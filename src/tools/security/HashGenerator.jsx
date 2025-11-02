import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import CryptoJS from 'crypto-js'

const HashGenerator = () => {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState({})
  const [copied, setCopied] = useState('')

  const generateHashes = () => {
    if (!input) return

    setHashes({
      md5: CryptoJS.MD5(input).toString(),
      sha1: CryptoJS.SHA1(input).toString(),
      sha256: CryptoJS.SHA256(input).toString(),
      sha512: CryptoJS.SHA512(input).toString(),
    })
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const hashTypes = [
    { name: 'MD5', key: 'md5', description: '128-bit hash (güvenli değil, sadece checksum için)' },
    { name: 'SHA-1', key: 'sha1', description: '160-bit hash (eski, önerilmez)' },
    { name: 'SHA-256', key: 'sha256', description: '256-bit hash (önerilen)' },
    { name: 'SHA-512', key: 'sha512', description: '512-bit hash (çok güvenli)' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Hash Generator</h1>
        <p className="text-gray-600">Metinler için hash değerleri oluşturun</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        {/* Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Metin Giriş</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hash'lenecek metni buraya girin..."
            className="textarea-field"
          />
          <button onClick={generateHashes} className="btn-primary w-full">
            Hash Oluştur
          </button>
        </div>

        {/* Hash Results */}
        {Object.keys(hashes).length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-gray-900">Hash Sonuçları</h3>
            {hashTypes.map((type) => (
              <div key={type.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{type.name}</h4>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                    {hashes[type.key]}
                  </code>
                  <button
                    onClick={() => copyToClipboard(hashes[type.key], type.key)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copied === type.key ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">Güvenlik Uyarısı</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>MD5 ve SHA-1 artık güvenli kabul edilmez</li>
          <li>Şifre saklama için hash kullanmayın, bcrypt/scrypt kullanın</li>
          <li>SHA-256 ve SHA-512 modern uygulamalar için önerilir</li>
          <li>Hassas veriler için salt eklemeyi unutmayın</li>
        </ul>
      </div>
    </div>
  )
}

export default HashGenerator
