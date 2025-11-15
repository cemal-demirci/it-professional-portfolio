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
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading - Stencil Style */}
            <h1 className="text-7xl md:text-9xl font-black text-white mb-6 stencil-text animate-spray">
              {t.hero.greeting}
            </h1>

            <div className="mb-8">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-400 tracking-wide">
                {t.hero.tagline}
              </h2>
            </div>

            <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12">
              {t.hero.description}
            </p>

            {/* CTA Buttons - Minimal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link
                to="/tools"
                className="px-8 py-4 bg-white text-black rounded-lg font-bold text-lg hover:bg-gray-200 transition-all duration-150 border border-white hover:border-gray-300"
              >
                {t.hero.cta1}
              </Link>

              <Link
                to="/about"
                className="px-8 py-4 bg-transparent text-white rounded-lg font-bold text-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-150"
              >
                {t.hero.cta2}
              </Link>
            </div>

            {/* Stats - Minimal Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {t.stats.map((stat, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all duration-200">
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 px-4 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
                {t.categories.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {t.categories.items.map((cat, idx) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={idx}
                    to="/tools"
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all duration-200 text-center group"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-200 transition-all">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{cat.count}</div>
                    <div className="text-sm text-gray-400">{cat.name}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Manifesto Section - Banksy Quote Style */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 text-center">
              {t.manifesto.title}
            </h2>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 md:p-12 mb-8">
              <blockquote className="banksy-quote text-2xl md:text-3xl text-white mb-8">
                "{t.manifesto.quote}"
              </blockquote>

              <div className="space-y-4">
                {t.manifesto.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-lg text-gray-400">
                    <span className="text-white">→</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Banksy Easter Egg */}
            <div className="text-center">
              <p className="text-sm text-gray-600 font-mono italic transform -rotate-1">
                [ "Art should comfort the disturbed and disturb the comfortable" ]
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-black text-black mb-4">
              {language === 'en' ? 'Ready?' : 'Hazır mısın?'}
            </h3>
            <p className="text-xl text-gray-700 mb-8">
              {language === 'en'
                ? 'No signup, no tracking, no BS.'
                : 'Kayıt yok, takip yok, saçmalık yok.'}
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg font-bold text-lg hover:bg-gray-900 transition-all duration-150"
            >
              {language === 'en' ? 'Start Now' : 'Hemen Başla'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
