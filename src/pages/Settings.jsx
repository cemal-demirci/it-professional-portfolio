import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon, Key, Zap, Clock, CheckCircle, XCircle,
  Shield, Info, Sparkles, Rocket, CreditCard, Gift, Mail, Copy,
  Trash2, Eye, EyeOff, Lock, Unlock, DollarSign, Send, BarChart3
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import {
  getUserCredits,
  redeemCreditCode,
  CREDIT_PACKAGES,
  sendCreditRequest,
  // Admin functions
  generateCreditCode,
  generateMultipleCodes,
  getGeneratedCodes,
  getCreditRequests,
  deleteGeneratedCode,
  invalidateCode,
  getCodeStatistics,
  clearCreditRequest
} from '../services/creditService'

const Settings = () => {
  // User states
  const [credits, setCredits] = useState(15)
  const [codeInput, setCodeInput] = useState('')
  const [redeemStatus, setRedeemStatus] = useState(null)
  const [requestEmail, setRequestEmail] = useState('')
  const [requestName, setRequestName] = useState('')
  const [requestMessage, setRequestMessage] = useState('')
  const [requestAmount, setRequestAmount] = useState(50)
  const [requestStatus, setRequestStatus] = useState(null)

  // Admin states
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminPass, setShowAdminPass] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [codeCount, setCodeCount] = useState(1)
  const [generatedCodes, setGeneratedCodes] = useState([])
  const [creditRequests, setCreditRequests] = useState([])
  const [stats, setStats] = useState(null)

  // UI states
  const [isVisible, setIsVisible] = useState(false)
  const [copiedCode, setCopiedCode] = useState(null)

  const { language } = useLanguage()
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cemal2026'

  useEffect(() => {
    setIsVisible(true)
    updateCredits()

    // Check if admin is already logged in
    const adminStatus = localStorage.getItem('isAdminLoggedIn')
    if (adminStatus === 'true') {
      setIsAdmin(true)
      loadAdminData()
    }
  }, [])

  const updateCredits = async () => {
    const currentCredits = await getUserCredits()
    setCredits(currentCredits)
  }

  const loadAdminData = async () => {
    const codes = await getGeneratedCodes()
    const requests = await getCreditRequests()
    const statistics = await getCodeStatistics()

    setGeneratedCodes(codes)
    setCreditRequests(requests)
    setStats(statistics)
  }

  const handleRedeemCode = async () => {
    try {
      const result = await redeemCreditCode(codeInput.trim().toUpperCase())

      setRedeemStatus({
        type: 'success',
        message: `${result.amount} credits added! New balance: ${result.newBalance} credits`
      })

      setCodeInput('')
      await updateCredits()

      setTimeout(() => setRedeemStatus(null), 5000)
    } catch (error) {
      setRedeemStatus({
        type: 'error',
        message: error.message
      })
      setTimeout(() => setRedeemStatus(null), 5000)
    }
  }

  const handleCreditRequest = async () => {
    if (!requestEmail || !requestName) {
      setRequestStatus({
        type: 'error',
        message: 'Please fill in your name and email'
      })
      setTimeout(() => setRequestStatus(null), 3000)
      return
    }

    try {
      await sendCreditRequest(requestEmail, requestName, requestMessage, requestAmount)

      setRequestStatus({
        type: 'success',
        message: 'Request sent! We will contact you soon.'
      })

      setRequestEmail('')
      setRequestName('')
      setRequestMessage('')

      setTimeout(() => setRequestStatus(null), 5000)
    } catch (error) {
      setRequestStatus({
        type: 'error',
        message: error.message
      })
      setTimeout(() => setRequestStatus(null), 3000)
    }
  }

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem('isAdminLoggedIn', 'true')
      loadAdminData()
      setAdminPassword('')
    } else {
      alert('Invalid admin password!')
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem('isAdminLoggedIn')
    setAdminPassword('')
  }

  const handleGenerateCodes = async () => {
    try {
      await generateMultipleCodes(selectedAmount, codeCount)
      await loadAdminData()
    } catch (error) {
      console.error('Error generating codes:', error)
      alert('Failed to generate codes: ' + error.message)
    }
  }

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleDeleteCode = async (code) => {
    if (confirm('Delete this code?')) {
      try {
        await deleteGeneratedCode(code)
        await loadAdminData()
      } catch (error) {
        console.error('Error deleting code:', error)
      }
    }
  }

  const handleInvalidateCode = async (code) => {
    if (confirm('Invalidate this code?')) {
      try {
        await invalidateCode(code)
        await loadAdminData()
      } catch (error) {
        console.error('Error invalidating code:', error)
      }
    }
  }

  const handleClearRequest = async (timestamp) => {
    if (confirm('Clear this request?')) {
      try {
        await clearCreditRequest(timestamp)
        await loadAdminData()
      } catch (error) {
        console.error('Error clearing request:', error)
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Header */}
      <div className={`text-center space-y-2 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary-600" />
          {t(language, 'settings.title')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your Cemal AI credits
        </p>
      </div>

      {/* Credit Balance */}
      <div className={`bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 rounded-xl p-6 text-white transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-white/80">Your Credit Balance</p>
              <h2 className="text-4xl font-bold">{credits}</h2>
              <p className="text-xs text-white/70">Credits • 1 credit = 1 AI request</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Status</p>
            <div className="flex items-center gap-2 mt-1">
              {credits > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span className="font-semibold">Depleted</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Code Section */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-cyan-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Redeem Credit Code</h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Have a credit code? Enter it below to add credits to your account.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="CEMAL-50-XXXXXXXX"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white uppercase"
          />
          <button
            onClick={handleRedeemCode}
            disabled={!codeInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            <Zap className="w-5 h-5" />
            Redeem
          </button>
        </div>

        {redeemStatus && (
          <div className={`p-4 rounded-lg border ${
            redeemStatus.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {redeemStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span className="text-sm font-medium">{redeemStatus.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Credit Request Section */}
      <div className={`bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800 space-y-4 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Need More Credits?
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              💬 <strong>Cemal AI says:</strong> Need credits for your AI adventures? Drop me a message! I'll hook you up with a custom code. No corporate BS, just good vibes. ✨
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-600 p-3 mb-4 rounded">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                ⚠️ <strong>Disclaimer:</strong> Cemal AI is Cemal's homelab AI pet project. It can make mistakes (like ChatGPT), but hey, it's not a Kumru either! 🥖 Use with caution and a sense of humor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Credit Package
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {CREDIT_PACKAGES.map(pkg => (
                  <button
                    key={pkg.amount}
                    onClick={() => setRequestAmount(pkg.amount)}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      requestAmount === pkg.amount
                        ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'
                    }`}
                  >
                    {pkg.amount} Credits
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message (optional)
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Tell me why you need credits, or just say hi! 😊"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            <button
              onClick={handleCreditRequest}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Request Credits
            </button>

            {requestStatus && (
              <div className={`mt-4 p-3 rounded-lg border ${
                requestStatus.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  {requestStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span className="text-sm font-medium">{requestStatus.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {!isAdmin ? (
        <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Admin Access</h3>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showAdminPass ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="Admin password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowAdminPass(!showAdminPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleAdminLogin}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 space-y-6 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Unlock className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            </div>
            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Codes</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Used</p>
                <p className="text-2xl font-bold text-green-400">{stats.used}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Unused</p>
                <p className="text-2xl font-bold text-blue-400">{stats.unused}</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Invalid</p>
                <p className="text-2xl font-bold text-red-400">{stats.invalid}</p>
              </div>
            </div>
          )}

          {/* Code Generation */}
          <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Generate Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Credit Amount</label>
                <select
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {CREDIT_PACKAGES.map(pkg => (
                    <option key={pkg.amount} value={pkg.amount}>{pkg.amount} Credits</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Number of Codes</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={codeCount}
                  onChange={(e) => setCodeCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateCodes}
                  className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-semibold"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Generated Codes List */}
          <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Generated Codes ({generatedCodes.length})</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {generatedCodes.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No codes generated yet</p>
              ) : (
                generatedCodes.map((codeObj, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      codeObj.usedAt
                        ? 'bg-green-900/20 border-green-800'
                        : !codeObj.isValid
                        ? 'bg-red-900/20 border-red-800'
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-white font-mono text-sm">{codeObj.code}</code>
                        {codeObj.usedAt && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">USED</span>}
                        {!codeObj.isValid && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">INVALID</span>}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {codeObj.amount} credits • Created: {new Date(codeObj.createdAt).toLocaleString()}
                        {codeObj.usedAt && ` • Used: ${new Date(codeObj.usedAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyCode(codeObj.code)}
                        className="p-2 hover:bg-slate-600 rounded transition-colors"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                      {!codeObj.usedAt && codeObj.isValid && (
                        <button
                          onClick={() => handleInvalidateCode(codeObj.code)}
                          className="p-2 hover:bg-red-600 rounded transition-colors"
                          title="Invalidate"
                        >
                          <XCircle className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCode(codeObj.code)}
                        className="p-2 hover:bg-red-600 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Credit Requests */}
          <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Credit Requests ({creditRequests.length})</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {creditRequests.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No requests yet</p>
              ) : (
                creditRequests.map((req, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{req.name}</p>
                        <p className="text-sm text-slate-400">{req.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-cyan-600 text-white text-xs rounded-full font-semibold">
                          {req.requestedAmount} credits
                        </span>
                        <button
                          onClick={() => handleClearRequest(req.timestamp)}
                          className="p-1 hover:bg-red-600 rounded transition-colors"
                          title="Clear request"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    {req.message && (
                      <p className="text-sm text-slate-300 mb-2 p-2 bg-slate-800/50 rounded">
                        "{req.message}"
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      {new Date(req.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tech Stack - Under the Hood */}
      <div className={`bg-slate-900 dark:bg-slate-950 rounded-xl p-5 border border-slate-700 dark:border-slate-600 space-y-4 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-bold text-slate-200">
            Built With Modern Tech
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {/* Frontend */}
          <div className="p-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="text-slate-300 font-semibold mb-2">Frontend Stack</div>
            <ul className="text-gray-300 space-y-1">
              <li>• React 18 + Vite (Lightning fast HMR)</li>
              <li>• Tailwind CSS v3 (JIT compiler)</li>
              <li>• Lucide Icons (Tree-shakeable)</li>
              <li>• React Router v6 (Client-side routing)</li>
            </ul>
          </div>

          {/* AI & Credits */}
          <div className="p-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="text-slate-300 font-semibold mb-2">Intelligence</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Cemal AI Engine (Custom built)</li>
              <li>• Credit-based rate limiting</li>
              <li>• Real-time streaming responses</li>
              <li>• 30K character context window</li>
            </ul>
          </div>

          {/* Backend & Database */}
          <div className="p-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="text-slate-300 font-semibold mb-2">Backend & Database</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Redis Cloud (Frankfurt - EU West 3)</li>
              <li>• ioredis (High-performance client)</li>
              <li>• Vercel Serverless Functions</li>
              <li>• RESTful API architecture</li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="p-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="text-slate-300 font-semibold mb-2">Deployment & CDN</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Vercel Edge Network (Global CDN)</li>
              <li>• Auto SSL/TLS (Let's Encrypt)</li>
              <li>• GitHub CI/CD integration</li>
              <li>• Zero-downtime deployments</li>
            </ul>
          </div>

          {/* Tools & Libraries */}
          <div className="p-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="text-slate-300 font-semibold mb-2">Tools & Libraries</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Tesseract.js (OCR engine)</li>
              <li>• pdf.js (Mozilla's PDF renderer)</li>
              <li>• html2canvas (Screenshot utility)</li>
              <li>• DOMPurify (XSS protection)</li>
            </ul>
          </div>

          {/* Security & Performance */}
          <div className="p-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="text-slate-300 font-semibold mb-2">Security & Performance</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Environment variable encryption</li>
              <li>• CORS & CSP headers configured</li>
              <li>• Code splitting & lazy loading</li>
              <li>• Optimized production builds</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-300 font-semibold">Open Source Repository</div>
              <div className="text-slate-400 text-xs mt-1">Built with passion, powered by RedBull 🔋</div>
            </div>
            <a
              href="https://github.com/cemal-demirci"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>

      {copiedCode && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce-subtle">
          <CheckCircle className="w-5 h-5" />
          Code copied!
        </div>
      )}
    </div>
  )
}

export default Settings
