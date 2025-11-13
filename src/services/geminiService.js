import { GoogleGenerativeAI } from '@google/generative-ai'
import storage from '../utils/storage'
import { getUserCredits, deductCredits } from './creditService'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Character limits
export const LIMITS = {
  MAX_INPUT_CHARS: 30000, // 30K characters per request
  MAX_OUTPUT_TOKENS: 2048,
  RATE_LIMIT: 15 // Deprecated - kept for backwards compatibility with old tools
}

let genAI = null

export const initGemini = () => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to .env file')
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY)
  }

  return genAI
}

// Sarcastic messages - Cemal style (TR/EN mix)
const SARCASTIC_MESSAGES = {
  noCredits: (currentCredits) => [
    `Kredi bitti aga! 💸 ${currentCredits} credit kaldı ama minimum 1 lazım. Settings'e git kod al!`,
    `No credits left, bro! 🚫 You have ${currentCredits} but need at least 1. Redeem a code!`,
    `Kredin yok kardeşim! ⚡ ${currentCredits} credit'in var ama yetmiyor. Kod kullan ya da iste!`,
    `Out of juice! 🔋 ${currentCredits} credits remaining but you need 1. Hit up Settings!`,
    `Para yok! 💰 ${currentCredits} credit ama bişey yapamam. Code redeem et!`
  ],
  inputTooLong: (current, max) => [
    `Sen romana mı yazıyorsun? 📚 ${current.toLocaleString()} karakter var, max ${max.toLocaleString()}. Kısa tut!`,
    `That's a novel, not a query! 📖 ${current.toLocaleString()}/${max.toLocaleString()} chars. TLDR lütfen!`,
    `Çok uzun yazmışsın aga! ✍️ ${current.toLocaleString()} chars ama max ${max.toLocaleString()}. Edit et!`,
    `War and Peace mi yazıyorsun? 📕 Current: ${current.toLocaleString()}, Max: ${max.toLocaleString()}. Trim yap!`,
    `Essay değil query istiyorum! 📝 ${current.toLocaleString()}/${max.toLocaleString()} - Summarize et bro!`
  ],
  apiKeyInvalid: () => [
    `API key çalışmıyor sanki 🙅 Google AI Studio'da check et!`,
    `Bu API key sahte gibi 💸 .env file'ı kontrol et!`,
    `API key rejected! 😅 Typo mu var acaba? Verify et!`,
    `Key geçersiz kardeşim 🔑 Double-check yap bakalım!`,
    `Nope! 🚫 That API key ain't working. Doğru yazdın mı?`
  ],
  quotaExceeded: () => [
    `Google "yeter artık" dedi 🛑 Quota aştın. Biraz bekle!`,
    `Quota bitti! 📊 Free tier'ın da limiti var. Try again later.`,
    `You've used up Google's patience 😬 Ve quota'yı da. Bekle biraz!`,
    `Limit doldu kardeşim! 🎯 Free tier bu kadar. Snack break?`,
    `Resource exhausted! 💤 Google needs a break too. Wait a bit bro.`
  ],
  success: (time) => [
    `Boom! 💥 ${time}s'de hallettim. I'm basically magic ✨`,
    `Bitti bile! ⚡ ${time}s'de done. You're welcome 😎`,
    `${time}s'de analysis complete 🎯 Check et aşağıda!`,
    `Ez pz! 🚀 ${time} saniyede bitti. That AI wisdom tho 🧠`,
    `Done in ${time}s! 💪 Masterpiece gibi oldu.`
  ],
  approachingLimit: () => [
    `Getting chunky! 📏 Limite yaklaşıyorsun. Maybe summarize?`,
    `Dikkat! ⚠️ You're near the max. Kısa tut biraz!`,
    `Careful there, wordsmith! ✍️ Limit yakın. Keep it concise!`,
    `Uzuyor ha! 📝 Character limit yaklaşıyor. TLDR yap!`
  ],
  analyzing: () => [
    `AI düşünüyor... 🤔 Sabır!`,
    `Processing... ⚙️ Magic takes time!`,
    `Analyzing yapıyorum... 🧠 Wait for it!`,
    `Thinking... 💭 Almost there bro!`
  ],
  noInput: () => [
    `Boş mu gönderiyorsun? 🤨 Write something first!`,
    `Bi şeyler yaz önce! ✍️ Input lazım!`,
    `Empty input detected! 📭 Type something!`
  ]
}

