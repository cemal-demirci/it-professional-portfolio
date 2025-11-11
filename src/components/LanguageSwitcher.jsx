import { Languages } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="group relative p-2 rounded-lg text-gray-300 hover:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
      aria-label="Toggle language"
      title={language === 'en' ? 'Switch to Turkish' : 'İngilizceye geç'}
    >
      <div className="flex items-center gap-2">
        <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-semibold uppercase">{language}</span>
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {language === 'en' ? 'Türkçe' : 'English'}
      </div>
    </button>
  )
}

export default LanguageSwitcher
