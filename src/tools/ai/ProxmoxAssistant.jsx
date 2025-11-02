import { useState } from 'react'
import { Server, Send, Loader2, Trash2, Copy, Check } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const ProxmoxAssistant = () => {
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const systemPrompt = `You are an expert Proxmox VE (Virtual Environment) assistant. You have deep knowledge of:
- Proxmox VE installation, configuration, and management
- Virtual machines (KVM/QEMU) and containers (LXC)
- Storage configuration (ZFS, LVM, Ceph, NFS, iSCSI)
- Networking (bridges, VLANs, SDN, OVS)
- High Availability (HA) and clustering
- Backup and restore strategies
- Security best practices
- Performance optimization
- CLI commands (qm, pct, pvesh, etc.)
- Web UI operations

Provide clear, practical, and actionable advice. Include relevant commands when appropriate.
Format your responses in a clear, organized manner with proper headings and code blocks when necessary.`

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setConversation(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const fullPrompt = `${systemPrompt}

${conversation.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n\n')}

User: ${question}`

      const response = await analyzeWithGemini(fullPrompt, 'proxmox-assistant')
      const assistantMessage = { role: 'assistant', content: response }
      setConversation(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`
      }
      setConversation(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setConversation([])
    setQuestion('')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Server className="w-8 h-8 text-orange-600" />
          Proxmox VE Assistant 🔧
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered Proxmox Virtual Environment expert
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        {/* Conversation Area */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-12">
              <Server className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Ask me anything about Proxmox VE!
              </p>
              <div className="mt-4 text-sm text-gray-400 dark:text-gray-500">
                <p>Example questions:</p>
                <ul className="mt-2 space-y-1">
                  <li>• How do I create a new VM in Proxmox?</li>
                  <li>• What are the best practices for ZFS storage?</li>
                  <li>• How to set up high availability clustering?</li>
                  <li>• How do I backup and restore VMs?</li>
                </ul>
              </div>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-50 dark:bg-primary-900/20 ml-12'
                    : 'bg-gray-50 dark:bg-gray-700/50 mr-12'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {message.role === 'user' ? '👤 You' : '🤖 Proxmox Assistant'}
                  </p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      title="Copy response"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Thinking...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about Proxmox VE, VMs, storage, networking..."
            className="flex-1 input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
          {conversation.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-secondary flex items-center gap-2"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          )}
        </form>

        {/* Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Conversation context is maintained
        </div>
      </div>
    </div>
  )
}

export default ProxmoxAssistant