const getRandomMessage = (messageArrayOrFunc) => {
  const messages = typeof messageArrayOrFunc === 'function' ? messageArrayOrFunc : messageArrayOrFunc
  return Array.isArray(messages) ? messages[Math.floor(Math.random() * messages.length)] : messages
}

// Check if user has enough credits
export const checkCredits = async () => {
  const credits = await getUserCredits()

  if (credits < 1) {
    const messages = SARCASTIC_MESSAGES.noCredits(credits)
    throw new Error(getRandomMessage(messages))
  }

  return true
}

// Get remaining credits (alias for getUserCredits for backwards compatibility)
export const getRemainingRequests = async () => {
  return await getUserCredits()
}

export const analyzeWithGemini = async (prompt, systemInstruction = '', options = {}) => {
  try {
    // For text-only input, check length (exclude image data from check)
    const textInput = typeof prompt === 'string' ? prompt : ''
    const totalTextInput = systemInstruction + textInput

    // Only check text length if no image is present
    if (!options.imageData && totalTextInput.length > LIMITS.MAX_INPUT_CHARS) {
      throw new Error(getRandomMessage(SARCASTIC_MESSAGES.inputTooLong(totalTextInput.length, LIMITS.MAX_INPUT_CHARS)))
    }

    // Check credits before making request
    if (!options.bypassCreditCheck) {
      await checkCredits()
    }

    const ai = initGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash-latest', // Latest stable SDK model
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: LIMITS.MAX_OUTPUT_TOKENS,
      },
      systemInstruction: systemInstruction || undefined
    })

    // If image data is provided, use Vision API format with parts
    let content
    if (options.imageData) {
      if (import.meta.env.DEV) {
        console.log('📸 Using Vision API format with image')
      }

      // Extract base64 data (remove data:image/jpeg;base64, prefix)
      const base64Data = options.imageData.replace(/^data:image\/\w+;base64,/, '')

      content = [
        { text: prompt },
        {
          inlineData: {
            mimeType: options.imageMimeType || 'image/jpeg',
            data: base64Data
          }
        }
      ]
    } else {
      content = prompt
    }

    const result = await model.generateContent(content)
    const response = await result.response

    // Deduct credits after successful request
    if (!options.bypassCreditCheck) {
      await deductCredits(1)
    }

    return response.text()
  } catch (error) {
    if (error.message.includes('API key') && !error.message.includes('nope')) {
      throw new Error(getRandomMessage(SARCASTIC_MESSAGES.apiKeyInvalid()))
    }
    if (error.message.includes('PERMISSION_DENIED')) {
      throw new Error(getRandomMessage(SARCASTIC_MESSAGES.apiKeyInvalid()))
    }
    if (error.message.includes('RESOURCE_EXHAUSTED')) {
      throw new Error(getRandomMessage(SARCASTIC_MESSAGES.quotaExceeded()))
    }
    throw error
  }
}

// Export sarcastic messages for use in components
export { SARCASTIC_MESSAGES, getRandomMessage }

export const streamAnalyzeWithGemini = async (prompt, systemInstruction = '', onChunk) => {
  try {
    // Check input length
    const totalInput = systemInstruction + prompt
    if (totalInput.length > LIMITS.MAX_INPUT_CHARS) {
      throw new Error(`Input too long. Maximum ${LIMITS.MAX_INPUT_CHARS.toLocaleString()} characters allowed.`)
    }

    // Check credits before making request
    await checkCredits()

    const ai = initGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: systemInstruction || undefined
    })

    const result = await model.generateContentStream(prompt)

    // Deduct credits after successful request
    await deductCredits(1)

    let fullText = ''
    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      fullText += chunkText
      if (onChunk) {
        onChunk(chunkText, fullText)
      }
    }

    return fullText
  } catch (error) {
    throw error
  }
}
