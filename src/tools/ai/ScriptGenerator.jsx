import { useState, useEffect } from 'react'
import { Terminal, Brain, Loader, AlertCircle, Activity, Zap, Code, Copy, CheckCircle } from 'lucide-react'
import { analyzeWithGemini, LIMITS, getRemainingRequests, SARCASTIC_MESSAGES, getRandomMessage } from '../../services/geminiService'

const ScriptGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [scriptType, setScriptType] = useState('powershell')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [remainingRequests, setRemainingRequests] = useState(LIMITS.RATE_LIMIT)
  const [analysisTime, setAnalysisTime] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setCharCount(prompt.length)
  }, [prompt])

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingRequests(getRemainingRequests())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const scriptTypes = {
    powershell: 'PowerShell',
    batch: 'Batch Script',
    bash: 'Bash Script',
    python: 'Python',
    vbscript: 'VBScript'
  }

  const generate = async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    setError('')
    setResult(null)
    const startTime = Date.now()

    try {
      const systemInstruction = `You are an expert script developer and system administrator. Generate a complete, production-ready ${scriptTypes[scriptType]} script based on the user's requirements.

Requirements:
1. **Complete Script**: Provide a full, working script with no placeholders
2. **Error Handling**: Include proper error handling and logging
3. **Comments**: Add clear comments explaining each section
4. **Best Practices**: Follow industry best practices and security guidelines
5. **Parameters**: Include configurable parameters where appropriate
6. **Documentation**: Add usage instructions at the top

The script should be ready to copy and use immediately.`

      const userPrompt = `Create a ${scriptTypes[scriptType]} script to: ${prompt}

Provide the complete script with error handling, comments, and usage instructions.`

      const script = await analyzeWithGemini(userPrompt, systemInstruction)

      const endTime = Date.now()
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(2))

      setResult({ script, timestamp: new Date().toLocaleString() })
      setRemainingRequests(getRemainingRequests())
    } catch (err) {
      setError(err.message || 'Failed to generate script')
    } finally {
      setGenerating(false)
    }
  }

  const copyScript = () => {
    if (result?.script) {
      navigator.clipboard.writeText(result.script)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const examples = [
    'Monitor disk space and send email alert when below 10%',
    'Backup specific folders to network share with date stamp',
    'Find and list all inactive AD users from last 90 days',
    'Check website uptime and log results',
    'Clean temp files older than 30 days from all user profiles'
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Terminal className="w-8 h-8 text-purple-600" />
          AI Script Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Prompt'tan production-ready script oluştur 🚀
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Prompt Length</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {charCount.toLocaleString()}
            <span className="text-sm text-blue-600 dark:text-blue-400 ml-1">/ {LIMITS.MAX_INPUT_CHARS.toLocaleString()}</span>
          </div>
          {charCount > LIMITS.MAX_INPUT_CHARS * 0.9 && (
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">{getRandomMessage(SARCASTIC_MESSAGES.approachingLimit())}</div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Requests Left</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {remainingRequests}
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">/ {LIMITS.RATE_LIMIT}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Generation Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {analysisTime > 0 ? `${analysisTime}s` : '-'}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Script Type</label>
          <select
            value={scriptType}
            onChange={(e) => setScriptType(e.target.value)}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Object.entries(scriptTypes).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ne yapmak istiyorsun?</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Örnek: Create a script that monitors CPU usage and sends alert when above 80% for 5 minutes..."
            className="textarea-field min-h-[150px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Example Prompts</label>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!prompt.trim() || generating}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {getRandomMessage(SARCASTIC_MESSAGES.analyzing())}
            </>
          ) : (
            <>
              <Code className="w-5 h-5" />
              Generate Script with AI ✨
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div className="text-sm text-red-800 dark:text-red-300">{error}</div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-600" />
              Generated {scriptTypes[scriptType]} Script
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{result.timestamp}</span>
              <button
                onClick={copyScript}
                className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 text-sm"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-900 dark:bg-gray-950 rounded-lg overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{result.script}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScriptGenerator
