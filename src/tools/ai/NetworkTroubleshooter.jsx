import { useState, useEffect } from 'react'
import { Network, Brain, Loader, AlertCircle, Zap, Activity } from 'lucide-react'
import { analyzeWithGemini, LIMITS, getRemainingRequests } from '../../services/geminiService'

const NetworkTroubleshooter = () => {
  const [problem, setProblem] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [credits, setCredits] = useState(15)
  const [analysisTime, setAnalysisTime] = useState(0)

  useEffect(() => {
    setCharCount(problem.length)
  }, [problem])

  useEffect(() => {
    updateCredits()
  }, [])

  const updateCredits = async () => {
    const remaining = await getRemainingRequests()
    setCredits(remaining)
  }

  const troubleshoot = async () => {
    if (!problem.trim()) return

    setAnalyzing(true)
    setError('')
    setResult(null)
    const startTime = Date.now()

    try {
      const systemInstruction = `You are an expert Network Administrator and Troubleshooter. Analyze the network problem and provide:

1. **Problem Diagnosis**: Identify the most likely cause
2. **Step-by-Step Solution**: Detailed troubleshooting steps
3. **PowerShell Commands**: Specific commands to run for diagnosis and fixes
4. **Network Commands**: netsh, ipconfig, ping, tracert, nslookup commands
5. **Verification Steps**: How to verify the fix worked
6. **Prevention**: Tips to prevent this issue in the future

Be specific with actual commands and explain what each command does.`

      const prompt = `Network Problem:\n${problem}`

      const analysis = await analyzeWithGemini(prompt, systemInstruction)

      const endTime = Date.now()
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(2))

      setResult({ analysis, timestamp: new Date().toLocaleString() })

      await updateCredits()
    } catch (err) {
      setError(err.message || 'Failed to analyze problem')
    } finally {
      setAnalyzing(false)
    }
  }

  const commonProblems = [
    'Cannot connect to internet but connected to WiFi',
    'DNS resolution failing for specific domains',
    'Very slow network speed on specific computer',
    'Cannot access network shares but internet works',
    'Getting "Network path not found" errors',
    'RDP connection keeps dropping'
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Network className="w-8 h-8 text-purple-600" />
          AI Network Troubleshooter
        </h1>
        <p className="text-gray-400">
          Intelligent network problem diagnosis and solutions
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Description Length</span>
          </div>
          <div className="text-2xl font-bold text-blue-100">
            {charCount.toLocaleString()}
            <span className="text-sm text-blue-400 ml-1">/ {LIMITS.MAX_INPUT_CHARS.toLocaleString()}</span>
          </div>
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

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Describe the Network Problem</label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe the network issue you're experiencing in detail..."
            className="textarea-field min-h-[150px] bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Common Problems</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commonProblems.map((p, i) => (
              <button
                key={i}
                onClick={() => setProblem(p)}
                className="px-3 py-2 text-xs text-left bg-gray-700 text-gray-300 rounded-lg hover:hover:bg-primary-900/30"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={troubleshoot}
          disabled={!problem.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              AI is troubleshooting...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Troubleshoot with AI
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 inline mr-2" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Troubleshooting Solution
          </h3>
          <div className="p-4 bg-gray-50 bg-gray-700/50 rounded-lg whitespace-pre-wrap text-sm text-gray-800 text-gray-200">
            {result.analysis}
          </div>
        </div>
      )}
    </div>
  )
}

export default NetworkTroubleshooter
