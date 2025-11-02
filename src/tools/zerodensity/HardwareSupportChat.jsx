import { useState } from 'react'
import { MessageCircle, Send, Loader, Cpu, AlertTriangle, CheckCircle, Globe, FileText } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const HardwareSupportChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Merhaba! / Hi! I\'m **Reality Guide** 🎯\n\nYour Zero Density Reality systems expert. I can help with:\n• Hardware troubleshooting (Evo II, Evo III, Evo III Pro, Ampere)\n• Performance optimization\n• System diagnostics\n• Configuration issues\n\n⚠️ Important: I cannot assist with hardware modifications outside official Zero Density specifications (RAM upgrades, GPU replacements, etc.)\n\n🌍 You can ask in English or Turkish.\n\n🔍 **FIRST: Are you using the original Zero Density ISO image, or did you install your own OS?**\n(Önce: Orijinal Zero Density ISO\'sunu mu kullanıyorsunuz yoksa kendi işletim sisteminizi mi kurdunuz?)',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isoQuestionAsked, setIsoQuestionAsked] = useState(false)
  const [usingOriginalISO, setUsingOriginalISO] = useState(null)

  const systemInfo = {
    evo2: {
      gpu: 'NVIDIA RTX 4090 (48GB GDDR6X)',
      cpu: 'AMD Ryzen 9 7950X',
      ram: '64GB DDR5',
      storage: '1TB NVMe SSD',
      features: 'Ray Tracing, DLSS 3, UE5 Lumen, Nanite',
      useCase: 'Broadcast & Live Production'
    },
    evo3: {
      gpu: 'NVIDIA RTX 5090 (32GB GDDR7)',
      cpu: 'AMD Ryzen 9 7950X3D',
      ram: '64GB DDR5',
      storage: '1TB NVMe SSD',
      features: 'Advanced Ray Tracing, DLSS 3.5, Full UE5 Support',
      useCase: 'Broadcast & Live Production'
    },
    evo3pro: {
      gpu: 'NVIDIA RTX 6000 Pro (96GB GDDR6X)',
      cpu: 'AMD Ryzen 9 7950X3D',
      ram: '128GB DDR5 ECC',
      storage: '2TB NVMe SSD',
      features: 'Professional Ray Tracing, DLSS 3.5, Enterprise UE5',
      useCase: 'Broadcast & Live Production'
    },
    amper: {
      gpu: 'NVIDIA RTX A6000 (48GB GDDR6)',
      cpu: 'AMD Threadripper',
      ram: '64GB DDR4 ECC',
      storage: '1TB NVMe SSD',
      features: 'Limited Ray Tracing (Older Gen), Lino Support',
      useCase: 'Legacy Projects (Pre-UE5)',
      limitations: 'No UE5 Lumen, No DLSS 3, Limited Nanite, Lino Supported'
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])

    // Check if this is the first message and detect ISO answer
    if (!isoQuestionAsked) {
      const lowerInput = input.toLowerCase()
      const isUsingISO = lowerInput.includes('yes') || lowerInput.includes('evet') ||
                         lowerInput.includes('original') || lowerInput.includes('orijinal') ||
                         lowerInput.includes('factory') || lowerInput.includes('fabrika')
      const isCustomOS = lowerInput.includes('no') || lowerInput.includes('hayır') ||
                         lowerInput.includes('custom') || lowerInput.includes('own') ||
                         lowerInput.includes('kendi')

      if (isUsingISO || isCustomOS) {
        setIsoQuestionAsked(true)
        setUsingOriginalISO(isUsingISO)
      }
    }

    setInput('')
    setLoading(true)

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.role !== 'assistant' || !msg.content.includes('Reality Guide')) // Skip initial greeting
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n')

      const isoContext = usingOriginalISO !== null
        ? `\n**ISO Status Known:** User ${usingOriginalISO ? 'IS using original Zero Density ISO' : 'IS NOT using original ISO (custom OS installed)'}.`
        : ''

      const systemInstruction = `You are a Zero Density Reality Hardware Support Specialist. You assist users in BOTH English and Turkish - respond in the language the user uses.${isoContext}

**IMPORTANT:** Remember previous conversation context. When user says "this", "that", "it", or similar references, refer to the conversation history.

**CRITICAL RULES - HARDWARE MODIFICATION POLICY:**
⛔ **STRICTLY PROHIBITED - You CANNOT help with:**
- RAM upgrades or modifications (e.g., "Can I add more RAM?", "RAM arttırabilir miyim?")
  → Response: "❌ Zero Density hardware specifications are fixed and cannot be modified. RAM upgrades are not possible due to our hardware certification and warranty policies."
  → TR: "❌ Zero Density donanım özellikleri sabittir ve değiştirilemez. RAM yükseltme, donanım sertifikamız ve garanti politikamız gereği mümkün değildir."

- GPU replacements or changes (e.g., "Can I upgrade the GPU?", "GPU değiştirebilir miyim?")
  → Response: "❌ Zero Density systems do NOT have external/removable graphics cards. The GPUs are integrated into the system and cannot be upgraded or replaced. Our systems are configured with specific GPUs for certified performance."
  → TR: "❌ Zero Density sistemlerinde harici/çıkarılabilir ekran kartı yoktur. GPU'lar sisteme entegredir ve yükseltilemez veya değiştirilemez. Sistemlerimiz sertifikalı performans için belirli GPU'larla yapılandırılmıştır."

- Any hardware modifications beyond official specs
  → Always respond: "This modification is not supported by Zero Density. Please use the system as provided."

**PRIORITY 1: Official Documentation**
- First, reference docs.zerodensity.io
- Mention source when citing official docs

**Reality System Specifications (FIXED - CANNOT BE CHANGED):**
${Object.entries(systemInfo).map(([system, specs]) =>
  `\n**${system.toUpperCase()}:**
  - GPU: ${specs.gpu} (FIXED - cannot be changed)
  - CPU: ${specs.cpu}
  - RAM: ${specs.ram} (FIXED - cannot be upgraded)
  - Storage: ${specs.storage}
  - Features: ${specs.features}
  - Use Case: ${specs.useCase}
  ${specs.limitations ? `- Limitations: ${specs.limitations}` : ''}`
).join('\n')}

**TROUBLESHOOTING PROTOCOL - ASK IF NOT ALREADY KNOWN:**
${usingOriginalISO === null ? '1. 🔍 "Are you using the original Zero Density ISO image?" / "Orijinal Zero Density ISO\'sunu mu kullanıyorsunuz?"' : ''}
2. 📦 "Is the Reality software version up to date?" / "Reality yazılım versiyonu güncel mi?"
3. 🔧 "Have any system settings been modified from default?" / "Varsayılan ayarlardan herhangi bir değişiklik yapıldı mı?"

**Important Context:**
- If user installed custom OS: ⚠️ WARN that Zero Density only supports factory ISO. Direct them to downloads page for latest official ISO.
- If drivers modified: Ask them to restore to original Zero Density drivers
- **Official ISO Download:** Latest Zero Density ISO images are available on the downloads page (docs.zerodensity.io or contact support)
- Ampere: LEGACY system - no UE5 Lumen, limited Nanite, BUT Lino IS supported
- Evo II/III/Pro: Full broadcast and live production support
- Pro model: 128GB RAM for heavy workloads (cannot be changed)

**Response Format:**
- 📚 Official docs citation
- ⚙️ Hardware specs
- ⚠️ Warnings/limitations
- ✓ Solutions
- 💡 Tips
- 🔍 Diagnostic questions
- ❌ Unsupported requests

**Language Support:**
- Detect user language (English or Turkish)
- Respond in the SAME language
- Be professional and helpful

**Complex Issues & Escalation:**
If issue is too complex, unclear, or outside your scope:
- EN: "For complex issues, please contact Cemal Demirci (IT & Security Administrator): cemal@zerodensity.tv"
- TR: "Karmaşık durumlar için lütfen Cemal Demirci ile iletişime geçin (IT & Güvenlik Yöneticisi): cemal@zerodensity.tv"`

      // Include conversation history for context
      const promptWithHistory = conversationHistory
        ? `Previous Conversation:\n${conversationHistory}\n\nNew User Question: ${input}\n\nContext: User is asking about Zero Density Reality systems. Check if this is covered in docs.zerodensity.io documentation, then provide comprehensive hardware support.`
        : `Reality Hardware Support Question: ${input}\n\nContext: User is asking about Zero Density Reality systems. Check if this is covered in docs.zerodensity.io documentation, then provide comprehensive hardware support.`

      const analysis = await analyzeWithGemini(
        promptWithHistory,
        systemInstruction
      )

      const assistantMessage = {
        role: 'assistant',
        content: analysis,
        timestamp: new Date().toLocaleTimeString()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${err.message}\n\nPlease try again or contact Zero Density support directly.`,
        timestamp: new Date().toLocaleTimeString(),
        error: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    {
      icon: '🔥',
      question: 'My Evo II GPU is running hot, how can I improve cooling?',
      system: 'evo2'
    },
    {
      icon: '🐌',
      question: 'Evo III rendering is slower than expected, what should I check?',
      system: 'evo3'
    },
    {
      icon: '⚠️',
      question: 'Can Ampere run UE5 Lumen projects?',
      system: 'amper'
    },
    {
      icon: '🖥️',
      question: 'Are you using the original Zero Density ISO or custom OS?',
      system: 'all'
    },
    {
      icon: '🎮',
      question: 'What are the GPU driver recommendations for Reality systems?',
      system: 'all'
    },
    {
      icon: '📊',
      question: 'How to monitor system performance during live broadcast?',
      system: 'all'
    }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Cpu className="w-8 h-8 text-blue-600" />
          Reality Guide 🎯
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your Zero Density Reality systems expert | English & Turkish support
        </p>
      </div>

      {/* Documentation Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Documentation Priority:</strong> This assistant references{' '}
            <a href="https://docs.zerodensity.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
              docs.zerodensity.io
            </a>
            {' '}first, then provides additional hardware guidance from broadcast industry best practices.
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(q.question)}
              disabled={loading}
              className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 text-sm"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{q.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{q.question}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : msg.error
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.timestamp}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">You</span>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <Loader className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your hardware issue..."
              className="flex-1 input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* System Specs Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(systemInfo).map(([key, specs]) => (
          <div key={key} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 uppercase text-sm">
              {key === 'evo3pro' ? 'Evo III Pro' : key.replace('evo', 'Evo ').replace('amper', 'Ampere')}
            </h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div><strong>GPU:</strong> {specs.gpu.split('(')[0]}</div>
              <div><strong>RAM:</strong> {specs.ram}</div>
              <div><strong>Use:</strong> {specs.useCase}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HardwareSupportChat
