import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

const UuidGenerator = () => {
  const [uuids, setUuids] = useState([])
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState(-1)

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const generateUUIDs = () => {
    const newUuids = []
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUID())
    }
    setUuids(newUuids)
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(-1), 2000)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
    setCopied(-2)
    setTimeout(() => setCopied(-1), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">UUID Generator</h1>
        <p className="text-gray-600">Benzersiz tanımlayıcı (UUID v4) oluşturun</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Adet</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <button onClick={generateUUIDs} className="btn-primary flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Oluştur
            </button>
          </div>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Oluşturulan UUID'ler</h3>
              {uuids.length > 1 && (
                <button
                  onClick={copyAll}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  {copied === -2 ? (
                    <>
                      <Check className="w-4 h-4" />
                      Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Tümünü Kopyala
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <code className="flex-1 text-sm font-mono text-gray-900">{uuid}</code>
                  <button
                    onClick={() => copyToClipboard(uuid, index)}
                    className="ml-3 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {copied === index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">UUID v4 Hakkında</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>128-bit benzersiz tanımlayıcı</li>
          <li>Rastgele üretilir (Version 4)</li>
          <li>Veritabanı primary key'leri için ideal</li>
          <li>Çakışma olasılığı son derece düşük</li>
          <li>Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</li>
        </ul>
      </div>
    </div>
  )
}

export default UuidGenerator
