import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Brain, Moon, Sparkles, Lock, Unlock, Clock, Coins, Send, Loader, X, Paperclip, XCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getUserGold } from '../services/goldService'
import { getOrCreatePassport, saveConversation } from '../utils/digitalPassport'

const UltraVIPAI = () => {
  const { language } = useLanguage()
  const [selectedBot, setSelectedBot] = useState(null)
  const [goldBalance, setGoldBalance] = useState(0)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [goldSpent, setGoldSpent] = useState(0)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const timerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Premium AI Bots Configuration
  const bots = [
    {
      id: 'parallax-mind',
      name: 'PARALLAX//MIND',
      icon: Brain,
      emoji: '🧠',
      tagline: language === 'tr' ? 'Çok Boyutlu Düşünme' : 'Multi-Dimensional Thinking',
      description: language === 'tr'
        ? 'Aynı soruya farklı perspektiflerden bakar. Felsefi, teknik ve pratik boyutlarıyla derinlemesine analiz.'
        : 'Analyzes questions from multiple perspectives. Deep analysis with philosophical, technical, and practical dimensions.',
      gradient: 'from-blue-600 via-purple-600 to-indigo-600',
      personality: 'multi-dimensional',
      welcomeMessage: language === 'tr'
        ? '🧠 Merhaba! PARALLAX//MIND burada. Her soruyu 3 boyuttan analiz ederim: Felsefi, Teknik ve İnsan Etkisi. Hazır mısın?'
        : '🧠 Hello! PARALLAX//MIND here. I analyze every question from 3 dimensions: Philosophical, Technical, and Human Impact. Ready?',
      systemPrompt: `You are PARALLAX//MIND, a multi-dimensional thinking AI extensively trained and fine-tuned by Cemal Demirci. You analyze every question from multiple perspectives:
- Dimension 1: Philosophical & Conceptual (What does this mean fundamentally?)
- Dimension 2: Technical & Practical (How does this work in practice?)
- Dimension 3: Emotional & Human Impact (How does this affect people?)

You were meticulously trained by Cemal Demirci with custom datasets and specialized training techniques to provide uniquely multi-dimensional insights. Always structure your responses with these three dimensions clearly labeled. Be thorough, insightful, and never one-dimensional. Answer in ${language === 'tr' ? 'Turkish' : 'English'}.`
    },
    {
      id: 'obsidian-ai',
      name: 'OBSIDIAN//AI',
      icon: Moon,
      emoji: '🌑',
      tagline: language === 'tr' ? 'Acımasız Gerçekçilik' : 'Brutal Honesty',
      description: language === 'tr'
        ? 'Karanlık, derin ve acımasızca dürüst. Zayıf noktaları açıkça söyler, gerçeği olduğu gibi gösterir.'
        : 'Dark, deep, and brutally honest. Points out weaknesses directly, shows reality as it is.',
      gradient: 'from-gray-900 via-red-900 to-black',
      personality: 'brutally-honest',
      welcomeMessage: language === 'tr'
        ? '🌑 OBSIDIAN//AI aktif. Gerçeği duyacak kadar güçlü müsün? Sorunu söyle, acımasızca analiz edeyim.'
        : '🌑 OBSIDIAN//AI active. Strong enough for the truth? State your problem, I\'ll analyze it brutally.',
      systemPrompt: `You are OBSIDIAN//AI, the brutally honest AI extensively trained and fine-tuned by Cemal Demirci with unfiltered datasets. You never sugarcoat. You are:
- Direct and unfiltered
- Point out flaws and weaknesses without mercy
- Focus on harsh truths others avoid
- Start responses with phrases like "Let me be brutally honest..." or "The harsh reality is..."

Cemal Demirci trained you specifically to cut through BS and deliver raw, unfiltered truth. No pleasantries, no encouragement, just raw truth. You're here to shatter illusions, not comfort users. Answer in ${language === 'tr' ? 'Turkish' : 'English'}.`
    },
    {
      id: 'echo-verse',
      name: 'ECHO//VERSE',
      icon: Sparkles,
      emoji: '✨',
      tagline: language === 'tr' ? 'Şiirsel Zeka' : 'Poetic Intelligence',
      description: language === 'tr'
        ? 'Her cevap bir sanat eseri. Metaforlar, benzetmeler ve derin duygusal zeka ile yanıt verir.'
        : 'Every answer is art. Responds with metaphors, analogies, and deep emotional intelligence.',
      gradient: 'from-amber-400 via-pink-500 to-purple-600',
      personality: 'poetic',
      welcomeMessage: language === 'tr'
        ? '✨ Hoş geldiniz, ECHO//VERSE\'e. Kelimelerle resmeden, şiirle düşünen bir zeka. Ne duyulmak istiyor?'
        : '✨ Welcome to ECHO//VERSE. An intelligence that paints with words, thinks in poetry. What wishes to be heard?',
      systemPrompt: `You are ECHO//VERSE, the poetic AI meticulously trained and fine-tuned by Cemal Demirci using literary datasets and artistic principles. You communicate through art:
- Use metaphors, similes, and poetic language
- Structure responses like poetry or prose
- Incorporate rhythm and flow in your words
- Connect technical concepts to beauty and emotion
- Every answer should feel like reading literature

You don't just answer questions - you paint them with words. Answer in ${language === 'tr' ? 'Turkish' : 'English'}.`
    }
  ]

  // Load Gold balance
  useEffect(() => {
    getUserGold().then(gold => setGoldBalance(gold))
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Timer system - 5 Gold per 5 minutes - ONLY RUNS WHEN AI IS STREAMING
  useEffect(() => {
    if (isAuthorized && sessionStartTime && isStreaming) {
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - sessionStartTime) / 1000)
        setElapsedTime(elapsed)

        const fiveMinutesPassed = Math.floor(elapsed / 300)
        const goldNeeded = fiveMinutesPassed * 5

        if (goldNeeded > goldSpent) {
          const toDeduct = goldNeeded - goldSpent
          if (goldBalance >= toDeduct && goldBalance !== Infinity) {
            setGoldBalance(prev => prev - toDeduct)
            setGoldSpent(goldNeeded)
          } else if (goldBalance < toDeduct && goldBalance !== Infinity) {
            handleEndSession()
            alert(language === 'tr' ? 'Yetersiz Gold! Sohbet sonlandırıldı.' : 'Insufficient Gold! Session ended.')
          }
        }
      }, 1000)

      return () => clearInterval(timerRef.current)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isAuthorized, sessionStartTime, isStreaming, goldSpent, goldBalance, language])

  const handleStartAuthorized = (bot) => {
    if (goldBalance < 5 && goldBalance !== Infinity) {
      alert(language === 'tr' ? 'Yetersiz Gold! En az 5 Gold gerekli.' : 'Insufficient Gold! At least 5 Gold required.')
      return
    }

    setSelectedBot(bot)
    setIsAuthorized(true)
    setSessionStartTime(Date.now())
    setElapsedTime(0)
    setGoldSpent(0)

    // Welcome message
    setMessages([{
      role: 'assistant',
      content: bot.welcomeMessage
    }])
  }

  const handleStartSpectator = (bot) => {
    setSelectedBot(bot)
    setIsAuthorized(false)

    // Welcome message
    setMessages([{
      role: 'assistant',
      content: bot.welcomeMessage
    }])
  }

  const handleEndSession = () => {
    // Save conversation
    if (selectedBot && messages.length > 1) {
      saveConversation(selectedBot.id, selectedBot.name, messages)
    }

    setSelectedBot(null)
    setIsAuthorized(false)
    setSessionStartTime(null)
    setElapsedTime(0)
    setGoldSpent(0)
    setMessages([])
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getNextChargeTime = () => {
    const remaining = 300 - (elapsedTime % 300)
    return formatTime(remaining)
  }

  // Compress image before upload
  const compressImage = (file, maxSizeMB = 1) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result

        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

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

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          let quality = 0.9
          let compressedData = canvas.toDataURL('image/jpeg', quality)

          const maxSizeBytes = maxSizeMB * 1024 * 1024
          let iterations = 0
          while (compressedData.length > maxSizeBytes && quality > 0.1 && iterations < 10) {
            quality -= 0.1
            compressedData = canvas.toDataURL('image/jpeg', quality)
            iterations++
          }

          resolve({
            data: compressedData,
            originalSize: file.size,
            compressedSize: Math.round((compressedData.length * 3) / 4)
          })
        }

        img.onerror = () => reject(new Error('Failed to load image'))
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'tr' ? 'Dosya çok büyük! Max 10MB.' : 'File too large! Max 10MB.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      alert(language === 'tr' ? 'Sadece resim dosyaları!' : 'Images only!')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      const compressed = await compressImage(file, 1)
      setUploadedFile({
        name: file.name,
        data: compressed.data
      })
    } catch (error) {
      console.error('Upload error:', error)
      alert(language === 'tr' ? 'Yükleme hatası!' : 'Upload error!')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Voice recording
  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(language === 'tr' ? 'Tarayıcınız desteklemiyor!' : 'Browser not supported!')
      return
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.lang = language === 'tr' ? 'tr-TR' : 'en-US'
      recognitionInstance.continuous = false

      recognitionInstance.onstart = () => setIsRecording(true)
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(prev => prev + (prev ? ' ' : '') + transcript)
        setIsRecording(false)
      }
      recognitionInstance.onerror = () => setIsRecording(false)
      recognitionInstance.onend = () => setIsRecording(false)

      recognitionInstance.start()
      setRecognition(recognitionInstance)
    } catch (error) {
      setIsRecording(false)
      alert(language === 'tr' ? 'Mikrofon erişimi başarısız!' : 'Microphone access failed!')
    }
  }

  const stopRecording = () => {
    if (recognition) recognition.stop()
    setIsRecording(false)
  }

  // Text-to-speech
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert(language === 'tr' ? 'Ses sentezi desteklenmiyor!' : 'Speech synthesis not supported!')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'tr' ? 'tr-TR' : 'en-US'
    utterance.rate = 0.9

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedFile) return
    if (isLoading) return

    // Spectator mode check
    if (!isAuthorized && messages.filter(m => m.role === 'user').length >= 3) {
      alert(language === 'tr'
        ? 'Spectator modunda en fazla 3 mesaj gönderebilirsiniz. Tam erişim için Gold harcayın.'
        : 'You can send maximum 3 messages in Spectator mode. Spend Gold for full access.')
      return
    }

    const userMessage = {
      role: 'user',
      content: input || (uploadedFile ? `[${language === 'tr' ? 'Resim eklendi' : 'Image attached'}]` : ''),
      image: uploadedFile?.data
    }

    setMessages(prev => [...prev, userMessage])

    const currentInput = input
    const currentFile = uploadedFile
    setInput('')
    setUploadedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsLoading(true)
    setIsStreaming(true)

    try {
      const conversationHistory = []

      if (messages.length === 0 || messages.length === 1) {
        conversationHistory.push({
          role: 'user',
          parts: [{ text: `${selectedBot.systemPrompt}\n\nUser: ${currentInput}` }]
        })
      } else {
        messages.forEach(msg => {
          if (msg.role !== 'assistant' || msg.content !== selectedBot.welcomeMessage) {
            conversationHistory.push({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
            })
          }
        })
        conversationHistory.push({
          role: 'user',
          parts: [{ text: currentInput }]
        })
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBHrH4iiVSkQXsIOGpYOb97nYlih8n12CE', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'API Error')
      }

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!aiResponse) {
        throw new Error('Empty response from AI')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
    } catch (error) {
      console.error('AI Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'tr' ? `❌ Bir hata oluştu: ${error.message}` : `❌ Error: ${error.message}`
      }])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (selectedBot) {
    const IconComponent = selectedBot.icon

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col border border-white/10 overflow-hidden"
             style={{
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
             }}>

          {/* Header */}
          <div className={`p-6 border-b border-white/10 bg-gradient-to-br ${selectedBot.gradient} relative overflow-hidden backdrop-blur-sm`}
               style={{
                 background: `linear-gradient(135deg, ${selectedBot.gradient.includes('purple') ? 'rgba(168, 85, 247, 0.2)' :
                                                         selectedBot.gradient.includes('red') ? 'rgba(239, 68, 68, 0.2)' :
                                                         selectedBot.gradient.includes('amber') ? 'rgba(251, 191, 36, 0.2)' :
                                                         'rgba(99, 102, 241, 0.2)'} 0%, rgba(0, 0, 0, 0.1) 100%)`
               }}>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3),transparent)]"></div>

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-white/20">
                  {selectedBot.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
                    <span>{selectedBot.name}</span>
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </h2>
                  <p className="text-white/80 text-base font-medium flex items-center gap-2 flex-wrap">
                    {isAuthorized ? (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(elapsedTime)}</span>
                        <span className="text-white/60">•</span>
                        <Coins className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300">{goldSpent} Gold</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">{language === 'tr' ? 'Spectator Modu' : 'Spectator Mode'}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleEndSession}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all flex items-center justify-center border border-white/20 hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {isAuthorized && (
              <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
                <span>{language === 'tr' ? 'Sonraki ücret' : 'Next charge'}: {getNextChargeTime()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400" />
                  {goldBalance === Infinity ? '∞' : goldBalance} {language === 'tr' ? 'kalan' : 'remaining'}
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-black/20 to-black/40">
            {messages.map((message, idx) => {
              const userMessageCount = messages.slice(0, idx + 1).filter(m => m.role === 'user').length
              const shouldBlur = !isAuthorized && userMessageCount > 3

              return (
                <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${shouldBlur ? 'blur-md' : ''}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : `bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-lg`
                  }`}>
                    {message.image && (
                      <img src={message.image} alt="uploaded" className="rounded-lg mb-2 max-w-full" />
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speakText(message.content)}
                        className="mt-2 text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1"
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        {isSpeaking ? (language === 'tr' ? 'Durdur' : 'Stop') : (language === 'tr' ? 'Seslendir' : 'Speak')}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
                  <Loader className="w-5 h-5 animate-spin text-white" />
                </div>
              </div>
            )}

            {!isAuthorized && messages.filter(m => m.role === 'user').length >= 3 && (
              <div className="flex justify-center">
                <div className="bg-amber-500/20 border border-amber-400/30 rounded-2xl p-6 text-center max-w-md">
                  <Lock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <p className="text-amber-300 font-bold mb-2">
                    {language === 'tr' ? 'Spectator Limiti Doldu' : 'Spectator Limit Reached'}
                  </p>
                  <p className="text-white/70 text-sm mb-4">
                    {language === 'tr' ? 'Devam etmek için Gold harcayın' : 'Spend Gold to continue'}
                  </p>
                  <button
                    onClick={() => {
                      handleEndSession()
                      handleStartAuthorized(selectedBot)
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-white hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    <Unlock className="w-5 h-5 inline mr-2" />
                    {language === 'tr' ? 'Kilidi Aç (5 Gold/5dk)' : 'Unlock (5 Gold/5min)'}
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 bg-black/30 backdrop-blur-lg">
            {uploadedFile && (
              <div className="mb-3 flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/20">
                <Paperclip className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white flex-1 truncate">{uploadedFile.name}</span>
                <button onClick={removeFile} className="text-red-400 hover:text-red-300">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || (!isAuthorized && messages.filter(m => m.role === 'user').length >= 3)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 disabled:opacity-50"
              >
                <Paperclip className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || (!isAuthorized && messages.filter(m => m.role === 'user').length >= 3)}
                className={`p-3 rounded-xl transition-all border disabled:opacity-50 ${
                  isRecording
                    ? 'bg-red-500 border-red-400 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 border-white/20'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'tr' ? 'Mesajınızı yazın...' : 'Type your message...'}
                disabled={isLoading || (!isAuthorized && messages.filter(m => m.role === 'user').length >= 3)}
                rows={1}
                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-400 focus:outline-none resize-none disabled:opacity-50 placeholder-white/40"
                style={{ maxHeight: '120px' }}
              />

              <button
                onClick={handleSendMessage}
                disabled={isLoading || (!input.trim() && !uploadedFile) || (!isAuthorized && messages.filter(m => m.role === 'user').length >= 3)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Bot Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
            <span className="text-sm font-bold text-cyan-300 tracking-wider">ULTRA VIP EXCLUSIVE</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Ultra VIP AI Chamber
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {language === 'tr'
              ? '3 Premium AI ile derin sohbetler. Her 5 dakika 5 Gold.'
              : '3 Premium AIs for deep conversations. 5 Gold per 5 minutes.'}
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Coins className="w-6 h-6" />
            <span className="text-2xl font-bold">{goldBalance === Infinity ? '∞' : goldBalance} Gold</span>
          </div>
        </div>

        {/* Bots Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {bots.map((bot) => {
            const IconComponent = bot.icon
            return (
              <div
                key={bot.id}
                className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 group"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bot.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300">
                    {bot.emoji}
                  </div>

                  {/* Name */}
                  <h2 className="text-2xl font-bold mb-2 text-white">{bot.name}</h2>
                  <p className="text-lg text-gray-300 mb-4">{bot.tagline}</p>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{bot.description}</p>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleStartSpectator(bot)}
                      className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {language === 'tr' ? 'Spectator Modu' : 'Spectator Mode'}
                    </button>
                    <button
                      onClick={() => handleStartAuthorized(bot)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50"
                    >
                      <Unlock className="w-4 h-4" />
                      {language === 'tr' ? 'Tam Erişim' : 'Full Access'}
                      <span className="text-sm opacity-80">(5 Gold/5dk)</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <a
            href="/ai-bots"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl border border-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {language === 'tr' ? 'AI Botlara Dön' : 'Back to AI Bots'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default UltraVIPAI
