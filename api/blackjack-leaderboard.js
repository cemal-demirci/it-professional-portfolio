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

// Helper: Get Passport ID from headers
const getPassportId = (req) => {
  const passportId = req.headers['x-passport-id']

  if (!passportId || passportId === 'undefined') {
    return null
  }

  return passportId
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Passport-ID')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { action } = req.query
  const passportId = getPassportId(req)

  try {
    // ==================== GET LEADERBOARD ====================
    if (req.method === 'GET' && action === 'get') {
      // Get all leaderboard entries (sorted set)
      const entries = await redis.zrevrange('blackjack:leaderboard', 0, 9, 'WITHSCORES')

      const leaderboard = []
      for (let i = 0; i < entries.length; i += 2) {
        const playerData = await redis.get(`blackjack:player:${entries[i]}`)
        if (playerData) {
          const player = JSON.parse(playerData)
          leaderboard.push({
            name: player.username,
            score: parseInt(entries[i + 1]),
            date: player.lastUpdate
          })
        }
      }

      return res.status(200).json({
        success: true,
        leaderboard
      })
    }

    // ==================== UPDATE SCORE ====================
    if (req.method === 'POST' && action === 'update') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const { score, username } = req.body

      if (!score || score <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid score required'
        })
      }

      if (!username) {
        return res.status(400).json({
          success: false,
          error: 'Username required'
        })
      }

      // Get current high score for this player
      const currentScore = await redis.zscore('blackjack:leaderboard', passportId)

      // Only update if new score is higher
      if (!currentScore || score > parseInt(currentScore)) {
        // Update leaderboard (sorted set by score)
        await redis.zadd('blackjack:leaderboard', score, passportId)

        // Store player info
        await redis.set(`blackjack:player:${passportId}`, JSON.stringify({
          username,
          lastUpdate: new Date().toISOString()
        }))

        // Log the update
        await redis.lpush('blackjack:updates', JSON.stringify({
          passportId,
          username,
          score,
          timestamp: new Date().toISOString()
        }))

        return res.status(200).json({
          success: true,
          score,
          message: 'New high score!',
          isNewRecord: true
        })
      }

      return res.status(200).json({
        success: true,
        score: parseInt(currentScore),
        message: 'Score not higher than current record',
        isNewRecord: false
      })
    }

    // ==================== GET PLAYER RANK ====================
    if (req.method === 'GET' && action === 'rank') {
      if (!passportId) {
        return res.status(400).json({
          success: false,
          error: 'Passport ID required'
        })
      }

      const rank = await redis.zrevrank('blackjack:leaderboard', passportId)
      const score = await redis.zscore('blackjack:leaderboard', passportId)

      if (rank === null || score === null) {
        return res.status(200).json({
          success: true,
          rank: null,
          score: null,
          message: 'No score recorded yet'
        })
      }

      return res.status(200).json({
        success: true,
        rank: rank + 1, // Convert 0-based to 1-based
        score: parseInt(score)
      })
    }

    // Invalid action
    return res.status(400).json({
      success: false,
      error: 'Invalid action'
    })

  } catch (error) {
    console.error('Blackjack Leaderboard API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    })
  }
}
