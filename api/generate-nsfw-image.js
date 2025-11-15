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

    // Use Flux Dev - More realistic, detailed, photorealistic results
    // Flux Dev is uncensored and produces much more realistic images than Schnell
    const model = 'black-forest-labs/flux-dev'

    const input = {
      prompt: prompt,
      num_inference_steps: 50, // Maximum steps for ultra-detailed, sharp results
      guidance_scale: 7.5, // Higher guidance = follows prompt more precisely, sharper details
      num_outputs: numOutputs,
      aspect_ratio: width === height ? '1:1' : (width > height ? '16:9' : '9:16'),
      output_format: 'png',
      output_quality: 100,
      seed: Math.floor(Math.random() * 1000000),
      disable_safety_checker: true // Disable NSFW filter completely
    }

    // Run the model and get the prediction
    console.log('⏳ Running model:', model)

    // Use replicate.run with model name (will use latest version)
    const output = await replicate.run(model, { input })

    console.log('✅ Image generation successful!')
    console.log('🖼️ Raw Output:', JSON.stringify(output, null, 2))
    console.log('🖼️ Output Type:', typeof output)
    console.log('🖼️ Is Array:', Array.isArray(output))

    // Handle different output formats
    let imageUrls = []

    // Flux Schnell returns a FileOutput object that needs to be read differently
    if (typeof output === 'string') {
      // Direct URL string
      imageUrls = [output]
    } else if (Array.isArray(output)) {
      // Array of FileOutput objects - need to extract URL from each
      imageUrls = output.map(item => {
        if (typeof item === 'string') {
          return item
        } else if (typeof item === 'function') {
          // Replicate returns a function that needs to be called
          return item()
        } else if (item && typeof item === 'object') {
          // FileOutput object - try multiple ways to get URL
          if (item.url) {
            // If url is a function, call it
            return typeof item.url === 'function' ? item.url() : item.url
          }
          // Try calling toString() if it's a method
          if (typeof item.toString === 'function') {
            const strVal = item.toString()
            if (strVal && strVal !== '[object Object]' && strVal.startsWith('http')) {
              return strVal
            }
          }
          // If object has a property that looks like a URL
          const possibleUrl = Object.values(item).find(val =>
            typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))
          )
          if (possibleUrl) return possibleUrl
        }
        return null
      }).filter(Boolean)
    } else if (output && typeof output === 'object') {
      // Single FileOutput object
      if (output.url) {
        imageUrls = [output.url]
      } else if (output.toString && output.toString() !== '[object Object]') {
        imageUrls = [output.toString()]
      } else {
        // Try to find URL in object properties
        const possibleUrl = Object.values(output).find(val =>
          typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))
        )
        if (possibleUrl) imageUrls = [possibleUrl]
      }
    }

    console.log('🖼️ Final Image URLs:', imageUrls)

    if (imageUrls.length === 0) {
      console.error('❌ Could not extract URLs from output')
      throw new Error('Could not extract image URLs from model output')
    }

    return res.status(200).json({
      success: true,
      images: imageUrls,
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
