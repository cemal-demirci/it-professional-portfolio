import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('error', (err) => console.error('Redis Client Error', err))

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
  return redisClient
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { fileId } = req.query

  try {
    const redis = await connectRedis()
    const metadata = await redis.get(`fileshare:${fileId}`)

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'File not found or expired'
      })
    }

    const fileInfo = JSON.parse(metadata)

    // Check if file is expired
    if (new Date(fileInfo.expiryTime) < new Date()) {
      await redis.del(`fileshare:${fileId}`)
      return res.status(404).json({
        success: false,
        error: 'File has expired'
      })
    }

    // Check download limit
    if (
      fileInfo.downloadLimit !== 'unlimited' &&
      fileInfo.downloadCount >= parseInt(fileInfo.downloadLimit)
    ) {
      await redis.del(`fileshare:${fileId}`)
      return res.status(404).json({
        success: false,
        error: 'Download limit reached'
      })
    }

    // Return file info (without encryption keys)
    return res.status(200).json({
      success: true,
      fileInfo: {
        originalName: fileInfo.originalName,
        originalSize: fileInfo.originalSize,
        mimeType: fileInfo.mimeType,
        hasPassword: fileInfo.hasPassword,
        downloadLimit: fileInfo.downloadLimit,
        downloadCount: fileInfo.downloadCount,
        expiryTime: fileInfo.expiryTime,
        createdAt: fileInfo.createdAt
      }
    })
  } catch (error) {
    console.error('Info fetch error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch file information'
    })
  }
}
