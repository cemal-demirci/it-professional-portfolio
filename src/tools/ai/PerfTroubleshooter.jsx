import { useState } from 'react'
import { Brain, Gauge, Loader } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const PerfTroubleshooter = () => {
  const [issue, setIssue] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const analyze = async () => {
    if (!issue.trim()) return
    setAnalyzing(true)
    try {
      const solution = await analyzeWithGemini(
        `Troubleshoot this performance issue: ${issue}`,
        'You are a performance expert. Diagnose bottlenecks, provide monitoring commands, and optimization steps.'
      )
      setResult(solution)
    } catch (err) {
      alert(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
        <Gauge className="w-8 h-8 text-purple-600" />
        AI Performance Troubleshooter
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border space-y-4">
        <textarea value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Describe the performance problem..." className="textarea-field min-h-[200px] dark:bg-gray-700" />
        <button onClick={analyze} disabled={analyzing} className="btn-primary w-full">
          {analyzing ? <><Loader className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Troubleshoot Performance</>}
        </button>
      </div>
      {result && <div className="bg-white dark:bg-gray-800 p-6 rounded-xl"><pre className="whitespace-pre-wrap text-sm">{result}</pre></div>}
    </div>
  )
}
export default PerfTroubleshooter
