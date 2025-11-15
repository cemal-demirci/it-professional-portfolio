import { Link } from 'react-router-dom'
import { ArrowRight, Code, Shield, Network, Terminal, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useRainbow } from '../contexts/RainbowContext'
import RainbowModeToolBlocker from '../components/RainbowModeToolBlocker'
import BanksyLoader from '../components/BanksyLoader'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const { language } = useLanguage()
  const { rainbowMode } = useRainbow()

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('cemal_loaded')
    if (hasLoaded) {
      setLoading(false)
      setIsVisible(true)
    }
  }, [])

  const handleLoadComplete = () => {
    sessionStorage.setItem('cemal_loaded', 'true')
    setLoading(false)
    setTimeout(() => setIsVisible(true), 100)
  }

  if (loading) {
    return <BanksyLoader onComplete={handleLoadComplete} />
  }

  if (rainbowMode) {
    return <RainbowModeToolBlocker />
  }

  const translations = {
    en: {
      hero: {
        greeting: "Hey, I'm Cemal",
        tagline: "Tools & Digital Playground",
        description: "Privacy-first alternative to bloated corporate tools. Everything runs in your browser.",
        cta1: "Explore Tools",
        cta2: "About Me"
      },
      stats: [
        { label: "AI Tools", value: "13" },
        { label: "Total Tools", value: "70+" },
        { label: "Privacy", value: "100%" },
        { label: "Cost", value: "$0" }
      ],
      categories: {
        title: "What's Inside",
        items: [
          { name: "AI Tools", count: "13", icon: Code },
          { name: "Code", count: "6", icon: Code },
          { name: "Security", count: "4", icon: Shield },
          { name: "Network", count: "12", icon: Network },
          { name: "Windows", count: "4", icon: Terminal },
          { name: "More", count: "30+", icon: Wrench }
        ]
      },
      manifesto: {
        title: "Why This Exists",
        quote: "Yavaş, şişkin, gizlilik ihlali yapan araçlardan bıktım. Kendi alanımı kurdum.",
        points: [
          "Ücretli duvar yok",
          "Veri toplama yok",
          "Her şey lokal çalışır",
          "Açık kaynak zihniyeti"
        ]
      }
    },
    tr: {
      hero: {
        greeting: "Merhaba, Ben Cemal",
        tagline: "Araçlar & Dijital Oyun Alanı",
        description: "Şişirilmiş kurumsal araçlara gizlilik-öncelikli alternatif. Her şey tarayıcında çalışır.",
        cta1: "Araçları Keşfet",
        cta2: "Hakkımda"
      },
      stats: [
        { label: "AI Araçları", value: "13" },
        { label: "Toplam Araç", value: "70+" },
        { label: "Gizlilik", value: "%100" },
        { label: "Ücret", value: "₺0" }
      ],
      categories: {
        title: "İçeride Ne Var",
        items: [
          { name: "AI Araçları", count: "13", icon: Code },
          { name: "Kod", count: "6", icon: Code },
          { name: "Güvenlik", count: "4", icon: Shield },
          { name: "Ağ", count: "12", icon: Network },
          { name: "Windows", count: "4", icon: Terminal },
          { name: "Daha Fazla", count: "30+", icon: Wrench }
        ]
      },
      manifesto: {
        title: "Neden Bu Var",
        quote: "Yavaş, şişkin, gizlilik ihlali yapan araçlardan bıktım. Kendi alanımı kurdum.",
        points: [
          "Ücretli duvar yok",
          "Veri toplama yok",
          "Her şey lokal çalışır",
          "Açık kaynak zihniyeti"
        ]
      }
    }
  }

  const t = translations[language]

  return (
    <div className={`min-h-screen bg-black transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-10 -z-10" />

      {/* Noise texture */}
      <div className="fixed inset-0 noise-texture -z-10" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-20 relative">
          {/* Banksy-style spray paint splatter */}
          <div className="absolute top-20 right-10 w-32 h-32 opacity-5">
            <div className="text-9xl transform rotate-12">💻</div>
          </div>
          <div className="absolute bottom-20 left-10 w-24 h-24 opacity-5">
            <div className="text-7xl transform -rotate-12">🎨</div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Stencil graffiti tag */}
            <div className="absolute -top-20 left-0 text-zinc-800 font-mono text-sm opacity-30 transform -rotate-6">
              [ cemal.online // 2025 ]
            </div>

            {/* Main Heading - Stencil Style */}
            <h1 className="text-7xl md:text-9xl font-black text-white mb-6 stencil-text animate-spray relative">
              {t.hero.greeting}
              {/* Spray paint drip effect */}
              <div className="absolute -bottom-2 left-1/4 w-1 h-8 bg-white opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-2 right-1/3 w-1 h-6 bg-white opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </h1>

            {/* Banksy signature style */}
            <div className="mb-8 relative">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-400 tracking-wide">
                {t.hero.tagline}
              </h2>
              {/* Underline spray effect */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
            </div>

            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12 italic font-mono">
              "{t.hero.description}"
            </p>

            {/* CTA Buttons - Sticker Style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link
                to="/tools"
                className="sticker px-8 py-4 bg-white text-black rounded-lg font-black text-lg hover:bg-gray-200 transition-all duration-150 transform hover:rotate-0 hover:scale-105"
              >
                {t.hero.cta1} →
              </Link>

              <Link
                to="/about"
                className="px-8 py-4 bg-black text-white rounded-lg font-black text-lg border-2 border-white hover:bg-white hover:text-black transition-all duration-150 transform hover:-rotate-1"
              >
                {t.hero.cta2}
              </Link>
            </div>

            {/* Banksy quote */}
            <div className="mb-12 transform -rotate-1">
              <p className="text-sm text-zinc-700 font-mono italic">
                "The people who run our cities don't understand graffiti because they think nothing has the right to exist unless it makes a profit"
              </p>
              <p className="text-xs text-zinc-800 font-mono mt-1">- Banksy</p>
            </div>

            {/* Stats - Graffiti Tags */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {t.stats.map((stat, idx) => (
                <div key={idx} className="bg-zinc-900 border-2 border-white rounded-lg p-6 hover:border-gray-300 transition-all duration-200 transform hover:-rotate-1 relative overflow-hidden">
                  {/* Spray paint texture */}
                  <div className="absolute inset-0 noise-texture opacity-30"></div>
                  <div className="relative z-10">
                    <div className="text-3xl font-black text-white mb-2 stencil-text">{stat.value}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                  </div>
                  {/* Corner tag */}
                  <div className="absolute top-1 right-1 text-xs text-zinc-700 font-mono">CD</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 px-4 bg-zinc-950/50 relative">
          {/* Banksy-style stencil background */}
          <div className="absolute top-10 right-20 text-9xl opacity-5 transform rotate-12">🔧</div>
          <div className="absolute bottom-10 left-20 text-8xl opacity-5 transform -rotate-12">⚡</div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 relative">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 stencil-text">
                {t.categories.title}
              </h2>
              {/* Spray paint underline */}
              <div className="w-48 h-2 bg-white mx-auto transform -rotate-1 opacity-30"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {t.categories.items.map((cat, idx) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={idx}
                    to="/tools"
                    className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-6 hover:border-white transition-all duration-200 text-center group transform hover:-rotate-2 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-all border-2 border-black">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="text-2xl font-black text-white mb-1 stencil-text">{cat.count}</div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide font-bold">{cat.name}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Manifesto Section - Banksy Quote Style */}
        <section className="py-24 px-4 relative">
          {/* Graffiti background elements */}
          <div className="absolute top-20 left-10 text-6xl opacity-5 transform -rotate-12">✊</div>
          <div className="absolute bottom-20 right-10 text-7xl opacity-5 transform rotate-12">🚀</div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 text-center stencil-text relative">
              {t.manifesto.title}
              {/* Spray drips */}
              <div className="absolute -bottom-1 left-1/3 w-1 h-6 bg-white opacity-20"></div>
              <div className="absolute -bottom-1 right-1/3 w-1 h-4 bg-white opacity-15"></div>
            </h2>

            <div className="bg-black border-4 border-white rounded-lg p-8 md:p-12 mb-8 transform -rotate-1 shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
              <blockquote className="banksy-quote text-2xl md:text-3xl text-white mb-8 stencil-text">
                "{t.manifesto.quote}"
              </blockquote>

              <div className="space-y-4">
                {t.manifesto.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-lg text-gray-300">
                    <span className="text-white font-black">✓</span>
                    <span className="font-medium">{point}</span>
                  </div>
                ))}
              </div>

              {/* Cemal signature */}
              <div className="mt-8 pt-6 border-t-2 border-zinc-800">
                <p className="text-sm text-gray-500 font-mono text-right transform rotate-1">
                  - Cemal Demirci, 2025
                </p>
              </div>
            </div>

            {/* Banksy Easter Eggs */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 font-mono italic transform -rotate-1">
                [ "Art should comfort the disturbed and disturb the comfortable" ]
              </p>
              <p className="text-xs text-zinc-800 font-mono transform rotate-1">
                "Built with rebellion, served with privacy" - cemal.online
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA - Stencil Style */}
        <section className="py-16 px-4 bg-white relative overflow-hidden">
          {/* Spray paint splatters */}
          <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-black"></div>
          <div className="absolute top-10 right-10 text-8xl opacity-10">🎯</div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-black mb-4 stencil-text transform -rotate-1">
              {language === 'en' ? 'READY?' : 'HAZIR MISIN?'}
            </h3>
            <p className="text-xl text-gray-700 mb-8 font-mono italic">
              {language === 'en'
                ? 'No signup, no tracking, no BS.'
                : 'Kayıt yok, takip yok, saçmalık yok.'}
            </p>
            <Link
              to="/tools"
              className="sticker inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-black text-lg hover:bg-gray-900 transition-all duration-150 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.3)]"
            >
              {language === 'en' ? 'START NOW' : 'HEMEN BAŞLA'}
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Cemal branding */}
            <div className="mt-12 pt-8 border-t-2 border-black">
              <p className="text-sm text-gray-600 font-mono">
                <span className="font-black">CEMAL.ONLINE</span> // Tools & Digital Playground
              </p>
              <p className="text-xs text-gray-500 font-mono mt-2">
                Made in Istanbul 🇹🇷 // Zero BS, Maximum Privacy
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
