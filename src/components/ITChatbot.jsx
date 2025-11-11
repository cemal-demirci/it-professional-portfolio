import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Trash2, Zap, AlertCircle, Sparkles } from 'lucide-react'
import { analyzeWithGemini, getRemainingRequests, SARCASTIC_MESSAGES, getRandomMessage } from '../services/geminiService'

const ITChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Selam! Ben IT Soru Botu! \n\nIT ile ilgili her türlü sorunuzu sorabilirsiniz:\n• Windows/Linux sorunları 🖥️\n• Network problemleri 🌐\n• Güvenlik konuları 🔐\n• Kod hataları 💻\n• Genel IT kavramlar 📚\n\nNasıl yardımcı olabilirim? 😊'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [credits, setCredits] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    updateCredits()
  }, [])

  useEffect(() => {
    // Only scroll to bottom when a new assistant message is added or loading changes
    if (messages.length > 0 && (messages[messages.length - 1].role === 'assistant' || !loading)) {
      scrollToBottom()
    }
  }, [messages, loading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const updateCredits = async () => {
    const remaining = await getRemainingRequests()
    setCredits(remaining)
  }

  const quickQuestions = [
    'Windows update nasıl yapılır?',
    'IP adresi nedir?',
    'BSOD hatası nasıl çözülür?',
    'PowerShell nedir?',
    'Firewall ne işe yarar?',
  ]

  const handleQuickQuestion = (question) => {
    setInput(question)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.role !== 'assistant' || !msg.content.includes('Selam! Ben IT Soru Botu')) // Skip initial greeting
        .map(msg => `${msg.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${msg.content}`)
        .join('\n\n')

      const systemInstruction = `Sen IT konularında uzman bir asistan botsun. Türkçe dilinde, arkadaşça ve anlaşılır bir şekilde cevap ver.

KURALLAR:
• Sadece IT ile ilgili konularda yardımcı ol (Windows, Linux, Network, Security, Programming, Hardware, etc.)
• IT dışı sorular gelirse kibarca reddet: "Ben sadece IT konularında yardımcı olabiliyorum. Bunun yerine IT sorusu sor! 🤓"
• Teknik terimleri açıklarken Türkçe örnekler ver
• Kod örnekleri gösterirken syntax highlighting kullan
• Kısa ve öz cevaplar ver, fazla uzatma
• Eğlenceli ve sarkastik ol ama yardımsever kal
• Emojiler kullan, sıkıcı olma! 😎
• Önceki konuşmaları hatırla ve bağlam kur! Kullanıcı "bunu" veya "o" dediğinde önceki mesajlara bak

ÖRNEKLER:
• "DNS nedir?" → DNS'i açıkla, örnek ver, kullanım senaryosu göster
• "Windows çöktü!" → Hangi hatayı alıyor sor, troubleshooting adımları ver
• "Seni kim yaptı?" → "Cemal yarattı beni! Ben IT konularında yardımcı oluyorum ✨"

NOT: Sadece IT konularında yardımcı ol!`

      // Include conversation history for context
      const promptWithHistory = conversationHistory
        ? `Önceki Sohbet:\n${conversationHistory}\n\nYeni Kullanıcı Sorusu: ${userMessage.content}`
        : `Kullanıcı sorusu: ${userMessage.content}`

      const response = await analyzeWithGemini(
        promptWithHistory,
        systemInstruction
      )

      const assistantMessage = {
        role: 'assistant',
        content: response
      }

      setMessages(prev => [...prev, assistantMessage])
      await updateCredits()
    } catch (err) {
      setError(err.message)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Hata: ${err.message}\n\nTekrar dene veya farklı bir soru sor!`
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '🔄 Chat temizlendi! Yeni soru sorabilirsin 😊'
      }
    ])
    setError(null)
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">IT Soru Botu</h3>
            <p className="text-xs text-white/80">Cemal AI Destekli 🤖</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {credits !== null && (
            <div className="text-xs text-white/90 bg-white/20 px-3 py-1 rounded-full">
              ⚡ {credits} credits
            </div>
          )}
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Chat'i temizle"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-orange-500 to-red-500'
                : 'bg-gradient-to-br from-cyan-500 to-teal-500'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message */}
            <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                  : 'bg-gray-800 text-white border border-gray-700'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && !loading && (
        <div className="p-4 bg-cyan-900/20 border-t border-gray-700">
          <p className="text-xs text-cyan-200 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Hızlı Sorular:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickQuestion(q)}
                className="text-xs px-3 py-1 bg-gray-800 text-cyan-300 border border-cyan-600 rounded-full hover:hover:bg-cyan-900/50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-900/20 border-t border-red-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="IT sorunuzu yazın... (örn: DNS nedir?)"
            className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Zap className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          💡 İpucu: Detaylı soru sorun, daha iyi cevap alın!
        </p>
      </form>
    </div>
  )
}

export default ITChatbot
