import Redis from 'ioredis'

/**
 * Serverless function to handle AI rate limiting
 * Uses Redis Cloud for persistent storage (works in incognito mode!)
 * GET: Check remaining requests for IP
 * POST: Record a new request
 */

// Redis Cloud connection - MUST set REDIS_URL environment variable
if (!process.env.REDIS_URL) {
  console.error('REDIS_URL environment variable is not set!')
}
const redis = new Redis(process.env.REDIS_URL)

const RATE_LIMIT = 15 // requests per day for free tier
const RATE_WINDOW = 86400000 // 24 hours in milliseconds
const SECRET_KEY = process.env.AI_UNLIMITED_KEY || 'change-this-secret'

// Get client IP from request
const getClientIP = (req) => {
  // Try various headers (Vercel, Cloudflare, etc.)
  const forwarded = req.headers['x-forwarded-for']
  const real = req.headers['x-real-ip']
  const cf = req.headers['cf-connecting-ip']

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (real) {
    return real
  }
  if (cf) {
    return cf
  }

  // Fallback
  return req.connection?.remoteAddress || 'unknown'
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const clientIP = getClientIP(req)
    const now = Date.now()

    // Check if unlimited mode is enabled (via header)
    const unlimitedKey = req.headers['x-unlimited-key']
    const isUnlimited = unlimitedKey === SECRET_KEY
    const currentLimit = isUnlimited ? 999999 : RATE_LIMIT

    // GET: Check remaining requests
    if (req.method === 'GET') {
      // Get request history from Redis
      const key = `ratelimit:${clientIP}`
      const historyStr = await redis.get(key)
      const history = historyStr ? JSON.parse(historyStr) : []

      // Filter out old requests
      const recentRequests = history.filter(time => now - time < RATE_WINDOW)

      // Update Redis with cleaned data
      if (recentRequests.length !== history.length) {
        await redis.setex(key, 86400, JSON.stringify(recentRequests)) // expire in 24h
      }

      const remaining = currentLimit - recentRequests.length

      return res.status(200).json({
        success: true,
        remaining,
        limit: currentLimit,
        isUnlimited,
        resetAt: recentRequests.length > 0
          ? new Date(recentRequests[0] + RATE_WINDOW).toISOString()
          : null
      })
    }

    // POST: Record new request
    if (req.method === 'POST') {
      const key = `ratelimit:${clientIP}`
      const historyStr = await redis.get(key)
      const history = historyStr ? JSON.parse(historyStr) : []

      // Filter out old requests
      const recentRequests = history.filter(time => now - time < RATE_WINDOW)

      // Check if limit exceeded
      if (recentRequests.length >= currentLimit) {
        const oldestRequest = recentRequests[0]
        const waitTimeSeconds = Math.ceil((RATE_WINDOW - (now - oldestRequest)) / 1000)

        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          remaining: 0,
          limit: currentLimit,
          waitTimeSeconds,
          resetAt: new Date(oldestRequest + RATE_WINDOW).toISOString()
        })
      }

      // Add new request
      recentRequests.push(now)

      // Save to Redis with expiration
      await redis.setex(key, 86400, JSON.stringify(recentRequests)) // expire in 24h

      const remaining = currentLimit - recentRequests.length

      return res.status(200).json({
        success: true,
        remaining,
        limit: currentLimit,
        message: 'Request recorded successfully'
      })
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Rate Limit API Error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
