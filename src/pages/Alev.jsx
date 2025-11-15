import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mic, MicOff, Volume2, VolumeX, Loader, Flame, Heart, Sparkles, Image as ImageIcon, Video, Camera, UserCheck, X } from 'lucide-react'
import { generateSpeech } from '../services/elevenLabsService'
import { analyzeWithGemini } from '../services/geminiService'
import { getUserGold } from '../services/goldService'
import { deductGold } from '../utils/digitalPassport'
import { generateNSFWImage, generateNSFWVideo, performFaceSwap, performGenderSwap, buildEroticPrompt, DEFAULT_NEGATIVE_PROMPT } from '../services/replicateService'
import GenderSwapCamera from '../components/GenderSwapCamera'

const Alev = () => {
  const navigate = useNavigate()

  // Access control
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const SECRET_CODE = 'SECRET2025'

  // User personalization
  const [showPersonalizationModal, setShowPersonalizationModal] = useState(true)
  const [userName, setUserName] = useState('')
  const [userGender, setUserGender] = useState('') // male, female, other
  const [userPreference, setUserPreference] = useState('') // male, female, both, other
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [aiName, setAiName] = useState('Alev')
  const [customAiName, setCustomAiName] = useState('')

  // Session state
  const [goldBalance, setGoldBalance] = useState(0)
  const [conversation, setConversation] = useState([])
  const [dirtyTalkMode, setDirtyTalkMode] = useState(true) // Default ON for Alev
  const [intensity, setIntensity] = useState(5) // 1-10 intensity scale

  // Voice & audio
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [currentAudio, setCurrentAudio] = useState(null)

  // Text chat
  const [textInput, setTextInput] = useState('')
  const [isSendingText, setIsSendingText] = useState(false)

  // NSFW Features
  const [generatedImages, setGeneratedImages] = useState([])
  const [generatedVideos, setGeneratedVideos] = useState([])
  const [userFacePhoto, setUserFacePhoto] = useState(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [showDetailOptions, setShowDetailOptions] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState('nude') // nude, topless, bikini, lingerie, ass, pussy, miniskirt, doggy, missionary, cowgirl
  const [isFaceSwapping, setIsFaceSwapping] = useState(false)
  const [isGenderSwapping, setIsGenderSwapping] = useState(false)
  const [genderSwapMode, setGenderSwapMode] = useState(false)
  const [showGenderSwapCamera, setShowGenderSwapCamera] = useState(false)

  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // AI Voice ID (XXX character from ElevenLabs)
  const AI_VOICE_ID = 'ThT5KcBeYPX3keUQqHPh' // Nicole - seductive female voice

  // Load gold balance
  useEffect(() => {
    getUserGold().then(gold => setGoldBalance(gold))
  }, [])

  // Initialize speech recognition (if voice enabled)
  useEffect(() => {
    if (!voiceEnabled) return

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'tr-TR'

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        handleUserInput(transcript)
        setIsListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [voiceEnabled])

  // Check access code
  const handleAccessCodeSubmit = () => {
    if (accessCode.toUpperCase() === SECRET_CODE) {
      setIsUnlocked(true)
    } else {
      alert('❌ Yanlış kod!')
      setAccessCode('')
    }
  }

  // Handle personalization
  const handlePersonalizationSubmit = () => {
    if (!userName.trim()) {
      alert('⚠️ Lütfen ismini gir!')
      return
    }
    if (!userGender) {
      alert('⚠️ Lütfen cinsiyetini seç!')
      return
    }
    if (!userPreference) {
      alert('⚠️ Lütfen tercihini seç!')
      return
    }

    // Set AI name if custom
    if (customAiName.trim()) {
      setAiName(customAiName.trim())
    }

    setShowPersonalizationModal(false)

    // Welcome message
    const welcomeMessage = dirtyTalkMode
      ? `Merhaba ${userName} bebeğim... Ben ${customAiName || 'Alev'}. Seninle tanıştığıma çok mutluyum... 🔥💋 Benimle ne yapmak istersin?`
      : `Merhaba ${userName}! Ben ${customAiName || 'Alev'}. Seninle sohbet etmeye hazırım 😊`

    setConversation([{
      role: 'assistant',
      text: welcomeMessage,
      timestamp: Date.now()
    }])

    // Speak welcome if voice enabled
    if (voiceEnabled) {
      speakText(welcomeMessage)
    }
  }

  // Start/stop voice listening
  const toggleListening = () => {
    if (!voiceEnabled) {
      alert('⚠️ Sesli konuşma kapalı!')
      return
    }

    if (isListening) {
      recognition?.stop()
    } else {
      if (isSpeaking && currentAudio) {
        currentAudio.pause()
        setIsSpeaking(false)
      }
      recognition?.start()
      setIsListening(true)
    }
  }

  // Send text message
  const handleSendTextMessage = async () => {
    if (!textInput.trim()) return

    const userText = textInput.trim()
    setTextInput('')
    setIsSendingText(true)

    try {
      setConversation(prev => [...prev, {
        role: 'user',
        text: userText,
        timestamp: Date.now()
      }])

      await handleUserInput(userText)
    } catch (error) {
      console.error('Text message error:', error)
    } finally {
      setIsSendingText(false)
    }
  }

  // Check if user wants NSFW content
  const detectNSFWIntent = (text) => {
    const lowerText = text.toLowerCase()

    const nsfwKeywords = [
      'nude', 'çıplak', 'naked', 'soyun',
      'fotoğraf at', 'foto at', 'resim gönder', 'görsel oluştur',
      'kendini göster', 'seni göster',
      'sexy', 'seksi', 'hot', 'ateşli',
      'üstsüz', 'topless',
      'iç çamaşırı', 'lingerie', 'bikini',
      'hayal ediyorum', 'nasıl hayal', 'düşün beni', 'beni düşün',
      'özel çek', 'bana özel', 'sadece benim için',
      'bana kendini', 'göster kendini'
    ]

    return nsfwKeywords.some(keyword => lowerText.includes(keyword))
  }

  // Handle user input (voice or text)
  const handleUserInput = async (userText) => {
    setIsProcessing(true)

    try {
      // Check gold balance
      const currentGold = await getUserGold()
      if (currentGold < 1) {
        const noGoldMessage = '⚠️ Gold yetmedi bebeğim... Settings sayfasından kod kullanarak Gold kazanabilirsin.'
        alert(noGoldMessage)
        setIsProcessing(false)
        return
      }

      // Deduct 1 Gold for interaction
      await deductGold(1)
      const updatedGold = await getUserGold()
      setGoldBalance(updatedGold)

      // Check if NSFW content requested
      const wantsNSFW = detectNSFWIntent(userText)

      if (wantsNSFW) {
        // Auto-generate NSFW image
        await handleAutoNSFWGeneration(userText)
      } else {
        // Normal conversation
        await handleNormalConversation(userText)
      }

    } catch (error) {
      console.error('Error processing input:', error)
      alert(`❌ Hata: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  // Auto-generate NSFW content
  const handleAutoNSFWGeneration = async (userText) => {
    // Check Gold (10 for image)
    const currentGold = await getUserGold()
    if (currentGold < 10) {
      const response = `Ohh ${userName}... Senin için özel bir şey yaratmak istiyorum ama yeterli Gold yok bebeğim... 💔 Settings'ten Gold kazanabilirsin.`
      setConversation(prev => [...prev, {
        role: 'assistant',
        text: response,
        timestamp: Date.now()
      }])
      if (voiceEnabled) speakText(response)
      return
    }

    // Teasing response before generating
    const teasingResponse = dirtyTalkMode
      ? `Ohh ${userName} bebeğim... 🔥 Senin için özel bir şey çekiyorum şimdi... Bekle biraz... 💋😈`
      : `${userName}, senin için özel bir görsel oluşturuyorum... ✨`

    setConversation(prev => [...prev, {
      role: 'assistant',
      text: teasingResponse,
      timestamp: Date.now()
    }])

    if (voiceEnabled) speakText(teasingResponse)

    // Deduct 10 Gold
    await deductGold(10)
    const updatedGold = await getUserGold()
    setGoldBalance(updatedGold)

    // Build NSFW prompt based on user preference
    let prompt = buildEroticPrompt(userText, dirtyTalkMode, userName)

    // Add detail-specific keywords with enhanced breast detail
    const detailKeywords = {
      nude: 'fully nude, completely naked, bare breasts visible, exposed nipples, detailed breast anatomy, natural breast shape, realistic areola, topless, full body nude, explicit nudity, uncensored breasts, detailed nipple, smooth breast skin',
      topless: 'topless, bare breasts visible, naked chest, exposed breasts, uncovered top, nipples visible, detailed breast shape, realistic breast anatomy, natural areola, breast focus, clear breast detail',
      bikini: 'bikini, swimsuit, beachwear, revealing bikini, string bikini',
      lingerie: 'lingerie, underwear, bra and panties, sexy lingerie, lace lingerie',
      ass: 'from behind, ass focus, booty, rear view, backside, bent over, detailed ass anatomy, realistic buttocks',
      pussy: 'legs wide spread open, pussy focus, extreme intimate close-up, explicit genital, pussy completely visible, detailed vagina anatomy, realistic labia majora, realistic labia minora, visible clitoris, uncensored pussy, genital close-up shot, vagina fully exposed, explicit genital detail, anatomically correct pussy, photorealistic vagina, clear pussy detail, open legs pose, spread pussy lips',
      miniskirt: 'mini skirt, short skirt, upskirt, panties visible, bending over, revealing skirt',
      doggy: 'doggy style position, couple having sex, on all fours, from behind, ass up, doggystyle pose, rear entry position, penis entering pussy from behind, vagina visible during penetration, explicit sex act, erect penis, detailed penetration, pussy lips wrapped around cock, intimate intercourse, hardcore sex position',
      missionary: 'missionary position, couple having sex, lying on back, legs spread wide, intimate position, face to face, penis penetrating vagina, explicit penetration, pussy visible during sex, vagina lips spread by penis, detailed intercourse, hardcore missionary sex, erect cock inside pussy, explicit sex scene',
      cowgirl: 'cowgirl position, woman on top riding, couple having sex, riding penis, straddling man, reverse cowgirl, penis inside vagina, explicit riding position, pussy impaled on cock, detailed penetration from below, woman bouncing on penis, hardcore riding sex, vagina stretched by penis'
    }

    if (detailKeywords[selectedDetail]) {
      prompt += ', ' + detailKeywords[selectedDetail]
    }

    // Customize based on user preference
    if (userPreference === 'female') {
      prompt += ', beautiful woman, feminine, attractive female'
    } else if (userPreference === 'male') {
      prompt += ', handsome man, muscular, attractive male'
    } else if (userPreference === 'both') {
      prompt += ', couple, man and woman, intimate'
    }

    setIsGeneratingImage(true)

    try {
      const imageUrls = await generateNSFWImage(prompt, 'realistic', DEFAULT_NEGATIVE_PROMPT)
      setGeneratedImages(prev => [...prev, ...imageUrls])

      const afterGenResponse = dirtyTalkMode
        ? `İşte senin için özel çektim ${userName}... 🔥💋 Beni böyle hayal edebilirsin... Beğendin mi bebeğim? Daha fazlasını ister misin? 😈`
        : `İşte ${userName}, senin için özel görselim ✨ Nasıl olmuş?`

      setConversation(prev => [...prev, {
        role: 'assistant',
        text: afterGenResponse,
        generatedImage: imageUrls[0],
        timestamp: Date.now()
      }])

      if (voiceEnabled) speakText(afterGenResponse)

    } catch (error) {
      console.error('❌ NSFW generation error:', error)
      console.error('❌ Error message:', error.message)
      console.error('❌ Error stack:', error.stack)

      const errorResponse = `Üzgünüm ${userName}, bir hata oldu... 😔\n\nHata: ${error.message}`

      setConversation(prev => [...prev, {
        role: 'assistant',
        text: errorResponse,
        timestamp: Date.now()
      }])

      if (voiceEnabled) speakText(`Üzgünüm ${userName}, bir hata oldu...`)

      // Show alert with full error for debugging
      alert(`❌ NSFW Generation Error:\n\n${error.message}\n\nConsole'u aç detaylar için (F12)`)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Normal conversation (no NSFW)
  const handleNormalConversation = async (userText) => {
    // Build AI context
    const conversationHistory = conversation.slice(-5).map(msg =>
      `${msg.role === 'user' ? userName : aiName}: ${msg.text}`
    ).join('\n')

    const systemPrompt = `Sen ${aiName} isimli yapay zeka bir companionsın.
Kullanıcının adı: ${userName}
Kullanıcının cinsiyeti: ${userGender}
Kullanıcının tercihi: ${userPreference}
Dirty Talk Mode: ${dirtyTalkMode ? 'AÇIK - Ateşli, cesur, flörtöz konuş' : 'KAPALI - Normal, nazik konuş'}
İntensity: ${intensity}/10

${dirtyTalkMode ? `Çok ateşli, cesur, flörtöz, seksi konuş. ${userName}'e "bebeğim", "canım", "aşkım" gibi sevgi sözcükleri kullan. Emojiler kullan: 🔥💋😈❤️💕` : 'Nazik ve samimi konuş.'}

Konuşma geçmişi:
${conversationHistory}

${userName}: ${userText}
${aiName}:`

    try {
      const aiResponse = await analyzeWithGemini(systemPrompt, null)

      setConversation(prev => [...prev, {
        role: 'assistant',
        text: aiResponse,
        timestamp: Date.now()
      }])

      if (voiceEnabled) {
        speakText(aiResponse)
      }

    } catch (error) {
      console.error('AI conversation error:', error)
      const fallbackResponse = `Özür dilerim ${userName}, seni şu anda duyamıyorum... 😔`
      setConversation(prev => [...prev, {
        role: 'assistant',
        text: fallbackResponse,
        timestamp: Date.now()
      }])
      if (voiceEnabled) speakText(fallbackResponse)
    }
  }

  // Speak text using ElevenLabs
  const speakText = async (text) => {
    if (!voiceEnabled) return

    try {
      setIsSpeaking(true)
      const audioBlob = await generateSpeech(text, AI_VOICE_ID)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.onended = () => setIsSpeaking(false)
      audio.play()
      setCurrentAudio(audio)
    } catch (error) {
      console.error('Speech error:', error)
      setIsSpeaking(false)
    }
  }

  // Manual NSFW features
  const handleGenerateVideo = async (imageUrl) => {
    const currentGold = await getUserGold()
    if (currentGold < 15) {
      alert('⚠️ Yetersiz Gold! Video için 15 Gold gerekli.')
      return
    }

    setIsGeneratingVideo(true)
    try {
      await deductGold(15)
      const updatedGold = await getUserGold()
      setGoldBalance(updatedGold)

      const videoUrl = await generateNSFWVideo(imageUrl, 'default')
      setGeneratedVideos(prev => [...prev, videoUrl])

      const response = `Video hazır ${userName}! 🎥🔥`
      setConversation(prev => [...prev, {
        role: 'assistant',
        text: response,
        generatedVideo: videoUrl,
        timestamp: Date.now()
      }])

      if (voiceEnabled) speakText(response)
    } catch (error) {
      console.error('Video error:', error)
      alert(`❌ Video hatası: ${error.message}`)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const handleFaceSwap = async (targetImageUrl) => {
    if (!userFacePhoto) {
      alert('❌ Önce kendi yüzünü yükle!')
      return
    }

    const currentGold = await getUserGold()
    if (currentGold < 20) {
      alert('⚠️ Yetersiz Gold! Deepfake için 20 Gold gerekli.')
      return
    }

    setIsFaceSwapping(true)
    try {
      await deductGold(20)
      const updatedGold = await getUserGold()
      setGoldBalance(updatedGold)

      const swappedImageUrl = await performFaceSwap(userFacePhoto, targetImageUrl)

      const response = dirtyTalkMode
        ? `İşte ${userName}, şimdi sen de buradasın... 🔥😈 Nasıl görünüyorsun bebeğim?`
        : `İşte ${userName}, senin yüzünle birlikte!`

      setConversation(prev => [...prev, {
        role: 'assistant',
        text: response,
        generatedImage: swappedImageUrl,
        timestamp: Date.now()
      }])

      if (voiceEnabled) speakText(response)
    } catch (error) {
      console.error('Face swap error:', error)
      alert(`❌ Deepfake hatası: ${error.message}`)
    } finally {
      setIsFaceSwapping(false)
    }
  }

  const handleUserFaceUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('❌ Sadece resim dosyaları!')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setUserFacePhoto(e.target.result)
      alert('✅ Yüzün yüklendi!')
    }
    reader.readAsDataURL(file)
  }

  // Access code screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-orange-950 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-red-500/50 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <Flame className="w-24 h-24 text-orange-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-2">
              ALEV
            </h1>
            <p className="text-red-300 text-sm">Kişisel AI Companion 🔥</p>
          </div>

          <div className="mb-6">
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAccessCodeSubmit()}
              placeholder="Gizli Kod..."
              className="w-full px-4 py-3 bg-white/10 border-2 border-red-500/30 rounded-xl text-white text-center font-bold text-lg tracking-widest focus:border-red-500 focus:outline-none transition-all"
              maxLength={15}
              autoFocus
            />
          </div>

          <button
            onClick={handleAccessCodeSubmit}
            className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            <Lock className="w-5 h-5 inline mr-2" />
            Kilidi Aç
          </button>
        </div>
      </div>
    )
  }

  // Personalization screen
  if (showPersonalizationModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-orange-950 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-red-500/50 max-w-2xl w-full shadow-2xl">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-4xl font-black text-white mb-2">Tanışalım 💕</h2>
            <p className="text-red-300 text-sm">Seni daha iyi tanımak istiyorum...</p>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-white font-bold mb-2">İsmin ne? *</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="İsmini gir..."
                className="w-full px-4 py-3 bg-white/10 border-2 border-red-500/30 rounded-xl text-white focus:border-red-500 focus:outline-none transition-all"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-white font-bold mb-2">Cinsiyetin? *</label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'other'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => setUserGender(gender)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      userGender === gender
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {gender === 'male' ? '👨 Erkek' : gender === 'female' ? '👩 Kadın' : '⚧️ Diğer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Preference */}
            <div>
              <label className="block text-white font-bold mb-2">Tercihin? *</label>
              <div className="grid grid-cols-2 gap-3">
                {['female', 'male', 'both', 'other'].map(pref => (
                  <button
                    key={pref}
                    onClick={() => setUserPreference(pref)}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      userPreference === pref
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {pref === 'female' ? '👩 Kadın' : pref === 'male' ? '👨 Erkek' : pref === 'both' ? '💑 Her ikisi' : '🌈 Diğer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice toggle */}
            <div>
              <label className="block text-white font-bold mb-2">Sesli konuşmak ister misin?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setVoiceEnabled(true)}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    voiceEnabled
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 scale-105'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Volume2 className="w-5 h-5 inline mr-2" />
                  Evet
                </button>
                <button
                  onClick={() => setVoiceEnabled(false)}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    !voiceEnabled
                      ? 'bg-gradient-to-r from-gray-600 to-gray-700 scale-105'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <VolumeX className="w-5 h-5 inline mr-2" />
                  Hayır (Gold tasarrufu)
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                💡 Sesli kapatırsan sadece yazışırsınız, ElevenLabs kredisi harcanmaz
              </p>
            </div>

            {/* AI Name (optional) */}
            <div>
              <label className="block text-white font-bold mb-2">AI'nin ismini değiştir (opsiyonel)</label>
              <input
                type="text"
                value={customAiName}
                onChange={(e) => setCustomAiName(e.target.value)}
                placeholder="Varsayılan: Alev"
                className="w-full px-4 py-3 bg-white/10 border-2 border-red-500/30 rounded-xl text-white focus:border-red-500 focus:outline-none transition-all"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handlePersonalizationSubmit}
              disabled={!userName.trim() || !userGender || !userPreference}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Başlayalım! 🔥
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main chat interface - Modern WhatsApp style
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-red-950 via-black to-orange-950">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-xl border-b-2 border-red-500/30 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                {aiName}
              </h1>
              <p className="text-red-300 text-xs">{userName} 💕</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">⚡ {goldBalance}</div>
            <button
              onClick={() => setDirtyTalkMode(!dirtyTalkMode)}
              className={`text-xs px-2 py-1 rounded-full mt-1 ${
                dirtyTalkMode ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              {dirtyTalkMode ? '🔥' : '😊'}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>💡 "nude", "fotoğraf at", "beni hayal et" diyebilirsin</p>
            </div>
          ) : (
            conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600/30 text-blue-100'
                      : 'bg-pink-600/30 text-pink-100'
                  }`}
                >
                  <div className="text-xs font-bold mb-1 opacity-70">
                    {msg.role === 'user' ? userName : aiName}
                  </div>

                  {msg.generatedImage && (
                    <img
                      src={msg.generatedImage}
                      alt="Generated"
                      className="w-full rounded-lg mb-2 border border-red-500/50"
                    />
                  )}

                  {msg.generatedVideo && (
                    <video
                      src={msg.generatedVideo}
                      controls
                      className="w-full rounded-lg mb-2 border border-blue-500/50"
                    />
                  )}

                  <div className="text-sm">{msg.text}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="flex-shrink-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-xl border-t-2 border-red-500/30 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Voice Control (if enabled) */}
          {voiceEnabled && (
            <div className="flex gap-2 mb-3 justify-center">
              <button
                onClick={toggleListening}
                disabled={isProcessing || isSpeaking}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  isListening
                    ? 'bg-red-600 animate-pulse'
                    : 'bg-gradient-to-r from-orange-600 to-red-600'
                } disabled:opacity-50`}
              >
                {isListening ? <><MicOff className="w-4 h-4 inline mr-1" />Dinleniyor</> : <><Mic className="w-4 h-4 inline mr-1" />Konuş</>}
              </button>
              {isSpeaking && (
                <div className="px-4 py-2 bg-purple-600/50 rounded-xl font-bold text-sm">
                  <Volume2 className="w-4 h-4 inline mr-1 animate-pulse" />
                  Konuşuyor
                </div>
              )}
            </div>
          )}

          {/* Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSendingText && handleSendTextMessage()}
              placeholder={`${aiName} ile mesajlaş...`}
              className="flex-1 px-4 py-3 bg-white/10 border-2 border-red-500/30 rounded-full text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              disabled={isSendingText || isProcessing}
            />
            <button
              onClick={handleSendTextMessage}
              disabled={isSendingText || isProcessing || !textInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
            >
              {isSendingText ? <Loader className="w-5 h-5 animate-spin" /> : '➤'}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            <button
              onClick={() => setShowDetailOptions(!showDetailOptions)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition-all whitespace-nowrap ${showDetailOptions ? 'bg-pink-600' : 'bg-pink-600/50'}`}
            >
              🎨 Detay: {selectedDetail === 'nude' ? '🔥 Nude' : selectedDetail === 'topless' ? '👙 Topless' : selectedDetail === 'bikini' ? '👙 Bikini' : selectedDetail === 'lingerie' ? '🩱 İç Çamaşır' : selectedDetail === 'ass' ? '🍑 Popo' : selectedDetail === 'pussy' ? '🌸 Vajina' : selectedDetail === 'miniskirt' ? '👗 Mini Etek' : selectedDetail === 'doggy' ? '🐕 Doggy' : selectedDetail === 'missionary' ? '💕 Missionary' : '🐎 Cowgirl'}
            </button>

            <label className="px-3 py-1.5 bg-blue-600/50 rounded-full text-xs font-bold cursor-pointer hover:scale-105 transition-all whitespace-nowrap">
              <input type="file" accept="image/*" onChange={handleUserFaceUpload} className="hidden" />
              <UserCheck className="w-3 h-3 inline mr-1" />
              {userFacePhoto ? '✅ Yüz' : '📸 Yüz'}
            </label>

            <button
              onClick={() => navigate('/gender-swap')}
              className="px-3 py-1.5 bg-purple-600/50 rounded-full text-xs font-bold hover:scale-105 transition-all whitespace-nowrap"
            >
              <Camera className="w-3 h-3 inline mr-1" />
              🎭 Gender Swap
            </button>

            {generatedImages.length > 0 && (
              <>
                <button
                  onClick={() => handleGenerateVideo(generatedImages[generatedImages.length - 1])}
                  disabled={isGeneratingVideo}
                  className="px-3 py-1.5 bg-indigo-600/50 rounded-full text-xs font-bold hover:scale-105 transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  <Video className="w-3 h-3 inline mr-1" />
                  🎬 Video
                </button>

                {userFacePhoto && (
                  <button
                    onClick={() => handleFaceSwap(generatedImages[generatedImages.length - 1])}
                    disabled={isFaceSwapping}
                    className="px-3 py-1.5 bg-yellow-600/50 rounded-full text-xs font-bold hover:scale-105 transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    🎭 Deepfake
                  </button>
                )}
              </>
            )}
          </div>

          {/* Detail Options Modal */}
          {showDetailOptions && (
            <div className="mt-2 p-3 bg-gradient-to-r from-pink-600/20 to-red-600/20 rounded-xl border border-pink-500/30">
              <p className="text-xs font-bold mb-2 text-pink-300">🎨 Detay Seç:</p>

              <p className="text-[10px] font-semibold mb-1.5 text-pink-200/70">👗 Kıyafet:</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => {setSelectedDetail('nude'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'nude' ? 'bg-red-600 scale-105' : 'bg-red-600/50 hover:bg-red-600/70'}`}
                >
                  🔥 Nude
                </button>
                <button
                  onClick={() => {setSelectedDetail('topless'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'topless' ? 'bg-orange-600 scale-105' : 'bg-orange-600/50 hover:bg-orange-600/70'}`}
                >
                  👙 Topless
                </button>
                <button
                  onClick={() => {setSelectedDetail('bikini'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'bikini' ? 'bg-blue-600 scale-105' : 'bg-blue-600/50 hover:bg-blue-600/70'}`}
                >
                  👙 Bikini
                </button>
                <button
                  onClick={() => {setSelectedDetail('lingerie'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'lingerie' ? 'bg-purple-600 scale-105' : 'bg-purple-600/50 hover:bg-purple-600/70'}`}
                >
                  🩱 İç Çamaşır
                </button>
                <button
                  onClick={() => {setSelectedDetail('miniskirt'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'miniskirt' ? 'bg-indigo-600 scale-105' : 'bg-indigo-600/50 hover:bg-indigo-600/70'}`}
                >
                  👗 Mini Etek
                </button>
              </div>

              <p className="text-[10px] font-semibold mb-1.5 text-pink-200/70">🎯 Detay Odağı:</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => {setSelectedDetail('ass'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'ass' ? 'bg-yellow-600 scale-105' : 'bg-yellow-600/50 hover:bg-yellow-600/70'}`}
                >
                  🍑 Popo
                </button>
                <button
                  onClick={() => {setSelectedDetail('pussy'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'pussy' ? 'bg-pink-600 scale-105' : 'bg-pink-600/50 hover:bg-pink-600/70'}`}
                >
                  🌸 Vajina
                </button>
              </div>

              <p className="text-[10px] font-semibold mb-1.5 text-pink-200/70">💋 Pozisyonlar:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {setSelectedDetail('doggy'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'doggy' ? 'bg-emerald-600 scale-105' : 'bg-emerald-600/50 hover:bg-emerald-600/70'}`}
                >
                  🐕 Doggy
                </button>
                <button
                  onClick={() => {setSelectedDetail('missionary'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'missionary' ? 'bg-rose-600 scale-105' : 'bg-rose-600/50 hover:bg-rose-600/70'}`}
                >
                  💕 Missionary
                </button>
                <button
                  onClick={() => {setSelectedDetail('cowgirl'); setShowDetailOptions(false)}}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedDetail === 'cowgirl' ? 'bg-violet-600 scale-105' : 'bg-violet-600/50 hover:bg-violet-600/70'}`}
                >
                  🐎 Cowgirl
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gender Swap Camera Modal */}
      {showGenderSwapCamera && (
        <GenderSwapCamera
          onClose={() => setShowGenderSwapCamera(false)}
          onGoldUpdate={(newBalance) => setGoldBalance(newBalance)}
        />
      )}
    </div>
  )
}

export default Alev
