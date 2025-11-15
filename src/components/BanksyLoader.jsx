import { useEffect, useState } from 'react'

const BanksyLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [quote, setQuote] = useState(0)

  const quotes = [
    "Art should comfort the disturbed...",
    "...and disturb the comfortable",
    "The greatest crimes are caused by excess...",
    "...not by necessity",
    "cemal.online loading..."
  ]

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onComplete(), 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    // Quote rotation
    const quoteInterval = setInterval(() => {
      setQuote(prev => (prev + 1) % quotes.length)
    }, 1200)

    return () => {
      clearInterval(interval)
      clearInterval(quoteInterval)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture opacity-50" />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative z-10 max-w-4xl w-full px-8">
        {/* Stencil style logo */}
        <div className="text-center mb-12">
          <h1 className="text-8xl md:text-9xl font-black stencil-text text-white mb-4 animate-spray"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            CEMAL
          </h1>
          <div className="text-2xl md:text-3xl font-bold text-gray-400 tracking-wider">
            .ONLINE
          </div>
        </div>

        {/* Spray paint progress bar */}
        <div className="relative w-full h-2 bg-zinc-900 rounded-full overflow-hidden mb-8">
          <div
            className="absolute inset-y-0 left-0 bg-white transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 20px rgba(255,255,255,0.5)'
            }}
          />
          {/* Drips effect */}
          {progress > 20 && (
            <>
              <div className="absolute top-full left-1/4 w-1 h-4 bg-white opacity-30"
                   style={{ animation: 'drip 2s infinite' }} />
              <div className="absolute top-full left-2/3 w-1 h-6 bg-white opacity-20"
                   style={{ animation: 'drip 2.5s infinite' }} />
            </>
          )}
        </div>

        {/* Rotating quotes - Banksy style */}
        <div className="text-center min-h-[60px]">
          <p className="text-xl md:text-2xl text-gray-400 font-mono italic animate-fadeIn">
            {quotes[quote]}
          </p>
        </div>

        {/* Progress percentage */}
        <div className="text-center mt-8">
          <span className="text-6xl font-black text-white stencil-text">
            {progress}%
          </span>
        </div>

        {/* Street art elements */}
        {progress > 50 && (
          <div className="absolute bottom-10 right-10 animate-spray">
            <div className="text-sm text-gray-600 font-mono transform rotate-12">
              [ NO COPYRIGHT • NO TRACKING • NO BS ]
            </div>
          </div>
        )}

        {progress > 70 && (
          <div className="absolute top-20 left-10 animate-spray">
            <div className="text-xs text-gray-700 font-mono transform -rotate-6">
              "Banksy would approve"
            </div>
          </div>
        )}
      </div>

      {/* Spray paint splatter */}
      <style>{`
        @keyframes drip {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </div>
  )
}

export default BanksyLoader
