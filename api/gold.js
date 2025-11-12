import Redis from 'ioredis'

// Redis connection
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
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cemal2026'

// Helper: Get Passport ID from headers
const getPassportId = (req) => {
  const passportId = req.headers['x-passport-id']

  if (!passportId || passportId === 'undefined') {
    return null
  }

  return passportId
}

// Helper: Generate random Gold code
const generateRandomCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Admin-Password, X-Passport-ID')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { action } = req.query
  const passportId = getPassportId(req)

  try {
    // ==================== GET BALANCE ====================
    if (req.method === 'GET' && action === 'balance') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const balance = await redis.get(`gold:balance:${passportId}`)
      const gold = balance ? parseInt(balance) : 0 // Default 0 Gold

      return res.status(200).json({
        success: true,
        gold,
        passportId
      })
    }

    // ==================== REWARD GOLD ====================
    if (req.method === 'POST' && action === 'reward') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const { amount, reason } = req.body

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid amount required'
        })
      }

      // Get current balance
      const currentBalance = await redis.get(`gold:balance:${passportId}`)
      const currentGold = currentBalance ? parseInt(currentBalance) : 0
      const newBalance = currentGold + amount

      // Update balance
      await redis.set(`gold:balance:${passportId}`, newBalance.toString())

      // Log reward
      await redis.lpush('gold:rewards', JSON.stringify({
        passportId,
        amount,
        reason: reason || 'Unknown',
        timestamp: new Date().toISOString(),
        newBalance
      }))

      return res.status(200).json({
        success: true,
        amount,
        newBalance,
        message: `+${amount} Gold kazandınız!`
      })
    }

    // ==================== TRANSFER GOLD ====================
    if (req.method === 'POST' && action === 'transfer') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const { toPassportId, amount } = req.body

      if (!toPassportId || !amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid recipient and amount required'
        })
      }

      if (passportId === toPassportId) {
        return res.status(400).json({
          success: false,
          error: 'Cannot transfer to yourself'
        })
      }

      // Get sender balance
      const senderBalance = await redis.get(`gold:balance:${passportId}`)
      const senderGold = senderBalance ? parseInt(senderBalance) : 0

      if (senderGold < amount) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient Gold',
          currentGold: senderGold
        })
      }

      // Get recipient balance
      const recipientBalance = await redis.get(`gold:balance:${toPassportId}`)
      const recipientGold = recipientBalance ? parseInt(recipientBalance) : 0

      // Execute transfer
      await redis.set(`gold:balance:${passportId}`, (senderGold - amount).toString())
      await redis.set(`gold:balance:${toPassportId}`, (recipientGold + amount).toString())

      // Log transfer
      await redis.lpush('gold:transfers', JSON.stringify({
        from: passportId,
        to: toPassportId,
        amount,
        timestamp: new Date().toISOString()
      }))

      return res.status(200).json({
        success: true,
        amount,
        newBalance: senderGold - amount,
        recipientBalance: recipientGold + amount
      })
    }

    // ==================== CHECK STREAK ====================
    if (req.method === 'POST' && action === 'check-streak') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const now = Date.now()
      const streakData = await redis.get(`gold:streak:${passportId}`)

      let streak = {
        strikes: 0,
        lastStrike: 0,
        totalGoldEarned: 0,
        streakCount: 0
      }

      if (streakData) {
        streak = JSON.parse(streakData)
      }

      // Check if 2 hours passed since last strike
      const TWO_HOURS = 2 * 60 * 60 * 1000
      const timeSinceLastStrike = now - streak.lastStrike

      let newStrike = false
      let goldRewarded = 0

      if (timeSinceLastStrike >= TWO_HOURS || streak.lastStrike === 0) {
        // Award strike
        streak.strikes += 1
        streak.lastStrike = now
        newStrike = true

        // Check if reached 5 strikes
        if (streak.strikes >= 5) {
          // Award 10 Gold
          const currentBalance = await redis.get(`gold:balance:${passportId}`)
          const currentGold = currentBalance ? parseInt(currentBalance) : 0
          const newBalance = currentGold + 10

          await redis.set(`gold:balance:${passportId}`, newBalance.toString())

          // Log reward
          await redis.lpush('gold:rewards', JSON.stringify({
            passportId,
            amount: 10,
            reason: 'Login Streak (5 strikes)',
            timestamp: new Date().toISOString(),
            newBalance
          }))

          goldRewarded = 10
          streak.totalGoldEarned += 10
          streak.streakCount += 1
          streak.strikes = 0 // Reset strikes
        }

        // Save streak data
        await redis.set(`gold:streak:${passportId}`, JSON.stringify(streak))
      }

      return res.status(200).json({
        success: true,
        newStrike,
        goldRewarded,
        streak: {
          strikes: streak.strikes,
          timeUntilNextStrike: TWO_HOURS - timeSinceLastStrike,
          totalGoldEarned: streak.totalGoldEarned,
          streakCount: streak.streakCount
        }
      })
    }

    // ==================== GET STREAK INFO ====================
    if (req.method === 'GET' && action === 'streak') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const streakData = await redis.get(`gold:streak:${passportId}`)

      let streak = {
        strikes: 0,
        lastStrike: 0,
        totalGoldEarned: 0,
        streakCount: 0
      }

      if (streakData) {
        streak = JSON.parse(streakData)
      }

      const TWO_HOURS = 2 * 60 * 60 * 1000
      const now = Date.now()
      const timeSinceLastStrike = now - streak.lastStrike
      const timeUntilNextStrike = Math.max(0, TWO_HOURS - timeSinceLastStrike)

      return res.status(200).json({
        success: true,
        streak: {
          strikes: streak.strikes,
          lastStrike: streak.lastStrike,
          timeUntilNextStrike,
          canClaimStrike: timeUntilNextStrike === 0 || streak.lastStrike === 0,
          totalGoldEarned: streak.totalGoldEarned,
          streakCount: streak.streakCount
        }
      })
    }

    // ==================== ADMIN: GENERATE GOLD CODES ====================
    if (req.method === 'POST' && action === 'generate') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      const { amount, count = 1 } = req.body

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid amount required'
        })
      }

      const codes = []

      for (let i = 0; i < count; i++) {
        const randomPart = generateRandomCode(8)
        const code = `GOLD-${amount}-${randomPart}`

        const codeData = {
          code,
          amount,
          createdAt: new Date().toISOString(),
          usedAt: null,
          usedBy: null,
          isValid: true
        }

        // Store in Redis
        await redis.set(`gold:code:${code}`, JSON.stringify(codeData))

        // Add to codes list
        await redis.lpush('gold:codes:all', code)

        codes.push(codeData)
      }

      return res.status(200).json({
        success: true,
        codes
      })
    }

    // ==================== REDEEM GOLD CODE ====================
    if (req.method === 'POST' && action === 'redeem') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const { code } = req.body

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Code is required'
        })
      }

      const codeUpper = code.toUpperCase().trim()

      // Validate format
      const regex = /^GOLD-(\d+)-([A-Z0-9]{8})$/
      if (!regex.test(codeUpper)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid code format'
        })
      }

      // Check if code exists
      const codeData = await redis.get(`gold:code:${codeUpper}`)
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
      parsedCode.usedBy = passportId
      await redis.set(`gold:code:${codeUpper}`, JSON.stringify(parsedCode))

      // Add Gold to user balance
      const currentBalance = await redis.get(`gold:balance:${passportId}`)
      const currentGold = currentBalance ? parseInt(currentBalance) : 0
      const newBalance = currentGold + parsedCode.amount
      await redis.set(`gold:balance:${passportId}`, newBalance.toString())

      // Log redemption
      await redis.lpush('gold:redemptions', JSON.stringify({
        code: codeUpper,
        amount: parsedCode.amount,
        passportId,
        timestamp: new Date().toISOString()
      }))

      return res.status(200).json({
        success: true,
        amount: parsedCode.amount,
        newBalance
      })
    }

    // ==================== ADMIN: LIST GOLD CODES ====================
    if (req.method === 'GET' && action === 'list') {
      const adminPassword = req.headers['x-admin-password']

      if (adminPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        })
      }

      // Get all code keys
      const allCodes = await redis.lrange('gold:codes:all', 0, -1)
      const codeDetails = []

      for (const code of allCodes) {
        const data = await redis.get(`gold:code:${code}`)
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
        totalGoldGenerated: codeDetails.reduce((sum, c) => sum + c.amount, 0),
        totalGoldUsed: codeDetails.filter(c => c.usedAt).reduce((sum, c) => sum + c.amount, 0)
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

      await redis.del(`gold:code:${code}`)
      await redis.lrem('gold:codes:all', 0, code)

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

      const codeData = await redis.get(`gold:code:${code}`)
      if (!codeData) {
        return res.status(404).json({
          success: false,
          error: 'Code not found'
        })
      }

      const parsed = JSON.parse(codeData)
      parsed.isValid = false
      await redis.set(`gold:code:${code}`, JSON.stringify(parsed))

      return res.status(200).json({
        success: true,
        message: 'Code invalidated'
      })
    }

    // Invalid action
    return res.status(400).json({
      success: false,
      error: 'Invalid action'
    })

  } catch (error) {
    console.error('Gold API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
