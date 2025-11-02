import { useState, useEffect } from 'react'
import { BookOpen, MessageSquare, Sparkles, GraduationCap, Zap, Rocket, Brain } from 'lucide-react'
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
      description: 'Yeni başlayanlar için eğlenceli ve anlaşılır IT terimleri sözlüğü. Cemal tarzında!',
      link: '/junior-it/glossary',
      color: 'from-slate-700 to-slate-600'
    },
    {
      icon: MessageSquare,
      title: 'AI Soru Botu',
      description: 'IT sorunlarına anında cevap! Cemal AI destekli chatbot ile istediğin soruyu sor.',
      link: '#chatbot',
      color: 'from-slate-700 to-slate-600'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold">Junior IT'ler İçin</h1>
          <p className="text-base text-white/90">
            IT dünyasına yeni mi başladın? Doğru yerdesin!
          </p>
          <p className="text-sm text-white/80 max-w-2xl mx-auto">
            Cemal tarzında IT terimleri, AI destekli soru-cevap ve daha fazlası. Eğlenerek öğren!
          </p>
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
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
                <div className="pt-3">
                  <span className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all">
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
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-5 text-white mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-7 h-7" />
            <div>
              <h2 className="text-xl font-bold">AI IT Soru Botu</h2>
              <p className="text-sm text-white/90">IT sorunlarını sor, Cemal AI anında cevaplasın!</p>
            </div>
          </div>
        </div>
        <ITChatbot />
      </div>

      {/* Learning Tips */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Junior IT için Öğrenme İpuçları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-slate-600">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-1">
              Lab Kur, Pratik Yap
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-400">
              VirtualBox/VMware kur, Windows Server/Linux denemeler yap. Kitaptan öğrenme yetmez!
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-slate-600">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-1">
              Sertifika Hedefle
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-400">
              CompTIA A+, Network+, Security+ ile başla. MCSA artık yok ama Azure/AWS cert'ler var!
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-slate-600">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-1">
              Google Kullanmayı Öğren
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-400">
              "Error code + Windows" yaz Google'a. Stack Overflow senin arkadaşın. Reddit IT subs takip et!
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-slate-600">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-1">
              Toplulukta Aktif Ol
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-400">
              Discord IT sunucularına katıl, forumları takip et. Soru sor, cevap ver, network kur!
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className={`bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
          Faydalı Kaynaklar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-slate-700 dark:text-slate-300">
            <strong>YouTube:</strong>
            <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Can Değer</li>
              <li>• Türk IT kanalları</li>
              <li>• Professor Messer</li>
              <li>• NetworkChuck</li>
            </ul>
          </div>
          <div className="text-slate-700 dark:text-slate-300">
            <strong>Döküman:</strong>
            <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Microsoft Learn</li>
              <li>• Linux man pages</li>
              <li>• DigitalOcean tutorials</li>
            </ul>
          </div>
          <div className="text-slate-700 dark:text-slate-300">
            <strong>Lab:</strong>
            <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li>• TryHackMe</li>
              <li>• HackTheBox</li>
              <li>• Azure/AWS Free Tier</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div className="text-center py-6 text-slate-600 dark:text-slate-400">
        <p className="text-base font-semibold mb-2">
          Başarılar Junior! Öğrenmeye devam et, vazgeçme.
        </p>
        <p className="text-sm">
          Bugün öğrendiğin her şey, yarın seni senior yapacak.
        </p>
        <p className="text-xs mt-4 text-slate-400 dark:text-slate-600">
          Made by Cemal Demirci
        </p>
      </div>
    </div>
  )
}

export default JuniorIT
