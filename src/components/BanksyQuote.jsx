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
    <div className="max-w-4xl mx-auto">
      <div
        className={`bg-zinc-800/50 backdrop-blur-xl border border-zinc-700 rounded-lg p-6 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Spray paint icon */}
          <div className="text-3xl flex-shrink-0">🎨</div>

          <div className="flex-1 min-w-0">
            <blockquote className="text-base md:text-lg text-gray-200 italic leading-relaxed mb-3 banksy-quote">
              "{quotes[language][currentQuoteIndex]}"
            </blockquote>
            <p className="text-sm text-gray-500 font-mono">— Banksy</p>
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
