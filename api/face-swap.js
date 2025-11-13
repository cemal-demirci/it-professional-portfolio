// Replicate API - Deepfake Face Swap
// Vercel Serverless Function

import Replicate from 'replicate'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { sourceFaceUrl, targetImageUrl } = req.body

    if (!sourceFaceUrl || !targetImageUrl) {
      return res.status(400).json({
        error: 'Both source face URL and target image URL are required'
      })
    }

    const replicateToken = process.env.REPLICATE_API_TOKEN
    if (!replicateToken) {
      console.error('❌ REPLICATE_API_TOKEN not found')
      return res.status(500).json({ error: 'Replicate API token not configured' })
    }

    const replicate = new Replicate({ auth: replicateToken })

    console.log('🎭 Performing face swap...')
    console.log('👤 Source face:', sourceFaceUrl)
    console.log('🖼️ Target image:', targetImageUrl)

    // Use FaceSwap model
    const model = 'yan-ops/face_swap:d5900f9ebed33e7ae6078bbee733b9d88b6c3119b05a9c2cd0d811b11ea344bf'

    const input = {
      target_image: targetImageUrl,
      swap_image: sourceFaceUrl,
      cache_days: 0 // Don't cache for privacy
    }

    console.log('⏳ Running face swap model...')
    const output = await replicate.run(model, { input })

    console.log('✅ Face swap successful!')
    console.log('🎭 Output:', output)

    return res.status(200).json({
      success: true,
      swappedImageUrl: output,
      message: 'Face swap completed successfully'
    })

  } catch (error) {
    console.error('❌ Face Swap Error:', error)
    return res.status(500).json({
      error: 'Face swap failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
