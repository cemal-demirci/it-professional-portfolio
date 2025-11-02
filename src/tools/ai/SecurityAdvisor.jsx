import { useState, useEffect } from 'react'
import { Shield, Brain, Loader, AlertCircle, CheckCircle, Activity, Zap } from 'lucide-react'
import { analyzeWithGemini, LIMITS, getRemainingRequests } from '../../services/geminiService'

const SecurityAdvisor = () => {
  const [scenario, setScenario] = useState('')
  const [systemType, setSystemType] = useState('windows-server')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [remainingRequests, setRemainingRequests] = useState(LIMITS.RATE_LIMIT)
  const [analysisTime, setAnalysisTime] = useState(0)

  useEffect(() => {
    setCharCount(scenario.length)
  }, [scenario])

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingRequests(getRemainingRequests())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const analyze = async () => {
    if (!scenario.trim()) return

    setAnalyzing(true)
    setError('')
    setResult(null)
    const startTime = Date.now()

    try {
      const systemInstruction = `You are an expert Security Consultant and Windows System Administrator specializing in ${systemType}. Provide comprehensive security recommendations including:

1. **Security Assessment**: Evaluate the current security posture
2. **Vulnerabilities**: Identify potential security weaknesses
3. **Hardening Steps**: Specific PowerShell commands and Group Policy settings
4. **Compliance**: Reference industry standards (CIS, NIST, ISO 27001)
5. **Monitoring**: Recommended logging and alerting configurations
6. **Actionable Steps**: Prioritized list of security improvements

Provide concrete, implementable solutions with exact commands where applicable.`

      const prompt = `System: ${systemType}\n\nScenario/Question: ${scenario}`

      const analysis = await analyzeWithGemini(prompt, systemInstruction)

      const endTime = Date.now()
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(2))

      setResult({ analysis, timestamp: new Date().toLocaleString() })

      setRemainingRequests(getRemainingRequests())
    } catch (err) {
      setError(err.message || 'Failed to get security recommendations')
    } finally {
      setAnalyzing(false)
    }
  }

  const quickQuestions = [
    'How to secure Active Directory against common attacks?',
    'Best practices for Windows Server 2022 hardening',
    'Implement zero-trust security model for our domain',
    'Secure RDP access and prevent brute force attacks',
    'Configure Windows Firewall for maximum security'
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Shield className="w-8 h-8 text-purple-600" />
          AI Security Configuration Advisor
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get expert security recommendations powered by AI
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Query Length</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {charCount.toLocaleString()}
            <span className="text-sm text-blue-600 dark:text-blue-400 ml-1">/ {LIMITS.MAX_INPUT_CHARS.toLocaleString()}</span>
          </div>
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
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {analysisTime > 0 ? `${analysisTime}s` : '-'}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">System Type</label>
          <select
            value={systemType}
            onChange={(e) => setSystemType(e.target.value)}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="windows-server">Windows Server</option>
            <option value="active-directory">Active Directory</option>
            <option value="windows-desktop">Windows 10/11</option>
            <option value="azure-ad">Azure AD / Entra ID</option>
            <option value="microsoft-365">Microsoft 365</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Security Question</label>
          <textarea
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Describe your security scenario or ask a question..."
            className="textarea-field min-h-[150px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quick Questions</label>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setScenario(q)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={analyze}
          disabled={!scenario.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Consulting AI...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Get AI Security Recommendations
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 inline mr-2" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Security Recommendations
            </h3>
            <span className="text-xs text-gray-500">{result.timestamp}</span>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
            {result.analysis}
          </div>
        </div>
      )}
    </div>
  )
}

export default SecurityAdvisor
