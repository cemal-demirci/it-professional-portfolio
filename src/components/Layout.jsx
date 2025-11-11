import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Settings as SettingsIcon, Zap, Infinity, UserCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import CommandPalette from './CommandPalette'
import CookieConsent from './CookieConsent'
import LanguageSwitcher from './LanguageSwitcher'
import DigitalPassport from './DigitalPassport'
import { getRemainingRequests, LIMITS } from '../services/geminiService'
import { useRainbow, getFabulousName, getFabulousMessage } from '../contexts/RainbowContext'

const Layout = ({ children }) => {
  const { rainbowMode } = useRainbow()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [passportOpen, setPassportOpen] = useState(false)
  const [fabulousMsg, setFabulousMsg] = useState('')
  const [remainingRequests, setRemainingRequests] = useState(10)
  const [isUnlimited, setIsUnlimited] = useState(false)
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Cemal Demirci',
    showNavLogo: false,
    logoText: 'CD'
  })
  const location = useLocation()

  useEffect(() => {
    // Load site settings from admin panel
    const savedSite = localStorage.getItem('site_settings')
    if (savedSite) {
      setSiteSettings(JSON.parse(savedSite))
    }

    // Update remaining requests and unlimited status (IP-based, async)
    const updateRequests = async () => {
      try {
        const response = await fetch('/api/credits?action=balance')
        const data = await response.json()

        if (data.success) {
          setRemainingRequests(data.credits)
          setIsUnlimited(data.unlimited || false)
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error)
        const remaining = await getRemainingRequests()
        setRemainingRequests(remaining)
      }
    }

    updateRequests()
    const interval = setInterval(updateRequests, 2000)
    return () => clearInterval(interval)
  }, [])

  // Rainbow mode fabulous messages
  useEffect(() => {
    if (!rainbowMode) {
      setFabulousMsg('')
      return
    }

    // Show message immediately when activated
    setFabulousMsg(getFabulousMessage())

    // Then show new message every 5 seconds
    const msgInterval = setInterval(() => {
      setFabulousMsg(getFabulousMessage())
    }, 5000)

    return () => clearInterval(msgInterval)
  }, [rainbowMode])

  const { language } = useLanguage()

  const navigation = [
    { name: t(language, 'nav.home'), href: '/' },
    { name: t(language, 'nav.tools'), href: '/tools' },
    { name: t(language, 'nav.aiBots'), href: '/ai-bots' },
    { name: t(language, 'nav.fileShare'), href: '/fileshare' },
    { name: t(language, 'nav.juniorIT'), href: '/junior-it' },
    { name: t(language, 'nav.aboutContact'), href: '/about' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      rainbowMode
        ? 'bg-black'
        : 'bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Rainbow Mode Fabulous Message */}
      {rainbowMode && fabulousMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-bounce">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-4 border-white/30">
            <p className="text-2xl font-black text-center">{fabulousMsg}</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Command Palette */}
        <CommandPalette />

        {/* Glassmorphism Header */}
        <header className="bg-gray-900/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-3 group">
                  {siteSettings.showNavLogo && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-xl">{siteSettings.logoText}</span>
                    </div>
                  )}
                  <span className="text-xl font-black text-white tracking-tight">{siteSettings.siteName}</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-105'
                    }`}
                  >
                    {rainbowMode ? getFabulousName(item.name) : item.name}
                  </Link>
                ))}

                {/* AI Requests Indicator */}
                <Link
                  to="/settings"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ml-2 shadow-lg hover:scale-105 ${
                    isUnlimited
                      ? 'bg-purple-600/90 text-white hover:bg-purple-500'
                      : remainingRequests > 5
                        ? 'bg-green-600/90 text-white hover:bg-green-500'
                        : remainingRequests > 0
                          ? 'bg-yellow-600/90 text-white hover:bg-yellow-500'
                          : 'bg-red-600/90 text-white hover:bg-red-500'
                  }`}
                  title={t(language, 'credits.manage')}
                >
                  {isUnlimited ? (
                    <>
                      <Infinity className="w-4 h-4" />
                      <span>{t(language, 'credits.unlimited')}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>{remainingRequests} {t(language, 'credits.remaining')}</span>
                    </>
                  )}
                </Link>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Digital Passport Button */}
                <button
                  onClick={() => setPassportOpen(true)}
                  className="p-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
                  title="Digital Passport"
                >
                  <UserCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center gap-2">
                {/* AI Requests Indicator - Mobile */}
                <Link
                  to="/settings"
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-lg ${
                    isUnlimited
                      ? 'bg-purple-600/90 text-white'
                      : remainingRequests > 5
                        ? 'bg-green-600/90 text-white'
                        : remainingRequests > 0
                          ? 'bg-yellow-600/90 text-white'
                          : 'bg-red-600/90 text-white'
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

                {/* Digital Passport Button - Mobile */}
                <button
                  onClick={() => setPassportOpen(true)}
                  className="p-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                  title="Digital Passport"
                >
                  <UserCircle className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-gray-900/60 backdrop-blur-xl">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {rainbowMode ? getFabulousName(item.name) : item.name}
                  </Link>
                ))}

                {/* AI Requests Info - Mobile Menu */}
                <div className="border-t border-white/10 mt-2 pt-2">
                  <Link
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-4 rounded-xl text-sm font-bold transition-all shadow-lg ${
                      isUnlimited
                        ? 'bg-purple-600/90 text-white'
                        : remainingRequests > 5
                          ? 'bg-green-600/90 text-white'
                          : remainingRequests > 0
                            ? 'bg-yellow-600/90 text-white'
                            : 'bg-red-600/90 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isUnlimited ? (
                        <>
                          <Infinity className="w-5 h-5" />
                          <span>{t(language, 'credits.unlimited')} {t(language, 'credits.requests')}</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          <span>{t(language, 'credits.requests')}</span>
                        </>
                      )}
                    </div>
                    <span className="font-black">
                      {isUnlimited ? '∞' : `${remainingRequests} ${t(language, 'credits.remaining')}`}
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

        {/* Modern Footer */}
        <footer className="bg-gray-900/40 backdrop-blur-xl border-t border-white/10 mt-auto shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center space-y-3">
              <div className="flex justify-center items-center gap-2 text-gray-400 text-sm">
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold text-gray-300">⌘ K</kbd>
                <span>{language === 'tr' ? 'veya' : 'or'}</span>
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-bold text-gray-300">Ctrl K</kbd>
                <span>{t(language, 'footer.searchHint')}</span>
              </div>
              <p className="text-gray-500 text-xs font-medium">
                &copy; {new Date().getFullYear()} Cemal Demirci • {t(language, 'footer.license')} • {t(language, 'footer.poweredBy')}
              </p>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-600 text-xs">
                {t(language, 'footer.techStack')}
              </p>
            </div>
          </div>
        </footer>

        {/* Digital Passport Modal */}
        <DigitalPassport
          isOpen={passportOpen}
          onClose={() => setPassportOpen(false)}
        />

        {/* GDPR Cookie Consent */}
        <CookieConsent />
      </div>
    </div>
  )
}

export default Layout
