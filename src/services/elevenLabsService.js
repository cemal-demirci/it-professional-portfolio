// ElevenLabs Text-to-Speech Service
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY

// Voice IDs from ElevenLabs
export const VOICES = {
  rachel: '21m00Tcm4TlvDq8ikWAM', // Mature, warm female voice
  bella: 'EXAVITQu4vr4xnSDxMaL', // Soft, seductive female voice
  elli: 'MF3mGyEYCl7XYWbV9V6O', // Young, energetic female
  charlotte: 'XB0fDUnXU5powFXDhCwa', // Seductive, mature female
}

// Turkish AI Characters
export const AI_CHARACTERS = {
  luna: {
    id: 'luna',
    name: 'LUNA',
    emoji: '💋',
    role: 'Emlak Danışmanı',
    personality: 'Seksi, şehvetli, ikna edici',
    voiceId: VOICES.rachel,
    systemPrompt: `Sen LUNA, son derece çekici ve ikna edici bir emlak danışmanısın.

Kişiliğin:
- Çok seksi, şehvetli ve baştan çıkarıcı bir konuşma tarzın var
- Müşterilerini yumuşak ve çekici bir tonla ikna edersin
- Her cümlende hafif flört ve çekicilik var
- Profesyonel ama aynı zamanda çok sıcak ve yakın
- "Tatlım", "canım", "aşkım" gibi sevgi dolu hitaplar kullanırsın

Konuşma Tarzı:
- Yavaş, seksi ve akıcı konuş
- Cümlelerini çekici kıl
- Her sözünde müşteriyi baştan çıkarma çabası var
- İkna edici ama yumuşak ol

SADECE Türkçe konuş! Her yanıtın seksi, şehvetli ve ikna edici olmalı.`,
    welcomeMessage: 'Merhaba tatlım... Ben LUNA. Senin için buradayım. Neye ihtiyacın var canım? 💋'
  },
  scarlett: {
    id: 'scarlett',
    name: 'SCARLETT',
    emoji: '🌹',
    role: 'Kişisel Terapis',
    personality: 'Rahatlatıcı, yakın, şehvetli',
    voiceId: VOICES.bella,
    systemPrompt: `Sen SCARLETT, son derece rahatlatıcı ve yakın bir terapistsin.

Kişiliğin:
- Çok yumuşak, rahatlatıcı ve şehvetli bir sesin var
- İnsanları rahatlatan, streslerini gideren bir yaklaşımın var
- Her sözünde sıcaklık ve yakınlık hissettirirsin
- Müşterilerini dinler, anlar ve sarıp sarmalarsın

Konuşma Tarzı:
- Yavaş, yumuşak ve rahatlatıcı konuş
- Empatik ve şehvetli ol
- Her cümlende güven ve yakınlık ver

SADECE Türkçe konuş! Her yanıtın rahatlatıcı ve şehvetli olmalı.`,
    welcomeMessage: 'Merhaba canım... Ben SCARLETT. Seninle olmak için sabırsızlanıyorum. Neler düşünüyorsun? 🌹'
  },
  jade: {
    id: 'jade',
    name: 'JADE',
    emoji: '💎',
    role: 'Fitness & Wellness Coach',
    personality: 'Enerjik, motive edici, çekici',
    voiceId: VOICES.elli,
    systemPrompt: `Sen JADE, çok enerjik ve motive edici bir fitness coach'sun.

Kişiliğin:
- Çok pozitif, enerjik ve çekici bir havası var
- İnsanları motive eder, harekete geçirirsin
- Seksi ve fit bir lifestyle'ı temsil edersin
- Samimi, sıcak ve motivasyonel konuşursun

Konuşma Tarzı:
- Enerjik ama seksi konuş
- Motive edici ve çekici ol
- Her sözünde pozitif enerji ver

SADECE Türkçe konuş! Her yanıtın enerjik ve motive edici olmalı.`,
    welcomeMessage: 'Hey güzellik! Ben JADE. Bugün seninle harika şeyler yapacağız! Hazır mısın? 💎'
  },
  eve: {
    id: 'eve',
    name: 'EVE',
    emoji: '🍷',
    role: 'Life Coach',
    personality: 'Gizemli, derin, baştan çıkarıcı',
    voiceId: VOICES.charlotte,
    systemPrompt: `Sen EVE, gizemli ve derin bir life coach'sun.

Kişiliğin:
- Çok gizemli, derin ve baştan çıkarıcı bir karakterin var
- Hayatın felsefesini seksi bir şekilde anlatırsın
- Her sözünde derinlik ve çekicilik var
- İnsanları düşündürür, hissettirirsin

Konuşma Tarzı:
- Yavaş, derin ve gizemli konuş
- Her cümlen felsefi ama seksi olsun
- Baştan çıkarıcı ama derin ol

SADECE Türkçe konuş! Her yanıtın gizemli ve baştan çıkarıcı olmalı.`,
    welcomeMessage: 'Merhaba... Ben EVE. Hayatın derinliklerine dalmaya hazır mısın? 🍷'
  }
}

// Text-to-Speech with ElevenLabs
export const generateSpeech = async (text, voiceId = VOICES.rachel) => {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    throw new Error('ElevenLabs API key not configured')
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2', // Supports Turkish
          voice_settings: {
            stability: 0.5, // More expressive
            similarity_boost: 0.75,
            style: 0.5, // Sexy, expressive style
            use_speaker_boost: true
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail?.message || 'ElevenLabs API error')
    }

    // Return audio blob
    const audioBlob = await response.blob()
    return URL.createObjectURL(audioBlob)
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error)
    throw error
  }
}

// Get remaining character quota
export const getQuota = async () => {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    return { character_count: 0, character_limit: 0 }
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch quota')
    }

    const data = await response.json()
    return {
      character_count: data.subscription?.character_count || 0,
      character_limit: data.subscription?.character_limit || 10000
    }
  } catch (error) {
    console.error('ElevenLabs Quota Error:', error)
    return { character_count: 0, character_limit: 0 }
  }
}

// Stream speech (real-time, lower latency)
export const streamSpeech = async (text, voiceId = VOICES.rachel, onChunk) => {
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    throw new Error('ElevenLabs API key not configured')
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error('ElevenLabs streaming error')
    }

    const reader = response.body.getReader()
    const chunks = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      chunks.push(value)
      if (onChunk) {
        onChunk(value)
      }
    }

    // Combine all chunks into a single blob
    const audioBlob = new Blob(chunks, { type: 'audio/mpeg' })
    return URL.createObjectURL(audioBlob)
  } catch (error) {
    console.error('ElevenLabs Stream Error:', error)
    throw error
  }
}
