import { useState } from 'react'
import { Brain, FileText, Loader, AlertCircle } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const EventCorrelator = () => {
  const [events, setEvents] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!events.trim()) return
    setAnalyzing(true)
    setError('')
    try {
      const analysis = await analyzeWithGemini(
        `Analyze and correlate these events:\n${events}`,
        'You are an expert at correlating Windows Event Logs. Find patterns, security threats, and related events.'
      )
      setResult(analysis)
    } catch (err) {
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
        <FileText className="w-8 h-8 text-purple-600" />
        AI Event Log Correlator
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border space-y-4">
        <textarea
          value={events}
          onChange={(e) => setEvents(e.target.value)}
          placeholder="Paste multiple event log entries..."
          className="textarea-field min-h-[300px] font-mono text-sm dark:bg-gray-700"
        />
        <button onClick={analyze} disabled={analyzing} className="btn-primary w-full">
          {analyzing ? <><Loader className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Correlate Events</>}
        </button>
      </div>
      {error && <div className="bg-red-50 p-4 rounded-lg"><AlertCircle className="inline w-5 h-5" /> {error}</div>}
      {result && <div className="bg-white dark:bg-gray-800 p-6 rounded-xl"><pre className="whitespace-pre-wrap text-sm">{result}</pre></div>}
    </div>
  )
}
export default EventCorrelator
