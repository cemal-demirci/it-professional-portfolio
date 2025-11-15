// Replicate API - Gender Swap (Real-time Camera Filter)
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
    const { imageData, targetGender = 'female', enhanceBeauty = true, customPrompt } = req.body

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' })
    }

    const replicateToken = process.env.REPLICATE_API_TOKEN
    if (!replicateToken) {
      console.error('❌ REPLICATE_API_TOKEN not found')
      return res.status(500).json({ error: 'Replicate API token not configured' })
    }

    const replicate = new Replicate({ auth: replicateToken })

    console.log('👗 Performing gender swap...')
    console.log('🎯 Target gender:', targetGender)
    console.log('💄 Enhance beauty:', enhanceBeauty)
    console.log('📝 Custom prompt:', customPrompt)

    // Use FLUX Schnell with img2img for gender transformation
    // Same model we use for NSFW - fast, uncensored, no filters
    const model = 'black-forest-labs/flux-schnell'

    // Use custom prompt if provided, otherwise use default
    const genderPrompt = customPrompt || (targetGender === 'female'
      ? 'beautiful woman, feminine face, long hair, makeup, soft features, elegant, attractive female, photorealistic portrait'
      : 'handsome man, masculine face, short hair, strong jawline, rugged features, attractive male, photorealistic portrait')

    const negativePrompt = 'ugly, deformed, blurry, low quality, bad anatomy, disfigured, distorted, child, minor'

    const input = {
      prompt: genderPrompt,
      image: imageData,
      prompt_strength: 0.8, // How much to transform (0.8 = 80% transformation)
      num_inference_steps: 4,
      guidance_scale: 0,
      output_format: 'jpg',
      output_quality: 100,
      disable_safety_checker: true,
      seed: Math.floor(Math.random() * 1000000)
    }

    console.log('⏳ Running gender swap model...')
    console.log('📝 Prompt:', genderPrompt)

    const output = await replicate.run(model, { input })

    console.log('✅ Gender swap successful!')
    console.log('🎨 Raw Output:', JSON.stringify(output, null, 2))

    // Extract URL from output
    let transformedUrl = output
    if (Array.isArray(output) && output.length > 0) {
      transformedUrl = output[0]
    } else if (output && typeof output === 'object') {
      transformedUrl = output.url || Object.values(output).find(v =>
        typeof v === 'string' && v.startsWith('http')
      )
    }

    console.log('🖼️ Final URL:', transformedUrl)

    return res.status(200).json({
      success: true,
      transformedImageUrl: transformedUrl,
      targetGender: targetGender,
      message: 'Gender swap completed successfully'
    })

  } catch (error) {
    console.error('❌ Gender Swap Error:', error)
    return res.status(500).json({
      error: 'Gender swap failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
