import { useState, useEffect } from 'react'
import {
  Settings as SettingsIcon, Key, Zap, Clock, CheckCircle, XCircle,
  Shield, Info, Sparkles, Rocket, CreditCard, Gift, Mail, Copy,
  Trash2, Eye, EyeOff, Lock, Unlock, DollarSign, Send, BarChart3, Crown, Infinity,
  Ghost, PartyPopper
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useRainbow } from '../contexts/RainbowContext'
import { t } from '../translations'
import { useGodMode } from '../contexts/GodModeContext'
import RainbowModeToolBlocker from '../components/RainbowModeToolBlocker'
import EasterEggs from '../components/EasterEggs'
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
  const { godMode } = useGodMode()
  const { rainbowMode } = useRainbow()

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
  const [showEasterEggs, setShowEasterEggs] = useState(true) // Show Easter Eggs by default
  const [easterEggInput, setEasterEggInput] = useState('')
  const [easterEggMessage, setEasterEggMessage] = useState(null)

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

  const handleEasterEggSubmit = (e) => {
    e.preventDefault()
    const code = easterEggInput.toLowerCase().trim()

    if (!code) return

    // Create keyboard events for the easter egg codes
    const simulateKeyPress = (keys) => {
      keys.forEach(key => {
        const event = new KeyboardEvent('keydown', { key })
        window.dispatchEvent(event)
      })
    }

    // Easter egg code mappings
    const easterEggCodes = {
      'konami': ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'c', 'd'],
      'party': ['p', 'a', 'r', 't', 'y'],
      'rainbow': ['r', 'a', 'i', 'n', 'b', 'o', 'w'],
      'gay': ['g', 'a', 'y'],
      'gey': ['g', 'e', 'y'],
      'retro': ['r', 'e', 't', 'r', 'o'],
      'dev': ['d', 'e', 'v'],
      'cxmxl': ['c', 'x', 'm', 'x', 'l'],
      'terminal': ['t', 'e', 'r', 'm', 'i', 'n', 'a', 'l'],
      'pervo': ['p', 'e', 'r', 'v', 'o']
    }

    if (easterEggCodes[code]) {
      simulateKeyPress(easterEggCodes[code])

      const messages = {
        'konami': '🎮 Fighting Game + Matrix Rain Activated!',
        'party': '🎉 Party Mode ON!',
        'rainbow': '🌈 Rainbow Mode Activated!',
        'gay': '🌈 Fabulous Mode!',
        'gey': '🌈 Fabulous Mode!',
        'retro': '💾 Retro Mode: Welcome to the 90s!',
        'dev': '👨‍💻 Developer Console Opened!',
        'cxmxl': '🔱 GOD MODE ACTIVATED!',
        'terminal': '💻 Terminal Access Granted!',
        'pervo': '💖 Love Letter Unlocked!'
      }

      setEasterEggMessage({ type: 'success', text: messages[code] || '✨ Easter Egg Activated!' })
      setEasterEggInput('')

      setTimeout(() => setEasterEggMessage(null), 3000)
    } else {
      setEasterEggMessage({ type: 'error', text: t(language, 'settings.easterEggs.unknownCode') })
      setTimeout(() => setEasterEggMessage(null), 3000)
    }
  }

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
        message: result.unlimited
          ? t(language, 'settings.redeemCode.unlimitedActivated')
          : `${result.amount} ${t(language, 'settings.redeemCode.creditsAdded')} ${result.newBalance} ${t(language, 'settings.redeemCode.creditsBalance')}`
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
        message: t(language, 'settings.creditRequest.fillNameEmail')
      })
      setTimeout(() => setRequestStatus(null), 3000)
      return
    }

    try {
      await sendCreditRequest(requestEmail, requestName, requestMessage, requestAmount)

      setRequestStatus({
        type: 'success',
        message: t(language, 'settings.creditRequest.requestSent')
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
      alert(t(language, 'settings.admin.invalidPassword'))
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
    if (confirm(t(language, 'settings.admin.generatedCodes.deleteConfirm'))) {
      try {
        await deleteGeneratedCode(code)
        await loadAdminData()
      } catch (error) {
        console.error('Error deleting code:', error)
      }
    }
  }

  const handleInvalidateCode = async (code) => {
    if (confirm(t(language, 'settings.admin.generatedCodes.invalidateConfirm'))) {
      try {
        await invalidateCode(code)
        await loadAdminData()
      } catch (error) {
        console.error('Error invalidating code:', error)
      }
    }
  }

  const handleClearRequest = async (timestamp) => {
    if (confirm(t(language, 'settings.admin.creditRequests.clearConfirm'))) {
      try {
        await clearCreditRequest(timestamp)
        await loadAdminData()
      } catch (error) {
        console.error('Error clearing request:', error)
      }
    }
  }

  // Rainbow Mode: Block Settings page
  if (rainbowMode) {
    return <RainbowModeToolBlocker />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Background Particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Easter Eggs - Only shown when activated */}
      {showEasterEggs && <EasterEggs />}
      {/* God Mode Banner */}
      {godMode && (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transition-all">
          <div className="flex items-center justify-center gap-4 text-white">
            <Crown className="w-12 h-12" />
            <div className="text-center">
              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>🔱 {t(language, 'settings.godModeActive')} 🔱</h2>
              <p className="text-xl font-bold mb-1 text-blue-50">{t(language, 'settings.godModeMessage')}</p>
              <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
                <span className="flex items-center gap-1">
                  <Infinity className="w-4 h-4" />
                  {t(language, 'settings.unlimitedAI')}
                </span>
                <span className="flex items-center gap-1">
                  <Infinity className="w-4 h-4" />
                  {t(language, 'settings.unlimitedFileShare')}
                </span>
                <span className="flex items-center gap-1">
                  <Infinity className="w-4 h-4" />
                  {t(language, 'settings.unlimitedRemote')}
                </span>
              </div>
            </div>
            <Sparkles className="w-12 h-12" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`text-center space-y-2 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent flex items-center justify-center gap-2" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          <SettingsIcon className="w-8 h-8 text-blue-400" />
          {t(language, 'settings.title')}
        </h1>
        <p className="text-sm text-blue-200/70">
          {godMode ? t(language, 'settings.godModeSubtitle') : t(language, 'settings.manageCredits')}
        </p>

        {/* Hidden Features Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowEasterEggs(!showEasterEggs)}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-all duration-500 blur-xl"></div>
            <div className="relative flex items-center gap-2">
              {showEasterEggs ? (
                <>
                  <Ghost className="w-5 h-5" />
                  <span>{t(language, 'settings.easterEggs.hideSecretFeatures')}</span>
                  <Ghost className="w-5 h-5" />
                </>
              ) : (
                <>
                  <PartyPopper className="w-5 h-5" />
                  <span>{t(language, 'settings.easterEggs.unlockHiddenFeatures')}</span>
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Easter Egg Terminal - Mobile Friendly */}
      {showEasterEggs && (
        <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '150ms' }}>
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Ghost className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent flex items-center gap-2" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {t(language, 'settings.easterEggs.terminalTitle')}
                <Sparkles className="w-5 h-5 text-blue-400" />
              </h3>
              <p className="text-sm text-blue-200/70">{t(language, 'settings.easterEggs.terminalSubtitle')}</p>
            </div>
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleEasterEggSubmit} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-blue-400 font-mono text-sm">$</span>
              </div>
              <input
                type="text"
                value={easterEggInput}
                onChange={(e) => setEasterEggInput(e.target.value)}
                placeholder={t(language, 'settings.easterEggs.enterCode')}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!easterEggInput.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>{t(language, 'settings.easterEggs.executeCode')}</span>
            </button>
          </form>

          {/* Message Display */}
          {easterEggMessage && (
            <div className={`p-4 rounded-xl border ${
              easterEggMessage.type === 'success'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            } animate-slide-down transition-all`}>
              <p className="font-bold text-center">{easterEggMessage.text}</p>
            </div>
          )}

          {/* Secret Hints - No codes shown! */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t(language, 'settings.easterEggs.secretCodes')}
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-2xl">🎮</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.classicGamer')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.classicGamerHint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🌈</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.colorfulJourney')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.colorfulJourneyHint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🔱</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.ultimatePower')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.ultimatePowerHint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">💾</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.backToThePast')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.backToThePastHint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.celebrationTime')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.celebrationTimeHint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">💻</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.commandLine')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.commandLineHint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">👨‍💻</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.codersParadise')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.codersParadiseHint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">💖</span>
                <div>
                  <p className="text-gray-300 font-semibold">{t(language, 'settings.easterEggs.romanticSecret')}</p>
                  <p className="text-gray-500 text-[10px]">{t(language, 'settings.easterEggs.romanticSecretHint')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 transition-all">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300">
              {t(language, 'settings.easterEggs.proTip')}
            </p>
          </div>
        </div>
      )}

      {/* Credit Balance - Simplified */}
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 text-white transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 md:w-7 md:h-7 text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-blue-200/70">{t(language, 'settings.creditBalance.title')}</p>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2 bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent truncate" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {godMode ? (
                  <>
                    <Infinity className="w-6 h-6 md:w-8 md:h-8 text-blue-300 flex-shrink-0" />
                    <span className="truncate">{t(language, 'settings.creditBalance.unlimited')}</span>
                  </>
                ) : (
                  credits
                )}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            {godMode || credits > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-400 flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base text-blue-100 whitespace-nowrap">{godMode ? t(language, 'settings.creditBalance.godMode') : t(language, 'settings.creditBalance.active')}</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0" />
                <span className="font-semibold text-sm md:text-base text-red-300 whitespace-nowrap">{t(language, 'settings.creditBalance.depleted')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Redeem Code Section - Simplified */}
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 space-y-3 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>{t(language, 'settings.redeemCode.title')}</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder={t(language, 'settings.redeemCode.placeholder')}
            className="flex-1 px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 bg-white/5 text-white uppercase transition-all text-sm placeholder-gray-500"
          />
          <button
            onClick={handleRedeemCode}
            disabled={!codeInput.trim()}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-sm whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            {t(language, 'settings.redeemCode.button')}
          </button>
        </div>

        {redeemStatus && (
          <div className={`p-3 rounded-xl border ${
            redeemStatus.type === 'success'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          } transition-all`}>
            <div className="flex items-center gap-2">
              {redeemStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span className="text-xs font-medium">{redeemStatus.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Credit Request Section - Simplified */}
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 space-y-3 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {t(language, 'settings.creditRequest.title')}
          </h2>
        </div>
        <p className="text-sm text-blue-200/70">
          {t(language, 'settings.creditRequest.aiMessage')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            placeholder={t(language, 'settings.creditRequest.yourName') + ' *'}
            className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 bg-white/5 text-white placeholder-gray-500 transition-all text-sm"
          />
          <input
            type="email"
            value={requestEmail}
            onChange={(e) => setRequestEmail(e.target.value)}
            placeholder={t(language, 'settings.creditRequest.yourEmail') + ' *'}
            className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 bg-white/5 text-white placeholder-gray-500 transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CREDIT_PACKAGES.map(pkg => (
            <button
              key={pkg.amount}
              onClick={() => setRequestAmount(pkg.amount)}
              className={`p-2.5 rounded-xl border font-semibold transition-all text-sm ${
                requestAmount === pkg.amount
                  ? 'border-blue-500/50 bg-blue-500/20 text-blue-200'
                  : 'border-white/10 bg-white/5 text-blue-100/70 hover:border-blue-500/30'
              }`}
            >
              {pkg.amount}
            </button>
          ))}
        </div>

        <textarea
          value={requestMessage}
          onChange={(e) => setRequestMessage(e.target.value)}
          placeholder={t(language, 'settings.creditRequest.message')}
          rows={2}
          className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 bg-white/5 text-white placeholder-gray-500 resize-none transition-all text-sm"
        />

        <button
          onClick={handleCreditRequest}
          className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 text-sm"
        >
          <Send className="w-4 h-4" />
          {t(language, 'settings.creditRequest.requestButton')}
        </button>

        {requestStatus && (
          <div className={`p-3 rounded-xl border ${
            requestStatus.type === 'success'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          } transition-all`}>
            <div className="flex items-center gap-2">
              {requestStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span className="text-xs font-medium">{requestStatus.message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Admin Panel */}
      {!isAdmin ? (
        <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>{t(language, 'settings.admin.accessTitle')}</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type={showAdminPass ? 'text' : 'password'}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder={t(language, 'settings.admin.passwordPlaceholder')}
                className="w-full px-4 py-2.5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 bg-white/5 text-white pr-10 transition-all text-sm placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowAdminPass(!showAdminPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-all"
              >
                {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleAdminLogin}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white rounded-xl transition-all text-sm font-semibold whitespace-nowrap"
            >
              {t(language, 'settings.admin.loginButton')}
            </button>
          </div>
        </div>
      ) : (
        <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Unlock className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>{t(language, 'settings.admin.panelTitle')}</h2>
            </div>
            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:shadow-lg text-white rounded-xl transition-all text-sm"
            >
              {t(language, 'settings.admin.logoutButton')}
            </button>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-blue-200/70 text-sm">{t(language, 'settings.admin.stats.totalCodes')}</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-blue-200/70 text-sm">{t(language, 'settings.admin.stats.used')}</p>
                <p className="text-2xl font-bold text-blue-300">{stats.used}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-blue-200/70 text-sm">{t(language, 'settings.admin.stats.unused')}</p>
                <p className="text-2xl font-bold text-indigo-300">{stats.unused}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-blue-200/70 text-sm">{t(language, 'settings.admin.stats.invalid')}</p>
                <p className="text-2xl font-bold text-red-400">{stats.invalid}</p>
              </div>
            </div>
          )}

          {/* Code Generation */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-lg font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>{t(language, 'settings.admin.generateCodes.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-blue-200/70 mb-2">{t(language, 'settings.admin.generateCodes.creditAmount')}</label>
                <select
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white transition-all focus:ring-2 focus:ring-blue-500/50"
                >
                  {CREDIT_PACKAGES.map(pkg => (
                    <option key={pkg.amount} value={pkg.amount}>{pkg.amount} {t(language, 'settings.admin.generateCodes.creditsLabel')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-blue-200/70 mb-2">{t(language, 'settings.admin.generateCodes.numberOfCodes')}</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={codeCount}
                  onChange={(e) => setCodeCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white transition-all focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateCodes}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white rounded-xl transition-all font-semibold"
                >
                  {t(language, 'settings.admin.generateCodes.generateButton')}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Codes List */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-lg font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>{t(language, 'settings.admin.generatedCodes.title')} ({generatedCodes.length})</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {generatedCodes.length === 0 ? (
                <p className="text-blue-200/70 text-center py-8">{t(language, 'settings.admin.generatedCodes.noCodesYet')}</p>
              ) : (
                generatedCodes.map((codeObj, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      codeObj.usedAt
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : !codeObj.isValid
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-white font-mono text-sm">{codeObj.code}</code>
                        {codeObj.usedAt && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{t(language, 'settings.admin.generatedCodes.used')}</span>}
                        {!codeObj.isValid && <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">{t(language, 'settings.admin.generatedCodes.invalid')}</span>}
                      </div>
                      <p className="text-xs text-blue-200/60 mt-1">
                        {codeObj.amount} {t(language, 'settings.admin.generatedCodes.credits')} • {t(language, 'settings.admin.generatedCodes.created')} {new Date(codeObj.createdAt).toLocaleString()}
                        {codeObj.usedAt && ` • ${t(language, 'settings.admin.generatedCodes.usedAt')} ${new Date(codeObj.usedAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopyCode(codeObj.code)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                        title={t(language, 'settings.admin.generatedCodes.copyCode')}
                      >
                        <Copy className="w-4 h-4 text-blue-300" />
                      </button>
                      {!codeObj.usedAt && codeObj.isValid && (
                        <button
                          onClick={() => handleInvalidateCode(codeObj.code)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                          title={t(language, 'settings.admin.generatedCodes.invalidate')}
                        >
                          <XCircle className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCode(codeObj.code)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                        title={t(language, 'settings.admin.generatedCodes.delete')}
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
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="text-lg font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent mb-4" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>{t(language, 'settings.admin.creditRequests.title')} ({creditRequests.length})</h3>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {creditRequests.length === 0 ? (
                <p className="text-blue-200/70 text-center py-8">{t(language, 'settings.admin.creditRequests.noRequests')}</p>
              ) : (
                creditRequests.map((req, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{req.name}</p>
                        <p className="text-sm text-blue-200/70">{req.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-full font-semibold">
                          {req.requestedAmount} {t(language, 'settings.admin.creditRequests.credits')}
                        </span>
                        <button
                          onClick={() => handleClearRequest(req.timestamp)}
                          className="p-1 hover:bg-red-500/20 rounded-lg transition-all"
                          title={t(language, 'settings.admin.creditRequests.clearRequest')}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    {req.message && (
                      <p className="text-sm text-blue-200/80 mb-2 p-2 bg-white/5 rounded-lg">
                        "{req.message}"
                      </p>
                    )}
                    <p className="text-xs text-blue-200/50">
                      {new Date(req.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tech Stack - Simplified */}
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 space-y-3 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {t(language, 'settings.techStack.title')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {/* Frontend */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="text-blue-200 font-semibold mb-1.5 text-sm">{t(language, 'settings.techStack.frontend')}</div>
            <p className="text-blue-100/60">React 18 • Vite • Tailwind CSS • Router v6</p>
          </div>

          {/* Backend */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="text-blue-200 font-semibold mb-1.5 text-sm">{t(language, 'settings.techStack.backend')}</div>
            <p className="text-blue-100/60">Redis Cloud • Vercel Functions • RESTful API</p>
          </div>

          {/* AI & Tools */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="text-blue-200 font-semibold mb-1.5 text-sm">{t(language, 'settings.techStack.intelligence')}</div>
            <p className="text-blue-100/60">Cemal AI • Tesseract.js • DOMPurify</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="text-center sm:text-left">
            <div className="text-blue-200 font-semibold text-sm">{t(language, 'settings.techStack.openSource')}</div>
            <div className="text-blue-200/60 text-xs">{t(language, 'settings.techStack.openSourceSubtitle')}</div>
          </div>
          <a
            href="https://github.com/cemal-demirci"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white rounded-xl transition-all flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            {t(language, 'settings.techStack.githubButton')}
          </a>
        </div>
      </div>

      {copiedCode && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-xl border border-white/10 transition-all">
          <CheckCircle className="w-5 h-5" />
          {t(language, 'settings.toast.codeCopied')}
        </div>
      )}
    </div>
  )
}

export default Settings
