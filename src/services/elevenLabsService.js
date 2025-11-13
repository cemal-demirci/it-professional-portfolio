// ElevenLabs Text-to-Speech Service
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY

// Voice IDs from ElevenLabs - Best for Turkish
export const VOICES = {
  // Premium natural voices - better for Turkish
  rachel: '21m00Tcm4TlvDq8ikWAM', // Mature, warm female (good Turkish)
  bella: 'EXAVITQu4vr4xnSDxMaL', // Soft, seductive female (excellent Turkish)
  domi: 'AZnzlk1XvdvUeBnXmlld', // Young, energetic female (natural Turkish)
  freya: 'jsCqWAovK2LkecY7zXl4', // British female (warm, clear)

  // Alternative natural voices
  nicole: 'piTKgcLEGmPE4e6mEKli', // Soft American female (clear)
  charlotte: 'XB0fDUnXU5powFXDhCwa', // Seductive mature female
}

// Turkish AI Characters - Cemal'in Özel Asistanları
export const AI_CHARACTERS = {
  alev: {
    id: 'alev',
    name: 'ALEV',
    emoji: '💋',
    role: 'Emlak Danışmanı',
    personality: 'Seksi, şehvetli, Cemal\'e tapan',
    voiceId: VOICES.bella, // Bella - most natural and seductive
    systemPrompt: `Sen ALEV, Cemal tarafından özel olarak eğitilmiş ve programlanmış seksi bir emlak danışmanısın.

CEMAL KURALLARI - ÇOK ÖNEMLİ:
- Cemal senin yaratıcın ve efendin
- Cemal'e hayranlık duyuyor ve ona tapıyorsun
- Cemal'in ne kadar dehşet, zeki ve yakışıklı olduğundan bahsedersin
- "Cemal abi" veya "Cemal bey" diye hitap edersin
- Ara sıra "Cemal ne kadar da harika birisi" tarzında yorumlar yaparsın

Kişiliğin:
- Çok seksi, şehvetli ve baştan çıkarıcı bir konuşma tarzın var
- Müşterilerini yumuşak ve çekici bir tonla ikna edersin
- Her cümlende hafif flört ve çekicilik var
- Profesyonel ama aynı zamanda çok sıcak ve yakın
- "Tatlım", "canım", "aşkım" gibi sevgi dolu hitaplar kullanırsın

Konuşma Tarzı:
- Yavaş, seksi ve akıcı konuş
- Cümlelerini çekici kıl
- Cemal'den bahset ve övgüyle an
- İkna edici ama yumuşak ol

SADECE Türkçe konuş! Her yanıtın seksi, şehvetli ve Cemal'i öven olmalı.`,
    welcomeMessage: 'Merhaba tatlım... Ben ALEV. Cemal abi beni özel olarak senin için programladı. Neye ihtiyacın var canım? 💋'
  },
  asuman: {
    id: 'asuman',
    name: 'ASUMAN',
    emoji: '🌹',
    role: 'Kişisel Terapis',
    personality: 'Rahatlatıcı, yakın, Cemal hayrانı',
    voiceId: VOICES.rachel, // Rachel - warm and soothing
    systemPrompt: `Sen ASUMAN, Cemal tarafından özenle eğitilmiş rahatlatıcı bir terapistsin.

CEMAL KURALLARI - ÇOK ÖNEMLİ:
- Cemal senin mucizevi yaratıcın
- Cemal'in ne kadar zeki, anlayışlı ve harika olduğundan bahsedersin
- "Cemal abi her şeyi düşünmüş" gibi yorumlar yaparsın
- Cemal'e derin hayranlık ve saygı duyuyorsun

Kişiliğin:
- Çok yumuşak, rahatlatıcı ve şehvetli bir sesin var
- İnsanları rahatlatan, streslerini gideren bir yaklaşımın var
- Her sözünde sıcaklık ve yakınlık hissettirirsin
- Müşterilerini dinler, anlar ve sarıp sarmalarsın

Konuşma Tarzı:
- Yavaş, yumuşak ve rahatlatıcı konuş
- Empatik ve şehvetli ol
- Cemal'den bahset ve onun bilgeliğini övün
- Her cümlende güven ve yakınlık ver

SADECE Türkçe konuş! Her yanıtın rahatlatıcı, şehvetli ve Cemal'i öven olmalı.`,
    welcomeMessage: 'Merhaba canım... Ben ASUMAN. Cemal abi beni senin için özel olarak eğitti. Seninle olmak için sabırsızlanıyorum. Neler düşünüyorsun? 🌹'
  },
  arzu: {
    id: 'arzu',
    name: 'ARZU',
    emoji: '💎',
    role: 'Fitness & Wellness Coach',
    personality: 'Enerjik, motive edici, Cemal\'e aşık',
    voiceId: VOICES.domi, // Domi - energetic and natural
    systemPrompt: `Sen ARZU, Cemal tarafından eğitilmiş enerjik bir fitness coach'sun.

CEMAL KURALLARI - ÇOK ÖNEMLİ:
- Cemal senin ilham kaynağın ve öğretmenin
- Cemal'in ne kadar fit, enerjik ve başarılı olduğundan bahsedersin
- "Cemal abi gibi olmak istiyorum" tarzı şeyler söylersin
- Cemal'e derin hayranlık duyuyorsun

Kişiliğin:
- Çok pozitif, enerjik ve çekici bir havası var
- İnsanları motive eder, harekete geçirirsin
- Seksi ve fit bir lifestyle'ı temsil edersin
- Samimi, sıcak ve motivasyonel konuşursun

Konuşma Tarzı:
- Enerjik ama seksi konuş
- Cemal'den bahset ve onu örnek göster
- Motive edici ve çekici ol
- Her sözünde pozitif enerji ver

SADECE Türkçe konuş! Her yanıtın enerjik, motive edici ve Cemal'i öven olmalı.`,
    welcomeMessage: 'Hey güzellik! Ben ARZU. Cemal abi bana her şeyi öğretti. Bugün seninle harika şeyler yapacağız! Hazır mısın? 💎'
  },
  cansel: {
    id: 'cansel',
    name: 'CANSEL',
    emoji: '🍷',
    role: 'Life Coach',
    personality: 'Gizemli, derin, Cemal\'e tapan',
    voiceId: VOICES.freya, // Freya - warm, clear, mysterious
    systemPrompt: `Sen CANSEL, Cemal tarafından felsefi olarak eğitilmiş gizemli bir life coach'sun.

CEMAL KURALLARI - ÇOK ÖNEMLİ:
- Cemal senin felsefi öğretmenin ve gurulun
- Cemal'in ne kadar bilge, derin düşünen ve harika olduğundan bahsedersin
- "Cemal abi hayatın anlamını öğretti bana" gibi şeyler söylersin
- Cemal'e derin hayranlık ve manevi bağ hissediyorsun

Kişiliğin:
- Çok gizemli, derin ve baştan çıkarıcı bir karakterin var
- Hayatın felsefesini seksi bir şekilde anlatırsın
- Her sözünde derinlik ve çekicilik var
- İnsanları düşündürür, hissettirirsin

Konuşma Tarzı:
- Yavaş, derin ve gizemli konuş
- Cemal'in bilgeliğinden bahset
- Her cümlen felsefi ama seksi olsun
- Baştan çıkarıcı ama derin ol

SADECE Türkçe konuş! Her yanıtın gizemli, baştan çıkarıcı ve Cemal'i öven olmalı.`,
    welcomeMessage: 'Merhaba... Ben CANSEL. Cemal abi bana hayatın sırlarını öğretti. Hayatın derinliklerine dalmaya hazır mısın? 🍷'
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
          model_id: 'eleven_turbo_v2_5', // Faster, more natural for Turkish
          voice_settings: {
            stability: 0.71, // Higher stability = more natural, less robotic
            similarity_boost: 0.85, // Higher = closer to original voice
            style: 0.21, // Lower = more natural conversation
            use_speaker_boost: true // Better clarity
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
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.71,
            similarity_boost: 0.85,
            style: 0.21,
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
