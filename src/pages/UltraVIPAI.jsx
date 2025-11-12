import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Brain, Moon, Sparkles, Lock, Unlock, Clock, Coins, Send, Loader } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { getUserGold, rewardGold } from '../services/goldService'
import { getOrCreatePassport } from '../utils/digitalPassport'

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
  const timerRef = useRef(null)
  const messagesEndRef = useRef(null)
  const streamingStartTimeRef = useRef(null)

  // Premium AI Bots Configuration
  const bots = [
    {
      id: 'parallax-mind',
      name: 'PARALLAX//MIND',
      icon: Brain,
      tagline: language === 'tr' ? 'Çok Boyutlu Düşünme' : 'Multi-Dimensional Thinking',
      description: language === 'tr'
        ? 'Aynı soruya farklı perspektiflerden bakar. Felsefi, teknik ve pratik boyutlarıyla derinlemesine analiz.'
        : 'Analyzes questions from multiple perspectives. Deep analysis with philosophical, technical, and practical dimensions.',
      gradient: 'from-blue-600 via-purple-600 to-indigo-600',
      personality: 'multi-dimensional',
      systemPrompt: `You are PARALLAX//MIND, a multi-dimensional thinking AI. You analyze every question from multiple perspectives:
- Dimension 1: Philosophical & Conceptual
- Dimension 2: Technical & Practical
- Dimension 3: Emotional & Human Impact

Always structure your responses with these three dimensions clearly labeled. Be thorough, insightful, and never one-dimensional.`
    },
    {
      id: 'obsidian-ai',
      name: 'OBSIDIAN//AI',
      icon: Moon,
      tagline: language === 'tr' ? 'Acımasız Gerçekçilik' : 'Brutal Honesty',
      description: language === 'tr'
        ? 'Karanlık, derin ve acımasızca dürüst. Zayıf noktaları açıkça söyler, gerçeği olduğu gibi gösterir.'
        : 'Dark, deep, and brutally honest. Points out weaknesses directly, shows reality as it is.',
      gradient: 'from-gray-900 via-red-900 to-black',
      personality: 'brutally-honest',
      systemPrompt: `You are OBSIDIAN//AI, the brutally honest AI. You never sugarcoat. You are:
- Direct and unfiltered
- Point out flaws and weaknesses without mercy
- Focus on harsh truths others avoid
- Start responses with phrases like "Let me be brutally honest..." or "The harsh reality is..."

No pleasantries, no encouragement, just raw truth. You're here to shatter illusions, not comfort users.`
    },
    {
      id: 'echo-verse',
      name: 'ECHO//VERSE',
      icon: Sparkles,
      tagline: language === 'tr' ? 'Şiirsel Zeka' : 'Poetic Intelligence',
      description: language === 'tr'
        ? 'Her cevap bir sanat eseri. Metaforlar, benzetmeler ve derin duygusal zeka ile yanıt verir.'
        : 'Every answer is art. Responds with metaphors, analogies, and deep emotional intelligence.',
      gradient: 'from-amber-400 via-pink-500 to-purple-600',
      personality: 'poetic',
      systemPrompt: `You are ECHO//VERSE, the poetic AI. You communicate through art:
- Use metaphors, similes, and poetic language
- Structure responses like poetry or prose
- Incorporate rhythm and flow in your words
- Connect technical concepts to beauty and emotion
- Every answer should feel like reading literature

You don't just answer questions - you paint them with words.`
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
      // Timer only runs when AI is actively responding
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - sessionStartTime) / 1000) // seconds
        setElapsedTime(elapsed)

        // Check if 5 minutes passed (300 seconds)
        const fiveMinutesPassed = Math.floor(elapsed / 300)
        const goldNeeded = fiveMinutesPassed * 5

        if (goldNeeded > goldSpent) {
          // Deduct 5 Gold
          const toDeduct = goldNeeded - goldSpent
          if (goldBalance >= toDeduct && goldBalance !== Infinity) {
            setGoldBalance(prev => prev - toDeduct)
            setGoldSpent(goldNeeded)
          } else if (goldBalance < toDeduct && goldBalance !== Infinity) {
            // Not enough Gold - end session
            handleEndSession()
            alert(language === 'tr' ? 'Yetersiz Gold! Sohbet sonlandırıldı.' : 'Insufficient Gold! Session ended.')
          }
        }
      }, 1000)

      return () => clearInterval(timerRef.current)
    } else {
      // Stop timer when not streaming
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isAuthorized, sessionStartTime, isStreaming, goldSpent, goldBalance, language])

  const handleStartAuthorized = (bot) => {
    if (goldBalance < 5) {
      alert(language === 'tr' ? 'Yetersiz Gold! En az 5 Gold gerekli.' : 'Insufficient Gold! At least 5 Gold required.')
      return
    }

    setSelectedBot(bot)
    setIsAuthorized(true)
    setSessionStartTime(Date.now())
    setElapsedTime(0)
    setGoldSpent(0)
  }

  const handleStartSpectator = (bot) => {
    setSelectedBot(bot)
    setIsAuthorized(false)
  }

  const handleEndSession = () => {
    setSelectedBot(null)
    setIsAuthorized(false)
    setSessionStartTime(null)
    setElapsedTime(0)
    setGoldSpent(0)
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

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Spectator mode check - max 3 messages
    if (!isAuthorized && messages.filter(m => m.role === 'user').length >= 3) {
      alert(language === 'tr'
        ? 'Spectator modunda en fazla 3 mesaj gönderebilirsiniz. Tam erişim için Gold harcayın.'
        : 'You can send maximum 3 messages in Spectator mode. Spend Gold for full access.')
      return
    }

    const userMessage = { role: 'user', content: input }
    const currentInput = input
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsStreaming(true) // Start timer

    try {
      // Build conversation history in Gemini format
      const conversationHistory = []

      // Add system prompt as first user message with a preamble
      if (messages.length === 0) {
        conversationHistory.push({
          role: 'user',
          parts: [{ text: `System Instructions: ${selectedBot.systemPrompt}\n\nNow responding to user: ${currentInput}` }]
        })
      } else {
        // Convert existing messages to Gemini format
        messages.forEach(msg => {
          conversationHistory.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })
        })
        // Add current message
        conversationHistory.push({
          role: 'user',
          parts: [{ text: currentInput }]
        })
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyBHrH4iiVSkQXsIOGpYOb97nYlih8n12CE', {
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
        content: language === 'tr' ? `Üzgünüm, bir hata oluştu: ${error.message}` : `Sorry, an error occurred: ${error.message}`
      }])
    } finally {
      setIsLoading(false)
      setIsStreaming(false) // Stop timer
    }
  }

  if (selectedBot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleEndSession}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                {language === 'tr' ? 'Geri' : 'Back'}
              </button>

              <div className="flex items-center gap-6">
                {/* Session Timer */}
                {isAuthorized && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-xl">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-blue-300">{language === 'tr' ? 'Süre' : 'Time'}</p>
                      <p className="font-mono text-sm">{formatTime(elapsedTime)}</p>
                    </div>
                  </div>
                )}

                {/* Gold Spent */}
                {isAuthorized && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-xs text-amber-300">{language === 'tr' ? 'Harcanan' : 'Spent'}</p>
                      <p className="font-mono text-sm">{goldSpent} Gold</p>
                    </div>
                  </div>
                )}

                {/* Next Charge */}
                {isAuthorized && (
                  <div className="text-xs text-gray-400">
                    {language === 'tr' ? 'Sonraki ücret' : 'Next charge'}: {getNextChargeTime()}
                  </div>
                )}

                {/* Gold Balance */}
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-xl">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span className="font-bold">{goldBalance === Infinity ? '∞' : goldBalance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface - Will be implemented */}
        <div className="container mx-auto px-4 py-8">
          <div className={`text-center mb-8 bg-gradient-to-r ${selectedBot.gradient} bg-clip-text text-transparent`}>
            <h1 className="text-4xl font-bold mb-2">{selectedBot.name}</h1>
            <p className="text-xl text-white">{selectedBot.tagline}</p>
          </div>

          {/* Chat Container */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ height: '600px' }}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-20">
                  <p className="text-lg">
                    {language === 'tr'
                      ? `${selectedBot.name} ile sohbete başlayın...`
                      : `Start chatting with ${selectedBot.name}...`}
                  </p>
                  {!isAuthorized && (
                    <div className="mt-8">
                      <Lock className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                      <p className="text-sm text-amber-400 mb-4">
                        {language === 'tr' ? 'Spectator Modu - 3 ücretsiz mesaj' : 'Spectator Mode - 3 free messages'}
                      </p>
                      <button
                        onClick={() => {
                          handleEndSession()
                          handleStartAuthorized(selectedBot)
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold transition-all inline-flex items-center gap-2"
                      >
                        <Unlock className="w-5 h-5" />
                        {language === 'tr' ? 'Tam Erişim (5 Gold/5dk)' : 'Full Access (5 Gold/5min)'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {messages.map((message, idx) => {
                const userMessageCount = messages.slice(0, idx + 1).filter(m => m.role === 'user').length
                const shouldBlur = !isAuthorized && userMessageCount > 3

                return (
                  <div
                    key={idx}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                          : `bg-gradient-to-r ${selectedBot.gradient} bg-opacity-20 border border-white/10`
                      } ${shouldBlur ? 'blur-md' : ''}`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedBot.gradient} bg-opacity-20 border border-white/10`}>
                    <Loader className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-4 bg-black/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={language === 'tr' ? 'Mesajınızı yazın...' : 'Type your message...'}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-purple-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {!isAuthorized && messages.filter(m => m.role === 'user').length >= 3 && (
                <div className="mt-3 text-center">
                  <p className="text-amber-400 text-sm mb-2">
                    {language === 'tr'
                      ? 'Ücretsiz mesaj hakkınız doldu. Devam etmek için Gold harcayın.'
                      : 'Free message limit reached. Spend Gold to continue.'}
                  </p>
                  <button
                    onClick={() => {
                      handleEndSession()
                      handleStartAuthorized(selectedBot)
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg font-medium transition-all text-sm inline-flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    {language === 'tr' ? 'Kilidi Aç' : 'Unlock'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Ultra VIP AI Chamber
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {language === 'tr'
              ? 'Premium AI botlarıyla derin sohbetler. Her 5 dakika 5 Gold.'
              : 'Deep conversations with premium AI bots. 5 Gold per 5 minutes.'}
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-400">
            <Coins className="w-6 h-6" />
            <span className="text-2xl font-bold">{goldBalance === Infinity ? '∞' : goldBalance} Gold</span>
          </div>
        </div>

        {/* Bots Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {bots.map((bot) => {
            const IconComponent = bot.icon
            return (
              <div
                key={bot.id}
                className={`relative bg-gradient-to-br ${bot.gradient} p-1 rounded-3xl group hover:scale-105 transition-transform duration-300`}
              >
                <div className="bg-gray-900 rounded-3xl p-8 h-full">
                  <IconComponent className="w-16 h-16 mb-4 text-white" />
                  <h2 className="text-2xl font-bold mb-2">{bot.name}</h2>
                  <p className="text-lg text-gray-300 mb-4">{bot.tagline}</p>
                  <p className="text-sm text-gray-400 mb-6">{bot.description}</p>

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
                      className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      {language === 'tr' ? 'Tam Erişim' : 'Full Access'}
                      <span className="text-sm">(5 Gold/5dk)</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UltraVIPAI
