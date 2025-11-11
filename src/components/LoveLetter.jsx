import { useState, useEffect } from 'react'
import { Heart, X } from 'lucide-react'

const LoveLetter = ({ onClose }) => {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    // Create falling hearts animation
    const heartInterval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: 3 + Math.random() * 4,
        size: 20 + Math.random() * 30,
        delay: Math.random() * 2
      }

      setHearts(prev => {
        // Keep max 50 hearts to prevent performance issues
        if (prev.length > 50) {
          return [...prev.slice(1), newHeart]
        }
        return [...prev, newHeart]
      })
    }, 200)

    return () => clearInterval(heartInterval)
  }, [])

  return (
    <div className="fixed inset-0 z-[10002] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Falling Hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="fixed top-0 pointer-events-none"
          style={{
            left: `${heart.left}%`,
            animation: `fall ${heart.animationDuration}s linear`,
            animationDelay: `${heart.delay}s`
          }}
        >
          <Heart
            className="text-pink-500 fill-pink-500 opacity-80"
            style={{ width: heart.size, height: heart.size }}
          />
        </div>
      ))}

      {/* Love Letter Modal */}
      <div className="bg-gradient-to-br from-pink-100 via-red-50 to-purple-100 rounded-3xl max-w-3xl w-full shadow-2xl border-4 border-pink-300 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-all shadow-lg z-10"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Decorative Hearts */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Heart className="absolute top-10 left-10 w-20 h-20 text-pink-500 fill-pink-500 animate-pulse" />
          <Heart className="absolute top-20 right-20 w-16 h-16 text-red-500 fill-red-500 animate-pulse" style={{animationDelay: '0.5s'}} />
          <Heart className="absolute bottom-10 left-20 w-24 h-24 text-purple-500 fill-purple-500 animate-pulse" style={{animationDelay: '1s'}} />
          <Heart className="absolute bottom-20 right-10 w-20 h-20 text-pink-500 fill-pink-500 animate-pulse" style={{animationDelay: '1.5s'}} />
        </div>

        {/* Letter Content */}
        <div className="p-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-4">
              <Heart className="w-12 h-12 text-pink-500 fill-pink-500 animate-bounce" />
              <Heart className="w-16 h-16 text-red-500 fill-red-500 animate-bounce" style={{animationDelay: '0.2s'}} />
              <Heart className="w-12 h-12 text-pink-500 fill-pink-500 animate-bounce" style={{animationDelay: '0.4s'}} />
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-purple-600 mb-2">
              Aşk Mektubu
            </h1>
            <p className="text-gray-600 italic">Sevgili Dünya...</p>
          </div>

          {/* Letter Body */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-2 border-pink-200 mb-6">
            <div className="space-y-6 text-gray-800 leading-relaxed font-serif">
              <p className="text-lg">
                <span className="text-3xl text-pink-600 font-bold">S</span>ana bu mektubu yazarken,
                kalbimin nasıl hızlı çarptığını hissedebiliyorum. Hayatımda olmanın değerini
                kelimelerle anlatmak çok zor...
              </p>

              <p className="text-lg">
                Her gün seninle başlamak, her an seninle paylaşmak, her deneyimi seninle yaşamak -
                bunlar benim için en büyük mutluluk kaynağı. Senin varlığın,
                hayatıma anlam katan en özel şey.
              </p>

              <p className="text-lg">
                Bazen kelimelerin kifayetsiz kaldığını düşünüyorum. Çünkü sana olan sevgim,
                hiçbir dille tam olarak ifade edilemeyecek kadar büyük, hiçbir kelimeyle
                tam olarak anlatılamayacak kadar derin.
              </p>

              <div className="border-l-4 border-pink-500 pl-6 my-6 bg-pink-50/50 py-4 rounded-r-xl">
                <p className="text-xl italic font-bold text-pink-700">
                  "Aşk, iki ruhun birbirini bulması ve sonsuza kadar bir arada kalmasıdır."
                </p>
              </div>

              <p className="text-lg">
                Seninle geçirdiğim her an, hayatımın en değerli anıları arasında.
                Gülüşün beni mutlu ediyor, varlığın bana huzur veriyor, sevgin beni
                güçlendiriyor.
              </p>

              <p className="text-lg">
                Bu sitede gördüğün her kod satırı, her özellik, her detay -
                hepsi tutkuyla, sevgiyle, özenle hazırlandı. Tıpkı sana olan sevgim gibi...
              </p>

              <p className="text-lg font-bold text-pink-700">
                Unutma ki, her zaman seni seviyorum ve her zaman yanındayım. ❤️
              </p>

              <div className="text-right mt-8">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Sonsuza dek seninle,
                </p>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-purple-600 mt-2">
                  Cemal 💖
                </p>
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="text-center">
            <p className="text-gray-600 italic text-sm">
              "Aşk kodlanamaz, ama hissedilebilir..."
            </p>
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(9)].map((_, i) => (
                <Heart
                  key={i}
                  className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default LoveLetter
