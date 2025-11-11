import { useState, useEffect } from 'react'
import { Brain, Upload, Zap, AlertCircle, CheckCircle, Loader, Activity } from 'lucide-react'
import { analyzeWithGemini, LIMITS, getRemainingRequests, SARCASTIC_MESSAGES, getRandomMessage } from '../../services/geminiService'

const PowerShellAnalyzer = () => {
  const [script, setScript] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [credits, setCredits] = useState(15)
  const [analysisTime, setAnalysisTime] = useState(0)

  useEffect(() => {
    setCharCount(script.length)
  }, [script])

  useEffect(() => {
    updateCredits()
  }, [])

  const updateCredits = async () => {
    const remaining = await getRemainingRequests()
    setCredits(remaining)
  }

  const analyzeScript = async () => {
    if (!script.trim()) return

    setAnalyzing(true)
    setError('')
    setResult(null)
    const startTime = Date.now()

    try {
      const systemInstruction = `You are an expert PowerShell and Windows System Administrator. Analyze the provided PowerShell script and provide:

1. **Security Analysis**: Identify any security risks, dangerous commands, or potential vulnerabilities
2. **Best Practices**: Suggest improvements following PowerShell best practices
3. **Performance**: Identify performance bottlenecks and optimization opportunities
4. **Error Handling**: Check for proper error handling and suggest improvements
5. **Code Quality**: Review code structure, readability, and maintainability
6. **Recommendations**: Provide specific, actionable recommendations for improvement

Format your response clearly with sections and bullet points. Be concise but thorough.`

      const prompt = `Analyze this PowerShell script:\n\n\`\`\`powershell\n${script}\n\`\`\``

      const analysis = await analyzeWithGemini(prompt, systemInstruction)

      const endTime = Date.now()
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(2))

      setResult({
        analysis,
        timestamp: new Date().toLocaleString()
      })

      await updateCredits()
    } catch (err) {
      setError(err.message || 'Failed to analyze script. Please check your API key configuration.')
    } finally {
      setAnalyzing(false)
    }
  }

  const loadExample = () => {
    setScript(`# Example PowerShell Script
$users = Get-ADUser -Filter * -Properties Department
foreach ($user in $users) {
    if ($user.Department -eq "IT") {
        Add-ADGroupMember -Identity "IT-Admins" -Members $user
    }
}
Write-Host "Done!"`)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setScript(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-purple-600" />
          AI PowerShell Script Analyzer
        </h1>
        <p className="text-gray-400">
          Analyze security, performance, and best practices
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Character Count</span>
          </div>
          <div className="text-2xl font-bold text-blue-100">
            {charCount.toLocaleString()}
            <span className="text-sm text-blue-400 ml-1">/ {LIMITS.MAX_INPUT_CHARS.toLocaleString()}</span>
          </div>
          {charCount > LIMITS.MAX_INPUT_CHARS * 0.9 && (
            <div className="text-xs text-orange-400 mt-1">{getRandomMessage(SARCASTIC_MESSAGES.approachingLimit())}</div>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-green-300">Credits Available</span>
          </div>
          <div className="text-2xl font-bold text-green-100">
            {credits}
            <span className="text-sm text-green-400 ml-1">credits</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-100">
            {analysisTime > 0 ? `${analysisTime}s` : '-'}
          </div>
        </div>
      </div>

      {/* Configuration Notice */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <strong>API Key Required:</strong> To use this tool, add your free Gemini API key to the <code className="bg-blue-900/50 px-1 rounded">.env</code> file.
            Get your key at: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white">PowerShell Script</h3>
          <div className="flex gap-2">
            <label className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:hover:bg-gray-600 cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload .ps1
              <input type="file" accept=".ps1,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:hover:bg-gray-600"
            >
              Load Example
            </button>
          </div>
        </div>

        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your PowerShell script here..."
          className="textarea-field min-h-[300px] font-mono text-sm bg-gray-700 border-gray-600 text-white"
        />

        <button
          onClick={analyzeScript}
          disabled={!script.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Analyze Script with AI
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              AI Analysis Results
            </h3>
            <span className="text-xs text-gray-400">{result.timestamp}</span>
          </div>

          <div className="prose-invert max-w-none">
            <div className="p-4 bg-gray-50 bg-gray-700/50 rounded-lg whitespace-pre-wrap text-sm text-gray-800 text-gray-200">
              {result.analysis}
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-800">
        <h3 className="font-semibold text-white mb-3">What This Tool Analyzes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            Security vulnerabilities and risks
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            PowerShell best practices
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            Performance optimizations
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            Error handling improvements
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            Code quality and maintainability
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            Specific actionable recommendations
          </div>
        </div>
      </div>
    </div>
  )
}

export default PowerShellAnalyzer
