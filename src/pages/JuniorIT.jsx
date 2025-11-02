import { useState, useEffect } from 'react'
import { BookOpen, MessageSquare, Sparkles, GraduationCap, Coffee, Zap, Rocket, Brain } from 'lucide-react'
import { Link } from 'react-router-dom'
import ITChatbot from '../components/ITChatbot'

const JuniorIT = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: 'IT Sözlük',
      description: 'Yeni başlayanlar için eğlenceli ve anlaşılır IT terimleri sözlüğü. Cemal ama öğretici!',
      link: '/junior-it/glossary',
      color: 'from-orange-600 to-red-600',
      emoji: '📖'
    },
    {
      icon: MessageSquare,
      title: 'AI Soru Botu',
      description: 'IT sorunlarına anında cevap! Cemal AI destekli chatbot ile istediğin soruyu sor.',
      link: '#chatbot',
      color: 'from-purple-600 to-pink-600',
      emoji: '🤖'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl p-8 text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="w-12 h-12 animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-bold">Junior IT'ler İçin</h1>
            <Rocket className="w-12 h-12 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-xl text-white/90">
            IT dünyasına yeni mi başladın? Doğru yerdesin! 🎯
          </p>
          <p className="text-sm text-white/80 max-w-2xl mx-auto">
            Cemal ama öğretici tarzda IT terimleri, AI destekli soru-cevap ve daha fazlası!
            Eğlenerek öğren, öğrenerek eğlen 😎
          </p>
        </div>
      </div>

      {/* Turkish Only Warning */}
      <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-600 p-4 rounded-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <Coffee className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <strong>🇹🇷 Sadece Türkçe (Turkish Only):</strong> Bu bölüm tamamen Türkçe dilinde hazırlanmıştır.
            İngilizce kaynak arıyorsan Google, Stack Overflow falan var zaten! 😅
            Burası Türk junior'lar için özel hazırlandı ❤️
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon
          return (
            <Link
              key={idx}
              to={feature.link}
              className={`group bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-700 hover:shadow-2xl hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + idx * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <span>{feature.title}</span>
                  <span className="text-3xl">{feature.emoji}</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                <div className="pt-4">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold group-hover:shadow-lg transition-all">
                    Başla →
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* AI Chatbot Section */}
      <div id="chatbot" className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">AI IT Soru Botu</h2>
              <p className="text-white/90">IT sorunlarını sor, Cemal AI anında cevaplasın! 🤖</p>
            </div>
          </div>
        </div>
        <ITChatbot />
      </div>

      {/* Learning Tips */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-600" />
          Junior IT için Öğrenme İpuçları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
            <h3 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">
              💻 Lab Kur, Pratik Yap
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-300">
              VirtualBox/VMware kur, Windows Server/Linux denemeler yap. Kitaptan öğrenme yetmez!
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              📚 Sertifika Hedefle
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              CompTIA A+, Network+, Security+ ile başla. MCSA artık yok ama Azure/AWS cert'ler var!
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              🔍 Google Kullanmayı Öğren
            </h3>
            <p className="text-sm text-green-800 dark:text-green-300">
              "Error code + Windows" yaz Google'a. Stack Overflow senin arkadaşın. Reddit IT subs takip et!
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              🤝 Toplulukta Aktif Ol
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Discord IT sunucularına katıl, forumları takip et. Soru sor, cevap ver, network kur!
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className={`bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Faydalı Kaynaklar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-gray-700 dark:text-gray-300">
            <strong>🎥 YouTube:</strong>
            <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Can Değer</li>
              <li>• Türk IT kanalları</li>
              <li>• Professor Messer</li>
              <li>• NetworkChuck</li>
            </ul>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <strong>📖 Döküman:</strong>
            <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Microsoft Learn</li>
              <li>• Linux man pages</li>
              <li>• DigitalOcean tutorials</li>
            </ul>
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <strong>🛠️ Lab:</strong>
            <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <li>• TryHackMe</li>
              <li>• HackTheBox</li>
              <li>• Azure/AWS Free Tier</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div className="text-center py-6 text-gray-600 dark:text-gray-400">
        <p className="text-lg font-semibold mb-2">
          🚀 Başarılar Junior! Öğrenmeye devam et, vazgeçme!
        </p>
        <p className="text-sm">
          Bugün öğrendiğin her şey, yarın seni senior yapacak 💪
        </p>
        <p className="text-xs mt-4 text-gray-400 dark:text-gray-600">
          Made with ❤️ and lots of ☕ by Cemal Demirci
        </p>
      </div>
    </div>
  )
}

export default JuniorIT
