import { useState, useEffect } from 'react'
import { Brain, Upload, FileText, Loader, AlertCircle, Activity, Zap } from 'lucide-react'
import { analyzeWithGemini, LIMITS, getRemainingRequests } from '../../services/geminiService'

const LogAnalyzer = () => {
  const [logContent, setLogContent] = useState('')
  const [logType, setLogType] = useState('windows')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [credits, setCredits] = useState(15)
  const [analysisTime, setAnalysisTime] = useState(0)

  useEffect(() => {
    setCharCount(logContent.length)
  }, [logContent])

  useEffect(() => {
    updateCredits()
  }, [])

  const updateCredits = async () => {
    const remaining = await getRemainingRequests()
    setCredits(remaining)
  }

  const logTypes = {
    windows: 'Windows Event Log',
    iis: 'IIS Log',
    apache: 'Apache/Nginx Log',
    application: 'Application Log',
    security: 'Security Log'
  }

  const analyzeLogs = async () => {
    if (!logContent.trim()) return

    setAnalyzing(true)
    setError('')
    setResult(null)
    const startTime = Date.now()

    try {
      const systemInstruction = `You are an expert System Administrator and Log Analyst. Analyze the provided ${logTypes[logType]} and provide:

1. **Critical Issues**: Identify errors, warnings, and critical events
2. **Security Concerns**: Detect suspicious activities, failed logins, unauthorized access attempts
3. **Performance Issues**: Identify performance bottlenecks or resource problems
4. **Patterns**: Recognize recurring issues or anomalies
5. **Recommendations**: Provide actionable steps to resolve identified issues
6. **Summary**: Brief overview of log health and key findings

Be specific with line numbers or timestamps when referencing log entries.`

      const prompt = `Analyze this ${logTypes[logType]}:\n\n${logContent}`

      const analysis = await analyzeWithGemini(prompt, systemInstruction)

      const endTime = Date.now()
      setAnalysisTime(((endTime - startTime) / 1000).toFixed(2))

      setResult({
        analysis,
        timestamp: new Date().toLocaleString(),
        logType: logTypes[logType]
      })

      await updateCredits()
    } catch (err) {
      setError(err.message || 'Failed to analyze logs')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogContent(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const loadExample = () => {
    setLogContent(`2024-11-01 18:45:12 - ERROR - Database connection failed: timeout after 30s
2024-11-01 18:45:15 - WARNING - High memory usage: 95%
2024-11-01 18:45:20 - ERROR - Failed login attempt for user 'admin' from 192.168.1.100
2024-11-01 18:45:25 - ERROR - Failed login attempt for user 'admin' from 192.168.1.100
2024-11-01 18:45:30 - CRITICAL - Service 'WebService' crashed
2024-11-01 18:46:00 - INFO - Service 'WebService' restarted
2024-11-01 18:46:05 - WARNING - Disk space low on C: drive (5% free)`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-purple-600" />
          AI Log File Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Intelligent log analysis and troubleshooting
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Log Size</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {charCount.toLocaleString()}
            <span className="text-sm text-blue-600 dark:text-blue-400 ml-1">/ {LIMITS.MAX_INPUT_CHARS.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Credits Available</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {credits}
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">credits</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Analysis Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {analysisTime > 0 ? `${analysisTime}s` : '-'}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Log Type</label>
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {Object.entries(logTypes).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 ml-4">
            <label className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Log
              <input type="file" accept=".log,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Example
            </button>
          </div>
        </div>

        <textarea
          value={logContent}
          onChange={(e) => setLogContent(e.target.value)}
          placeholder="Paste your log file content here..."
          className="textarea-field min-h-[300px] font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <button
          onClick={analyzeLogs}
          disabled={!logContent.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing Logs with AI...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Analyze Logs with AI
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
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Analysis: {result.logType}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{result.timestamp}</span>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
            {result.analysis}
          </div>
        </div>
      )}
    </div>
  )
}

export default LogAnalyzer
