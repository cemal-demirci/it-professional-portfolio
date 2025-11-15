import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const BanksyQuote = () => {
  const { language } = useLanguage()
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const quotes = {
    en: [
      { text: "Art should comfort the disturbed and disturb the comfortable.", author: "Banksy", icon: "🎨" },
      { text: "I don't think about art when I'm working. I try to think about life.", author: "Jean-Michel Basquiat", icon: "👑" },
      { text: "In the future, everyone will be world-famous for 15 minutes.", author: "Andy Warhol", icon: "🎭" },
      { text: "The greatest crimes are not committed by people breaking the rules but by people following them.", author: "Banksy", icon: "🎨" },
      { text: "Art is how we decorate space, music is how we decorate time.", author: "Jean-Michel Basquiat", icon: "👑" },
      { text: "Don't think about making art, just get it done. Let everyone else decide if it's good or bad.", author: "Andy Warhol", icon: "🎭" },
      { text: "People say graffiti is ugly. But that's only if it's done properly.", author: "Banksy", icon: "🎨" },
      { text: "I wanted to paint like a machine.", author: "Andy Warhol", icon: "🎭" },
      { text: "Believe it or not, I can actually draw.", author: "Jean-Michel Basquiat", icon: "👑" },
      { text: "If you want to achieve greatness, stop asking for permission.", author: "Banksy", icon: "🎨" }
    ],
    tr: [
      { text: "Sanat rahatsız olanı rahatlatmalı ve rahat olanı rahatsız etmeli.", author: "Banksy", icon: "🎨" },
      { text: "Çalışırken sanatı düşünmem. Hayatı düşünmeye çalışırım.", author: "Jean-Michel Basquiat", icon: "👑" },
      { text: "Gelecekte herkes 15 dakikalığına dünyaca ünlü olacak.", author: "Andy Warhol", icon: "🎭" },
      { text: "En büyük suçlar kuralları çiğneyenler değil, onlara uyanlar tarafından işlenir.", author: "Banksy", icon: "🎨" },
      { text: "Sanat mekanı, müzik zamanı süsleme şeklimizdir.", author: "Jean-Michel Basquiat", icon: "👑" },
      { text: "Sanat yapmayı düşünme, sadece yap. İyi mi kötü mü, bırak herkes karar versin.", author: "Andy Warhol", icon: "🎭" },
      { text: "İnsanlar grafitinin çirkin olduğunu söyler. Ama bu sadece düzgün yapıldığında geçerli.", author: "Banksy", icon: "🎨" },
      { text: "Bir makine gibi boyamak istedim.", author: "Andy Warhol", icon: "🎭" },
      { text: "İnan ya da inanma, aslında çizim yapabilirim.", author: "Jean-Michel Basquiat", icon: "👑" },
      { text: "Büyüklüğe ulaşmak istiyorsan izin istemeyi bırak.", author: "Banksy", icon: "🎨" }
    ]
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) =>
          (prevIndex + 1) % quotes[language].length
        )
        setIsVisible(true)
      }, 500) // Wait for fade out
    }, 8000) // Change quote every 8 seconds

    return () => clearInterval(interval)
  }, [language, quotes])

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className={`bg-zinc-800/50 backdrop-blur-xl border border-zinc-700 rounded-lg p-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Artist icon */}
          <div className="text-3xl flex-shrink-0">{quotes[language][currentQuoteIndex].icon}</div>

          <div className="flex-1 min-w-0">
            <blockquote className="text-base md:text-lg text-gray-200 italic leading-relaxed mb-3 banksy-quote">
              "{quotes[language][currentQuoteIndex].text}"
            </blockquote>
            <p className="text-sm text-gray-500 font-mono">— {quotes[language][currentQuoteIndex].author}</p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-4 justify-center">
          {quotes[language].map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentQuoteIndex
                  ? 'w-8 bg-white'
                  : 'w-1.5 bg-zinc-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BanksyQuote
