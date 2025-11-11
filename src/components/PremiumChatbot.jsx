import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Lock, MessageSquare, Zap, Infinity, Mic, MicOff, Volume2, VolumeX, Paperclip, Image as ImageIcon, FileText, XCircle } from 'lucide-react'
import { analyzeWithGemini, getRemainingRequests, LIMITS } from '../services/geminiService'
import { saveConversation } from '../utils/digitalPassport'

const PremiumChatbot = ({ bot, onClose, language = 'tr' }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [remainingQuestions, setRemainingQuestions] = useState(10)
  const [isLocked, setIsLocked] = useState(false)
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: instant ? 'auto' : 'smooth',
      block: 'end'
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mobile keyboard scroll fix
  const handleInputFocus = () => {
    // Delay to let keyboard animation start
    setTimeout(() => {
      scrollToBottom(true)
    }, 300)
  }

  // Save conversation and close
  const handleClose = () => {
    // Save conversation if there are more than just the welcome message
    if (messages.length > 1) {
      const botId = bot.id || bot.name.en || bot.name.tr
      const botName = bot.name[language] || bot.name.tr
      saveConversation(botId, botName, messages)
    }
    onClose()
  }

  useEffect(() => {
    // Welcome message
    const welcomeMsg = {
      role: 'assistant',
      content: bot.welcomeMessage[language] || bot.welcomeMessage.tr
    }
    setMessages([welcomeMsg])

    // Check remaining questions and unlimited mode
    const checkRemaining = async () => {
      try {
        const response = await fetch('/api/credits?action=balance')
        const data = await response.json()

        if (data.success) {
          setRemainingQuestions(data.credits)
          setIsUnlimited(data.unlimited || false)

          // Don't lock if unlimited mode
          if (!data.unlimited && data.credits <= 0) {
            setIsLocked(true)
          }
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error)
        const remaining = await getRemainingRequests()
        setRemainingQuestions(remaining)
        if (remaining <= 0) {
          setIsLocked(true)
        }
      }
    }
    checkRemaining()
  }, [bot, language])

  const handleSend = async () => {
    if (!input.trim() || isLoading || isLocked) return

    // Check remaining questions and unlimited mode
    try {
      const response = await fetch('/api/credits?action=balance')
      const data = await response.json()

      if (data.success) {
        setRemainingQuestions(data.credits)
        setIsUnlimited(data.unlimited || false)

        // If not unlimited and no credits, lock
        if (!data.unlimited && data.credits <= 0) {
          setIsLocked(true)
          const lockMessage = {
            role: 'assistant',
            content: language === 'tr'
              ? '🔒 Günlük soru hakkınız doldu! Yarın tekrar deneyin veya sınırsız erişim için benimle iletişime geçin: me@cemal.online'
              : '🔒 Your daily questions are used! Try again tomorrow or contact me for unlimited access: me@cemal.online'
          }
          setMessages(prev => [...prev, lockMessage])
          return
        }
      }
    } catch (error) {
      console.error('Failed to check credits:', error)
    }

    const userMessage = {
      role: 'user',
      content: input || (uploadedFile ? `[${language === 'tr' ? 'Resim eklendi' : 'Image attached'}]` : ''),
      image: uploadedFile?.data
    }

    setMessages(prev => [...prev, userMessage])

    // Instant scroll after user message
    setTimeout(() => scrollToBottom(true), 50)

    const currentInput = input
    const currentFile = uploadedFile
    setInput('')
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setIsLoading(true)

    try {
      // Build conversation history
      const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n')

      const systemInstruction = `${bot.systemPrompt[language] || bot.systemPrompt.tr}

Previous conversation:
${conversationHistory}

${currentFile ? `User has attached an image. Analyze it and respond accordingly.` : ''}

Answer in ${language === 'tr' ? 'Turkish' : 'English'}.`

      // Prepare prompt text (exclude image data from text)
      const promptText = currentInput || (currentFile ? (language === 'tr' ? 'Bu resmi analiz et' : 'Analyze this image') : '')

      // Prepare options with image data if present
      const apiOptions = currentFile ? {
        imageData: currentFile.data,
        imageMimeType: currentFile.type || 'image/jpeg'
      } : {}

      const response = await analyzeWithGemini(promptText, systemInstruction, apiOptions)

      const aiMessage = {
        role: 'assistant',
        content: response
      }

      setMessages(prev => [...prev, aiMessage])

      // Update remaining questions after response (check unlimited again)
      try {
        const balanceResponse = await fetch('/api/credits?action=balance')
        const balanceData = await balanceResponse.json()

        if (balanceData.success) {
          setRemainingQuestions(balanceData.credits)
          setIsUnlimited(balanceData.unlimited || false)

          // Only lock if not unlimited and out of credits
          if (!balanceData.unlimited && balanceData.credits <= 0) {
            setTimeout(() => {
              const lockMessage = {
                role: 'assistant',
                content: language === 'tr'
                  ? '✨ Günlük soru hakkınız doldu! Yarın tekrar gelin veya sınırsız erişim için: me@cemal.online'
                  : '✨ Daily questions used! Come back tomorrow or contact me for unlimited access: me@cemal.online'
              }
              setMessages(prev => [...prev, lockMessage])
              setIsLocked(true)
            }, 1000)
          }
        }
      } catch (error) {
        console.error('Failed to update credits:', error)
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'assistant',
        content: language === 'tr'
          ? '❌ Bir hata oluştu. Lütfen tekrar deneyin.'
          : '❌ An error occurred. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Compress image before upload
  const compressImage = (file, maxSizeMB = 1) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()

        reader.onload = (event) => {
          try {
            const img = new Image()
            img.src = event.target.result

            img.onload = () => {
              try {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                if (import.meta.env.DEV) console.log(`📸 Original image: ${width}x${height}`)

                // Calculate new dimensions (max 1920px width)
                const maxWidth = 1920
                const maxHeight = 1920

                if (width > height) {
                  if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                  }
                } else {
                  if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height)
                    height = maxHeight
                  }
                }

                if (import.meta.env.DEV) console.log(`🔄 Resized to: ${width}x${height}`)

                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                if (!ctx) {
                  throw new Error('Canvas context could not be created')
                }

                ctx.drawImage(img, 0, 0, width, height)

                // Start with high quality
                let quality = 0.9
                let compressedData = canvas.toDataURL('image/jpeg', quality)

                // Reduce quality until file size is acceptable
                const maxSizeBytes = maxSizeMB * 1024 * 1024
                let iterations = 0
                while (compressedData.length > maxSizeBytes && quality > 0.1 && iterations < 10) {
                  quality -= 0.1
                  compressedData = canvas.toDataURL('image/jpeg', quality)
                  iterations++
                }

                if (import.meta.env.DEV) console.log(`✅ Compressed with quality: ${Math.round(quality * 100)}%`)

                resolve({
                  data: compressedData,
                  originalSize: file.size,
                  compressedSize: Math.round((compressedData.length * 3) / 4),
                  quality: Math.round(quality * 100)
                })
              } catch (error) {
                console.error('❌ Canvas error:', error)
                reject(new Error('Image processing failed: ' + error.message))
              }
            }

            img.onerror = (error) => {
              console.error('❌ Image load error:', error)
              reject(new Error('Failed to load image. The file might be corrupted.'))
            }
          } catch (error) {
            console.error('❌ Image creation error:', error)
            reject(new Error('Failed to create image: ' + error.message))
          }
        }

        reader.onerror = (error) => {
          console.error('❌ FileReader error:', error)
          reject(new Error('Failed to read file. Please try again.'))
        }

        reader.readAsDataURL(file)
      } catch (error) {
        console.error('❌ Compression initialization error:', error)
        reject(new Error('Failed to initialize compression: ' + error.message))
      }
    })
  }

  // File upload handler with compression
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (import.meta.env.DEV) console.log(`📁 Uploading file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`)

    // Check file size (max 10MB original)
    if (file.size > 10 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      alert(language === 'tr'
        ? `Dosya boyutu çok büyük (${sizeMB}MB)! Maksimum 10MB olmalıdır.`
        : `File size too large (${sizeMB}MB)! Maximum is 10MB.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Only accept images
    if (!file.type.startsWith('image/')) {
      alert(language === 'tr'
        ? `Geçersiz dosya tipi: ${file.type}\nŞu anda sadece resim dosyaları (JPG, PNG, GIF, WebP) destekleniyor!`
        : `Invalid file type: ${file.type}\nCurrently only image files (JPG, PNG, GIF, WebP) are supported!`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      if (import.meta.env.DEV) console.log('🔄 Starting compression...')

      // Compress image to max 1MB
      const compressed = await compressImage(file, 1)

      if (import.meta.env.DEV) console.log(`✅ Compression successful!`)
      const originalMB = (compressed.originalSize / (1024 * 1024)).toFixed(2)
      const compressedMB = (compressed.compressedSize / (1024 * 1024)).toFixed(2)
      if (import.meta.env.DEV) console.log(`   Original: ${originalMB}MB → Compressed: ${compressedMB}MB (${compressed.quality}% quality)`)

      setUploadedFile({
        name: file.name,
        type: 'image/jpeg',
        data: compressed.data,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        quality: compressed.quality
      })

      // Show success message for significant compression
      if (compressed.originalSize > compressed.compressedSize * 2) {
        setTimeout(() => {
          if (import.meta.env.DEV) console.log(`💡 Dosya başarıyla sıkıştırıldı: ${originalMB}MB → ${compressedMB}MB`)
        }, 100)
      }
    } catch (error) {
      console.error('❌ Image upload error:', error)

      let errorMessage = language === 'tr'
        ? 'Resim yüklenirken hata oluştu!'
        : 'Error loading image!'

      if (error.message) {
        errorMessage += '\n\n' + (language === 'tr'
          ? `Detay: ${error.message}\n\nFarklı bir resim deneyin veya resmi başka bir formatta (JPG/PNG) kaydedin.`
          : `Details: ${error.message}\n\nTry a different image or save it in another format (JPG/PNG).`)
      }

      alert(errorMessage)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Voice recording handler with better error handling
  const startRecording = async () => {
    // Check browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(language === 'tr'
        ? 'Üzgünüz! Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Chrome, Edge veya Safari kullanın.'
        : 'Sorry! Your browser doesn\'t support speech recognition. Please use Chrome, Edge, or Safari.')
      return
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true })

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.lang = language === 'tr' ? 'tr-TR' : 'en-US'
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onstart = () => {
        if (import.meta.env.DEV) console.log('🎤 Recording started')
        setIsRecording(true)
      }

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (import.meta.env.DEV) console.log('📝 Transcript:', transcript)
        setInput(prev => prev + (prev ? ' ' : '') + transcript)
        setIsRecording(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error)
        setIsRecording(false)

        let errorMessage = language === 'tr'
          ? 'Ses tanıma hatası!'
          : 'Speech recognition error!'

        switch(event.error) {
          case 'no-speech':
            errorMessage = language === 'tr'
              ? 'Ses algılanamadı. Lütfen tekrar deneyin ve konuşun.'
              : 'No speech detected. Please try again and speak.'
            break
          case 'audio-capture':
            errorMessage = language === 'tr'
              ? 'Mikrofon erişimi başarısız! Lütfen mikrofon izni verin.'
              : 'Microphone access failed! Please grant microphone permission.'
            break
          case 'not-allowed':
            errorMessage = language === 'tr'
              ? 'Mikrofon izni reddedildi! Lütfen tarayıcı ayarlarından izin verin.'
              : 'Microphone permission denied! Please allow microphone access in browser settings.'
            break
          case 'network':
            errorMessage = language === 'tr'
              ? 'Network hatası! İnternet bağlantınızı kontrol edin.'
              : 'Network error! Check your internet connection.'
            break
          default:
            errorMessage = language === 'tr'
              ? `Ses tanıma hatası (${event.error})! Lütfen tekrar deneyin.`
              : `Speech recognition error (${event.error})! Please try again.`
        }

        alert(errorMessage)
      }

      recognitionInstance.onend = () => {
        if (import.meta.env.DEV) console.log('🛑 Recording ended')
        setIsRecording(false)
      }

      if (import.meta.env.DEV) console.log('▶️ Starting recognition...')
      recognitionInstance.start()
      setRecognition(recognitionInstance)

    } catch (error) {
      console.error('❌ Microphone permission error:', error)
      setIsRecording(false)
      alert(language === 'tr'
        ? 'Mikrofon erişimi başarısız! Lütfen tarayıcı ayarlarından mikrofon izni verin ve sayfayı yenileyin.'
        : 'Microphone access failed! Please grant microphone permission in browser settings and reload the page.')
    }
  }

  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
    }
    setIsRecording(false)
  }

  // Voice playback handler
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'tr'
        ? 'Tarayıcınız ses sentezi desteklemiyor!'
        : 'Your browser doesn\'t support speech synthesis!')
      return
    }

    // Stop current speech
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'tr' ? 'tr-TR' : 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full h-[90vh] sm:max-h-[90vh] flex flex-col border border-white/10 overflow-hidden animate-slideUp"
           style={{
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
           }}>
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b border-white/10 bg-gradient-to-br ${bot.gradient} relative overflow-hidden backdrop-blur-sm`}
             style={{
               background: `linear-gradient(135deg, ${bot.gradient.includes('pink') ? 'rgba(236, 72, 153, 0.2)' :
                                                       bot.gradient.includes('purple') ? 'rgba(168, 85, 247, 0.2)' :
                                                       bot.gradient.includes('green') ? 'rgba(34, 197, 94, 0.2)' :
                                                       bot.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.2)' :
                                                       bot.gradient.includes('orange') ? 'rgba(249, 115, 22, 0.2)' :
                                                       'rgba(99, 102, 241, 0.2)'} 0%, rgba(0, 0, 0, 0.1) 100%)`
             }}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent)]"></div>
          <div className="relative z-10 flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg flex-shrink-0 border border-white/20">
                {bot.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mb-1">
                  <span className="break-words">{bot.name[language] || bot.name.tr}</span>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse flex-shrink-0" />
                </h2>
                <p className="text-white/80 text-sm sm:text-base font-medium flex items-center gap-2 flex-wrap">
                  {isUnlimited ? (
                    <>
                      <Infinity className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{language === 'tr' ? 'Sınırsız soru hakkı' : 'Unlimited questions'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>
                        {language === 'tr'
                          ? `${remainingQuestions}/${LIMITS.RATE_LIMIT} günlük soru kaldı`
                          : `${remainingQuestions}/${LIMITS.RATE_LIMIT} daily questions left`
                        }
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 backdrop-blur-lg rounded-xl transition-all hover:scale-110 flex-shrink-0 border border-white/10"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-3 sm:space-y-4"
             style={{
               background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)'
             }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-messageSlide`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-2xl p-3 sm:p-4 backdrop-blur-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500/80 to-purple-500/80 text-white border border-white/20'
                    : 'bg-white/10 text-gray-100 border border-white/20'
                }`}
                style={{
                  boxShadow: message.role === 'user'
                    ? '0 8px 32px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
                    : '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 255, 255, 0.05)'
                }}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{bot.name[language] || bot.name.tr}</span>
                    </div>
                    <button
                      onClick={() => speakText(message.content)}
                      className="p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-all group border border-white/10 flex-shrink-0"
                      title={language === 'tr' ? 'Sesli dinle' : 'Listen'}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4 text-blue-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                      )}
                    </button>
                  </div>
                )}
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                {message.role === 'user' && message.image && (
                  <img src={message.image} alt="Uploaded" className="mt-2 rounded-lg max-w-full h-auto" />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-messageSlide">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                   style={{
                     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 255, 255, 0.05)'
                   }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                  <span className="text-gray-300 text-sm">
                    {language === 'tr' ? 'Düşünüyor...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 border-t border-white/10 backdrop-blur-xl"
             style={{
               background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)'
             }}>
          {isLocked ? (
            <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-xl p-4 sm:p-6 border-2 border-pink-500/50 text-center">
              <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 mx-auto mb-3 animate-pulse" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {language === 'tr' ? 'Premium Erişim Gerekli' : 'Premium Access Required'}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">
                {language === 'tr'
                  ? 'Sınırsız soru ve gelişmiş özellikler için benimle iletişime geçin!'
                  : 'Contact me for unlimited questions and advanced features!'}
              </p>
              <a
                href="mailto:me@cemal.online"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-bold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{language === 'tr' ? 'İletişime Geç' : 'Contact Now'}</span>
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {/* File preview */}
              {uploadedFile && (
                <div className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 space-y-2"
                     style={{
                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 255, 255, 0.05)'
                     }}>
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{uploadedFile.name}</p>
                      {uploadedFile.compressedSize && (
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.compressedSize / (1024 * 1024)).toFixed(2)} MB
                          {uploadedFile.quality && ` • ${uploadedFile.quality}% kalite`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                  {/* Image preview thumbnail */}
                  <img
                    src={uploadedFile.data}
                    alt="Preview"
                    className="w-full h-32 sm:h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {/* File upload button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isLocked || uploadedFile}
                  className="p-3 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-gray-300 hover:text-blue-400 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 flex-shrink-0"
                  style={{
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                  title={language === 'tr' ? 'Resim ekle' : 'Add image'}
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Voice recording button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading || isLocked}
                  className={`p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border flex-shrink-0 ${
                    isRecording
                      ? 'bg-red-500/80 hover:bg-red-600/80 text-white border-red-400/50 animate-pulse backdrop-blur-lg'
                      : 'bg-white/10 backdrop-blur-lg hover:bg-white/20 text-gray-300 hover:text-blue-400 border-white/20'
                  }`}
                  style={{
                    boxShadow: isRecording
                      ? '0 8px 24px rgba(239, 68, 68, 0.4)'
                      : '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                  title={language === 'tr' ? 'Sesli mesaj' : 'Voice message'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Text input */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  placeholder={language === 'tr' ? 'Mesajınızı yazın...' : 'Type your message...'}
                  rows={2}
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 resize-none text-base"
                  style={{
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }}
                  disabled={isLoading || isLocked}
                />

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !uploadedFile) || isLoading || isLocked}
                  className="px-4 sm:px-5 py-3 bg-gradient-to-br from-blue-500/90 to-purple-500/90 backdrop-blur-lg text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 border border-white/20 flex-shrink-0"
                  style={{
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(168, 85, 247, 0.3)'
                  }}
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline text-base">{language === 'tr' ? 'Gönder' : 'Send'}</span>
                </button>
              </div>
            </div>
          )}
          {!isLocked && (
            <p className="text-gray-500 text-xs sm:text-sm mt-3 text-center px-2">
              {isUnlimited ? (
                language === 'tr'
                  ? '✨ Sınırsız mod aktif! İstediğiniz kadar soru sorabilirsiniz.'
                  : '✨ Unlimited mode active! Ask as many questions as you want.'
              ) : (
                language === 'tr'
                  ? `💡 ${remainingQuestions} soru hakkınız kaldı! Sınırsız erişim için: me@cemal.online`
                  : `💡 You have ${remainingQuestions} questions left! For unlimited access: me@cemal.online`
              )}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .animate-messageSlide {
          animation: messageSlide 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default PremiumChatbot
