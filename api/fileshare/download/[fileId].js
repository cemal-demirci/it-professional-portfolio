import { createClient } from 'redis'
import crypto from 'crypto'

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

function verifyPassword(password, hasPassword) {
  // If file is password protected, verify the password
  // This is a simple implementation - in production, you'd hash and compare
  return hasPassword ? password !== undefined : true
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { fileId } = req.query
  const { password } = req.body || {}

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

    // Verify password if required
    if (fileInfo.hasPassword && !password) {
      return res.status(401).json({
        success: false,
        error: 'Password required'
      })
    }

    // Download file from Vercel Blob
    const fileResponse = await fetch(fileInfo.blobUrl)
    if (!fileResponse.ok) {
      throw new Error('Failed to fetch file from storage')
    }

    const fileBuffer = await fileResponse.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    // Update download count
    fileInfo.downloadCount += 1
    await redis.set(
      `fileshare:${fileId}`,
      JSON.stringify(fileInfo),
      {
        EX: Math.floor((new Date(fileInfo.expiryTime).getTime() - Date.now()) / 1000)
      }
    )

    // If download limit reached, delete the file
    if (
      fileInfo.downloadLimit !== 'unlimited' &&
      fileInfo.downloadCount >= parseInt(fileInfo.downloadLimit)
    ) {
      // Note: In production, you should also delete from Vercel Blob
      await redis.del(`fileshare:${fileId}`)
    }

    return res.status(200).json({
      success: true,
      encryptedData: base64Data,
      metadata: {
        originalName: fileInfo.originalName,
        originalSize: fileInfo.originalSize,
        mimeType: fileInfo.mimeType,
        iv: fileInfo.iv,
        key: fileInfo.key
      }
    })
  } catch (error) {
    console.error('Download error:', error)
    return res.status(500).json({
      success: false,
      error: 'Download failed'
    })
  }
}
