import { Link } from 'react-router-dom'
import { ArrowRight, Code, Shield, FileText, Palette, Network, Wrench, Monitor, Sparkles, Zap, Rocket, GraduationCap, BookOpen, MessageSquare, Share2, Globe, Lock, Infinity } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import ServiceStatus from '../components/ServiceStatus'
import QuickSpeedTest from '../components/QuickSpeedTest'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Code,
      title: 'Code Tools',
      description: 'JSON formatter, Base64 encoder/decoder, Regex tester, and more',
      color: 'from-blue-500 to-cyan-500',
      link: '/tools#code-tools'
    },
    {
      icon: Shield,
      title: 'Security Tools',
      description: 'Password generator, hash generator, encryption/decryption tools',
      color: 'from-red-500 to-pink-500',
      link: '/tools#security-tools'
    },
    {
      icon: FileText,
      title: 'Text Tools',
      description: 'Markdown editor, word counter, text diff, case converter',
      color: 'from-green-500 to-emerald-500',
      link: '/tools#text-tools'
    },
    {
      icon: Palette,
      title: 'Design Tools',
      description: 'Color picker, gradient generator, CSS generator',
      color: 'from-purple-500 to-violet-500',
      link: '/tools#design-tools'
    },
    {
      icon: Network,
      title: 'Network Tools',
      description: 'URL encoder, IP/DNS lookup, WHOIS, MAC lookup, Security headers, and more',
      color: 'from-orange-500 to-amber-500',
      link: '/tools#network-tools'
    },
    {
      icon: Monitor,
      title: 'Windows Tools',
      description: 'GUID generator, Power Management, Bloatware removal scripts',
      color: 'from-cyan-500 to-blue-500',
      link: '/tools#windows-tools'
    },
    {
      icon: Wrench,
      title: 'Utility Tools',
      description: 'QR code generator, timestamp converter, UUID generator',
      color: 'from-indigo-500 to-blue-500',
      link: '/tools#utility-tools'
    }
  ]

  return (
    <div className="space-y-12 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6 py-16 relative">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full mb-6 animate-shimmer border-2 border-primary-400/30">
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">{t(language, 'home.welcome')}</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white drop-shadow-2xl">
            {t(language, 'home.greeting')}{' '}
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] glow-purple">
              {t(language, 'home.name')}
            </span>
          </h1>
        </div>

        <p className={`text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {t(language, 'home.title')}
        </p>

        <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {t(language, 'home.subtitle')}
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <Link
            to="/tools"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold shadow-2xl hover:shadow-purple-500/50 hover:scale-110 hover:-translate-y-2 transition-all duration-300 glow"
          >
            {t(language, 'home.exploreTools')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center px-8 py-4 glass-card text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            {t(language, 'home.aboutMe')}
          </Link>
        </div>
      </div>

      {/* Service Status Monitor */}
      <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <ServiceStatus />
      </div>

      {/* Speed Test & Junior IT - Side by Side */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Quick Speed Test Widget */}
        <QuickSpeedTest />

        {/* Junior IT Section - Compact */}
        <Link
          to="/junior-it"
          className="group block bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-white/20"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8" />
                <h2 className="text-xl font-bold">Junior IT 🚀</h2>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
            <p className="text-white/90 text-sm mb-3">IT dünyasına yeni başladın? Burası tam sana göre!</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <div className="flex items-center gap-1 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <h3 className="font-semibold text-xs">IT Sözlük 📖</h3>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <div className="flex items-center gap-1 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <h3 className="font-semibold text-xs">AI Soru Botu 🤖</h3>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* PREMIUM P2P FEATURES - Side by Side */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 delay-850 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Pleiades Share Section */}
        <Link
          to="/fileshare"
          className="group block bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-white/20"
        >
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold rounded-full shadow-lg">
              v2.0 🚀
            </span>
            <span className="px-2 py-1 bg-green-400 text-green-900 text-xs font-bold rounded-full shadow-lg">
              4x FASTER
            </span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold">Pleiades Share v2</h2>
                <p className="text-white/80 text-sm mt-1">
                  {language === 'tr' ? 'Yeni Nesil P2P Dosya Paylaşımı' : 'Next-Gen P2P File Sharing'}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform flex-shrink-0" />
            </div>
            <p className="text-white/90 text-sm mb-2">
              {language === 'tr'
                ? '⚡ 64KB chunks • 🔄 Auto-retry • 🛡️ Base64 encoding'
                : '⚡ 64KB chunks • 🔄 Auto-retry • 🛡️ Base64 encoding'}
            </p>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="bg-white/10 px-2 py-1 rounded">✓ No corruption</div>
              <div className="bg-white/10 px-2 py-1 rounded">✓ Unlimited</div>
              <div className="bg-white/10 px-2 py-1 rounded">✓ P2P Direct</div>
            </div>
          </div>
        </Link>

        {/* Remote Desktop Section */}
        <Link
          to="/remote-desktop"
          className="group block bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-white/20"
        >
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold rounded-full shadow-lg">
              v2.0 ⚡
            </span>
            <span className="px-2 py-1 bg-purple-400 text-purple-900 text-xs font-bold rounded-full shadow-lg">
              TURBO MODE
            </span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold">
                  {language === 'tr' ? 'Uzak Masaüstü v2' : 'Remote Desktop v2'}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {language === 'tr' ? 'Turbo Mode ile 60 FPS' : 'Turbo Mode with 60 FPS'}
                </p>
              </div>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform flex-shrink-0" />
            </div>
            <p className="text-white/90 text-sm mb-2">
              {language === 'tr'
                ? '🔒 Secure • 🏠 Local • ⚡ Turbo (LAN)'
                : '🔒 Secure • 🏠 Local • ⚡ Turbo (LAN)'}
            </p>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="bg-white/10 px-2 py-1 rounded">✓ 60 FPS</div>
              <div className="bg-white/10 px-2 py-1 rounded">✓ Auto-reconnect</div>
              <div className="bg-white/10 px-2 py-1 rounded">✓ LAN Direct</div>
            </div>
            <p className="text-white/70 text-xs">
              {language === 'tr'
                ? '🌐 Web Tabanlı • ⚡ Anında • 🔒 P2P Güvenli'
                : '🌐 Web-Based • ⚡ Instant • 🔒 P2P Secure'}
            </p>
          </div>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Link
              key={index}
              to={feature.link}
              className={`glass-card rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 hover:border-primary-400/60 dark:hover:border-primary-600/60 hover:scale-105 cursor-pointer group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-all duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          )
        })}
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-2xl p-10 md:p-12 text-center text-white shadow-xl transition-all duration-500 hover:shadow-2xl relative overflow-hidden ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 via-purple-600/20 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t(language, 'home.professionalTools')}
          </h2>
          <p className="text-lg mb-6 text-white/90">
            {t(language, 'home.allToolsFree')}
          </p>
          <Link
            to="/tools"
            className="group inline-flex items-center px-8 py-3 bg-white text-slate-800 rounded-lg hover:bg-slate-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
          >
            {t(language, 'home.viewAllTools')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Tech Stack Section - Ultra Minimal */}
      <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Built With Modern Tech
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Powered by Cemal AI & cutting-edge technologies
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-medium">
            React 18
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-medium">
            Vite
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-medium">
            Tailwind CSS
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-medium">
            Redis Cloud
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-medium">
            Frankfurt DB
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-medium">
            Vercel Edge
          </span>
          <span className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-300 dark:border-gray-600 font-medium">
            Cemal AI
          </span>
        </div>
      </div>
    </div>
  )
}

export default Home
