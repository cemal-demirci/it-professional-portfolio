import { useRainbow } from '../contexts/RainbowContext'
import { Heart, Sparkles, ExternalLink } from 'lucide-react'

const RainbowModeToolBlocker = ({ children }) => {
  const { rainbowMode } = useRainbow()

  if (!rainbowMode) {
    return children
  }

  const hornetMessages = [
    {
      title: "⚠️ BİZ BURADA GEY İSTEMİYORUZ!",
      subtitle: "(Ama her yer rainbow... ironic değil mi? 🌈)",
      message: "IT tools'lar çalışmıyor çünkü bu site artık 100% FABULOUS! 💅",
      cta: "Gerçek aşkı bul, Hornet'i indir! 🐝"
    },
    {
      title: "🚫 TOOL DEVRE DIŞI!",
      subtitle: "Gaylik algılandı, sistemler kapandı! 🏳️‍🌈",
      message: "Bu tool straight people için. Sen fabulous olduktan sonra artık network tool'a ihtiyacın yok, Hornet'te network kur! 💋",
      cta: "Hornet'te yeni connections bul! 📱"
    },
    {
      title: "❌ HETEROSEXİM ONLY ZONE!",
      subtitle: "(En büyük yalan 😂)",
      message: "Bu IT tool çok boring! Sen daha eğlenceli şeyler yapabilirsin... Mesela Hornet'i indir! 🦄",
      cta: "Download Hornet NOW! 🐝✨"
    },
    {
      title: "🚨 GAY ALERT ACTIVATED!",
      subtitle: "Rainbow mode tespit edildi! 🌈",
      message: "Sistemlerimiz bu kadar FABULOUSNESS'a hazır değil! IT araçları yerine dating app'leri daha mantıklı olacak. 💅",
      cta: "Hornet: Where IT gays meet! 📲"
    },
    {
      title: "💻 404 ERROR: Straightness Not Found!",
      subtitle: "Bu site artık %100 FABULOUS certified! ✨",
      message: "IT tools? Honey, sen Grindr ve Hornet kullanmalısın! LinkedIn'den daha iyi networking olur. 😉",
      cta: "Join the BEE-utiful community! 🐝🌈"
    },
    {
      title: "⛔ NO HOMO? BIG HOMO!",
      subtitle: "Welcome to the gay side! 🏳️‍🌈",
      message: "Bu tool heterolar için tasarlandı. Sen artık upgrade olup Hornet kullanmalısın bestie! 💎",
      cta: "Hornet: IT professionals' choice! 💪"
    },
    {
      title: "🦄 STRAIGHT.EXE HAS STOPPED WORKING",
      subtitle: "Sistem tamamen GAY'e geçti! 🌈",
      message: "Cybersecurity mi? Honey, önce heart-security'ni düşün! Hornet'te aşkını bul! 💕",
      cta: "Click here for LEGENDARY dates! 🐝"
    }
  ]

  const randomMessage = hornetMessages[Math.floor(Math.random() * hornetMessages.length)]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Animated Rainbow Border */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-yellow-600 via-green-600 via-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-75 animate-pulse"></div>

          <div className="relative bg-gray-900 rounded-3xl p-8 border-4 border-transparent bg-clip-padding">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center gap-2 mb-4 animate-bounce">
                <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
                <Sparkles className="w-12 h-12 text-yellow-400" />
                <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
              </div>

              <h1 className="text-4xl font-black text-white mb-2 animate-pulse">
                {randomMessage.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                {randomMessage.subtitle}
              </p>
            </div>

            {/* Message */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 mb-6 border-2 border-purple-500/30">
              <p className="text-lg text-white text-center leading-relaxed">
                {randomMessage.message}
              </p>
            </div>

            {/* Hornet CTA */}
            <div className="space-y-4">
              <a
                href="https://hornet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">🐝</span>
                  <span>{randomMessage.cta}</span>
                  <ExternalLink className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://apps.apple.com/app/hornet-gay-social-network/id436698816"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-semibold transition-colors border border-gray-700 flex items-center justify-center gap-2"
                >
                  <span className="text-2xl">🍎</span>
                  <span>App Store</span>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.hornet.android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-semibold transition-colors border border-gray-700 flex items-center justify-center gap-2"
                >
                  <span className="text-2xl">🤖</span>
                  <span>Play Store</span>
                </a>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400 mb-3">
                💡 <span className="font-bold text-purple-400">Fun Fact:</span> IT professionals make the best partners!
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div>🌈 100% Fabulous</div>
                <div>💅 Extremely Slay</div>
                <div>🦄 Certified Gay</div>
              </div>
            </div>

            {/* Small print */}
            <p className="text-center text-xs text-gray-600 mt-6">
              (Rainbow modunu kapatmak için tekrar "rainbow" yaz 😉)
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes rainbow-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}

export default RainbowModeToolBlocker
