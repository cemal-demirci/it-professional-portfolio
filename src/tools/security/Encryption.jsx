import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import CryptoJS from 'crypto-js'

const Encryption = () => {
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encrypt')

  const encrypt = () => {
    if (!input || !password) {
      alert('Lütfen metin ve şifre girin!')
      return
    }
    const encrypted = CryptoJS.AES.encrypt(input, password).toString()
    setOutput(encrypted)
  }

  const decrypt = () => {
    if (!input || !password) {
      alert('Lütfen şifreli metin ve şifre girin!')
      return
    }
    try {
      const decrypted = CryptoJS.AES.decrypt(input, password).toString(CryptoJS.enc.Utf8)
      if (!decrypted) {
        setOutput('Hata: Yanlış şifre veya bozuk veri!')
      } else {
        setOutput(decrypted)
      }
    } catch (err) {
      setOutput('Hata: Çözme işlemi başarısız!')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Şifreleme Aracı</h1>
        <p className="text-gray-600">AES-256 ile metinlerinizi şifreleyin veya çözün</p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setMode('encrypt')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            mode === 'encrypt'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Lock className="w-5 h-5" />
          Şifrele
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            mode === 'decrypt'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Unlock className="w-5 h-5" />
          Çöz
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Güçlü bir şifre girin..."
            className="input-field"
          />
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {mode === 'encrypt' ? 'Şifrelenecek Metin' : 'Şifreli Metin'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encrypt' ? 'Şifrelenecek metni girin...' : 'Şifreli metni girin...'}
            className="textarea-field"
          />
        </div>

        <button
          onClick={mode === 'encrypt' ? encrypt : decrypt}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {mode === 'encrypt' ? (
            <>
              <Lock className="w-5 h-5" />
              Şifrele
            </>
          ) : (
            <>
              <Unlock className="w-5 h-5" />
              Şifreyi Çöz
            </>
          )}
        </button>

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sonuç</label>
            <textarea
              value={output}
              readOnly
              className="textarea-field bg-gray-50"
            />
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Nasıl Çalışır?</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>AES-256 algoritması kullanılır (military-grade encryption)</li>
          <li>Tüm işlemler tarayıcınızda gerçekleşir, veriler sunucuya gönderilmez</li>
          <li>Şifrenizi kaybederseniz veriyi geri alamazsınız!</li>
          <li>Güçlü ve hatırlanabilir bir şifre kullanın</li>
        </ul>
      </div>
    </div>
  )
}

export default Encryption
