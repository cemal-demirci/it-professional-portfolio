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

      {/* Quick Speed Test Widget */}
      <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <QuickSpeedTest />
      </div>

      {/* NEW FEATURES SECTION */}
      <div className="space-y-6">
        {/* QuantumDrop Section */}
        <div className={`transition-all duration-1000 delay-850 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link
            to="/fileshare"
            className="group block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-white/20"
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-lg animate-pulse">
              NEW ✨
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <Share2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                      QuantumDrop
                      <Zap className="w-6 h-6 animate-pulse" />
                    </h2>
                    <p className="text-white/90 mt-1 font-medium">
                      {language === 'tr'
                        ? 'Peer-to-Peer Dosya Paylaşımı - Sunucusuz, Sınırsız, Güvenli'
                        : 'Peer-to-Peer File Sharing - Serverless, Unlimited, Secure'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {language === 'tr' ? '🌍 Çevre Dostu' : '🌍 Eco-Friendly'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90">
                    {language === 'tr'
                      ? 'Sunucu yok = Karbon ayak izi yok'
                      : 'No servers = Zero carbon footprint'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {language === 'tr' ? '🔒 Gizlilik' : '🔒 Privacy'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90">
                    {language === 'tr'
                      ? 'Dosyalarınız sadece sizde kalır'
                      : 'Your files stay with you only'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Infinity className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {language === 'tr' ? '∞ Sınırsız' : '∞ Unlimited'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90">
                    {language === 'tr'
                      ? 'Dosya boyutu limiti yok'
                      : 'No file size limits'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Remote Desktop Section */}
        <div className={`transition-all duration-1000 delay-875 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link
            to="/remote-desktop"
            className="group block bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-white/20"
          >
            <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-lg animate-pulse">
              NEW ✨
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <Monitor className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                      {language === 'tr' ? 'Uzak Masaüstü' : 'Remote Desktop'}
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </h2>
                    <p className="text-white/90 mt-1 font-medium">
                      {language === 'tr'
                        ? 'Tarayıcı Tabanlı - Kurulum Gerektirmez - TeamViewer Alternatifi'
                        : 'Browser-Based - No Installation - TeamViewer Alternative'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {language === 'tr' ? '🌐 Web Tabanlı' : '🌐 Web-Based'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90">
                    {language === 'tr'
                      ? 'Sadece tarayıcı, başka bir şey yok'
                      : 'Just your browser, nothing else'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {language === 'tr' ? '⚡ Anında Bağlan' : '⚡ Instant Connect'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90">
                    {language === 'tr'
                      ? 'Kod gir, hemen başla'
                      : 'Enter code, start instantly'}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-5 h-5" />
                    <h3 className="font-semibold">
                      {language === 'tr' ? '🔒 P2P Güvenli' : '🔒 P2P Secure'}
                    </h3>
                  </div>
                  <p className="text-xs text-white/90">
                    {language === 'tr'
                      ? 'Doğrudan bağlantı, sunucu yok'
                      : 'Direct connection, no servers'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Junior IT Section */}
      <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Link
          to="/junior-it"
          className="group block bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden border border-white/20"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-10 h-10" />
                <div>
                  <h2 className="text-2xl font-bold">Junior IT'ler İçin 🚀</h2>
                  <p className="text-white/90 mt-1">IT dünyasına yeni mi başladın? Burası tam sana göre!</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-semibold">IT Sözlük 📖</h3>
                </div>
                <p className="text-xs text-white/90">
                  DNS? BSOD? API? Cemal ama öğretici IT terimleri sözlüğü
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="font-semibold">AI Soru Botu 🤖</h3>
                </div>
                <p className="text-xs text-white/90">
                  IT sorunlarını sor, Cemal AI anında cevaplasın!
                </p>
              </div>
            </div>
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
