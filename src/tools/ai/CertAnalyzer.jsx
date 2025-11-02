import { useState } from 'react'
import { Brain, Shield, Loader, AlertCircle } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const CertAnalyzer = () => {
  const [cert, setCert] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!cert.trim()) return
    setAnalyzing(true)
    setError('')
    try {
      const analysis = await analyzeWithGemini(
        `Analyze this certificate:\n${cert}`,
        'You are a PKI and SSL/TLS expert. Analyze certificates for security issues, expiration, and best practices.'
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
        <Shield className="w-8 h-8 text-purple-600" />
        AI Certificate Analyzer
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border space-y-4">
        <textarea
          value={cert}
          onChange={(e) => setCert(e.target.value)}
          placeholder="Paste certificate (PEM format) or certificate info..."
          className="textarea-field min-h-[300px] font-mono text-sm dark:bg-gray-700"
        />
        <button onClick={analyze} disabled={analyzing} className="btn-primary w-full">
          {analyzing ? <><Loader className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Brain className="w-5 h-5" /> Analyze Certificate</>}
        </button>
      </div>
      {error && <div className="bg-red-50 p-4 rounded-lg"><AlertCircle className="inline w-5 h-5" /> {error}</div>}
      {result && <div className="bg-white dark:bg-gray-800 p-6 rounded-xl"><pre className="whitespace-pre-wrap text-sm">{result}</pre></div>}
    </div>
  )
}
export default CertAnalyzer
