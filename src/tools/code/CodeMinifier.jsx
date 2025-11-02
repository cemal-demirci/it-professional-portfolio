import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const CodeMinifier = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [codeType, setCodeType] = useState('javascript')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({ before: 0, after: 0, saved: 0 })

  const minifyCode = () => {
    let minified = ''

    switch (codeType) {
      case 'javascript':
        // Basic JS minification
        minified = input
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
          .replace(/\/\/.*/g, '') // Remove single-line comments
          .replace(/\s+/g, ' ') // Replace multiple spaces with one
          .replace(/\s*([{};,:])\s*/g, '$1') // Remove spaces around operators
          .trim()
        break

      case 'css':
        // Basic CSS minification
        minified = input
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Replace multiple spaces
          .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Remove spaces around CSS characters
          .replace(/;\}/g, '}') // Remove last semicolon
          .trim()
        break

      case 'html':
        // Basic HTML minification
        minified = input
          .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
          .replace(/\s+/g, ' ') // Replace multiple spaces
          .replace(/>\s+</g, '><') // Remove spaces between tags
          .trim()
        break

      default:
        minified = input
    }

    setOutput(minified)

    // Calculate stats
    const before = input.length
    const after = minified.length
    const saved = before > 0 ? ((before - after) / before * 100).toFixed(2) : 0

    setStats({ before, after, saved })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Code Minifier</h1>
        <p className="text-gray-600">JavaScript, CSS ve HTML kodunuzu küçültün</p>
      </div>

      {/* Code Type Selection */}
      <div className="flex justify-center gap-2">
        {['javascript', 'css', 'html'].map((type) => (
          <button
            key={type}
            onClick={() => setCodeType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              codeType === type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Kod Giriş ({codeType.toUpperCase()})
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`${codeType.toUpperCase()} kodunuzu buraya yapıştırın...`}
            className="textarea-field"
          />
          <button onClick={minifyCode} className="btn-primary w-full">
            Küçült
          </button>
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
            placeholder="Küçültülmüş kod burada görünecek..."
            className="textarea-field bg-gray-50"
          />
        </div>
      </div>

      {/* Stats */}
      {output && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">İstatistikler</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-green-700">Önceki boyut:</span>
              <span className="ml-2 font-bold text-green-900">{stats.before} karakter</span>
            </div>
            <div>
              <span className="text-green-700">Yeni boyut:</span>
              <span className="ml-2 font-bold text-green-900">{stats.after} karakter</span>
            </div>
            <div>
              <span className="text-green-700">Tasarruf:</span>
              <span className="ml-2 font-bold text-green-900">{stats.saved}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Önemli Not</h3>
        <p className="text-sm text-blue-800">
          Bu araç temel minification sağlar. Production kullanımı için UglifyJS, Terser (JS),
          cssnano (CSS) veya html-minifier gibi profesyonel araçları kullanmanız önerilir.
        </p>
      </div>
    </div>
  )
}

export default CodeMinifier
