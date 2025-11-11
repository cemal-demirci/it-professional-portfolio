import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

const JsonFormatter = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError('')
    } catch (err) {
      setError('Geçersiz JSON formatı: ' + err.message)
      setOutput('')
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
    } catch (err) {
      setError('Geçersiz JSON formatı: ' + err.message)
      setOutput('')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className={`text-center space-y-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-3xl font-bold text-white">JSON Formatter</h1>
        <p className="text-gray-400">JSON verilerinizi formatla, doğrula ve küçült</p>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        {/* Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">JSON Giriş</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "Cemal", "age": 25}'
            className="textarea-field"
          />
          <div className="flex gap-2">
            <button onClick={formatJson} className="btn-primary flex-1">
              Formatla
            </button>
            <button onClick={minifyJson} className="btn-secondary flex-1">
              Küçült
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Sonuç</label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Kopyala
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatlanmış JSON burada görünecek..."
            className="textarea-field bg-gray-50"
          />
        </div>
      </div>

      {error && (
        <div className={`bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {error}
        </div>
      )}

      <div className={`bg-blue-900/20 border border-blue-800 rounded-lg p-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
        <h3 className="font-semibold text-blue-300 mb-2">Kullanım İpuçları</h3>
        <ul className="text-sm text-blue-300 space-y-1 list-disc list-inside">
          <li>JSON verinizi sol tarafa yapıştırın</li>
          <li>"Formatla" butonuna basarak okunabilir hale getirin</li>
          <li>"Küçült" butonuna basarak boyutunu azaltın</li>
          <li>Tüm işlemler tarayıcınızda gerçekleşir, verileriniz güvende</li>
        </ul>
      </div>
    </div>
  )
}

export default JsonFormatter
