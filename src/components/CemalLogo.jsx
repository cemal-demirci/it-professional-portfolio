import { Sparkles } from 'lucide-react'

const CemalLogo = ({ size = 'large', showDecorations = true }) => {
  const sizes = {
    small: 'text-4xl md:text-5xl',
    medium: 'text-5xl md:text-7xl',
    large: 'text-7xl md:text-9xl'
  }

  const onlineSizes = {
    small: 'text-lg md:text-xl',
    medium: 'text-xl md:text-2xl',
    large: 'text-2xl md:text-3xl'
  }

  return (
    <div className="text-center mb-8 group cursor-default">
      <div className="inline-block relative">
        {/* Animated Glow Effect - Breathing */}
        <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-purple-500/50 animate-pulse"></div>

        {/* Floating Sparkles */}
        <div className="absolute -top-4 -right-4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Sparkles className="w-6 h-6 text-cyan-400 opacity-60" />
        </div>
        <div className="absolute -top-2 -left-6 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Sparkles className="w-4 h-4 text-purple-400 opacity-60" />
        </div>
        <div className="absolute -bottom-4 right-8 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          <Sparkles className="w-5 h-5 text-blue-400 opacity-60" />
        </div>

        {/* Main Logo */}
        <div className="relative">
          {/* CEMAL text with animated gradient */}
          <h1
            className={`${sizes[size]} font-black relative mb-2 transition-all duration-300 group-hover:scale-105`}
            style={{
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: '-0.04em',
              fontWeight: '900'
            }}
          >
            {/* Animated background glow with gradient shift */}
            <span className="absolute inset-0 bg-gradient-to-br from-blue-400/80 via-indigo-400/80 to-purple-400/80 bg-clip-text text-transparent blur-[2px] animate-gradient bg-[length:200%_auto]">
              CEMAL
            </span>

            {/* Main text with animated gradient */}
            <span
              className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
              style={{
                textShadow: '0 0 60px rgba(99, 102, 241, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)',
                filter: 'drop-shadow(0 4px 16px rgba(79, 70, 229, 0.3))',
                animation: 'gradient 8s ease infinite, float 6s ease-in-out infinite'
              }}
            >
              CEMAL
            </span>

            {/* Animated top highlight */}
            <span className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent bg-clip-text text-transparent animate-pulse">
              CEMAL
            </span>
          </h1>

          {/* .online suffix with animated elements */}
          <div className="flex items-center justify-center gap-1.5 group-hover:gap-2 transition-all duration-300">
            {/* Animated pulsing dot */}
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 animate-ping absolute"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 shadow-lg shadow-blue-400/50"></div>
            </div>

            {/* Animated online text */}
            <span
              className={`${onlineSizes[size]} font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-wide animate-gradient bg-[length:200%_auto] group-hover:tracking-wider transition-all duration-300`}
              style={{
                animation: 'gradient 6s ease infinite'
              }}
            >
              online
            </span>
          </div>

          {showDecorations && (
            <>
              {/* Animated underline decoration */}
              <div className="mt-4 flex justify-center gap-2">
                <div
                  className="h-0.5 w-16 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent rounded-full animate-pulse"
                  style={{ animationDelay: '0s', animationDuration: '2s' }}
                ></div>
                <div
                  className="h-0.5 w-10 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent rounded-full animate-pulse"
                  style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}
                ></div>
                <div
                  className="h-0.5 w-16 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent rounded-full animate-pulse"
                  style={{ animationDelay: '1s', animationDuration: '3s' }}
                ></div>
              </div>

              {/* Animated corner frames */}
              <div className="absolute -inset-8 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-blue-400/20 rounded-tl-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-indigo-400/20 rounded-tr-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-indigo-400/20 rounded-bl-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-purple-400/20 rounded-br-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default CemalLogo
