import { GoogleGenerativeAI } from '@google/generative-ai'
import storage from '../utils/storage'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// Rate limiting - Server-side API with Vercel KV (works in incognito mode!)
const RATE_LIMIT = 15 // requests per day for free tier
const RATE_WINDOW = 86400000 // 24 hours in ms
const API_BASE = import.meta.env.VITE_API_BASE || ''

// Secret key for unlimited access
const SECRET_KEY = 'unlimited2024'

// Check if unlimited mode is enabled
const isUnlimitedMode = () => {
  const storedKey = localStorage.getItem('aiUnlimitedKey')
  return storedKey === SECRET_KEY
}

// Get unlimited key for API header
const getUnlimitedKey = () => {
  return isUnlimitedMode() ? SECRET_KEY : null
}

// Get current rate limit based on mode
const getCurrentRateLimit = () => {
  return isUnlimitedMode() ? 999999 : RATE_LIMIT
}

// Character limits
export const LIMITS = {
  MAX_INPUT_CHARS: 30000, // 30K characters per request
  MAX_OUTPUT_TOKENS: 2048,
  RATE_LIMIT: RATE_LIMIT,
  RATE_WINDOW_HOURS: RATE_WINDOW / 3600000 // 24 hours
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
  rateLimitReached: (waitTime, limit) => {
    const hours = Math.floor(waitTime / 3600)
    const minutes = Math.floor((waitTime % 3600) / 60)
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

    return [
      `Yavaş kardeşim! 🐢 Günlük limit: ${limit}/day. ${timeStr} bekle, acele etme!`,
      `Whoa there, cowboy! 🤠 Daily limit: ${limit}. Come back in ${timeStr} ☕`,
      `Easy tiger! 🐅 AI'ın da dinlenmesi lazım. Wait ${timeStr} bro.`,
      `Sakin! 🏎️ Free tier = ${limit}/gün. Chill yap ${timeStr}.`,
      `Houston, we have a problem! 🚀 Günlük ${limit} limit aştın. ${timeStr} sonra gel.`,
      `Slow down amigo! ⚡ ${limit} request/day limit var. ${timeStr} bekle.`
    ]
  },
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

// Check rate limit - Server-side API with Vercel KV (with localStorage fallback for dev)
export const checkRateLimit = async () => {
  try {
    const headers = {}
    const unlimitedKey = getUnlimitedKey()
    if (unlimitedKey) {
      headers['x-unlimited-key'] = unlimitedKey
    }

    const response = await fetch(`${API_BASE}/api/ratelimit`, {
      method: 'GET',
      headers
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Rate limit check failed')
    }

    if (data.remaining <= 0) {
      const currentLimit = data.limit
      const waitTimeSeconds = data.waitTimeSeconds || 3600
      const messages = SARCASTIC_MESSAGES.rateLimitReached(waitTimeSeconds, currentLimit)
      throw new Error(getRandomMessage(messages))
    }

    return true
  } catch (error) {
    // Fallback to localStorage-based rate limiting for development
    console.warn('Server API unavailable, using localStorage fallback:', error.message)
    return checkRateLimitLocal()
  }
}

// Local rate limiting fallback (for development)
const checkRateLimitLocal = () => {
  if (isUnlimitedMode()) {
    return true
  }

  const storageKey = 'local_rate_limit'
  const now = Date.now()

  // Get existing requests
  const data = localStorage.getItem(storageKey)
  const requests = data ? JSON.parse(data) : []

  // Filter recent requests (within 24 hours)
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW)

  // Check if limit exceeded
  if (recentRequests.length >= RATE_LIMIT) {
    const oldestRequest = recentRequests[0]
    const waitTimeSeconds = Math.ceil((RATE_WINDOW - (now - oldestRequest)) / 1000)
    const messages = SARCASTIC_MESSAGES.rateLimitReached(waitTimeSeconds, RATE_LIMIT)
    throw new Error(getRandomMessage(messages))
  }

  return true
}

// Record request - Server-side API with Vercel KV (with localStorage fallback for dev)
const recordRequest = async () => {
  try {
    const headers = {}
    const unlimitedKey = getUnlimitedKey()
    if (unlimitedKey) {
      headers['x-unlimited-key'] = unlimitedKey
    }

    const response = await fetch(`${API_BASE}/api/ratelimit`, {
      method: 'POST',
      headers
    })

    const data = await response.json()

    if (response.status === 429) {
      // Rate limit exceeded after request was made
      // This shouldn't happen if checkRateLimit works correctly
      console.warn('Rate limit exceeded during recording')
    }

    return data.success
  } catch (error) {
    console.warn('Failed to record request, using localStorage fallback:', error.message)
    recordRequestLocal()
    return false
  }
}

// Local request recording fallback (for development)
const recordRequestLocal = () => {
  if (isUnlimitedMode()) {
    return
  }

  const storageKey = 'local_rate_limit'
  const now = Date.now()

  // Get existing requests
  const data = localStorage.getItem(storageKey)
  const requests = data ? JSON.parse(data) : []

  // Add new request
  requests.push(now)

  // Filter recent requests and save
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW)
  localStorage.setItem(storageKey, JSON.stringify(recentRequests))
}

// Get remaining requests - Server-side API with Vercel KV (with localStorage fallback for dev)
export const getRemainingRequests = async () => {
  try {
    const headers = {}
    const unlimitedKey = getUnlimitedKey()
    if (unlimitedKey) {
      headers['x-unlimited-key'] = unlimitedKey
    }

    const response = await fetch(`${API_BASE}/api/ratelimit`, {
      method: 'GET',
      headers
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return data.remaining
    }

    // Fallback
    return getCurrentRateLimit()
  } catch (error) {
    console.warn('Failed to get remaining requests, using localStorage fallback')
    return getRemainingRequestsLocal()
  }
}

// Local remaining requests (for development)
const getRemainingRequestsLocal = () => {
  if (isUnlimitedMode()) {
    return 999999
  }

  const storageKey = 'local_rate_limit'
  const now = Date.now()

  // Get existing requests
  const data = localStorage.getItem(storageKey)
  const requests = data ? JSON.parse(data) : []

  // Filter recent requests
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW)

  return Math.max(0, RATE_LIMIT - recentRequests.length)
}

export const analyzeWithGemini = async (prompt, systemInstruction = '', options = {}) => {
  try {
    // Check input length
    const totalInput = systemInstruction + prompt
    if (totalInput.length > LIMITS.MAX_INPUT_CHARS) {
      throw new Error(getRandomMessage(SARCASTIC_MESSAGES.inputTooLong(totalInput.length, LIMITS.MAX_INPUT_CHARS)))
    }

    // Check rate limit (IP-based)
    if (!options.bypassRateLimit) {
      await checkRateLimit()
    }

    const ai = initGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash-exp', // Latest fast model
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: LIMITS.MAX_OUTPUT_TOKENS,
      },
      systemInstruction: systemInstruction || undefined
    })

    const result = await model.generateContent(prompt)
    const response = await result.response

    // Record successful request (IP-based)
    if (!options.bypassRateLimit) {
      await recordRequest()
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

    // Check rate limit (IP-based)
    await checkRateLimit()

    const ai = initGemini()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction || undefined
    })

    const result = await model.generateContentStream(prompt)

    // Record request (IP-based)
    await recordRequest()

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
