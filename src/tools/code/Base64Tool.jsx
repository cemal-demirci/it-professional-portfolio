import { useState } from 'react'
import { Copy, Check, ArrowDown, ArrowUp } from 'lucide-react'

const Base64Tool = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const encode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)))
      setOutput(encoded)
    } catch (err) {
      setOutput('Kodlama hatası: ' + err.message)
    }
  }

  const decode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)))
      setOutput(decoded)
    } catch (err) {
      setOutput('Çözme hatası: Geçersiz Base64 verisi')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Base64 Encoder/Decoder</h1>
        <p className="text-gray-600">Metinlerinizi Base64 formatına kodlayın veya çözün</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Giriş</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Kodlanacak veya çözülecek metni buraya girin..."
            className="textarea-field"
          />
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={encode} className="btn-primary flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            Base64'e Kodla
          </button>
          <button onClick={decode} className="btn-secondary flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            Base64'ten Çöz
          </button>
        </div>

        {output && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Sonuç</label>
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
            </div>
            <textarea
              value={output}
              readOnly
              className="textarea-field bg-gray-50"
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Base64 Nedir?</h3>
        <p className="text-sm text-blue-800">
          Base64, binary verinin ASCII string formatına dönüştürülmesi için kullanılan bir kodlama yöntemidir.
          Email eklerinde, veri URL'lerinde ve web geliştirmede yaygın olarak kullanılır.
        </p>
      </div>
    </div>
  )
}

export default Base64Tool
