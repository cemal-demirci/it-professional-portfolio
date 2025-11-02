import { useState, useEffect } from 'react'
import { Cookie, X, Check, Settings } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import storage from '../utils/storage'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    // Check if user has already consented
    const consent = storage.getItem('cookie_consent')
    if (!consent) {
      // Show banner after 1 second delay
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAcceptAll = () => {
    storage.setItem('cookie_consent', {
      necessary: true,
      analytics: true,
      preferences: true,
      timestamp: new Date().toISOString()
    })
    setShowBanner(false)
  }

  const handleAcceptNecessary = () => {
    storage.setItem('cookie_consent', {
      necessary: true,
      analytics: false,
      preferences: false,
      timestamp: new Date().toISOString()
    })
    setShowBanner(false)
  }

  const handleReject = () => {
    storage.setItem('cookie_consent', {
      necessary: true,
      analytics: false,
      preferences: false,
      timestamp: new Date().toISOString()
    })
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 border-t-2 border-primary-600 shadow-2xl">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-start gap-4">
            {/* Cookie Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                {t(language, 'cookie.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t(language, 'cookie.description')}
                <br /><br />
                {t(language, 'cookie.description2')}
                <a href="/privacy" className="text-primary-600 hover:underline font-semibold">
                  {t(language, 'cookie.privacyPolicy')}
                </a>.
              </p>

              {showDetails && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{t(language, 'cookie.necessary')}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {t(language, 'cookie.necessaryDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{t(language, 'cookie.analytics')}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t(language, 'cookie.analyticsDesc')}
                        </p>
                      </div>
                    </label>
                  </div>
                  <div className="flex items-start gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{t(language, 'cookie.preferences')}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t(language, 'cookie.preferencesDesc')}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  <Check className="w-4 h-4" />
                  {t(language, 'cookie.acceptAll')}
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-sm transition-all"
                >
                  {t(language, 'cookie.necessaryOnly')}
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium text-sm flex items-center gap-2 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  {showDetails ? t(language, 'cookie.hide') : t(language, 'cookie.customize')}
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-all"
                >
                  {t(language, 'cookie.reject')}
                </button>
              </div>

              {/* GDPR Compliance Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {t(language, 'cookie.gdpr')}
                  <a href="mailto:cemal.online" className="text-primary-600 hover:underline font-semibold">
                    cemal.online
                  </a>
                  {t(language, 'cookie.gdprEmail')}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleReject}
              className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Reject & Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
