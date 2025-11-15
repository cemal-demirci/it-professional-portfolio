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
        description: "Corporate tools are slow, bloated, and spy on you. Mine are fast, light, and actually respect your privacy.",
        cta1: "Show Me",
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
        quote: "Tired of slow, bloated tools that sell your data. So I built my own playground. No corporate BS, no paywalls, no tracking.",
        points: [
          "Zero dollars. Always.",
          "Your data stays yours",
          "Everything runs in your browser",
          "Open source vibes"
        ]
      }
    },
    tr: {
      hero: {
        greeting: "Merhaba, Ben Cemal",
        tagline: "Araçlar & Dijital Oyun Alanı",
        description: "Kurumsal araçlar yavaş, şişkin ve seni izliyor. Benimkiler hızlı, hafif ve gizliliğine gerçekten saygı duyuyor.",
        cta1: "Göster",
        cta2: "Hakkımda"
      },
      stats: [
        { label: "AI Araçları", value: "13" },
        { label: "Toplam Araç", value: "70+" },
        { label: "Gizlilik", value: "%100" },
        { label: "Ücret", value: "₺0" }
      ],
      categories: {
        title: "Neler Var",
        items: [
          { name: "AI Araçları", count: "13", icon: Code },
          { name: "Kod", count: "6", icon: Code },
          { name: "Güvenlik", count: "4", icon: Shield },
          { name: "Ağ", count: "12", icon: Network },
          { name: "Windows", count: "4", icon: Terminal },
          { name: "Diğerleri", count: "30+", icon: Wrench }
        ]
      },
      manifesto: {
        title: "Neden Var Bu Site",
        quote: "Yavaş, şişkin ve verini satan araçlardan bıktım. Kendi oyun alanımı kurdum. Kurumsal saçmalık yok, para yok, takip yok.",
        points: [
          "Sıfır para. Hep öyle.",
          "Verin size ait kalıyor",
          "Her şey tarayıcında çalışıyor",
          "Açık kaynak ruhuyla"
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
          {/* Banksy-style graffiti text - hidden on mobile */}
          <div className="hidden md:block absolute top-32 right-12 transform rotate-12 opacity-10">
            <p className="text-6xl font-black text-white stencil-text">NO BS</p>
          </div>
          <div className="hidden md:block absolute bottom-32 left-12 transform -rotate-6 opacity-10">
            <p className="text-5xl font-black text-white stencil-text">FREE TOOLS</p>
          </div>
          <div className="hidden lg:block absolute top-1/2 right-8 transform -translate-y-1/2 rotate-90 opacity-5">
            <p className="text-4xl font-black text-white stencil-text">PRIVACY FIRST</p>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {/* Minimal Professional Header */}
            <div className="mb-12">
              {/* Small tag */}
              <div className="inline-block mb-6 px-4 py-2 border border-zinc-800 rounded-lg">
                <p className="text-sm text-gray-500 font-mono">cemal.online</p>
              </div>

              {/* Main Name - Clean & Minimal */}
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                CEMAL DEMIRCI
              </h1>

              {/* Subtitle - Minimal */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-zinc-800"></div>
                <h2 className="text-xl md:text-2xl text-gray-400 font-light tracking-wide">
                  {t.hero.tagline}
                </h2>
                <div className="h-px w-12 bg-zinc-800"></div>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                {t.hero.description}
              </p>
            </div>

            {/* CTA Buttons - Minimal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/tools"
                className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-all duration-150"
              >
                {t.hero.cta1} →
              </Link>

              <Link
                to="/about"
                className="px-8 py-3 bg-transparent text-white rounded-lg font-semibold border border-zinc-800 hover:border-zinc-600 transition-all duration-150"
              >
                {t.hero.cta2}
              </Link>
            </div>

            {/* Subtle quote */}
            <div className="mb-16">
              <p className="text-sm text-zinc-700 font-mono italic max-w-xl mx-auto">
                "Privacy-first tools. No corporate BS. Just what works."
              </p>
            </div>

            {/* Stats - Minimal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {t.stats.filter(stat => !stat.label.toLowerCase().includes('cost') && !stat.label.toLowerCase().includes('ücret')).map((stat, idx) => (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all duration-200">
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tools Section */}
        <section className="py-24 px-4 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute top-12 left-8 transform -rotate-3 opacity-8">
            <p className="text-5xl font-black text-white stencil-text">TOOLS</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'Featured Tools' : 'Öne Çıkan Araçlar'}
              </h2>
              <p className="text-gray-500">
                {language === 'en' ? 'Most popular tools on the platform' : 'En çok kullanılan araçlar'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  name: language === 'en' ? 'AI Text Analyzer' : 'AI Metin Analizi',
                  desc: language === 'en' ? 'Advanced sentiment & quality analysis' : 'Gelişmiş duygu ve kalite analizi',
                  icon: '🤖',
                  path: '/tools/text-analyzer'
                },
                {
                  name: language === 'en' ? 'Network Diagnostics' : 'Ağ Teşhisi',
                  desc: language === 'en' ? 'Complete network troubleshooting' : 'Ağ sorunlarını tespit eder',
                  icon: '🌐',
                  path: '/tools/network-diagnostics'
                },
                {
                  name: language === 'en' ? 'Password Generator' : 'Şifre Oluşturucu',
                  desc: language === 'en' ? 'Secure password generation' : 'Güvenli şifreler oluşturur',
                  icon: '🔐',
                  path: '/tools/password-generator'
                }
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  to={tool.path}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all group"
                >
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300">{tool.name}</h3>
                  <p className="text-gray-500 text-sm">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Wall of Shame Section */}
        <section className="py-24 px-4 bg-zinc-950/50 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute top-16 right-16 transform rotate-6 opacity-8">
            <p className="text-6xl font-black text-white stencil-text">SHAME</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'Wall of Shame' : 'Utanç Duvarı'}
              </h2>
              <p className="text-gray-500">
                {language === 'en' ? 'Corporate tools you probably hate (but keep using)' : 'Muhtemelen nefret ettiğin (ama kullanmaya devam ettiğin) kurumsal araçlar'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Google Analytics',
                  shame: language === 'en' ? 'Tracks your visitors, then sells the data' : 'Ziyaretçilerini izler, sonra verisini satar',
                  icon: '🕵️',
                  price: language === 'en' ? 'Free (you\'re the product)' : 'Bedava (sen ürünsün)'
                },
                {
                  name: 'Adobe Creative Cloud',
                  shame: language === 'en' ? 'Mortgage your kidney for Photoshop' : 'Photoshop için böbreğini ipotek et',
                  icon: '💸',
                  price: '$54.99/mo'
                },
                {
                  name: 'Zoom',
                  shame: language === 'en' ? 'Your boss watches you, we watch you too' : 'Patron seni gözetlerken biz de seni gözetliyoruz',
                  icon: '👁️',
                  price: language === 'en' ? 'Free (with data mining)' : 'Bedava (veri madenciliği ile)'
                },
                {
                  name: 'Microsoft 365',
                  shame: language === 'en' ? 'Subscription hell since 2011' : '2011\'den beri abonelik cehennemi',
                  icon: '🔥',
                  price: '$12.50/mo'
                },
                {
                  name: 'Slack',
                  shame: language === 'en' ? 'Pay to get distracted 24/7' : 'Dikkatinin dağılması için para öde',
                  icon: '💬',
                  price: '$7.25/mo'
                },
                {
                  name: 'Salesforce',
                  shame: language === 'en' ? 'Complicated AF, expensive AF' : 'Karmaşık AF, pahalı AF',
                  icon: '🤮',
                  price: language === 'en' ? 'Call for quote (lol)' : 'Teklif için ara (lol)'
                }
              ].map((tool, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 border-2 border-red-900/50 rounded-lg p-6 hover:border-red-700 transition-all relative"
                >
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-black px-2 py-1 rounded transform rotate-12">
                    {language === 'en' ? 'SHAME' : 'UTANÇ'}
                  </div>
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-red-400 text-sm mb-3 italic">"{tool.shame}"</p>
                  <p className="text-gray-500 text-xs line-through">{tool.price}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-500 italic">
                {language === 'en'
                  ? 'Meanwhile, everything here is free and respects your privacy. Just saying.'
                  : 'Bu arada buradaki her şey bedava ve gizliliğine saygı duyuyor. Yalnızca söylüyorum.'}
              </p>
            </div>
          </div>
        </section>

        {/* AI Chatbots Section */}
        <section className="py-24 px-4 bg-black relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute bottom-16 right-12 transform rotate-6 opacity-8">
            <p className="text-6xl font-black text-white stencil-text">AI</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'AI Chatbots' : 'AI Sohbet Botları'}
              </h2>
              <p className="text-gray-500">
                {language === 'en' ? 'Specialized AI assistants for IT professionals' : 'IT uzmanları için yapay zeka asistanları'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: language === 'en' ? 'Event Correlator' : 'Olay İlişkilendirici',
                  desc: language === 'en' ? 'Analyze and correlate system events' : 'Sistem olaylarını analiz edip ilişkilendirir',
                  icon: '🔍',
                  path: '/ai-bots/event-correlator'
                },
                {
                  name: language === 'en' ? 'Cert Analyzer' : 'Sertifika Analizi',
                  desc: language === 'en' ? 'SSL/TLS certificate analysis' : 'SSL/TLS sertifikalarını analiz eder',
                  icon: '🔐',
                  path: '/ai-bots/cert-analyzer'
                },
                {
                  name: language === 'en' ? 'DR Planner' : 'DR Planlayıcı',
                  desc: language === 'en' ? 'Disaster recovery planning' : 'Felaket kurtarma planları yapar',
                  icon: '🚨',
                  path: '/ai-bots/dr-planner'
                },
                {
                  name: language === 'en' ? 'Perf Troubleshooter' : 'Performans Sorun Giderici',
                  desc: language === 'en' ? 'Performance issue diagnosis' : 'Performans sorunlarını tespit eder',
                  icon: '⚡',
                  path: '/ai-bots/perf-troubleshooter'
                },
                {
                  name: language === 'en' ? 'Proxmox Assistant' : 'Proxmox Asistanı',
                  desc: language === 'en' ? 'Proxmox VE expert assistant' : 'Proxmox VE uzman asistanı',
                  icon: '🖥️',
                  path: '/ai-bots/proxmox-assistant'
                },
                {
                  name: language === 'en' ? 'Script Generator' : 'Script Üretici',
                  desc: language === 'en' ? 'Generate automation scripts' : 'Otomasyon scriptleri oluşturur',
                  icon: '📜',
                  path: '/ai-bots/script-generator'
                }
              ].map((bot, idx) => (
                <Link
                  key={idx}
                  to={bot.path}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all group"
                >
                  <div className="text-4xl mb-4">{bot.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300">{bot.name}</h3>
                  <p className="text-gray-500 text-sm">{bot.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 px-4 bg-zinc-950/50 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute top-20 left-16 transform -rotate-12 opacity-8">
            <p className="text-7xl font-black text-white stencil-text">70+</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                {t.categories.title}
              </h2>
              <div className="w-16 h-1 bg-white mx-auto opacity-20"></div>
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
                    <div className="text-sm text-gray-500">{cat.name}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-24 px-4 bg-zinc-950/50 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute bottom-12 right-20 transform rotate-3 opacity-8">
            <p className="text-5xl font-black text-white stencil-text">REACT</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'Built With' : 'Teknolojiler'}
              </h2>
              <p className="text-gray-500">
                {language === 'en' ? 'Modern tech stack for maximum performance' : 'Hızlı ve modern teknolojilerle yapıldı'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'React 18', icon: '⚛️' },
                { name: 'Vite', icon: '⚡' },
                { name: 'TailwindCSS', icon: '🎨' },
                { name: 'Google AI', icon: '🤖' },
                { name: 'Node.js', icon: '🟢' },
                { name: 'Vercel', icon: '▲' }
              ].map((tech, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center hover:border-zinc-700 transition-all"
                >
                  <div className="text-3xl mb-2">{tech.icon}</div>
                  <div className="text-sm text-gray-400">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-24 px-4 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute top-16 right-8 transform rotate-12 opacity-8">
            <p className="text-6xl font-black text-white stencil-text">HACK</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'Expertise' : 'Uzmanlık Alanları'}
              </h2>
              <p className="text-gray-500">
                {language === 'en' ? 'What I bring to the table' : 'Neler yapabilirim'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: language === 'en' ? 'IT Infrastructure' : 'IT Altyapı',
                  desc: language === 'en' ? 'Enterprise systems & networks' : 'Kurumsal sistemler ve ağlar',
                  icon: '🖥️'
                },
                {
                  title: language === 'en' ? 'AI Integration' : 'AI Entegrasyonu',
                  desc: language === 'en' ? 'Smart automation tools' : 'Akıllı otomasyon araçları',
                  icon: '🤖'
                },
                {
                  title: language === 'en' ? 'Security' : 'Güvenlik',
                  desc: language === 'en' ? 'Privacy-first approach' : 'Gizlilik odaklı yaklaşım',
                  icon: '🔒'
                },
                {
                  title: language === 'en' ? 'Web Development' : 'Web Geliştirme',
                  desc: language === 'en' ? 'Modern, fast interfaces' : 'Modern, hızlı arayüzler',
                  icon: '⚡'
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Satirical Testimonials Section */}
        <section className="py-24 px-4 bg-black relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute bottom-12 left-8 transform -rotate-12 opacity-8">
            <p className="text-6xl font-black text-white stencil-text">LOL</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'What They Say' : 'Ne Diyorlar'}
              </h2>
              <p className="text-gray-500">
                {language === 'en' ? '(Totally real reviews, trust me bro)' : '(Kesinlikle gerçek yorumlar, inan bana kardeşim)'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: language === 'en' ? 'Disappointed you don\'t sell my data' : 'Verilerimi satmadığınız için hayal kırıklığına uğradım',
                  author: language === 'en' ? 'Google CEO' : 'Google CEO\'su',
                  avatar: '😢',
                  rating: '★☆☆☆☆'
                },
                {
                  quote: language === 'en' ? 'How are you not making money? This is madness!' : 'Nasıl para kazanmıyorsunuz ki? Bu delilik!',
                  author: 'Mark Zuckerberg',
                  avatar: '🤯',
                  rating: '★☆☆☆☆'
                },
                {
                  quote: language === 'en' ? 'Privacy in 2025? You\'re kidding, right?' : 'Gizlilik mi? 2025\'te mi? Şaka yapıyorsunuz değil mi?',
                  author: language === 'en' ? 'A SaaS Startup' : 'Bir SaaS Girişimi',
                  avatar: '🤑',
                  rating: '★☆☆☆☆'
                },
                {
                  quote: language === 'en' ? 'Where\'s the subscription? Where\'s the paywall?' : 'Abonelik nerede? Ücretli duvar nerede?',
                  author: 'Adobe',
                  avatar: '💸',
                  rating: '★☆☆☆☆'
                },
                {
                  quote: language === 'en' ? 'This is hurting our business model' : 'Bu bizim iş modelimize zarar veriyor',
                  author: language === 'en' ? 'Big Tech Coalition' : 'Big Tech Koalisyonu',
                  avatar: '🏢',
                  rating: '★☆☆☆☆'
                },
                {
                  quote: language === 'en' ? 'Actually useful and free? Unfair competition!' : 'Gerçekten kullanışlı ve bedava mı? Haksız rekabet!',
                  author: 'Microsoft',
                  avatar: '😠',
                  rating: '★☆☆☆☆'
                }
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all relative"
                >
                  <div className="absolute top-3 right-3 text-2xl">{testimonial.rating}</div>
                  <div className="text-5xl mb-4">{testimonial.avatar}</div>
                  <blockquote className="text-gray-300 italic mb-4">"{testimonial.quote}"</blockquote>
                  <p className="text-sm text-gray-500 font-semibold">— {testimonial.author}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-500 text-sm italic">
                {language === 'en'
                  ? '* These reviews are satirical. Big Tech actually loves ignoring us.'
                  : '* Bu yorumlar satiriktir. Big Tech aslında bizi görmezden gelmeyi seviyor.'}
              </p>
            </div>
          </div>
        </section>

        {/* Manifesto Section - Clean */}
        <section className="py-24 px-4 bg-zinc-950/50 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute top-24 left-8 transform -rotate-6 opacity-8">
            <p className="text-5xl font-black text-white stencil-text">WHY?</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8 text-center">
              {t.manifesto.title}
            </h2>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 md:p-12 mb-8">
              <blockquote className="text-xl md:text-2xl text-white mb-8 italic border-l-4 border-white pl-6">
                "{t.manifesto.quote}"
              </blockquote>

              <div className="space-y-3">
                {t.manifesto.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-gray-300">
                    <span className="text-white">→</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Signature */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <p className="text-sm text-gray-500 font-mono text-right">
                  — Cemal Demirci
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Big Tech vs Me Comparison Section */}
        <section className="py-24 px-4 bg-zinc-950/50 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute top-16 left-16 transform -rotate-6 opacity-8">
            <p className="text-6xl font-black text-white stencil-text">VS</p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'Them vs Me' : 'Onlar vs Ben'}
              </h2>
              <p className="text-gray-500">
                {language === 'en' ? 'The difference is pretty obvious' : 'Fark oldukça açık'}
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-800">
                      <th className="px-6 py-4 text-left text-white font-black">{language === 'en' ? 'Feature' : 'Özellik'}</th>
                      <th className="px-6 py-4 text-center text-red-400 font-black">Big Tech 🏢</th>
                      <th className="px-6 py-4 text-center text-green-400 font-black">cemal.online ✨</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: language === 'en' ? 'Data Collection' : 'Veri Toplama',
                        them: language === 'en' ? 'Everything' : 'Her şey',
                        me: language === 'en' ? 'Nothing' : 'Hiçbir şey',
                        themIcon: '🕵️',
                        meIcon: '🙈'
                      },
                      {
                        feature: language === 'en' ? 'Price' : 'Fiyat',
                        them: '$99/mo',
                        me: '$0',
                        themIcon: '💸',
                        meIcon: '🎉'
                      },
                      {
                        feature: language === 'en' ? 'Privacy' : 'Gizlilik',
                        them: 'LOL',
                        me: language === 'en' ? 'Actual real privacy' : 'Gerçek gizlilik',
                        themIcon: '🤡',
                        meIcon: '🔒'
                      },
                      {
                        feature: language === 'en' ? 'Terms of Service' : 'Kullanım Şartları',
                        them: language === 'en' ? '47 pages' : '47 sayfa',
                        me: language === 'en' ? 'Use it, don\'t be evil' : 'Kullan, kötü olma',
                        themIcon: '📄',
                        meIcon: '✌️'
                      },
                      {
                        feature: language === 'en' ? 'Ads' : 'Reklamlar',
                        them: language === 'en' ? 'Everywhere' : 'Her yerde',
                        me: language === 'en' ? 'None. Ever.' : 'Yok. Asla olmayacak.',
                        themIcon: '🎯',
                        meIcon: '🚫'
                      },
                      {
                        feature: language === 'en' ? 'Account Required' : 'Hesap Gerekli mi',
                        them: language === 'en' ? 'Yes + email + phone' : 'Evet + email + telefon',
                        me: language === 'en' ? 'Nope' : 'Hayır',
                        themIcon: '📧',
                        meIcon: '🎊'
                      },
                      {
                        feature: language === 'en' ? 'Sells Your Data' : 'Verini Satar mı',
                        them: language === 'en' ? 'That\'s the business model' : 'İş modeli bu',
                        me: language === 'en' ? 'What data?' : 'Hangi veri?',
                        themIcon: '💰',
                        meIcon: '🤷'
                      }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-t border-zinc-800">
                        <td className="px-6 py-4 text-white font-semibold">{row.feature}</td>
                        <td className="px-6 py-4 text-center text-red-400">
                          <div className="flex items-center justify-center gap-2">
                            <span>{row.themIcon}</span>
                            <span>{row.them}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-green-400">
                          <div className="flex items-center justify-center gap-2">
                            <span>{row.meIcon}</span>
                            <span className="font-bold">{row.me}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-500 italic text-sm">
                {language === 'en'
                  ? '* All comparisons are 100% factual. Fight me.'
                  : '* Tüm karşılaştırmalar %100 gerçektir. Kavga et benimle.'}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Facts Section */}
        <section className="py-24 px-4 relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute bottom-20 left-12 transform rotate-3 opacity-8">
            <p className="text-7xl font-black text-white stencil-text">100%</p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                {language === 'en' ? 'Why Choose This?' : 'Neden Burası?'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: language === 'en' ? '100% Privacy' : '%100 Gizlilik',
                  desc: language === 'en' ? 'All tools run locally in your browser. Zero data collection.' : 'Her şey tarayıcında çalışır. Hiçbir veri toplamıyorum.',
                  icon: '🔒'
                },
                {
                  title: language === 'en' ? 'Always Free' : 'Tamamen Ücretsiz',
                  desc: language === 'en' ? 'No paywalls, no subscriptions. Just use the tools you need.' : 'Para yok, abonelik yok. Sadece kullan.',
                  icon: '💰'
                },
                {
                  title: language === 'en' ? 'No Account' : 'Hesap Gerektirmiyor',
                  desc: language === 'en' ? 'Start using immediately. No signup, no email, no BS.' : 'Hemen kullanmaya başla. Kayıt yok, email yok, saçmalık yok.',
                  icon: '⚡'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Minimal */}
        <section className="py-16 px-4 bg-white relative">
          {/* Banksy graffiti - hidden on mobile */}
          <div className="hidden md:block absolute top-8 right-16 transform -rotate-12 opacity-10">
            <p className="text-6xl font-black text-black stencil-text">START</p>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-black text-black mb-4">
              {language === 'en' ? 'Ready to Start?' : 'Başlayalım mı?'}
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'en'
                ? 'No signup. No tracking. Just tools.'
                : 'Kayıt yok. Takip yok. Sadece araçlar var.'}
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-all duration-150"
            >
              {language === 'en' ? 'Explore Tools' : 'Araçlara Göz At'}
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Footer info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                cemal.online — Made in Istanbul 🇹🇷
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
