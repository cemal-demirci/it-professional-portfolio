import { Link } from 'react-router-dom'
import { ArrowRight, Code, Shield, FileText, Palette, Network, Wrench, Monitor, Sparkles, Zap, Rocket, GraduationCap, BookOpen, MessageSquare } from 'lucide-react'
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
      <div className="text-center space-y-6 py-12 relative">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 animate-bounce">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">{t(language, 'home.welcome')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            {t(language, 'home.greeting')}{' '}
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              {t(language, 'home.name')}
            </span>
          </h1>
        </div>

        <p className={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {t(language, 'home.title')}
        </p>

        <p className={`text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {t(language, 'home.subtitle')}
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <Link
            to="/tools"
            className="group inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
          >
            {t(language, 'home.exploreTools')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium hover:scale-105 hover:-translate-y-1"
          >
            {t(language, 'home.aboutMe')}
          </Link>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <Zap className="absolute top-20 left-[10%] w-8 h-8 text-yellow-500/20 animate-float" />
          <Rocket className="absolute top-40 right-[15%] w-10 h-10 text-blue-500/20 animate-float-delayed" />
          <Sparkles className="absolute bottom-20 left-[20%] w-6 h-6 text-purple-500/20 animate-float" style={{ animationDelay: '1s' }} />
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

      {/* Junior IT Section */}
      <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Link
          to="/junior-it"
          className="group block bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-12 h-12 animate-bounce" />
                <div>
                  <h2 className="text-3xl font-bold">Junior IT'ler İçin 🚀</h2>
                  <p className="text-white/90 mt-1">IT dünyasına yeni mi başladın? Burası tam sana göre!</p>
                </div>
              </div>
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">IT Sözlük 📖</h3>
                </div>
                <p className="text-sm text-white/90">
                  DNS? BSOD? API? Cemal ama öğretici IT terimleri sözlüğü
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">AI Soru Botu 🤖</h3>
                </div>
                <p className="text-sm text-white/90">
                  IT sorunlarını sor, Cemal AI anında cevaplasın!
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm">
              <div className="px-3 py-1 bg-white/20 rounded-full border border-white/30">
                🇹🇷 Sadece Türkçe
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full border border-white/30">
                ✨ Ücretsiz
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full border border-white/30">
                😎 Eğlenceli
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Link
              key={index}
              to={feature.link}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500 hover:border-primary-300 dark:hover:border-primary-700 hover:scale-105 hover:-translate-y-2 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 animate-gradient-rotate`}>
                <Icon className="w-6 h-6 text-white animate-pulse-slow" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </Link>
          )
        })}
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-r from-primary-600 via-purple-600 to-primary-400 bg-[length:200%_auto] animate-gradient rounded-2xl p-8 md:p-12 text-center text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative">
          <Sparkles className="absolute -top-6 right-1/4 w-8 h-8 text-white/50 animate-spin-slow" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-pulse-slow">
            {t(language, 'home.professionalTools')}
          </h2>
          <p className="text-xl mb-6 text-primary-50">
            {t(language, 'home.allToolsFree')}
          </p>
          <Link
            to="/tools"
            className="group inline-flex items-center px-8 py-3 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg hover:scale-110"
          >
            {t(language, 'home.viewAllTools')}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Tech Stack Section - Colorful */}
      <div className={`bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ⚡ Built With Modern Tech
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Powered by Cemal AI & cutting-edge technologies
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 cursor-default">
            ⚛️ React 18
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 cursor-default">
            ⚡ Vite
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 cursor-default">
            🎨 Tailwind CSS
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 cursor-default">
            🗄️ Redis Cloud
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 cursor-default">
            🌍 Frankfurt DB
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 cursor-default">
            ▲ Vercel Edge
          </span>
          <span className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 hover:rotate-2 transition-all duration-300 cursor-default">
            🤖 Cemal AI
          </span>
        </div>
      </div>
    </div>
  )
}

export default Home
