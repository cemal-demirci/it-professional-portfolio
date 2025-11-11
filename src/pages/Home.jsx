import { Link } from 'react-router-dom'
import { ArrowRight, Code, Shield, FileText, Palette, Network, Wrench, Monitor, Sparkles, Zap, Rocket, GraduationCap, BookOpen, MessageSquare, Share2, Globe, Lock, Infinity, Terminal, Binary } from 'lucide-react'
import { useEffect, useState, useRef, lazy, Suspense } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useRainbow } from '../contexts/RainbowContext'
import { t } from '../translations'
import RainbowModeToolBlocker from '../components/RainbowModeToolBlocker'
import CemalLogo from '../components/CemalLogo'

// Lazy load heavy components for better performance
const ServiceStatus = lazy(() => import('../components/ServiceStatus'))
const QuickSpeedTest = lazy(() => import('../components/QuickSpeedTest'))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
  </div>
)

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  const [terminalLines, setTerminalLines] = useState([])
  const [showContent, setShowContent] = useState(false)
  const bootCanvasRef = useRef(null)
  const mainCanvasRef = useRef(null)
  const { language } = useLanguage()
  const { rainbowMode } = useRainbow()

  // Matrix Rain Effect for Boot Screen
  useEffect(() => {
    if (sessionStorage.getItem('cemal_booted')) return // Skip if already booted

    const canvas = bootCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const letters = '01'
    const fontSize = 12
    const columns = canvas.width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Gradient from blue to purple
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#60a5fa') // blue-400
      gradient.addColorStop(1, '#a78bfa') // purple-400
      ctx.fillStyle = gradient
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [])

  // Matrix Rain Effect for Main Content
  useEffect(() => {
    if (!bootComplete) return // Don't start until boot is complete

    const canvas = mainCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const letters = '01'
    const fontSize = 12
    const columns = canvas.width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Gradient from blue to purple
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#60a5fa') // blue-400
      gradient.addColorStop(1, '#a78bfa') // purple-400
      ctx.fillStyle = gradient
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [bootComplete])

  // Terminal Boot Sequence - Fast & lightweight version
  useEffect(() => {
    const hasBooted = sessionStorage.getItem('cemal_booted')

    if (hasBooted) {
      // Skip boot, show content immediately
      setBootComplete(true)
      setShowContent(true)
      setIsVisible(true)
      return
    }

    // Faster boot sequence for better performance (4 messages)
    const bootSequence = [
      { text: `> ${t(language, 'home.boot.init')} 🚀`, delay: 50 },
      { text: `> ✓ ${t(language, 'home.boot.toolsReady')}`, delay: 200 },
      { text: `> ✓ ${t(language, 'home.boot.botsAwake')}`, delay: 350 },
      { text: `> ${t(language, 'home.boot.welcomeAboard')}`, delay: 500 },
    ]

    bootSequence.forEach(({ text, delay }) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, text])
      }, delay)
    })

    // Completion at 650ms total
    setTimeout(() => {
      setBootComplete(true)
      sessionStorage.setItem('cemal_booted', 'true') // Mark as booted
      setTimeout(() => setShowContent(true), 100)
      setTimeout(() => setIsVisible(true), 150)
    }, 650)
  }, []) // Empty dependency - only run once on mount

  const features = [
    {
      icon: Code,
      title: t(language, 'home.features.categories.code.title'),
      description: t(language, 'home.features.categories.code.description'),
      color: 'from-blue-500 to-cyan-500',
      link: '/tools#code-tools'
    },
    {
      icon: Shield,
      title: t(language, 'home.features.categories.security.title'),
      description: t(language, 'home.features.categories.security.description'),
      color: 'from-red-500 to-pink-500',
      link: '/tools#security-tools'
    },
    {
      icon: FileText,
      title: t(language, 'home.features.categories.text.title'),
      description: t(language, 'home.features.categories.text.description'),
      color: 'from-green-500 to-emerald-500',
      link: '/tools#text-tools'
    },
    {
      icon: Palette,
      title: t(language, 'home.features.categories.design.title'),
      description: t(language, 'home.features.categories.design.description'),
      color: 'from-purple-500 to-violet-500',
      link: '/tools#design-tools'
    },
    {
      icon: Network,
      title: t(language, 'home.features.categories.network.title'),
      description: t(language, 'home.features.categories.network.description'),
      color: 'from-orange-500 to-amber-500',
      link: '/tools#network-tools'
    },
    {
      icon: Monitor,
      title: t(language, 'home.features.categories.windows.title'),
      description: t(language, 'home.features.categories.windows.description'),
      color: 'from-cyan-500 to-blue-500',
      link: '/tools#windows-tools'
    },
    {
      icon: Wrench,
      title: t(language, 'home.features.categories.utility.title'),
      description: t(language, 'home.features.categories.utility.description'),
      color: 'from-indigo-500 to-blue-500',
      link: '/tools#utility-tools'
    }
  ]


  if (!bootComplete) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50 flex items-center justify-center overflow-hidden">
        {/* Matrix Background */}
        <canvas ref={bootCanvasRef} className="absolute inset-0 opacity-10" />

        {/* Terminal Window */}
        <div className="relative z-10 w-full max-w-2xl mx-4">
          <div className="bg-black/80 backdrop-blur-2xl rounded-2xl border border-blue-500/20 shadow-2xl overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-blue-950/50 to-purple-950/50 px-4 py-3 border-b border-blue-500/20 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"></div>
              <Terminal className="w-4 h-4 text-blue-400 ml-2 animate-pulse" />
              <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-sm font-mono font-bold">cemal.online</span>
            </div>

            {/* Terminal Content */}
            <div className="p-8 font-mono text-base space-y-3 min-h-[280px]">
              {terminalLines.map((line, index) => (
                <div
                  key={index}
                  className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text animate-fadeIn"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {line}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-6">
                <span className="text-blue-400">{'>'}</span>
                <div className="w-2 h-5 bg-gradient-to-b from-blue-400 to-purple-400 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Rainbow Mode: Block Home page
  if (rainbowMode) {
    return <RainbowModeToolBlocker />
  }

  return (
    <div className="space-y-12 relative overflow-hidden min-h-screen">
      {/* Matrix Background - Faded */}
      <canvas ref={mainCanvasRef} className="fixed inset-0 opacity-5 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className={`text-center space-y-8 py-16 relative transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ zIndex: 2 }}>

        {/* Animated Logo */}
        <CemalLogo size="large" showDecorations={true} />

        <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full mb-6 border-2 border-cyan-400/30 animate-glow">
            <Binary className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="text-sm font-bold text-cyan-300 tracking-wider">💼 {t(language, 'home.hero.badge')}</span>
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-4">
            {t(language, 'home.hero.greeting')}{' '}
            <span
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
              style={{
                textShadow: '0 0 40px rgba(6, 182, 212, 0.5)',
                animation: 'gradient 3s ease infinite, glow 2s ease-in-out infinite alternate'
              }}
            >
              {t(language, 'home.hero.name')}
            </span>
          </h1>
        </div>

        <p className={`text-2xl md:text-3xl font-bold text-gray-200 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {t(language, 'home.hero.title')}
          </span>
        </p>

        <p className={`text-lg md:text-xl text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          {t(language, 'home.hero.subtitle')}<br />
          <span className="text-cyan-400 font-semibold">{t(language, 'home.hero.subtitleHighlight')}</span>
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <Link
            to="/tools"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Rocket className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">{t(language, 'home.hero.exploreTools')}</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
          </Link>

          <Link
            to="/about"
            className="inline-flex items-center gap-3 px-8 py-4 glass-card text-gray-200 rounded-xl font-bold text-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-2 border-cyan-400/20 hover:border-cyan-400/50"
          >
            <span>{t(language, 'home.hero.servicesContact')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Tech Stack Badges - Animated */}
        <div className={`flex flex-wrap justify-center gap-3 pt-8 max-w-4xl mx-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-cyan-300 rounded-lg border border-cyan-500/30 font-mono text-sm hover:scale-110 transition-transform cursor-default shadow-lg hover:shadow-cyan-500/50">
            {t(language, 'home.techStack.react')}
          </span>
          <span className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-purple-300 rounded-lg border border-purple-500/30 font-mono text-sm hover:scale-110 transition-transform cursor-default shadow-lg hover:shadow-purple-500/50">
            {t(language, 'home.techStack.vite')}
          </span>
          <span className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-blue-300 rounded-lg border border-blue-500/30 font-mono text-sm hover:scale-110 transition-transform cursor-default shadow-lg hover:shadow-blue-500/50">
            {t(language, 'home.techStack.tailwind')}
          </span>
          <span className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-green-300 rounded-lg border border-green-500/30 font-mono text-sm hover:scale-110 transition-transform cursor-default shadow-lg hover:shadow-green-500/50">
            {t(language, 'home.techStack.redis')}
          </span>
          <span className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-orange-300 rounded-lg border border-orange-500/30 font-mono text-sm hover:scale-110 transition-transform cursor-default shadow-lg hover:shadow-orange-500/50">
            {t(language, 'home.techStack.vercel')}
          </span>
          <span className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm text-pink-300 rounded-lg border border-pink-500/30 font-mono text-sm hover:scale-110 transition-transform cursor-default shadow-lg hover:shadow-pink-500/50">
            {t(language, 'home.techStack.cemalAI')}
          </span>
        </div>
      </div>

      {/* Premium AI Bots Section */}
      <div className={`max-w-7xl mx-auto px-4 mb-20 transition-all duration-1000 delay-650 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ zIndex: 2, position: 'relative' }}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600/20 to-purple-600/20 backdrop-blur-lg rounded-full border border-pink-500/30 mb-4">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-sm font-bold text-pink-300 tracking-wider">{t(language, 'home.aiBots.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t(language, 'home.aiBots.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t(language, 'home.aiBots.subtitle')} 🎯
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Professor Posh */}
          <Link
            to="/ai-bots"
            className="group relative glass-card rounded-2xl p-6 border-2 border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-pink-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  🎩
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">{t(language, 'home.aiBots.bots.professorPosh.name')}</h3>
                  <p className="text-sm text-gray-400">{t(language, 'home.aiBots.bots.professorPosh.role')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic mb-3">{t(language, 'home.aiBots.bots.professorPosh.quote')}</p>
              <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>{t(language, 'home.aiBots.bots.professorPosh.tag')}</span>
              </div>
            </div>
          </Link>

          {/* Saul Goodman AI */}
          <Link
            to="/ai-bots"
            className="group relative glass-card rounded-2xl p-6 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-purple-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  ⚖️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{t(language, 'home.aiBots.bots.saulGoodman.name')}</h3>
                  <p className="text-sm text-gray-400">{t(language, 'home.aiBots.bots.saulGoodman.role')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic mb-3">{t(language, 'home.aiBots.bots.saulGoodman.quote')}</p>
              <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>{t(language, 'home.aiBots.bots.saulGoodman.tag')}</span>
              </div>
            </div>
          </Link>

          {/* Gordon HealthyAI */}
          <Link
            to="/ai-bots"
            className="group relative glass-card rounded-2xl p-6 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-green-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  🥗
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{t(language, 'home.aiBots.bots.gordonHealthy.name')}</h3>
                  <p className="text-sm text-gray-400">{t(language, 'home.aiBots.bots.gordonHealthy.role')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic mb-3">{t(language, 'home.aiBots.bots.gordonHealthy.quote')}</p>
              <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>{t(language, 'home.aiBots.bots.gordonHealthy.tag')}</span>
              </div>
            </div>
          </Link>

          {/* Sheldon Numbers */}
          <Link
            to="/ai-bots"
            className="group relative glass-card rounded-2xl p-6 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-blue-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  📐
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{t(language, 'home.aiBots.bots.sheldonNumbers.name')}</h3>
                  <p className="text-sm text-gray-400">{t(language, 'home.aiBots.bots.sheldonNumbers.role')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic mb-3">{t(language, 'home.aiBots.bots.sheldonNumbers.quote')}</p>
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>{t(language, 'home.aiBots.bots.sheldonNumbers.tag')}</span>
              </div>
            </div>
          </Link>

          {/* Dr. Freud AI */}
          <Link
            to="/ai-bots"
            className="group relative glass-card rounded-2xl p-6 border-2 border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-indigo-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  🧠
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{t(language, 'home.aiBots.bots.drFreud.name')}</h3>
                  <p className="text-sm text-gray-400">{t(language, 'home.aiBots.bots.drFreud.role')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic mb-3">{t(language, 'home.aiBots.bots.drFreud.quote')}</p>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>{t(language, 'home.aiBots.bots.drFreud.tag')}</span>
              </div>
            </div>
          </Link>

          {/* Harvey Specter AI */}
          <Link
            to="/ai-bots"
            className="group relative glass-card rounded-2xl p-6 border-2 border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-orange-500/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  💼
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{t(language, 'home.aiBots.bots.harveySpecter.name')}</h3>
                  <p className="text-sm text-gray-400">{t(language, 'home.aiBots.bots.harveySpecter.role')}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm italic mb-3">{t(language, 'home.aiBots.bots.harveySpecter.quote')}</p>
              <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>{t(language, 'home.aiBots.bots.harveySpecter.tag')}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <Link
            to="/ai-bots"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          >
            <Sparkles className="w-6 h-6" />
            <span>{t(language, 'home.aiBots.exploreAll')}</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className={`max-w-7xl mx-auto px-4 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ zIndex: 2, position: 'relative' }}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {t(language, 'home.features.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400">{t(language, 'home.features.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className={`group glass-card rounded-2xl p-6 border border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:border-cyan-500/50 hover:scale-105 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${800 + index * 100}ms`,
                position: 'relative'
              }}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{t(language, 'home.features.explore')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Special Features */}
      <div className={`max-w-7xl mx-auto px-4 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ zIndex: 2, position: 'relative' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* IT Glossary Card */}
          <Link
            to="/junior-it/glossary"
            className="group glass-card rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
          >
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2 flex-wrap">
                  {t(language, 'home.specialFeatures.glossary.title')}
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full animate-pulse">{t(language, 'home.specialFeatures.glossary.badge')}</span>
                </h3>
                <p className="text-gray-400 mb-4">
                  {t(language, 'home.specialFeatures.glossary.description')}
                </p>
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <GraduationCap className="w-5 h-5" />
                  <span>{t(language, 'home.specialFeatures.glossary.cta')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Junior IT Card */}
          <Link
            to="/junior-it"
            className="group glass-card rounded-2xl p-8 border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-cyan-500/50"
          >
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2 flex-wrap">
                  {t(language, 'home.specialFeatures.juniorIT.title')}
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {t(language, 'home.specialFeatures.juniorIT.badge')}
                  </span>
                </h3>
                <p className="text-gray-400 mb-4">
                  {t(language, 'home.specialFeatures.juniorIT.description')}
                </p>
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>{t(language, 'home.specialFeatures.juniorIT.cta')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Pleiades Share Card */}
          <Link
            to="/fileshare"
            className="group glass-card rounded-2xl p-6 sm:p-8 border-2 border-green-500/30 hover:border-green-500/60 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-green-500/50"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg flex-shrink-0">
                <Share2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2 flex items-center gap-2 flex-wrap">
                  <span className="break-words">{t(language, 'home.specialFeatures.fileShare.title')}</span>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex-shrink-0">{t(language, 'home.specialFeatures.fileShare.badge')}</span>
                </h3>
                <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base break-words">
                  {t(language, 'home.specialFeatures.fileShare.description')}
                </p>
                <div className="flex items-center gap-2 text-green-400 font-bold flex-wrap">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{t(language, 'home.specialFeatures.fileShare.cta')}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform flex-shrink-0" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Service Status & Speed Test */}
      <div className={`max-w-7xl mx-auto px-4 space-y-6 pb-12 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ zIndex: 2, position: 'relative' }}>
        <Suspense fallback={<LoadingFallback />}>
          <ServiceStatus />
          <QuickSpeedTest />
        </Suspense>
      </div>

      <style jsx>{`
        @keyframes spin3d {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(10deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glow {
          0% {
            filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.5));
          }
          100% {
            filter: drop-shadow(0 0 40px rgba(6, 182, 212, 0.8));
          }
        }
      `}</style>
    </div>
  )
}

export default Home
