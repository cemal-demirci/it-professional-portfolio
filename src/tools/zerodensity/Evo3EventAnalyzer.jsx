import { useState } from 'react'
import { Monitor, Brain, Upload, Loader } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const Evo3EventAnalyzer = () => {
  const [eventLog, setEventLog] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const analyze = async () => {
    if (!eventLog.trim()) return
    setAnalyzing(true)
    try {
      const analysis = await analyzeWithGemini(
        `Analyze these EVO III event logs:\n\n${eventLog}`,
        'You are an EVO III expert. Focus on UE5 rendering, multi-GPU setups, and PCIe bandwidth optimization.'
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
      <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
        <Monitor className="w-8 h-8 text-orange-600" />
        EVO III Event Analyzer
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border space-y-4">
        <textarea value={eventLog} onChange={(e) => setEventLog(e.target.value)} placeholder="Paste Evo III event logs..." className="textarea-field min-h-[300px] font-mono text-sm dark:bg-gray-700" />
        <button onClick={analyze} disabled={analyzing} className="btn-primary w-full">
          {analyzing ? <><Loader className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Analyze Evo III Logs</>}
        </button>
      </div>
      {result && <div className="bg-white dark:bg-gray-800 p-6 rounded-xl"><pre className="whitespace-pre-wrap text-sm">{result}</pre></div>}
    </div>
  )
}
export default Evo3EventAnalyzer
