import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Home, User, Wrench, Moon, Sun, Settings as SettingsIcon, Zap, Infinity, GraduationCap, Share2, Monitor } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import CommandPalette from './CommandPalette'
import CookieConsent from './CookieConsent'
import LanguageSwitcher from './LanguageSwitcher'
import { getRemainingRequests, LIMITS } from '../services/geminiService'

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [remainingRequests, setRemainingRequests] = useState(10)
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Cemal Demirci',
    showNavLogo: false,
    logoText: 'CD'
  })
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    // Load site settings from admin panel
    const savedSite = localStorage.getItem('site_settings')
    if (savedSite) {
      setSiteSettings(JSON.parse(savedSite))
    }

    // Check unlimited mode
    const storedKey = localStorage.getItem('aiUnlimitedKey')
    setIsUnlimited(storedKey === 'unlimited2024')

    // Update remaining requests (IP-based, async)
    const updateRequests = async () => {
      const remaining = await getRemainingRequests()
      setRemainingRequests(remaining)
    }

    updateRequests()
    const interval = setInterval(updateRequests, 1000)
    return () => clearInterval(interval)
  }, [])

  const { language } = useLanguage()

  const navigation = [
    { name: t(language, 'nav.home'), href: '/' },
    { name: t(language, 'nav.tools'), href: '/tools' },
    { name: 'Pleiades Share', href: '/fileshare' },
    { name: 'Remote', href: '/remote-desktop' },
    { name: 'Junior IT', href: '/junior-it' },
    { name: t(language, 'nav.about'), href: '/about' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Command Palette */}
      <CommandPalette />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                {siteSettings.showNavLogo && (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">{siteSettings.logoText}</span>
                  </div>
                )}
                <span className="text-xl font-bold text-gray-900 dark:text-white">{siteSettings.siteName}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {/* AI Requests Indicator */}
              <Link
                to="/settings"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-2 ${
                  isUnlimited
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                    : remainingRequests > 5
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : remainingRequests > 0
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                }`}
                title="AI Requests - Click to manage"
              >
                {isUnlimited ? (
                  <>
                    <Infinity className="w-4 h-4" />
                    <span>Unlimited</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>{remainingRequests}/{LIMITS.RATE_LIMIT}</span>
                  </>
                )}
              </Link>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              {/* AI Requests Indicator - Mobile */}
              <Link
                to="/settings"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isUnlimited
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : remainingRequests > 5
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : remainingRequests > 0
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}
                title="AI Requests"
              >
                {isUnlimited ? (
                  <>
                    <Infinity className="w-3 h-3" />
                    <span>∞</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3" />
                    <span>{remainingRequests}</span>
                  </>
                )}
              </Link>

              {/* Language Switcher - Mobile */}
              <LanguageSwitcher />

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {/* AI Requests Info - Mobile Menu */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isUnlimited
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : remainingRequests > 5
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : remainingRequests > 0
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isUnlimited ? (
                      <>
                        <Infinity className="w-5 h-5" />
                        <span>Unlimited AI Requests</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>AI Requests Today</span>
                      </>
                    )}
                  </div>
                  <span className="font-bold">
                    {isUnlimited ? '∞' : `${remainingRequests}/${LIMITS.RATE_LIMIT}`}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center space-y-1">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">⌘ K</kbd>
              {' '}or{' '}
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">Ctrl K</kbd>
              {' '}to search tools
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} Cemal Demirci • MIT License • Powered by Cemal AI • React 18 + Vite + Tailwind CSS • Redis Cloud (Frankfurt) • Vercel Edge
            </p>
          </div>
        </div>
      </footer>

      {/* GDPR Cookie Consent */}
      <CookieConsent />
    </div>
  )
}

export default Layout
