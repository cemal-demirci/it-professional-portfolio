// Replicate API - NSFW Image Generation
// Vercel Serverless Function

import Replicate from 'replicate'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, negativePrompt, mode, width = 1024, height = 1024, numOutputs = 1 } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    // Check for Replicate API token
    const replicateToken = process.env.REPLICATE_API_TOKEN
    if (!replicateToken) {
      console.error('❌ REPLICATE_API_TOKEN not found in environment variables')
      return res.status(500).json({
        error: 'Replicate API token not configured',
        details: 'Server configuration error. Please contact administrator.'
      })
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: replicateToken,
    })

    console.log('🎨 Generating NSFW image with Replicate...')
    console.log('📝 Prompt:', prompt)
    console.log('🚫 Negative:', negativePrompt)
    console.log('🎯 Mode:', mode)

    // Choose model based on mode
    let model, input

    if (mode === 'realistic') {
      // Realistic Vision v5.1 - Best for realistic NSFW
      model = 'lucataco/realistic-vision-v5.1:a7b77e23bb42dc8da706efecedfb3f72c5c521dc0a7a05b87527d6ec5c405bbc'
      input = {
        prompt: prompt,
        negative_prompt: negativePrompt || 'cartoon, anime, drawing, painting, 3d, cgi, bad anatomy, bad hands, extra limbs, deformed, blurry, low quality',
        width: width,
        height: height,
        num_outputs: numOutputs,
        scheduler: 'DPMSolverMultistep',
        num_inference_steps: 30,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000)
      }
    } else if (mode === 'anime') {
      // Anime style NSFW
      model = 'cjwbw/anything-v4.0:42a996d39a96aedc57b2e0aa8105dea39c9c89d9d266caf6bb4327a1c191b061'
      input = {
        prompt: prompt,
        negative_prompt: negativePrompt || 'realistic, photo, 3d, bad anatomy, bad hands, extra limbs, deformed, blurry, low quality',
        width: width,
        height: height,
        num_outputs: numOutputs,
        num_inference_steps: 30,
        guidance_scale: 9.0,
        seed: Math.floor(Math.random() * 1000000)
      }
    } else {
      // SDXL - High quality general purpose
      model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b'
      input = {
        prompt: prompt,
        negative_prompt: negativePrompt || 'bad anatomy, bad hands, extra limbs, deformed, blurry, low quality, cartoon, anime',
        width: width,
        height: height,
        num_outputs: numOutputs,
        scheduler: 'DPMSolverMultistep',
        num_inference_steps: 40,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000)
      }
    }

    // Run the model
    console.log('⏳ Running model:', model)
    const output = await replicate.run(model, { input })

    console.log('✅ Image generation successful!')
    console.log('🖼️ Output:', output)

    // Output is an array of image URLs
    return res.status(200).json({
      success: true,
      images: Array.isArray(output) ? output : [output],
      prompt: prompt,
      mode: mode
    })

  } catch (error) {
    console.error('❌ Replicate API Error:', error)
    return res.status(500).json({
      error: 'Image generation failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
