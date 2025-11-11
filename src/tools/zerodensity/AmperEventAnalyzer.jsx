import { useState } from 'react'
import { Cpu, Brain, Upload, Loader, AlertTriangle, Zap } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const AmpereEventAnalyzer = () => {
  const [eventLog, setEventLog] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const analyze = async () => {
    if (!eventLog.trim()) return
    setAnalyzing(true)
    try {
      const systemInstruction = `You are a Reality Ampere expert. Focus on:

1. **Hardware Limitations**: Ampere uses RTX A6000 (older generation GPU)
   - ⚠️ NO UE5 Lumen support (will crash)
   - ⚠️ NO DLSS 3 / Frame Generation
   - ⚠️ Limited Nanite performance
   - ✓ Only DLSS 2.0 supported

2. **Common Issues**:
   - Lumen-related crashes → Older GPU architecture, disable in UE5 settings
   - Nanite performance issues → Use traditional LODs instead
   - Ray tracing limitations → First-gen RT cores, avoid complex scenes

3. **Analysis Focus**:
   - FPGA processing issues
   - Embedded system errors
   - GPU-related crashes (especially UE5 features)
   - Network latency issues

When analyzing logs, if you see Lumen/Nanite errors, IMMEDIATELY warn that Ampere's RTX A6000 doesn't support these features properly.`

      const analysis = await analyzeWithGemini(
        `Analyze these Reality Ampere event logs:\n\n${eventLog}`,
        systemInstruction
      )
      setResult(analysis)
    } catch (err) {
      alert(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Cpu className="w-8 h-8 text-yellow-600" />
          Ampere Event Analyzer
        </h1>
        <p className="text-gray-400">AI-powered analysis for Ampere systems</p>
      </div>

      {/* GPU Warning Banner */}
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-2">Ampere - Hardware Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-sm text-white/80">GPU</div>
                <div className="font-semibold">NVIDIA RTX A6000</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-sm text-white/80">Architecture</div>
                <div className="font-semibold">Amperee (Older Gen)</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="text-sm text-white/80">VRAM</div>
                <div className="font-semibold">48GB GDDR6</div>
              </div>
            </div>

            <div className="bg-red-500/30 border border-red-400/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Known Hardware Limitations
              </h4>
              <ul className="text-sm space-y-1">
                <li>⚠️ <strong>UE5 Lumen:</strong> Not supported - will crash (older GPU architecture)</li>
                <li>⚠️ <strong>Nanite:</strong> Limited performance - use traditional LODs</li>
                <li>⚠️ <strong>DLSS 3:</strong> Not available - only DLSS 2.0</li>
                <li>⚠️ <strong>Ray Tracing:</strong> First-gen RT cores - avoid complex scenes</li>
              </ul>
              <div className="mt-3 text-xs bg-red-600/20 p-2 rounded">
                💡 <strong>Quick Fix:</strong> If experiencing crashes with UE5, disable Lumen and Nanite in Project Settings → Engine → Rendering
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Input */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <h3 className="font-semibold text-white">Ampere Event Logs</h3>
        <textarea
          value={eventLog}
          onChange={(e) => setEventLog(e.target.value)}
          placeholder="Paste Ampere event logs here..."
          className="textarea-field min-h-[300px] font-mono text-sm"
        />
        <button onClick={analyze} disabled={analyzing || !eventLog.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
          {analyzing ? <><Loader className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Analyze Ampere Logs</>}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="font-semibold text-white mb-4">Analysis Results</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 text-gray-200 bg-gray-900 p-4 rounded-lg">{result}</pre>
        </div>
      )}

      {/* Tips */}
      <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-300 mb-2">Ampere Troubleshooting Tips:</h4>
        <ul className="text-sm text-yellow-300 space-y-1 ml-5 list-disc">
          <li>Lumen crashes → Disable in UE5: Edit → Project Settings → Engine → Rendering → Global Illumination → Dynamic Global Illumination Method → None</li>
          <li>Nanite issues → Disable per-mesh or use traditional Static Mesh LODs</li>
          <li>Poor RT performance → Reduce ray tracing quality or disable entirely</li>
          <li>FPGA issues → Check camera calibration and network latency</li>
        </ul>
      </div>
    </div>
  )
}
export default AmpereEventAnalyzer
