import { put } from '@vercel/blob'
import { createClient } from 'redis'
import crypto from 'crypto'
import formidable from 'formidable'
import fs from 'fs'

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

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Parse multipart form data
    const form = formidable({ multiples: false, maxFileSize: 100 * 1024 * 1024 }) // 100MB

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    })

    const file = files.file[0]
    const metadata = JSON.parse(fields.metadata[0])

    // Generate unique file ID
    const fileId = crypto.randomBytes(16).toString('hex')

    // Read file
    const fileData = fs.readFileSync(file.filepath)

    // Upload to Vercel Blob
    const blob = await put(`fileshare/${fileId}`, fileData, {
      access: 'public',
      addRandomSuffix: false
    })

    // Calculate expiry time
    const now = new Date()
    let expiryTime = new Date(now)

    switch (metadata.expiryTime) {
      case '1h':
        expiryTime.setHours(now.getHours() + 1)
        break
      case '24h':
        expiryTime.setHours(now.getHours() + 24)
        break
      case '7d':
        expiryTime.setDate(now.getDate() + 7)
        break
      case '30d':
        expiryTime.setDate(now.getDate() + 30)
        break
      default:
        expiryTime.setHours(now.getHours() + 24)
    }

    // Store metadata in Redis
    const redis = await connectRedis()
    const fileMetadata = {
      fileId,
      blobUrl: blob.url,
      originalName: metadata.originalName,
      originalSize: metadata.originalSize,
      mimeType: metadata.mimeType,
      iv: metadata.iv,
      key: metadata.key,
      hasPassword: metadata.hasPassword,
      downloadLimit: metadata.downloadLimit,
      downloadCount: 0,
      createdAt: now.toISOString(),
      expiryTime: expiryTime.toISOString()
    }

    await redis.set(
      `fileshare:${fileId}`,
      JSON.stringify(fileMetadata),
      {
        EX: Math.floor((expiryTime.getTime() - now.getTime()) / 1000) // TTL in seconds
      }
    )

    // Clean up temp file
    fs.unlinkSync(file.filepath)

    return res.status(200).json({
      success: true,
      fileId,
      expiryTime: expiryTime.toISOString()
    })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    })
  }
}
