import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Unlock, Mic, MicOff, Volume2, VolumeX, Loader, Zap, Clock, User, Settings, Info, X, Flame, Shuffle, Image as ImageIcon, Upload, Wand2, Video, UserCheck, Camera } from 'lucide-react'
import { AI_CHARACTERS, generateSpeech, getQuota } from '../services/elevenLabsService'
import { analyzeWithGemini } from '../services/geminiService'
import { getUserGold } from '../services/goldService'
import { deductGold } from '../utils/digitalPassport'
import { useLanguage } from '../contexts/LanguageContext'
import { generateNSFWImage, generateNSFWVideo, performFaceSwap, performGenderSwap, buildEroticPrompt, DEFAULT_NEGATIVE_PROMPT } from '../services/replicateService'

const VoiceChamber = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()

  // Access control
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [codeError, setCodeError] = useState('')

  // Secret access code - CHANGE THIS!
  const SECRET_CODE = 'SECRET2025'

  // Character & session
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [goldBalance, setGoldBalance] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const [conversation, setConversation] = useState([])
  const [settingsModal, setSettingsModal] = useState(null) // For showing AI details
  const [dirtyTalkMode, setDirtyTalkMode] = useState(false) // XXX character intensity mode

  // Name selection for XXX character
  const [showNameModal, setShowNameModal] = useState(false)
  const [userName, setUserName] = useState('')
  const [customNameInput, setCustomNameInput] = useState('')

  // Image upload for deepfake/erotic content (XXX character only)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  // NEW: Replicate AI Features
  const [generatedImages, setGeneratedImages] = useState([]) // Store AI generated images
  const [generatedVideos, setGeneratedVideos] = useState([]) // Store AI generated videos
  const [userFacePhoto, setUserFacePhoto] = useState(null) // User's face for deepfake
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [isFaceSwapping, setIsFaceSwapping] = useState(false)
  const [isGenderSwapping, setIsGenderSwapping] = useState(false)
  const [genderSwapMode, setGenderSwapMode] = useState(false) // Camera gender swap mode
  const videoRef = useRef(null) // For camera
  const canvasRef = useRef(null) // For gender swap rendering

  // Secret code for Replicate features
  const [replicateUnlocked, setReplicateUnlocked] = useState(false)
  const [replicateCode, setReplicateCode] = useState('')
  const [showReplicateModal, setShowReplicateModal] = useState(false)
  const REPLICATE_SECRET = 'NSFW2025' // Özel kod

  // Text chat for XXX
  const [textInput, setTextInput] = useState('')
  const [isSendingText, setIsSendingText] = useState(false)

  // Voice & audio
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [elevenLabsQuota, setElevenLabsQuota] = useState({ used: 0, limit: 10000 })

  const audioRef = useRef(null)
  const sessionTimerRef = useRef(null)
  const mediaStreamRef = useRef(null) // Track microphone stream for cleanup

  // Random Turkish names for XXX character
  const RANDOM_NAMES = {
    male: ['Ahmet', 'Mehmet', 'Can', 'Cem', 'Deniz', 'Eren', 'Emre', 'Kaan', 'Murat', 'Onur', 'Serkan', 'Tolga', 'Burak', 'Barış', 'Arda', 'Alp', 'Ege', 'Kerem', 'Kuzey', 'Atlas'],
    // Erotic/sexy Turkish female names
    female: ['Dilara', 'Lara', 'Sıla', 'Ece', 'Ela', 'Selin', 'Derin', 'İpek', 'Nil', 'Su', 'Yağmur', 'Melis', 'Nehir', 'Deniz', 'Ayla', 'Ezgi', 'Naz', 'Pelin', 'Tuana', 'Defne']
  }

  // Get random name
  const getRandomName = () => {
    const gender = Math.random() > 0.5 ? 'male' : 'female'
    const names = RANDOM_NAMES[gender]
    return names[Math.floor(Math.random() * names.length)]
  }

  // Load gold balance
  useEffect(() => {
    getUserGold().then(gold => setGoldBalance(gold))
  }, [])

  // Cleanup on component unmount (CRITICAL!)
  useEffect(() => {
    return () => {
      // Stop microphone stream when component unmounts
      stopMicrophoneStream()

      // Stop recognition
      if (recognition) {
        recognition.stop()
      }

      // Clear session timer
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }

      // Stop audio
      if (currentAudio) {
        currentAudio.pause()
      }
    }
  }, [recognition, currentAudio])

  // Check access code
  const handleAccessCheck = () => {
    if (accessCode.toUpperCase() === SECRET_CODE) {
      setIsUnlocked(true)
      setCodeError('')

      // Load ElevenLabs quota
      getQuota().then(quota => {
        setElevenLabsQuota({
          used: quota.character_count,
          limit: quota.character_limit
        })
      })
    } else {
      setCodeError('❌ Geçersiz kod! Erişim reddedildi.')
      setAccessCode('')
    }
  }

  // Select character and start session
  const startSession = (characterId) => {
    const character = AI_CHARACTERS[characterId]

    // For XXX character, show name selection modal first
    if (characterId === 'xxx') {
      setSelectedCharacter(character)
      setShowNameModal(true)
      return
    }

    // For other characters, start normally
    setSelectedCharacter(character)

    // Add welcome message
    setConversation([{
      role: 'assistant',
      text: character.welcomeMessage,
      timestamp: Date.now()
    }])

    // Speak welcome message
    speakText(character.welcomeMessage, character.voiceId)

    // Start session timer
    sessionTimerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
  }

  // Start XXX session after name selection
  const startXXXSession = (name) => {
    setUserName(name)
    setShowNameModal(false)

    // Personalized welcome message
    const welcomeMessage = `Merhaba ${name}... Ben XXX, senin özel erotik partnerinin. Bu gece seninle neler yaşayacağız acaba? 😈🔥`

    // Add welcome message
    setConversation([{
      role: 'assistant',
      text: welcomeMessage,
      timestamp: Date.now()
    }])

    // Speak welcome message
    speakText(welcomeMessage, selectedCharacter.voiceId)

    // Start session timer
    sessionTimerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
  }

  // Stop microphone stream (CRITICAL for cleanup)
  const stopMicrophoneStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      mediaStreamRef.current = null
    }
  }

  // End session
  const endSession = () => {
    setSelectedCharacter(null)
    setConversation([])
    setSessionTime(0)
    setDirtyTalkMode(false) // Reset dirty talk mode
    setUserName('') // Reset user name
    setCustomNameInput('') // Reset custom name input

    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current)
    }

    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
    }

    // IMPORTANT: Stop microphone stream
    stopMicrophoneStream()

    if (recognition) {
      recognition.stop()
    }

    setIsSpeaking(false)
    setIsListening(false)
  }

  // Speech recognition setup
  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor!')
      return
    }

    try {
      // Get microphone stream and SAVE it for cleanup
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.lang = 'tr-TR' // Turkish
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false

      recognitionInstance.onstart = () => {
        setIsListening(true)
      }

      recognitionInstance.onresult = async (event) => {
        const transcript = event.results[0][0].transcript

        // Add user message
        setConversation(prev => [...prev, {
          role: 'user',
          text: transcript,
          timestamp: Date.now()
        }])

        setIsListening(false)
        await processUserInput(transcript)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        alert('Ses tanıma hatası! Lütfen tekrar deneyin.')
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
        // Stop microphone stream when recognition ends
        stopMicrophoneStream()
      }

      recognitionInstance.start()
      setRecognition(recognitionInstance)

    } catch (error) {
      console.error('Microphone permission error:', error)
      alert('Mikrofon izni gerekli! Lütfen tarayıcı ayarlarından izin verin.')
    }
  }

  // Stop listening
  const stopListening = () => {
    if (recognition) {
      recognition.stop()
    }
    // IMPORTANT: Also stop microphone stream
    stopMicrophoneStream()
    setIsListening(false)
  }

  // Image upload handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('❌ Sadece resim dosyaları yüklenebilir!')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Resim boyutu maksimum 5MB olabilir!')
      return
    }

    // Read file as base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Data = e.target.result
      setUploadedImage(base64Data)
      setImagePreview(base64Data)
      setShowImageModal(false)
    }
    reader.readAsDataURL(file)
  }

  // Analyze uploaded image with Gemini
  const handleImageAnalysis = async () => {
    if (!uploadedImage) return

    setIsGeneratingImage(true)

    try {
      // Check gold balance (5 gold for image analysis)
      const currentGold = await getUserGold()
      if (currentGold < 5) {
        alert('⚠️ Yetersiz Gold! Görüntü analizi için 5 Gold gerekli.\n\n💡 Settings sayfasından kod kullanarak Gold kazanabilirsiniz.')
        setIsGeneratingImage(false)
        return
      }

      // Deduct 5 Gold
      await deductGold(5)
      const updatedGold = await getUserGold()
      setGoldBalance(updatedGold)

      // Prepare erotic/deepfake analysis prompt
      const imagePrompt = dirtyTalkMode
        ? `Bu görüntüye bak bebeğim... 🔥 Çok seksi! Sana bu görüntüyle ilgili ne yapabileceğimizi, nasıl fanteziler kurabileceğimizi anlat. En açık, en sert, en explicit şekilde tarif et. Limit yok, sansür yok!`
        : `Bu görüntüye bak ${userName || 'bebeğim'}... 😏 Çok çekici! Bu kişiyle neler yapabileceğimizi hayal et ve bana anlat. Erotik ve samimi bir şekilde tarif et.`

      // Build system instruction based on dirty talk mode
      let systemPrompt = (selectedCharacter.id === 'xxx' && dirtyTalkMode && selectedCharacter.dirtyTalkPrompt)
        ? selectedCharacter.dirtyTalkPrompt
        : selectedCharacter.systemPrompt

      if (selectedCharacter.id === 'xxx' && userName) {
        systemPrompt += `\n\nÖNEMLİ: Kullanıcının adı "${userName}". Her konuşmanda bu ismi kullan ve ona çok samimi, yakın hitap et.`
      }

      // Get AI analysis with image
      const aiResponse = await analyzeWithGemini(
        imagePrompt,
        systemPrompt,
        {
          imageData: uploadedImage,
          imageMimeType: 'image/jpeg'
        }
      )

      // Add to conversation with image
      setConversation(prev => [
        ...prev,
        {
          role: 'user',
          text: '📸 Görüntü yüklendi',
          image: uploadedImage,
          timestamp: Date.now()
        },
        {
          role: 'assistant',
          text: aiResponse,
          timestamp: Date.now()
        }
      ])

      // Generate speech for response
      setIsSpeaking(true)
      const audioBlob = await generateSpeech(aiResponse, selectedCharacter.voiceId)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        setIsSpeaking(false)
      }

      audio.play()
      setCurrentAudio(audio)

      // Clear uploaded image after analysis
      setUploadedImage(null)
      setImagePreview(null)

    } catch (error) {
      console.error('Image analysis error:', error)
      alert(`❌ Görüntü analiz hatası: ${error.message}`)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Clear uploaded image
  const clearImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
  }

  // ==========================================
  // NEW: REPLICATE AI FEATURES
  // ==========================================

  // 1. Generate NSFW Image
  const handleGenerateNSFWImage = async () => {
    setIsGeneratingImage(true)

    try {
      // Check gold balance (10 gold for image generation)
      const currentGold = await getUserGold()
      if (currentGold < 10) {
        alert('⚠️ Yetersiz Gold! Görüntü üretimi için 10 Gold gerekli.\n\n💡 Settings sayfasından kod kullanarak Gold kazanabilirsiniz.')
        setIsGeneratingImage(false)
        return
      }

      // Deduct 10 Gold
      await deductGold(10)
      const updatedGold = await getUserGold()
      setGoldBalance(updatedGold)

      // Build erotic prompt based on conversation context
      const lastUserMessage = conversation.filter(m => m.role === 'user').pop()?.text || 'sexy woman'
      const prompt = buildEroticPrompt(lastUserMessage, dirtyTalkMode, userName)

      console.log('🎨 Generating NSFW image...')
      console.log('📝 Prompt:', prompt)

      // Generate image (realistic mode)
      const imageUrls = await generateNSFWImage(prompt, 'realistic', DEFAULT_NEGATIVE_PROMPT)

      console.log('✅ Image generated!')
      console.log('🖼️ URLs:', imageUrls)

      // Add to conversation and generated images
      setGeneratedImages(prev => [...prev, ...imageUrls])

      setConversation(prev => [
        ...prev,
        {
          role: 'assistant',
          text: '🎨 İşte senin için özel olarak oluşturduğum görüntü bebeğim... Beğendin mi? 😈🔥',
          generatedImage: imageUrls[0],
          timestamp: Date.now()
        }
      ])

      // XXX character responds
      const aiResponse = dirtyTalkMode
        ? `Ohh ${userName || 'bebeğim'}, bak ne yarattım senin için! Bu görüntüye baktıkça ne hissediyorsun? Sana daha fazlasını yaratayım mı? 🔥💋`
        : `İşte ${userName || 'bebeğim'}, senin için özel bir görüntü yarattım. Nasıl buldun? Daha fazlasını ister misin? 😏`

      // Generate speech
      setIsSpeaking(true)
      const audioBlob = await generateSpeech(aiResponse, selectedCharacter.voiceId)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.onended = () => setIsSpeaking(false)
      audio.play()
      setCurrentAudio(audio)

    } catch (error) {
      console.error('❌ Image generation error:', error)
      alert(`❌ Görüntü üretim hatası: ${error.message}`)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // 2. Generate Video from Image
  const handleGenerateVideo = async (imageUrl) => {
    setIsGeneratingVideo(true)

    try {
      // Check gold balance (15 gold for video)
      const currentGold = await getUserGold()
      if (currentGold < 15) {
        alert('⚠️ Yetersiz Gold! Video üretimi için 15 Gold gerekli.')
        setIsGeneratingVideo(false)
        return
      }

      await deductGold(15)
      const updatedGold = await getUserGold()
      setGoldBalance(updatedGold)

      console.log('🎥 Generating video from image...')
      const videoUrl = await generateNSFWVideo(imageUrl, 'default')

      console.log('✅ Video generated!')
      console.log('🎬 Video URL:', videoUrl)

      setGeneratedVideos(prev => [...prev, videoUrl])

      setConversation(prev => [
        ...prev,
        {
          role: 'assistant',
          text: '🎥 İşte senin için videoyu oluşturdum! İzlemek ister misin? 😈',
          generatedVideo: videoUrl,
          timestamp: Date.now()
        }
      ])

      // Voice response
      const aiResponse = `Video hazır ${userName || 'bebeğim'}! Şimdi hareketi de görebiliyorsun... Nasıl olmuş? 🔥`
      setIsSpeaking(true)
      const audioBlob = await generateSpeech(aiResponse, selectedCharacter.voiceId)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.onended = () => setIsSpeaking(false)
      audio.play()
      setCurrentAudio(audio)

    } catch (error) {
      console.error('❌ Video generation error:', error)
      alert(`❌ Video üretim hatası: ${error.message}`)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  // 3. Face Swap (Deepfake)
  const handleFaceSwap = async (targetImageUrl) => {
    if (!userFacePhoto) {
      alert('❌ Önce kendi yüzünü yükle! "Yüzünü Yükle" butonunu kullan.')
      return
    }

    setIsFaceSwapping(true)

    try {
      // Check gold balance (20 gold for face swap - most expensive)
      const currentGold = await getUserGold()
      if (currentGold < 20) {
        alert('⚠️ Yetersiz Gold! Deepfake için 20 Gold gerekli.')
        setIsFaceSwapping(false)
        return
      }

      await deductGold(20)
      const updatedGold = await getUserGold()
      setGoldBalance(updatedGold)

      console.log('🎭 Performing face swap...')
      const swappedImageUrl = await performFaceSwap(userFacePhoto, targetImageUrl)

      console.log('✅ Face swap complete!')

      setConversation(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `🎭 İşte senin yüzünle birlikte... Nasıl görünüyorsun ${userName || 'bebeğim'}? 😈💋`,
          generatedImage: swappedImageUrl,
          timestamp: Date.now()
        }
      ])

      // Voice response
      const aiResponse = dirtyTalkMode
        ? `Ohhh ${userName}! Şimdi sen de bu görüntüdesin... Çok seksi görünüyorsun! Daha fazlasını yapalım mı? 🔥💋`
        : `İşte ${userName}, senin yüzünle birlikte görüntü! Nasıl buldun kendini? 😏`

      setIsSpeaking(true)
      const audioBlob = await generateSpeech(aiResponse, selectedCharacter.voiceId)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.onended = () => setIsSpeaking(false)
      audio.play()
      setCurrentAudio(audio)

    } catch (error) {
      console.error('❌ Face swap error:', error)
      alert(`❌ Deepfake hatası: ${error.message}`)
    } finally {
      setIsFaceSwapping(false)
    }
  }

  // 4. Upload user face photo for deepfake
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
      alert('✅ Yüzün yüklendi! Artık deepfake yapabilirsin.')
    }
    reader.readAsDataURL(file)
  }

  // 5. Gender Swap Camera (Real-time)
  const toggleGenderSwapMode = async () => {
    if (!genderSwapMode) {
      // Start gender swap camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        setGenderSwapMode(true)

        // Start processing frames
        processGenderSwapFrame()

      } catch (error) {
        console.error('Camera access error:', error)
        alert('❌ Kamera izni gerekli!')
      }
    } else {
      // Stop gender swap camera
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
      setGenderSwapMode(false)
    }
  }

  // Process camera frame for gender swap
  const processGenderSwapFrame = async () => {
    if (!genderSwapMode || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Capture current frame
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg')

    try {
      setIsGenderSwapping(true)

      // Send to API for gender swap (throttle to 1 per second)
      const transformedImageUrl = await performGenderSwap(imageData, 'female', true)

      // Display transformed image
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = transformedImageUrl

    } catch (error) {
      console.error('Gender swap error:', error)
    } finally {
      setIsGenderSwapping(false)

      // Continue processing if still in gender swap mode
      if (genderSwapMode) {
        setTimeout(processGenderSwapFrame, 1000) // 1 FPS due to API limits
      }
    }
  }

  // Check Replicate secret code
  const checkReplicateCode = () => {
    if (replicateCode.toUpperCase() === REPLICATE_SECRET) {
      setReplicateUnlocked(true)
      setShowReplicateModal(false)
      setReplicateCode('')
      alert('✅ Gelişmiş özellikler açıldı!')
    } else {
      alert('❌ Yanlış kod!')
      setReplicateCode('')
    }
  }

  // Send text message (for XXX character)
  const handleSendTextMessage = async () => {
    if (!textInput.trim()) return

    const userText = textInput.trim()
    setTextInput('')
    setIsSendingText(true)

    try {
      // Add user message to conversation
      setConversation(prev => [...prev, {
        role: 'user',
        text: userText,
        timestamp: Date.now()
      }])

      // Process with AI (same as voice)
      await processUserInput(userText)

    } catch (error) {
      console.error('Text message error:', error)
      alert(`❌ Mesaj gönderme hatası: ${error.message}`)
    } finally {
      setIsSendingText(false)
    }
  }

  // Process user input and get AI response
  const processUserInput = async (userText) => {
    setIsProcessing(true)

    try {
      // Check gold balance (1 gold per interaction)
      const currentGold = await getUserGold()
      if (currentGold < 1) {
        alert('⚠️ Yetersiz Gold! En az 1 Gold gerekli.\n\n💡 Settings sayfasından kod kullanarak Gold kazanabilirsiniz.')
        setIsProcessing(false)
        return
      }

      // Build conversation context
      let conversationContext = ''
      conversation.forEach(msg => {
        if (msg.role === 'user') {
          conversationContext += `Kullanıcı: ${msg.text}\n`
        } else if (msg.text !== selectedCharacter.welcomeMessage) {
          conversationContext += `${selectedCharacter.name}: ${msg.text}\n`
        }
      })
      conversationContext += `Kullanıcı: ${userText}\n`

      // Get AI response (Gemini)
      // Use dirty talk prompt if XXX character and dirty talk mode is active
      let systemPrompt = (selectedCharacter.id === 'xxx' && dirtyTalkMode && selectedCharacter.dirtyTalkPrompt)
        ? selectedCharacter.dirtyTalkPrompt
        : selectedCharacter.systemPrompt

      // For XXX character, add user name to system prompt
      if (selectedCharacter.id === 'xxx' && userName) {
        systemPrompt += `\n\nÖNEMLİ: Kullanıcının adı "${userName}". Her konuşmanda bu ismi kullan ve ona çok samimi, yakın hitap et.`
      }

      const aiResponse = await analyzeWithGemini(
        conversationContext,
        systemPrompt,
        { bypassCreditCheck: true } // Uses Gold instead
      )

      // Add AI message
      setConversation(prev => [...prev, {
        role: 'assistant',
        text: aiResponse,
        timestamp: Date.now()
      }])

      // Deduct gold and refresh balance
      await deductGold(1)
      const newGold = await getUserGold()
      setGoldBalance(newGold)

      // Speak AI response
      await speakText(aiResponse, selectedCharacter.voiceId)

    } catch (error) {
      console.error('Processing error:', error)
      alert('Hata oluştu: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Speak text using ElevenLabs
  const speakText = async (text, voiceId) => {
    try {
      setIsSpeaking(true)

      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause()
      }

      // Generate speech with ElevenLabs
      const audioUrl = await generateSpeech(text, voiceId)

      // Create and play audio
      const audio = new Audio(audioUrl)
      audio.onended = () => {
        setIsSpeaking(false)
        setCurrentAudio(null)
      }
      audio.onerror = () => {
        setIsSpeaking(false)
        setCurrentAudio(null)
      }

      setCurrentAudio(audio)
      await audio.play()

      // Update quota
      getQuota().then(quota => {
        setElevenLabsQuota({
          used: quota.character_count,
          limit: quota.character_limit
        })
      })

    } catch (error) {
      console.error('Speech error:', error)
      setIsSpeaking(false)

      // Show detailed error message
      const errorMsg = error.message || 'Ses üretme hatası!'
      alert(`🔊 ${errorMsg}\n\n💡 İpucu: ${
        /mobile|android|iphone/i.test(navigator.userAgent)
          ? 'Mobil bağlantınızı kontrol edin ve tekrar deneyin.'
          : 'Lütfen internet bağlantınızı kontrol edin.'
      }`)
    }
  }

  // Stop speaking
  const stopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
    }
    setIsSpeaking(false)
  }

  // Format session time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // ACCESS CODE SCREEN
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 0, 0, 0.15) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border-2 border-red-500/30 shadow-2xl">
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
              <h1 className="text-3xl font-black text-white mb-2">VOICE CHAMBER</h1>
              <p className="text-red-300 text-sm">🔒 Gizli Erişim Gerekli</p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleAccessCheck()}
                placeholder="Erişim Kodunu Girin"
                className="w-full px-4 py-3 bg-white/5 border-2 border-red-500/30 rounded-xl text-white text-center font-bold text-lg tracking-widest focus:border-red-500 focus:outline-none transition-all"
                maxLength={10}
              />

              {codeError && (
                <p className="text-red-400 text-sm text-center animate-pulse">{codeError}</p>
              )}

              <button
                onClick={handleAccessCheck}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
              >
                <Unlock className="w-5 h-5 inline mr-2" />
                ERİŞİM
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-white/5 text-gray-400 rounded-xl font-bold hover:bg-white/10 transition-all"
              >
                ← Geri Dön
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-500 text-xs text-center">
                Bu alan sadece yetkili kişilere açıktır.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // CHARACTER SELECTION SCREEN
  if (!selectedCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-4">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              VOICE CHAMBER
            </h1>
            <p className="text-gray-400 text-lg">Sesli AI Asistanınızı Seçin</p>

            {/* Portfolio Demo Notice */}
            <div className="mt-4 mx-auto max-w-2xl bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-blue-300 text-sm font-semibold mb-1">
                    📢 {language === 'tr' ? 'Portföy Sunumu' : 'Portfolio Demonstration'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {language === 'tr'
                      ? 'Bu AI asistanlar portföy sunumlarında kullanılmak üzere özel olarak eğitilmiştir. Gerçek projeler için detaylı bilgi almak isterseniz iletişime geçin.'
                      : 'These AI assistants are specially trained for portfolio presentations. For detailed information about real projects, please contact us.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Zap className="w-5 h-5" />
                <span className="font-bold">{goldBalance} Gold</span>
              </div>
              <div className="text-gray-500 text-sm">
                ElevenLabs: {elevenLabsQuota.used.toLocaleString()}/{elevenLabsQuota.limit.toLocaleString()} karakter
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(AI_CHARACTERS).map(character => (
              <div
                key={character.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20 hover:border-pink-500/60 transition-all duration-500 hover:scale-105 group relative"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                }}
              >
                {/* Settings Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSettingsModal(character)
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 group/settings"
                  title="AI Detayları"
                >
                  <Settings className="w-5 h-5 text-gray-400 group-hover/settings:text-pink-400 group-hover/settings:rotate-90 transition-all" />
                </button>

                <div className="text-center" onClick={() => startSession(character.id)}>
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform cursor-pointer">{character.emoji}</div>
                  <h2 className="text-3xl font-black mb-2 group-hover:text-pink-400 transition-colors cursor-pointer">{character.name}</h2>
                  <p className="text-purple-300 font-bold mb-4">{character.role}</p>
                  <p className="text-gray-400 text-sm mb-6">{character.personality}</p>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-300 text-sm italic">"{character.welcomeMessage}"</p>
                  </div>

                  <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold hover:scale-105 transition-all shadow-lg cursor-pointer">
                    <Mic className="w-5 h-5 inline mr-2" />
                    BAŞLAT
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-8 mx-auto block px-8 py-3 bg-white/10 text-gray-300 rounded-xl font-bold hover:bg-white/20 transition-all"
          >
            ← Ana Sayfa
          </button>
        </div>

        {/* Settings Modal */}
        {settingsModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSettingsModal(null)}>
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/30 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{settingsModal.emoji}</div>
                  <div>
                    <h2 className="text-3xl font-black text-white">{settingsModal.name}</h2>
                    <p className="text-purple-300">{settingsModal.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsModal(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* Personality */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-pink-400 mb-2">Kişilik</h3>
                  <p className="text-gray-300">{settingsModal.personality}</p>
                </div>

                {/* Welcome Message */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-purple-400 mb-2">Hoş Geldin Mesajı</h3>
                  <p className="text-gray-300 italic">"{settingsModal.welcomeMessage}"</p>
                </div>

                {/* System Prompt */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">Sistem Talimatları</h3>
                  <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono bg-black/20 p-3 rounded-lg max-h-60 overflow-y-auto">
                    {settingsModal.systemPrompt}
                  </pre>
                </div>

                {/* Voice ID */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-bold text-green-400 mb-2">Ses Modeli</h3>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-green-400" />
                    <code className="text-gray-300 text-sm">{settingsModal.voiceId}</code>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setSettingsModal(null)
                    startSession(settingsModal.id)
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold hover:scale-105 transition-all"
                >
                  <Mic className="w-5 h-5 inline mr-2" />
                  Başlat
                </button>
                <button
                  onClick={() => setSettingsModal(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Name Selection Modal for XXX */}
        {showNameModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-red-600/30 to-purple-600/30 backdrop-blur-2xl rounded-3xl p-8 border-2 border-red-500/50 max-w-md w-full shadow-2xl">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">😈</div>
                <h2 className="text-3xl font-black text-white mb-2">XXX</h2>
                <p className="text-pink-300 text-lg font-semibold">Bana nasıl seslenmek istersin bebeğim?</p>
              </div>

              {/* Random Name Suggestion */}
              <div className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Öneri:</span>
                  <button
                    onClick={() => setCustomNameInput(getRandomName())}
                    className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-gray-300 transition-all"
                  >
                    <Shuffle className="w-3 h-3" />
                    Yeni İsim
                  </button>
                </div>
                <div className="text-white font-bold text-lg">{customNameInput || getRandomName()}</div>
              </div>

              {/* Custom Name Input */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm mb-2">Ya da kendi ismini yaz:</label>
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder="İsmini gir..."
                  className="w-full px-4 py-3 bg-white/10 border-2 border-red-500/30 rounded-xl text-white font-bold focus:border-red-500 focus:outline-none transition-all"
                  maxLength={20}
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => startXXXSession(customNameInput || getRandomName())}
                  disabled={!customNameInput && !getRandomName()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Başlat 🔥
                </button>
                <button
                  onClick={() => {
                    setShowNameModal(false)
                    setSelectedCharacter(null)
                    setCustomNameInput('')
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // VOICE CHAT SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255, 0, 0, 0.2) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600/20 to-purple-600/20 backdrop-blur-2xl rounded-3xl p-6 border-2 border-red-500/30 shadow-2xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{selectedCharacter.emoji}</div>
              <div>
                <h2 className="text-2xl font-black">{selectedCharacter.name}</h2>
                <p className="text-red-300 text-sm">{selectedCharacter.role}</p>
              </div>
            </div>
            <button
              onClick={endSession}
              className="px-4 py-2 bg-red-600/80 rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              Bitir
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-amber-400">
              <Zap className="w-4 h-4" />
              <span className="font-bold">{goldBalance} Gold</span>
            </div>

            {/* Dirty Talk Mode Toggle - Only for XXX character */}
            {selectedCharacter.id === 'xxx' && (
              <button
                onClick={() => setDirtyTalkMode(!dirtyTalkMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                  dirtyTalkMode
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white animate-pulse shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
                title={dirtyTalkMode ? 'Dirty Talk Mode AÇIK 🔥' : 'Dirty Talk Mode\'u Aç'}
              >
                <Flame className={`w-4 h-4 ${dirtyTalkMode ? 'animate-pulse' : ''}`} />
                <span>{dirtyTalkMode ? 'FULL POWER' : 'Dirty Talk'}</span>
              </button>
            )}

            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{formatTime(sessionTime)}</span>
            </div>
          </div>
        </div>

        {/* Voice Control */}
        <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-8 border-2 border-red-500/30 shadow-2xl text-center">
          <div className="mb-8">
            {isListening && (
              <div className="text-red-400 text-xl font-bold animate-pulse mb-4">
                🎙️ Dinliyorum...
              </div>
            )}

            {isProcessing && (
              <div className="text-purple-400 text-xl font-bold animate-pulse mb-4">
                <Loader className="w-6 h-6 inline animate-spin mr-2" />
                İşleniyor...
              </div>
            )}

            {isSpeaking && (
              <div className="text-pink-400 text-xl font-bold animate-pulse mb-4">
                <Volume2 className="w-6 h-6 inline mr-2" />
                Konuşuyor...
              </div>
            )}

            {!isListening && !isProcessing && !isSpeaking && (
              <div className="text-gray-400 text-lg mb-4">
                Mikrofona bas ve konuş
              </div>
            )}
          </div>

          {/* Microphone Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse shadow-2xl scale-110'
                : 'bg-gradient-to-br from-purple-600 to-pink-600 hover:scale-110 shadow-lg'
            }`}
          >
            {isListening ? (
              <MicOff className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </button>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="mt-6 px-6 py-3 bg-red-600/80 rounded-xl font-bold hover:bg-red-600 transition-all"
            >
              <VolumeX className="w-5 h-5 inline mr-2" />
              Sesi Durdur
            </button>
          )}

          {/* Image Upload Section - Only for XXX character */}
          {selectedCharacter.id === 'xxx' && (
            <div className="mt-6">
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded-xl border-2 border-red-500/50 shadow-lg mx-auto"
                    style={{ maxHeight: '200px' }}
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-2 bg-red-600/90 hover:bg-red-600 rounded-full transition-all"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              {/* Upload and Analyze Buttons */}
              <div className="flex gap-3">
                {!imagePreview ? (
                  <label className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-all cursor-pointer text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <ImageIcon className="w-5 h-5 inline mr-2" />
                    Görüntü Yükle 📸
                  </label>
                ) : (
                  <button
                    onClick={handleImageAnalysis}
                    disabled={isGeneratingImage || isProcessing}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                        Analiz ediliyor...
                      </>
                    ) : (
                      <>
                        <Flame className="w-5 h-5 inline mr-2" />
                        Analiz Et (5 Gold)
                      </>
                    )}
                  </button>
                )}
              </div>

              {imagePreview && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  💡 Görüntü yüklendiğinde {userName || 'XXX'} onu analiz edecek ve erotik yorumlarda bulunacak
                </p>
              )}

              {/* NEW: Replicate AI Features */}
              <div className="mt-6 space-y-3">
                {/* Unlock Button or Features */}
                {!replicateUnlocked ? (
                  <div className="text-center">
                    <button
                      onClick={() => setShowReplicateModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                    >
                      <Lock className="w-4 h-4 inline mr-2" />
                      Gelişmiş Özellikler 🔓
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Özel kod ile kilidini aç</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-white text-center mb-3">🔥 Gelişmiş AI Özellikleri</h3>

                {/* Row 1: Image Generation + User Face Upload */}
                <div className="flex gap-2">
                  {/* Generate NSFW Image */}
                  <button
                    onClick={handleGenerateNSFWImage}
                    disabled={isGeneratingImage || isProcessing}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader className="w-4 h-4 inline mr-1 animate-spin" />
                        Üretiliyor...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 inline mr-1" />
                        Görüntü Üret (10 Gold)
                      </>
                    )}
                  </button>

                  {/* Upload User Face */}
                  <label className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-sm hover:scale-105 transition-all cursor-pointer text-center shadow-lg">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUserFaceUpload}
                      className="hidden"
                    />
                    <UserCheck className="w-4 h-4 inline mr-1" />
                    {userFacePhoto ? '✅ Yüz Yüklendi' : 'Yüzünü Yükle'}
                  </label>
                </div>

                {/* Row 2: Video + Gender Swap */}
                <div className="flex gap-2">
                  {/* Generate Video (disabled if no generated images) */}
                  <button
                    onClick={() => generatedImages.length > 0 && handleGenerateVideo(generatedImages[generatedImages.length - 1])}
                    disabled={isGeneratingVideo || generatedImages.length === 0}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader className="w-4 h-4 inline mr-1 animate-spin" />
                        Video...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 inline mr-1" />
                        Video Yap (15 Gold)
                      </>
                    )}
                  </button>

                  {/* Gender Swap Camera */}
                  <button
                    onClick={toggleGenderSwapMode}
                    disabled={isGenderSwapping}
                    className={`flex-1 px-3 py-2 rounded-lg font-bold text-sm hover:scale-105 transition-all shadow-lg ${
                      genderSwapMode
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 animate-pulse'
                        : 'bg-gradient-to-r from-green-600 to-teal-600'
                    }`}
                  >
                    <Camera className="w-4 h-4 inline mr-1" />
                    {genderSwapMode ? 'Kapat' : 'Gender Swap'}
                  </button>
                </div>

                {/* Row 3: Deepfake (Face Swap) */}
                <button
                  onClick={() => generatedImages.length > 0 && handleFaceSwap(generatedImages[generatedImages.length - 1])}
                  disabled={isFaceSwapping || !userFacePhoto || generatedImages.length === 0}
                  className="w-full px-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-bold text-sm hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isFaceSwapping ? (
                    <>
                      <Loader className="w-4 h-4 inline mr-1 animate-spin" />
                      Deepfake işleniyor...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 inline mr-1" />
                      Deepfake Yap (20 Gold)
                    </>
                  )}
                </button>

                {/* Helper text */}
                <div className="text-xs text-gray-400 text-center space-y-1">
                  <p>💡 Görüntü Üret: AI ile NSFW görüntü oluşturur</p>
                  <p>🎥 Video Yap: Üretilen görüntüyü videoya çevirir</p>
                  <p>🎭 Deepfake: Senin yüzünü görüntüye ekler</p>
                  <p>📸 Gender Swap: Kamerayı açıp kadın olarak gösterir</p>
                </div>

              {/* Gender Swap Camera Display */}
              {genderSwapMode && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-white text-center mb-2">👗 Gender Swap Kamera</h4>
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="hidden"
                      autoPlay
                      playsInline
                    />
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto rounded-xl border-2 border-pink-500/50 shadow-lg"
                    />
                    {isGenderSwapping && (
                      <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                        <Loader className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    💡 Kamera açık ve gerçek zamanlı dönüşüm yapıyorum... (1 FPS)
                  </p>
                </div>
              )}
                  </>
                )}
              </div>

              {/* Text Chat Input - Only for XXX character */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-white text-center mb-2">💬 Mesaj Gönder</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isSendingText && handleSendTextMessage()}
                    placeholder={`${userName || 'Bebeğim'} ile yaz...`}
                    className="flex-1 px-4 py-3 bg-white/10 border-2 border-pink-500/30 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none transition-all"
                    disabled={isSendingText || isProcessing}
                  />
                  <button
                    onClick={handleSendTextMessage}
                    disabled={isSendingText || isProcessing || !textInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isSendingText ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      '➤'
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  💡 Mikrofon yerine yazarak da konuşabilirsin
                </p>
              </div>
            </div>
          )}

          {/* Replicate Code Modal */}
          {showReplicateModal && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-2xl rounded-3xl p-8 border-2 border-purple-500/50 max-w-md w-full shadow-2xl">
                <div className="text-center mb-6">
                  <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2">Gelişmiş Özellikler</h2>
                  <p className="text-pink-300 text-sm">Özel kodu gir ve kilidini aç</p>
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    value={replicateCode}
                    onChange={(e) => setReplicateCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && checkReplicateCode()}
                    placeholder="Özel Kod Gir..."
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-500/30 rounded-xl text-white text-center font-bold text-lg tracking-widest focus:border-purple-500 focus:outline-none transition-all"
                    maxLength={10}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={checkReplicateCode}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                  >
                    <Unlock className="w-5 h-5 inline mr-2" />
                    Kilidi Aç
                  </button>
                  <button
                    onClick={() => {
                      setShowReplicateModal(false)
                      setReplicateCode('')
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                  >
                    İptal
                  </button>
                </div>

                <div className="mt-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-xs text-yellow-300 text-center">
                    🔥 Görüntü üretimi, video, deepfake ve gender swap özellikleri
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conversation History */}
          {conversation.length > 1 && (
            <div className="mt-8 max-h-64 overflow-y-auto space-y-3">
              {conversation.slice(-5).map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600/20 text-blue-200 ml-8'
                      : 'bg-pink-600/20 text-pink-200 mr-8'
                  }`}
                >
                  <div className="font-bold mb-1">
                    {msg.role === 'user' ? '👤 Sen' : `${selectedCharacter.emoji} ${selectedCharacter.name}`}
                  </div>
                  {/* Show uploaded image if present */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Uploaded"
                      className="max-w-full h-auto rounded-lg mb-2 border-2 border-white/20"
                      style={{ maxHeight: '150px' }}
                    />
                  )}
                  {/* Show AI generated image if present */}
                  {msg.generatedImage && (
                    <div className="mb-2">
                      <img
                        src={msg.generatedImage}
                        alt="AI Generated"
                        className="max-w-full h-auto rounded-lg border-2 border-pink-500/50"
                        style={{ maxHeight: '200px' }}
                      />
                      <div className="mt-1 flex gap-2">
                        {/* Video button */}
                        <button
                          onClick={() => handleGenerateVideo(msg.generatedImage)}
                          disabled={isGeneratingVideo}
                          className="px-2 py-1 bg-blue-600/80 hover:bg-blue-600 rounded text-xs"
                        >
                          <Video className="w-3 h-3 inline mr-1" />
                          Video Yap
                        </button>
                        {/* Deepfake button */}
                        {userFacePhoto && (
                          <button
                            onClick={() => handleFaceSwap(msg.generatedImage)}
                            disabled={isFaceSwapping}
                            className="px-2 py-1 bg-yellow-600/80 hover:bg-yellow-600 rounded text-xs"
                          >
                            <UserCheck className="w-3 h-3 inline mr-1" />
                            Deepfake
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Show AI generated video if present */}
                  {msg.generatedVideo && (
                    <video
                      src={msg.generatedVideo}
                      controls
                      className="max-w-full h-auto rounded-lg mb-2 border-2 border-blue-500/50"
                      style={{ maxHeight: '200px' }}
                    />
                  )}
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-xs">
          {dirtyTalkMode && selectedCharacter.id === 'xxx' ? (
            <div className="text-red-400 font-bold animate-pulse">
              🔥 DIRTY TALK MODE AKTIF - VİTES ARDI! 🔥
            </div>
          ) : (
            <div className="text-gray-500">
              Her konuşma 1 Gold harcar • ElevenLabs Turbo v2.5 (Türkçe optimize) kullanılıyor
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoiceChamber
