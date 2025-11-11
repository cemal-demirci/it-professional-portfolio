import { useState, useEffect } from 'react'
import { BookOpen, MessageSquare, Sparkles, GraduationCap, Zap, Rocket, Brain } from 'lucide-react'
import { Link } from 'react-router-dom'
import ITChatbot from '../components/ITChatbot'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import CemalLogo from '../components/CemalLogo'

const JuniorIT = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: BookOpen,
      title: t(language, 'juniorIT.features.glossary.name'),
      description: t(language, 'juniorIT.features.glossary.desc'),
      link: '/junior-it/glossary',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: MessageSquare,
      title: t(language, 'juniorIT.features.aiBot.name'),
      description: t(language, 'juniorIT.features.aiBot.desc'),
      link: '#chatbot',
      color: 'from-indigo-600 to-purple-600'
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Animated Logo */}
      <CemalLogo size="medium" showDecorations={false} />

      {/* Header */}
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
            {t(language, 'juniorIT.title')}
          </h1>
          <p className="text-base text-white/90">
            {t(language, 'juniorIT.welcome')}
          </p>
          <p className="text-sm text-white/80 max-w-2xl mx-auto">
            {t(language, 'juniorIT.description')}
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
              className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + idx * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70">
                  {feature.description}
                </p>
                <div className="pt-3">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg">
                    {t(language, 'juniorIT.button')}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* AI Chatbot Section */}
      <div id="chatbot" className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-white mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
                {t(language, 'juniorIT.aiSection.title')}
              </h2>
              <p className="text-sm text-white/80">{t(language, 'juniorIT.aiSection.desc')}</p>
            </div>
          </div>
        </div>
        <ITChatbot />
      </div>

      {/* Learning Tips */}
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
        <h2 className="text-xl font-bold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent mb-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
          {t(language, 'juniorIT.learningTips.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {t(language, 'juniorIT.learningTips.tips').map((tip, idx) => {
            const borderColors = [
              'border-blue-600 hover:border-blue-500',
              'border-indigo-600 hover:border-indigo-500',
              'border-blue-600 hover:border-blue-500',
              'border-purple-600 hover:border-purple-500'
            ]
            return (
              <div key={idx} className={`p-4 bg-white/5 backdrop-blur-xl rounded-xl border-l-4 ${borderColors[idx % borderColors.length]} transition-all`}>
                <h3 className="font-semibold text-white mb-1">
                  {tip.title}
                </h3>
                <p className="text-sm text-white/70">
                  {tip.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resources */}
      <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
        <h3 className="text-base font-semibold bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent mb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}>
          {t(language, 'juniorIT.resources.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-white">
            <strong>{t(language, 'juniorIT.resources.platforms.title')}</strong>
            <ul className="mt-2 space-y-1 text-white/70">
              {t(language, 'juniorIT.resources.platforms.items').map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="text-white">
            <strong>{t(language, 'juniorIT.resources.certifications.title')}</strong>
            <ul className="mt-2 space-y-1 text-white/70">
              {t(language, 'juniorIT.resources.certifications.items').map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="text-white">
            <strong>{t(language, 'juniorIT.resources.tools.title')}</strong>
            <ul className="mt-2 space-y-1 text-white/70">
              {t(language, 'juniorIT.resources.tools.items').map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div className="text-center py-6 text-white/60">
        <p className="text-base font-semibold mb-2 text-white/80">
          {t(language, 'juniorIT.footer.message1')}
        </p>
        <p className="text-sm text-white/70">
          {t(language, 'juniorIT.footer.message2')}
        </p>
        <p className="text-xs mt-4 text-white/50">
          {t(language, 'juniorIT.footer.madeBy')}
        </p>
      </div>
    </div>
  )
}

export default JuniorIT
