import Redis from 'ioredis'

// Redis connection (same as ratelimit.js)
const redis = new Redis(process.env.REDIS_URL, {
  tls: process.env.REDIS_URL?.includes('rediss://') ? {
    rejectUnauthorized: false
  } : undefined,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) return null
    return Math.min(times * 50, 2000)
  }
})

// Admin password from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cemal2026' // Fallback for development

// Helper: Generate random code
const generateRandomCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Helper: Get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         'unknown'
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Admin-Password')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { action } = req.query
  const clientIP = getClientIP(req)

  try {
    // ==================== GET BALANCE ====================
    if (req.method === 'GET' && action === 'balance') {
      const balance = await redis.get(`credit:balance:${clientIP}`)
      const credits = balance ? parseInt(balance) : 15 // Default 15 free credits

      return res.status(200).json({
        success: true,
        credits,
        ip: clientIP
      })
    }

    // ==================== REDEEM CODE ====================
    if (req.method === 'POST' && action === 'redeem') {
      const { code } = req.body

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Code is required'
        })
      }

      const codeUpper = code.toUpperCase().trim()

      // Validate format
      const regex = /^CEMAL-(\d+)-([A-Z0-9]{8})$/
      if (!regex.test(codeUpper)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid code format'
        })
      }

      // Check if code exists
      const codeData = await redis.get(`credit:code:${codeUpper}`)
      if (!codeData) {
        return res.status(404).json({
          success: false,
          error: 'Code not found'
        })
      }

      const parsedCode = JSON.parse(codeData)

      // Check if already used
      if (parsedCode.usedAt) {
        return res.status(400).json({
          success: false,
          error: 'Code already used'
        })
      }

      // Check if valid
      if (!parsedCode.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Code has been invalidated'
        })
      }

      // Mark as used
      parsedCode.usedAt = new Date().toISOString()
      parsedCode.usedBy = clientIP
      await redis.set(`credit:code:${codeUpper}`, JSON.stringify(parsedCode))

      // Add credits to user balance
      const currentBalance = await redis.get(`credit:balance:${clientIP}`)
      const currentCredits = currentBalance ? parseInt(currentBalance) : 15
      const newBalance = currentCredits + parsedCode.amount
      await redis.set(`credit:balance:${clientIP}`, newBalance.toString())

      // Log redemption
      await redis.lpush('credit:redemptions', JSON.stringify({
        code: codeUpper,
        amount: parsedCode.amount,
        ip: clientIP,
        timestamp: new Date().toISOString()
      }))

      return res.status(200).json({
        success: true,
        amount: parsedCode.amount,
        newBalance
      })
    }

    // ==================== DEDUCT CREDITS (AI usage) ====================
    if (req.method === 'POST' && action === 'deduct') {
      const { amount = 1 } = req.body

      const currentBalance = await redis.get(`credit:balance:${clientIP}`)
      const currentCredits = currentBalance ? parseInt(currentBalance) : 15

      if (currentCredits < amount) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient credits',
          credits: currentCredits
        })
      }

      const newBalance = currentCredits - amount
      await redis.set(`credit:balance:${clientIP}`, newBalance.toString())

      return res.status(200).json({
        success: true,
        deducted: amount,
        newBalance
      })
    }

    // ==================== SUBMIT CREDIT REQUEST ====================
    if (req.method === 'POST' && action === 'request') {
      const { email, name, message, requestedAmount } = req.body

      if (!email || !name) {
        return res.status(400).json({
          success: false,
          error: 'Email and name are required'
        })
      }

      const request = {
        email,
        name,
        message,
        requestedAmount,
        ip: clientIP,
        timestamp: new Date().toISOString()
      }

      // Store in Redis
      await redis.lpush('credit:requests', JSON.stringify(request))

      // TODO: Send email notification (future enhancement)

      return res.status(200).json({
        success: true,
        message: 'Request received! We will contact you soon.'
      })
    }

    // ==================== ADMIN: GENERATE CODES ====================
    if (req.method === 'POST' && action === 'generate') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      const { amount, count = 1 } = req.body

      if (![50, 100, 200, 1000].includes(amount)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid credit amount'
        })
      }

      const codes = []

      for (let i = 0; i < count; i++) {
        const randomPart = generateRandomCode(8)
        const code = `CEMAL-${amount}-${randomPart}`

        const codeData = {
          code,
          amount,
          createdAt: new Date().toISOString(),
          usedAt: null,
          usedBy: null,
          isValid: true
        }

        // Store in Redis
        await redis.set(`credit:code:${code}`, JSON.stringify(codeData))

        // Add to codes list
        await redis.lpush('credit:codes:all', code)

        codes.push(codeData)
      }

      return res.status(200).json({
        success: true,
        codes
      })
    }

    // ==================== ADMIN: LIST CODES ====================
    if (req.method === 'GET' && action === 'list') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      // Get all code keys
      const allCodes = await redis.lrange('credit:codes:all', 0, -1)
      const codeDetails = []

      for (const code of allCodes) {
        const data = await redis.get(`credit:code:${code}`)
        if (data) {
          codeDetails.push(JSON.parse(data))
        }
      }

      // Calculate stats
      const stats = {
        total: codeDetails.length,
        used: codeDetails.filter(c => c.usedAt).length,
        unused: codeDetails.filter(c => !c.usedAt && c.isValid).length,
        invalid: codeDetails.filter(c => !c.isValid).length,
        totalCreditsGenerated: codeDetails.reduce((sum, c) => sum + c.amount, 0),
        totalCreditsUsed: codeDetails.filter(c => c.usedAt).reduce((sum, c) => sum + c.amount, 0)
      }

      return res.status(200).json({
        success: true,
        codes: codeDetails,
        stats
      })
    }

    // ==================== ADMIN: DELETE CODE ====================
    if (req.method === 'DELETE' && action === 'delete') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      const { code } = req.body

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Code is required'
        })
      }

      await redis.del(`credit:code:${code}`)
      await redis.lrem('credit:codes:all', 0, code)

      return res.status(200).json({
        success: true,
        message: 'Code deleted'
      })
    }

    // ==================== ADMIN: INVALIDATE CODE ====================
    if (req.method === 'POST' && action === 'invalidate') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      const { code } = req.body

      const codeData = await redis.get(`credit:code:${code}`)
      if (!codeData) {
        return res.status(404).json({
          success: false,
          error: 'Code not found'
        })
      }

      const parsed = JSON.parse(codeData)
      parsed.isValid = false
      await redis.set(`credit:code:${code}`, JSON.stringify(parsed))

      return res.status(200).json({
        success: true,
        message: 'Code invalidated'
      })
    }

    // ==================== ADMIN: GET REQUESTS ====================
    if (req.method === 'GET' && action === 'requests') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      const requests = await redis.lrange('credit:requests', 0, -1)
      const parsed = requests.map(r => JSON.parse(r))

      return res.status(200).json({
        success: true,
        requests: parsed
      })
    }

    // ==================== ADMIN: CLEAR REQUEST ====================
    if (req.method === 'DELETE' && action === 'clear-request') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      const { timestamp } = req.body

      const requests = await redis.lrange('credit:requests', 0, -1)
      const filtered = requests.filter(r => {
        const parsed = JSON.parse(r)
        return parsed.timestamp !== timestamp
      })

      // Clear and rebuild
      await redis.del('credit:requests')
      for (const req of filtered) {
        await redis.lpush('credit:requests', req)
      }

      return res.status(200).json({
        success: true,
        message: 'Request cleared'
      })
    }

    // Invalid action
    return res.status(400).json({
      success: false,
      error: 'Invalid action'
    })

  } catch (error) {
    console.error('Credits API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
