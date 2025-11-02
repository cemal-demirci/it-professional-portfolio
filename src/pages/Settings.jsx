import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Key, Zap, Clock, CheckCircle, XCircle, Infinity, Shield, Info, Sparkles, Rocket } from 'lucide-react'
import { getRemainingRequests, LIMITS } from '../services/geminiService'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import storage from '../utils/storage'

const Settings = () => {
  const [unlimitedKey, setUnlimitedKey] = useState('')
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [remainingRequests, setRemainingRequests] = useState(10)
  const [saveStatus, setSaveStatus] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()

  const SECRET_KEY = 'unlimited2024'

  useEffect(() => {
    // Enable animations
    setIsVisible(true)

    // Check if unlimited mode is already activated
    const savedKey = storage.getItem('aiUnlimitedKey')
    if (savedKey === SECRET_KEY) {
      setIsUnlimited(true)
    }

    // Get remaining requests (IP-based, async)
    const updateRemaining = async () => {
      const remaining = await getRemainingRequests()
      setRemainingRequests(remaining)
    }

    updateRemaining()

    // Update remaining requests every second
    const interval = setInterval(() => {
      updateRemaining()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleActivateUnlimited = () => {
    if (unlimitedKey === SECRET_KEY) {
      storage.setItem('aiUnlimitedKey', SECRET_KEY)
      setIsUnlimited(true)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } else {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  const handleDeactivateUnlimited = () => {
    storage.removeItem('aiUnlimitedKey')
    setIsUnlimited(false)
    setUnlimitedKey('')
    setSaveStatus('deactivated')
    setTimeout(() => setSaveStatus(null), 3000)
  }


  return (
    <div className="max-w-4xl mx-auto space-y-6 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className={`text-center space-y-2 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 animate-bounce">
          <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t(language, 'settings.aiConfig')}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <SettingsIcon className="w-10 h-10 text-primary-600 animate-pulse-slow" />
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            {t(language, 'settings.title')}
          </span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t(language, 'settings.subtitle')}
        </p>

        {/* Floating Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <Zap className="absolute top-20 left-[10%] w-8 h-8 text-yellow-500/20 animate-float" />
          <Rocket className="absolute top-40 right-[15%] w-10 h-10 text-purple-500/20 animate-float-delayed" />
          <Infinity className="absolute bottom-10 left-[20%] w-8 h-8 text-blue-500/20 animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* How It Works Info Box */}
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
            <p><strong>{t(language, 'settings.howItWorks')}</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>{t(language, 'settings.freeTier')}</li>
              <li>{t(language, 'settings.unlimitedMode')}</li>
              <li>{t(language, 'settings.storage')}</li>
              <li>{t(language, 'settings.scope')}</li>
              <li>{t(language, 'settings.activation')}</li>
              <li>{t(language, 'settings.privacy')}</li>
            </ul>
            <p className="mt-2 text-xs italic">{t(language, 'settings.secretKeyHint')}</p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className={`rounded-xl p-6 border transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${
        isUnlimited
          ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isUnlimited ? (
              <Infinity className="w-8 h-8 text-purple-600" />
            ) : (
              <Clock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isUnlimited ? t(language, 'settings.unlimitedActive') : t(language, 'settings.freeTierActive')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isUnlimited
                  ? t(language, 'settings.unlimitedDesc')
                  : `${remainingRequests}/${LIMITS.RATE_LIMIT} ${t(language, 'settings.requestsRemaining')}`
                }
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
            isUnlimited
              ? 'bg-purple-600 text-white'
              : remainingRequests > 0
                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
          }`}>
            {isUnlimited ? (
              <><Infinity className="w-4 h-4" /> {t(language, 'settings.unlimited')}</>
            ) : remainingRequests > 0 ? (
              <><CheckCircle className="w-4 h-4" /> {t(language, 'settings.active')}</>
            ) : (
              <><XCircle className="w-4 h-4" /> {t(language, 'settings.depleted')}</>
            )}
          </div>
        </div>

        {!isUnlimited && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{t(language, 'settings.dailyLimitProgress')}</span>
              <span>{((LIMITS.RATE_LIMIT - remainingRequests) / LIMITS.RATE_LIMIT * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  remainingRequests > 5 ? 'bg-green-600' :
                  remainingRequests > 2 ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}
                style={{ width: `${((LIMITS.RATE_LIMIT - remainingRequests) / LIMITS.RATE_LIMIT * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Unlimited Mode */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <Key className="w-6 h-6 text-primary-600" />
          {t(language, 'settings.unlimitedModeTitle')}
        </div>

        {isUnlimited ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 border border-purple-300 dark:border-purple-700">
              <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 mb-2">
                <Zap className="w-5 h-5" />
                <strong>{t(language, 'settings.unlimitedModeActive')}</strong>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-400">
                {t(language, 'settings.unlimitedModeActiveDesc')}
              </p>
            </div>
            <button
              onClick={handleDeactivateUnlimited}
              className="btn-secondary flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              {t(language, 'settings.deactivateUnlimited')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(language, 'settings.secretKeyLabel')}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={unlimitedKey}
                    onChange={(e) => setUnlimitedKey(e.target.value)}
                    placeholder={t(language, 'settings.enterSecretKey')}
                    className="input-field pr-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showKey ? '🙈' : '👁️'}
                  </button>
                </div>
                <button
                  onClick={handleActivateUnlimited}
                  disabled={!unlimitedKey.trim()}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  {t(language, 'settings.activate')}
                </button>
              </div>
            </div>

            {saveStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2 text-green-800 dark:text-green-300">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{t(language, 'settings.unlimitedActivated')}</span>
              </div>
            )}

            {saveStatus === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2 text-red-800 dark:text-red-300">
                <XCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{t(language, 'settings.invalidKey')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tech Stack - Under the Hood */}
      <div className={`bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 rounded-xl p-6 border border-gray-700 dark:border-gray-600 space-y-4 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Under the Hood - Tech Stack
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Frontend */}
          <div className="p-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors">
            <div className="text-purple-400 font-semibold mb-2">Frontend Stack</div>
            <ul className="text-gray-300 space-y-1">
              <li>• React 18 + Vite (Lightning fast HMR)</li>
              <li>• Tailwind CSS v3 (JIT compiler)</li>
              <li>• Lucide Icons (Tree-shakeable)</li>
              <li>• React Router v6 (Client-side routing)</li>
            </ul>
          </div>

          {/* AI & APIs */}
          <div className="p-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-colors">
            <div className="text-blue-400 font-semibold mb-2">AI & Intelligence</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Cemal AI Engine (Custom built)</li>
              <li>• IP-based rate limiting (Cloudflare)</li>
              <li>• Real-time streaming responses</li>
              <li>• 30K character context window</li>
            </ul>
          </div>

          {/* Backend & Database */}
          <div className="p-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-green-500/50 transition-colors">
            <div className="text-green-400 font-semibold mb-2">Backend & Database</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Redis Cloud (Frankfurt - EU West 3)</li>
              <li>• ioredis (High-performance client)</li>
              <li>• Vercel Serverless Functions</li>
              <li>• RESTful API architecture</li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="p-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-colors">
            <div className="text-yellow-400 font-semibold mb-2">Deployment & CDN</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Vercel Edge Network (Global CDN)</li>
              <li>• Auto SSL/TLS (Let's Encrypt)</li>
              <li>• GitHub CI/CD integration</li>
              <li>• Zero-downtime deployments</li>
            </ul>
          </div>

          {/* Tools & Libraries */}
          <div className="p-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-pink-500/50 transition-colors">
            <div className="text-pink-400 font-semibold mb-2">Tools & Libraries</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Tesseract.js (OCR engine)</li>
              <li>• pdf.js (Mozilla's PDF renderer)</li>
              <li>• html2canvas (Screenshot utility)</li>
              <li>• DOMPurify (XSS protection)</li>
            </ul>
          </div>

          {/* Security & Performance */}
          <div className="p-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-red-500/50 transition-colors">
            <div className="text-red-400 font-semibold mb-2">Security & Performance</div>
            <ul className="text-gray-300 space-y-1">
              <li>• Environment variable encryption</li>
              <li>• CORS & CSP headers configured</li>
              <li>• Code splitting & lazy loading</li>
              <li>• Optimized production builds</li>
            </ul>
          </div>
        </div>

        {/* Repository Link */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-300 font-semibold">Open Source Repository</div>
              <div className="text-gray-400 text-xs mt-1">Built with passion, powered by coffee ☕</div>
            </div>
            <a
              href="https://github.com/cemal-demirci"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
        <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {t(language, 'settings.proTips')}
        </h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 ml-5 list-disc">
          <li>{t(language, 'settings.tip1')}</li>
          <li>{t(language, 'settings.tip2')}</li>
          <li>{t(language, 'settings.tip3')}</li>
          <li>{t(language, 'settings.tip4')}</li>
          <li>{t(language, 'settings.tip5')}</li>
        </ul>
      </div>
    </div>
  )
}

export default Settings
