import { useState } from 'react'
import { Monitor, Brain, Upload, Loader, AlertCircle, CheckCircle, Activity } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const Evo2EventAnalyzer = () => {
  const [eventLog, setEventLog] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!eventLog.trim()) return

    setAnalyzing(true)
    setError('')
    setResult(null)

    try {
      const systemInstruction = `You are a Reality Evo II system expert at Zero Density. Analyze the provided event logs and provide:

1. **Critical Issues**: GPU errors, rendering issues, system crashes
2. **Performance Issues**: Frame drops, latency problems, resource bottlenecks
3. **Broadcast Impact**: Issues affecting live broadcast quality
4. **Network Issues**: NDI stream problems, network latency
5. **Recommendations**: Specific fixes for Evo II hardware/software
6. **Prevention**: Steps to prevent future issues

Focus on EVO II specific components: GPU rendering, video inputs/outputs, PCIe lane configuration (x8/x16 for Corvid cards).

**PCIe Configuration Notes:**
- EVO II supports PCIe x8 and x16 slots
- Corvid video I/O cards require proper lane detection (x8 minimum)
- Check PCIe bandwidth issues if Corvid cards show performance degradation`

      const analysis = await analyzeWithGemini(
        `Analyze these Reality Evo II event logs:\n\n${eventLog}`,
        systemInstruction
      )

      setResult({
        analysis,
        timestamp: new Date().toLocaleString(),
        systemType: 'Reality Evo II'
      })
    } catch (err) {
      setError(err.message || 'Analysis failed! 😅')
    } finally {
      setAnalyzing(false)
    }
  }

  const loadExample = () => {
    setEventLog(`EVO II - System Event Log
2024-11-01 14:23:15 [GPU] WARNING: GPU temperature high: 82°C
2024-11-01 14:23:20 [Render] ERROR: Frame drop detected - Frame 1245
2024-11-01 14:23:22 [NDI] WARNING: NDI stream latency increased: 45ms
2024-11-01 14:23:30 [PCIe] WARNING: Corvid card detected at x8 instead of x16
2024-11-01 14:23:35 [GPU] CRITICAL: GPU memory usage 95%
2024-11-01 14:23:40 [System] ERROR: Real-time rendering failed
2024-11-01 14:23:45 [Network] WARNING: Network packet loss: 2.3%
2024-11-01 14:24:00 [GPU] INFO: GPU temperature normalized: 75°C`)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setEventLog(event.target.result)
      reader.readAsText(file)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Monitor className="w-8 h-8 text-red-600" />
          EVO II Event Analyzer
        </h1>
        <p className="text-gray-400">
          AI-powered analysis for EVO II system events
        </p>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-4 border border-red-800">
        <div className="flex items-center gap-2 text-sm text-red-300">
          <Activity className="w-4 h-4" />
          <span><strong>System:</strong> EVO II | <strong>GPU:</strong> NVIDIA RTX Series | <strong>PCIe:</strong> x8/x16 Corvid Support</span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white">Event Log Input</h3>
          <div className="flex gap-2">
            <label className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:hover:bg-gray-600 cursor-pointer flex items-center gap-2 text-sm">
              <Upload className="w-4 h-4" />
              Upload Log
              <input type="file" accept=".log,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:hover:bg-gray-600 text-sm"
            >
              Load Example
            </button>
          </div>
        </div>

        <textarea
          value={eventLog}
          onChange={(e) => setEventLog(e.target.value)}
          placeholder="Paste Reality Evo II event logs here..."
          className="textarea-field min-h-[300px] font-mono text-sm bg-gray-700 border-gray-600 text-white"
        />

        <button
          onClick={analyze}
          disabled={!eventLog.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              AI analyzing yapıyor... 🤖
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Analyze with AI
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
              <CheckCircle className="w-5 h-5 text-green-600" />
              {result.systemType} Analysis Results
            </h3>
            <span className="text-xs text-gray-400">{result.timestamp}</span>
          </div>

          <div className="p-4 bg-gray-50 bg-gray-700/50 rounded-lg whitespace-pre-wrap text-sm text-gray-800 text-gray-200">
            {result.analysis}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">EVO II Common Issues:</h4>
        <ul className="text-sm text-blue-300 space-y-1 ml-5 list-disc">
          <li>GPU overheating → Check cooling system, reduce rendering complexity</li>
          <li>Frame drops → Lower scene complexity or check GPU utilization</li>
          <li>Corvid PCIe lanes → Verify card is running at x16, not x8 (check BIOS/lspci)</li>
          <li>NDI latency → Verify network bandwidth and switch quality</li>
        </ul>
      </div>
    </div>
  )
}

export default Evo2EventAnalyzer
