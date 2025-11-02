import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

const PasswordGenerator = () => {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  })
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const generatePassword = () => {
    let charset = ''
    if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (options.numbers) charset += '0123456789'
    if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (charset === '') {
      alert('En az bir karakter tipi seçmelisiniz!')
      return
    }

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPassword(newPassword)
    calculateStrength(newPassword)
  }

  const calculateStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    setStrength(Math.min(score, 5))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStrengthColor = () => {
    if (strength <= 2) return 'text-red-600 bg-red-100'
    if (strength <= 4) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getStrengthText = () => {
    if (strength <= 2) return 'Zayıf'
    if (strength <= 4) return 'Orta'
    return 'Güçlü'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`text-center space-y-2 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Şifre Üretici</h1>
        <p className="text-gray-600 dark:text-gray-400">Güçlü ve güvenli şifreler oluşturun</p>
      </div>

      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        {/* Generated Password Display */}
        {password && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <span className="font-mono text-lg font-semibold text-gray-900 break-all">
                {password}
              </span>
              <button
                onClick={copyToClipboard}
                className="ml-4 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStrengthColor()}`}>
              Güvenlik: {getStrengthText()}
            </div>
          </div>
        )}

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">Şifre Uzunluğu</label>
            <span className="text-sm font-semibold text-primary-600">{length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Karakter Tipleri</label>
          <div className="space-y-2">
            {[
              { key: 'uppercase', label: 'Büyük Harfler (A-Z)' },
              { key: 'lowercase', label: 'Küçük Harfler (a-z)' },
              { key: 'numbers', label: 'Sayılar (0-9)' },
              { key: 'symbols', label: 'Semboller (!@#$%...)' }
            ].map((option) => (
              <label key={option.key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[option.key]}
                  onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={generatePassword} className="btn-primary w-full flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Şifre Oluştur
        </button>
      </div>

      <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Güvenlik İpuçları</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>En az 12-16 karakter uzunluğunda şifre kullanın</li>
          <li>Farklı hesaplar için farklı şifreler kullanın</li>
          <li>Şifrelerinizi bir şifre yöneticisinde saklayın</li>
          <li>Mümkün olduğunda 2FA (iki faktörlü kimlik doğrulama) kullanın</li>
        </ul>
      </div>
    </div>
  )
}

export default PasswordGenerator
