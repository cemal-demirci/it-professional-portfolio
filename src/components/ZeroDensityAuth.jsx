import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

const ZeroDensityAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('zdAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()

    // Get password from localStorage (set by admin)
    const storedPassword = localStorage.getItem('zdPassword') || 'zerodensity2024'

    if (password === storedPassword) {
      sessionStorage.setItem('zdAuth', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Yanlış şifre! 🔒')
      setPassword('')
    }
  }

  if (isAuthenticated) {
    return children
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Zero Density
          </h1>
          <p className="text-gray-400">
            Internal Tools - Authorized Access Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-12"
                placeholder="Enter password..."
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
          >
            Access Zero Density Tools
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>For IT & Broadcast Engineering Team</p>
          <p className="mt-1">Contact admin for access</p>
        </div>
      </div>
    </div>
  )
}

export default ZeroDensityAuth
