import { useState } from 'react'
import { Brain, LifeBuoy, Loader } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const DrPlanner = () => {
  const [scenario, setScenario] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)

  const generate = async () => {
    if (!scenario.trim()) return
    setGenerating(true)
    try {
      const plan = await analyzeWithGemini(
        `Create a Disaster Recovery plan for: ${scenario}`,
        'You are a DR/BC expert. Create comprehensive disaster recovery plans with RTO, RPO, procedures, and checklists.'
      )
      setResult(plan)
    } catch (err) {
      alert(err.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
        <LifeBuoy className="w-8 h-8 text-purple-600" />
        AI Disaster Recovery Planner
      </h1>
      <div className="bg-gray-800 rounded-xl p-6 border space-y-4">
        <textarea value={scenario} onChange={(e) => setScenario(e.target.value)} placeholder="Describe your infrastructure and critical systems..." className="textarea-field min-h-[200px] bg-gray-700" />
        <button onClick={generate} disabled={generating} className="btn-primary w-full">
          {generating ? <><Loader className="w-5 h-5 animate-spin" /> Generating...</> : <><Brain className="w-5 h-5" /> Generate DR Plan</>}
        </button>
      </div>
      {result && <div className="bg-gray-800 p-6 rounded-xl"><pre className="whitespace-pre-wrap text-sm">{result}</pre></div>}
    </div>
  )
}
export default DrPlanner
