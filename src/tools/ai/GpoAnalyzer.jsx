import { useState, useEffect } from 'react'
import { Shield, Brain, Loader, AlertCircle, Activity, Zap, Settings } from 'lucide-react'
import { analyzeWithGemini, LIMITS, getRemainingRequests, SARCASTIC_MESSAGES, getRandomMessage } from '../../services/geminiService'

const GpoAnalyzer = () => {
  const [gpoContent, setGpoContent] = useState('')
  const [gpoType, setGpoType] = useState('security')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [credits, setCredits] = useState(15)
  const [analysisTime, setAnalysisTime] = useState(0)

  useEffect(() => {
    setCharCount(gpoContent.length)
  }, [gpoContent])

  useEffect(() => {
    updateCredits()
  }, [])

  const updateCredits = async () => {
    const remaining = await getRemainingRequests()
    setCredits(remaining)
  }

  const gpoTypes = {
    security: 'Security Policy',
    user: 'User Configuration',
    computer: 'Computer Configuration',
    audit: 'Audit Policy',
    firewall: 'Firewall Settings'
  }

  const analyze = async () => {
    if (!gpoContent.trim()) return

    setAnalyzing(true)
    setError('')
    setResult(null)
    const startTime = Date.now()

    try {
      const systemInstruction = `You are an expert Active Directory and Group Policy Administrator. Analyze the provided ${gpoTypes[gpoType]} and provide:

1. **Security Analysis**: Identify security issues, weak configurations, or vulnerabilities
2. **Best Practices**: Compare against Microsoft and industry best practices
3. **Compliance**: Check against CIS benchmarks, NIST, and other standards
4. **Conflicts**: Identify potential conflicts with other policies
5. **Impact Assessment**: Evaluate the impact on users and systems
6. **Recommendations**: Provide specific, actionable improvements with exact PowerShell commands

Be specific with GPO settings and provide PowerShell commands for implementation.`

      const prompt = `Analyze this ${gpoTypes[gpoType]}:\n\n${gpoContent}`

      const analysis = await analyzeWithGemini(prompt, systemInstruction)

      const endTime = Date.now()
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(2))

      setResult({ analysis, timestamp: new Date().toLocaleString() })
      await updateCredits()
    } catch (err) {
      setError(err.message || 'Failed to analyze GPO')
    } finally {
      setAnalyzing(false)
    }
  }

  const loadExample = () => {
    setGpoContent(`# Example Security Policy GPO Settings
Computer Configuration > Windows Settings > Security Settings > Account Policies

Password Policy:
- Minimum password length: 8
- Password complexity: Enabled
- Maximum password age: 90 days
- Minimum password age: 1 day
- Password history: 5 passwords

Account Lockout Policy:
- Account lockout threshold: 5 invalid attempts
- Account lockout duration: 30 minutes
- Reset lockout counter after: 30 minutes

Audit Policy:
- Audit account logon events: Success, Failure
- Audit logon events: Success, Failure
- Audit object access: Failure
- Audit policy change: Success`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Settings className="w-8 h-8 text-purple-600" />
          AI Group Policy (GPO) Analyzer
        </h1>
        <p className="text-gray-400">
          Intelligent Group Policy analysis and security recommendations
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">Policy Size</span>
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
            <span className="text-xs font-medium text-purple-300">Analysis Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-100">
            {analysisTime > 0 ? `${analysisTime}s` : '-'}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">GPO Type</label>
            <select
              value={gpoType}
              onChange={(e) => setGpoType(e.target.value)}
              className="input-field bg-gray-700 border-gray-600 text-white"
            >
              {Object.entries(gpoTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={loadExample}
              className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:hover:bg-gray-600"
            >
              Load Example Policy
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Group Policy Settings</label>
          <textarea
            value={gpoContent}
            onChange={(e) => setGpoContent(e.target.value)}
            placeholder="Paste your GPO settings, GPResult output, or policy configuration..."
            className="textarea-field min-h-[300px] font-mono text-sm bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <button
          onClick={analyze}
          disabled={!gpoContent.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing GPO with AI...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Analyze GPO with AI
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              GPO Analysis Results
            </h3>
            <span className="text-xs text-gray-400">{result.timestamp}</span>
          </div>

          <div className="p-4 bg-gray-50 bg-gray-700/50 rounded-lg whitespace-pre-wrap text-sm text-gray-800 text-gray-200">
            {result.analysis}
          </div>
        </div>
      )}
    </div>
  )
}

export default GpoAnalyzer
