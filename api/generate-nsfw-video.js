// Replicate API - NSFW Video Generation (Image to Video)
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
    const { imageUrl, motionType = 'default' } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' })
    }

    const replicateToken = process.env.REPLICATE_API_TOKEN
    if (!replicateToken) {
      console.error('❌ REPLICATE_API_TOKEN not found')
      return res.status(500).json({ error: 'Replicate API token not configured' })
    }

    const replicate = new Replicate({ auth: replicateToken })

    console.log('🎥 Generating video from image...')
    console.log('🖼️ Image URL:', imageUrl)
    console.log('💫 Motion type:', motionType)

    // AnimateDiff - Image to Video
    const model = 'lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dfa10dc16e845b4ae00d281e2fa377e48a9f'

    const input = {
      path: imageUrl,
      motion_module: motionType === 'zoom' ? 'mm_sd_v15_v2' : 'mm_sd_v15',
      seed: Math.floor(Math.random() * 1000000),
      steps: 25,
      guidance_scale: 7.5,
      prompt: 'smooth motion, natural movement, high quality',
      n_prompt: 'static, blurry, distorted, low quality'
    }

    console.log('⏳ Running AnimateDiff...')
    const output = await replicate.run(model, { input })

    console.log('✅ Video generation successful!')
    console.log('🎬 Output:', output)

    return res.status(200).json({
      success: true,
      videoUrl: output,
      motionType: motionType
    })

  } catch (error) {
    console.error('❌ Video Generation Error:', error)
    return res.status(500).json({
      error: 'Video generation failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
