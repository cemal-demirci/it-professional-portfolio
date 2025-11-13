import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Unlock, Mic, MicOff, Volume2, VolumeX, Loader, Zap, Clock, User, Settings, Info, X } from 'lucide-react'
import { AI_CHARACTERS, generateSpeech, getQuota } from '../services/elevenLabsService'
import { analyzeWithGemini } from '../services/geminiService'
import { getUserGold } from '../services/goldService'
import { deductGold } from '../utils/digitalPassport'
import { useLanguage } from '../contexts/LanguageContext'

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

  // Voice & audio
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [elevenLabsQuota, setElevenLabsQuota] = useState({ used: 0, limit: 10000 })

  const audioRef = useRef(null)
  const sessionTimerRef = useRef(null)

  // Load gold balance
  useEffect(() => {
    getUserGold().then(gold => setGoldBalance(gold))
  }, [])

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

  // End session
  const endSession = () => {
    setSelectedCharacter(null)
    setConversation([])
    setSessionTime(0)

    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current)
    }

    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
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
      await navigator.mediaDevices.getUserMedia({ audio: true })

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
    setIsListening(false)
  }

  // Process user input and get AI response
  const processUserInput = async (userText) => {
    setIsProcessing(true)

    try {
      // Check gold balance (1 gold per interaction)
      const currentGold = await getUserGold()
      if (currentGold < 1) {
        alert('Yetersiz Gold! Devam etmek için Gold satın alın.')
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
      const aiResponse = await analyzeWithGemini(
        conversationContext,
        selectedCharacter.systemPrompt,
        { bypassCreditCheck: true } // Uses Gold instead
      )

      // Add AI message
      setConversation(prev => [...prev, {
        role: 'assistant',
        text: aiResponse,
        timestamp: Date.now()
      }])

      // Deduct gold
      await deductGold(1)
      setGoldBalance(prev => prev - 1)

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
      alert('Ses üretme hatası! ElevenLabs API key\'i kontrol edin.')
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
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 text-center text-gray-500 text-xs">
          Her konuşma 1 Gold harcar • ElevenLabs Turbo v2.5 (Türkçe optimize) kullanılıyor
        </div>
      </div>
    </div>
  )
}

export default VoiceChamber
