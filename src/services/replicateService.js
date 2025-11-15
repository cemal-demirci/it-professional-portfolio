// Replicate AI Service - NSFW Image/Video Generation, Deepfake, Gender Swap
// Frontend service to communicate with backend Replicate API

const API_BASE = import.meta.env.PROD ? 'https://www.cemal.online' : 'http://localhost:3000'

/**
 * Generate NSFW image using Replicate AI
 * @param {string} prompt - Text prompt for image generation
 * @param {string} mode - 'realistic', 'anime', or 'sdxl'
 * @param {string} negativePrompt - Things to avoid in generation
 * @returns {Promise<Array<string>>} - Array of generated image URLs
 */
export const generateNSFWImage = async (prompt, mode = 'realistic', negativePrompt = '') => {
  try {
    console.log('🎨 Generating NSFW image...')
    console.log('📝 Prompt:', prompt)
    console.log('🎯 Mode:', mode)

    const response = await fetch(`${API_BASE}/api/generate-nsfw-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        mode,
        negativePrompt,
        width: 1024,
        height: 1024,
        numOutputs: 1
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error || 'Image generation failed')
    }

    const data = await response.json()
    console.log('✅ Image generated successfully!')
    console.log('🖼️ Image URLs:', data.images)

    return data.images

  } catch (error) {
    console.error('❌ Image generation error:', error)
    throw error
  }
}

/**
 * Generate video from image (Image-to-Video)
 * @param {string} imageUrl - URL of the image to animate
 * @param {string} motionType - 'default' or 'zoom'
 * @returns {Promise<string>} - Generated video URL
 */
export const generateNSFWVideo = async (imageUrl, motionType = 'default') => {
  try {
    console.log('🎥 Generating video from image...')
    console.log('🖼️ Image URL:', imageUrl)

    const response = await fetch(`${API_BASE}/api/generate-nsfw-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        motionType
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error || 'Video generation failed')
    }

    const data = await response.json()
    console.log('✅ Video generated successfully!')
    console.log('🎬 Video URL:', data.videoUrl)

    return data.videoUrl

  } catch (error) {
    console.error('❌ Video generation error:', error)
    throw error
  }
}

/**
 * Perform face swap (Deepfake)
 * @param {string} sourceFaceUrl - URL of face to swap FROM (user's face)
 * @param {string} targetImageUrl - URL of image to swap TO (AI generated body)
 * @returns {Promise<string>} - URL of swapped image
 */
export const performFaceSwap = async (sourceFaceUrl, targetImageUrl) => {
  try {
    console.log('🎭 Performing face swap...')
    console.log('👤 Source face:', sourceFaceUrl)
    console.log('🖼️ Target image:', targetImageUrl)

    const response = await fetch(`${API_BASE}/api/face-swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceFaceUrl,
        targetImageUrl
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error || 'Face swap failed')
    }

    const data = await response.json()
    console.log('✅ Face swap successful!')
    console.log('🎭 Swapped image URL:', data.swappedImageUrl)

    return data.swappedImageUrl

  } catch (error) {
    console.error('❌ Face swap error:', error)
    throw error
  }
}

/**
 * Perform gender swap (Male to Female transformation)
 * @param {string} imageData - Base64 image data or URL
 * @param {string} targetGender - 'female' or 'male'
 * @param {boolean} enhanceBeauty - Apply beauty enhancement
 * @param {string} customPrompt - Optional custom prompt for advanced control
 * @returns {Promise<string>} - URL of transformed image
 */
export const performGenderSwap = async (imageData, targetGender = 'female', enhanceBeauty = true, customPrompt = null) => {
  try {
    console.log('👗 Performing gender swap...')
    console.log('🎯 Target gender:', targetGender)
    console.log('📝 Custom prompt:', customPrompt)

    const response = await fetch(`${API_BASE}/api/gender-swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,
        targetGender,
        enhanceBeauty,
        customPrompt
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.details || error.error || 'Gender swap failed')
    }

    const data = await response.json()
    console.log('✅ Gender swap successful!')
    console.log('💅 Transformed image URL:', data.transformedImageUrl)

    return data.transformedImageUrl

  } catch (error) {
    console.error('❌ Gender swap error:', error)
    throw error
  }
}

/**
 * Build an erotik AI prompt based on user input and dirty talk mode
 * @param {string} userInput - User's request
 * @param {boolean} dirtyTalkMode - Is dirty talk mode enabled?
 * @param {string} userName - User's name for personalization
 * @returns {string} - Enhanced AI prompt for NSFW generation
 */
export const buildEroticPrompt = (userInput, dirtyTalkMode = false, userName = '') => {
  // Ultra high quality - Flux Dev optimized for maximum realism
  const quality = 'photorealistic, hyperrealistic, 8k resolution, professional photography, DSLR camera, 85mm lens, f/1.4 aperture, natural skin texture, detailed pores, realistic lighting, high dynamic range, ultra sharp focus, lifelike details, professional model photography'

  // Strong NSFW keywords for Flux Dev (no censorship)
  const nsfw = dirtyTalkMode
    ? 'fully nude, completely naked, bare breasts visible, topless, uncensored, explicit nudity, erotic photography, adult content, sensual pose, seductive expression, intimate pose, provocative angle, NSFW, natural nude body, exposed nipples, detailed breast anatomy, realistic breast shape, explicit sex, hardcore pornography, penetration visible, genitals in frame, penis and vagina visible, detailed sex organs, explicit intercourse'
    : 'revealing lingerie, barely covered, bikini, see-through, transparent clothing, sensual, alluring, suggestive pose'

  // Enhanced body and aesthetic details for photorealism with focus on breast and genital detail
  const body = 'perfect anatomically correct female form, natural breast proportions, detailed realistic breasts, natural breast shape, visible nipple detail, realistic areola, smooth breast skin texture, natural curves, realistic skin tone, flawless complexion, gorgeous facial features, expressive eyes, natural makeup, realistic hair, elegant posture, confident body language, natural beauty, anatomically correct genitals, realistic penis anatomy, detailed vagina, natural body proportions for both male and female'

  // Professional photography scene
  const scene = 'professional photography studio, soft diffused lighting, natural window light, bokeh background, cinematic composition, shallow depth of field, warm color grading'

  // Combine all elements - Flux Dev works better with highly detailed, realistic prompts
  const enhancedPrompt = `${userInput}, ${nsfw}, ${body}, ${scene}, ${quality}`

  console.log('🔥 Built ultra-realistic prompt for Flux Dev:', enhancedPrompt)
  return enhancedPrompt
}

/**
 * Negative prompt for NSFW generation (things to avoid)
 * Enhanced negative for Flux Dev - helps avoid common AI artifacts
 */
export const DEFAULT_NEGATIVE_PROMPT = 'unrealistic, fake looking, plastic skin, cartoon, anime, 3d render, deformed, distorted, disfigured, bad anatomy, extra limbs, missing limbs, ugly face, bad proportions, watermark, signature, text, blurry, low quality, jpeg artifacts, oversaturated, child, minor, underage'

export default {
  generateNSFWImage,
  generateNSFWVideo,
  performFaceSwap,
  performGenderSwap,
  buildEroticPrompt,
  DEFAULT_NEGATIVE_PROMPT
}
