import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const BanksyQuote = () => {
  const { language } = useLanguage()
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const quotes = {
    en: [
      "Art should comfort the disturbed and disturb the comfortable.",
      "The greatest crimes in the world are not committed by people breaking the rules but by people following the rules.",
      "Think outside the box, collapse the box, and take a f***ing sharp knife to it.",
      "A wall is a very big weapon. It's one of the nastiest things you can hit someone with.",
      "People say graffiti is ugly, irresponsible and childish. But that's only if it's done properly.",
      "Imagine a city where graffiti wasn't illegal, a city where everybody could draw whatever they liked.",
      "You're mind is working at its best when you're being paranoid. You explore every avenue.",
      "Some people become cops because they want to make the world a better place. Some people become vandals because they want to make the world a better looking place."
    ],
    tr: [
      "Sanat rahatsız olanı rahatlatmalı ve rahat olanı rahatsız etmeli.",
      "Dünyadaki en büyük suçlar, kuralları çiğneyenler değil, kuralları takip edenler tarafından işlenir.",
      "Kutunun dışında düşün, kutuyu çökert ve üzerine keskin bir bıçak al.",
      "Duvar çok büyük bir silahtır. Birine vurabileceğin en kötü şeylerden biridir.",
      "İnsanlar grafitinin çirkin, sorumsuzca ve çocukça olduğunu söyler. Ama bu sadece düzgün yapıldığında geçerli.",
      "Grafitinin yasadışı olmadığı, herkesin istediğini çizebildiği bir şehir hayal et.",
      "Aklın en iyi paranoyak olduğunda çalışır. Her yolu keşfedersin.",
      "Bazı insanlar dünyayı daha iyi bir yer yapmak için polis olur. Bazıları dünyayı daha güzel görünen bir yer yapmak için vandal olur."
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
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-40 pointer-events-none">
      <div
        className={`bg-zinc-900/95 backdrop-blur-xl border-2 border-zinc-800 rounded-lg p-4 shadow-2xl transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Spray paint icon */}
          <div className="text-2xl flex-shrink-0">🎨</div>

          <div className="flex-1 min-w-0">
            <blockquote className="text-sm text-gray-300 italic leading-relaxed mb-2 banksy-quote">
              "{quotes[language][currentQuoteIndex]}"
            </blockquote>
            <p className="text-xs text-gray-600 font-mono">— Banksy</p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 mt-3 justify-center">
          {quotes[language].map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentQuoteIndex
                  ? 'w-6 bg-white'
                  : 'w-1 bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BanksyQuote
