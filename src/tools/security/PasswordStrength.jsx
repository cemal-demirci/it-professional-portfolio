import { useState } from 'react'
import { Shield, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const PasswordStrength = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, level: 'None', color: 'gray', percentage: 0 }

    let score = 0
    const checks = {
      length: pwd.length >= 8,
      longLength: pwd.length >= 12,
      veryLongLength: pwd.length >= 16,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
      noCommonPatterns: !/(123|abc|qwerty|password|admin)/i.test(pwd)
    }

    // Calculate score
    if (checks.length) score += 10
    if (checks.longLength) score += 10
    if (checks.veryLongLength) score += 10
    if (checks.lowercase) score += 10
    if (checks.uppercase) score += 15
    if (checks.numbers) score += 15
    if (checks.symbols) score += 20
    if (checks.noCommonPatterns) score += 10

    // Determine strength level
    let level = 'Very Weak'
    let color = 'red'

    if (score >= 80) {
      level = 'Very Strong'
      color = 'green'
    } else if (score >= 60) {
      level = 'Strong'
      color = 'blue'
    } else if (score >= 40) {
      level = 'Medium'
      color = 'yellow'
    } else if (score >= 20) {
      level = 'Weak'
      color = 'orange'
    }

    return { score, level, color, percentage: score, checks }
  }

  const strength = calculateStrength(password)

  const getColorClasses = (color) => {
    const colors = {
      gray: 'text-gray-400 bg-gray-700',
      red: 'text-red-400 bg-red-900/30',
      orange: 'text-orange-400 bg-orange-900/30',
      yellow: 'text-yellow-400 bg-yellow-900/30',
      blue: 'text-blue-400 bg-blue-900/30',
      green: 'text-green-400 bg-green-900/30'
    }
    return colors[color] || colors.gray
  }

  const getBarColor = (color) => {
    const colors = {
      gray: 'bg-gray-400',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500'
    }
    return colors[color] || colors.gray
  }

  const checklistItems = strength.checks ? [
    { label: 'At least 8 characters', passed: strength.checks.length },
    { label: 'Contains lowercase letters', passed: strength.checks.lowercase },
    { label: 'Contains uppercase letters', passed: strength.checks.uppercase },
    { label: 'Contains numbers', passed: strength.checks.numbers },
    { label: 'Contains special characters', passed: strength.checks.symbols },
    { label: 'No common patterns', passed: strength.checks.noCommonPatterns },
    { label: '12+ characters (recommended)', passed: strength.checks.longLength },
    { label: '16+ characters (best)', passed: strength.checks.veryLongLength }
  ] : []

  const estimateTimeToCrack = (pwd) => {
    if (!pwd) return 'N/A'

    const charsetSize =
      (/[a-z]/.test(pwd) ? 26 : 0) +
      (/[A-Z]/.test(pwd) ? 26 : 0) +
      (/\d/.test(pwd) ? 10 : 0) +
      (/[!@#$%^&*(),.?":{}|<>]/.test(pwd) ? 32 : 0)

    const combinations = Math.pow(charsetSize, pwd.length)
    const guessesPerSecond = 1000000000 // 1 billion guesses/second (modern hardware)
    const seconds = combinations / guessesPerSecond

    if (seconds < 1) return 'Instant'
    if (seconds < 60) return `${Math.round(seconds)} seconds`
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
    if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`
    return 'Centuries'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Shield className="w-8 h-8" />
          Password Strength Checker
        </h1>
        <p className="text-gray-400">
          Test your password strength and get recommendations
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-6">
        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Enter Password to Test
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password here..."
              className="input-field pr-12 bg-gray-700 border-gray-600 text-white w-full"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Your password is never sent to any server. All analysis happens in your browser.
          </p>
        </div>

        {/* Strength Indicator */}
        {password && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${getColorClasses(strength.color)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Password Strength:</span>
                <span className="text-xl font-bold">{strength.level}</span>
              </div>
              <div className="w-full bg-gray-200 bg-gray-700 rounded-full h-3">
                <div
                  className={`${getBarColor(strength.color)} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${strength.percentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Score: {strength.score}/100</span>
                <span>Time to crack: {estimateTimeToCrack(password)}</span>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <h3 className="font-semibold text-white mb-3">Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {checklistItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded ${
                      item.passed
                        ? 'text-green-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {item.passed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {strength.score < 80 && (
              <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm text-blue-300">
                    <div className="font-semibold">Tips to improve your password:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {!strength.checks.longLength && <li>Make it at least 12 characters long</li>}
                      {!strength.checks.uppercase && <li>Add uppercase letters (A-Z)</li>}
                      {!strength.checks.numbers && <li>Include numbers (0-9)</li>}
                      {!strength.checks.symbols && <li>Use special characters (!@#$%^&*)</li>}
                      {!strength.checks.noCommonPatterns && <li>Avoid common words and patterns</li>}
                      <li>Consider using a passphrase with random words</li>
                      <li>Use a unique password for each account</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold text-white mb-3">Password Security Tips</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            <strong className="text-white">Length matters:</strong> Longer passwords are exponentially harder to crack.
          </p>
          <p>
            <strong className="text-white">Use passphrases:</strong> Combine 4-5 random words (e.g., "correct-horse-battery-staple").
          </p>
          <p>
            <strong className="text-white">Avoid personal info:</strong> Don't use names, birthdates, or common words.
          </p>
          <p>
            <strong className="text-white">Use a password manager:</strong> Let software generate and store complex passwords.
          </p>
          <p>
            <strong className="text-white">Enable 2FA:</strong> Two-factor authentication adds an extra layer of security.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PasswordStrength
