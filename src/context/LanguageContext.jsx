import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en')
  }

  const t = (key) => {
    const translations = {
      // Navigation
      'nav.home': { en: '🏠 Home Base', tr: '🏠 Ana Üs' },
      'nav.about': { en: '👤 About Me', tr: '👤 Hakkımda' },
      'nav.tools': { en: '🛠️ Tool Arsenal', tr: '🛠️ Araç Cephaneliği' },
      'nav.settings': { en: '⚙️ Control Panel', tr: '⚙️ Kontrol Paneli' },

      // Home Page
      'home.title': { en: 'Cemal Demirci', tr: 'Cemal Demirci' },
      'home.subtitle': { en: 'IT Wizard & Security Ninja 🥷', tr: 'IT Sihirbazı & Güvenlik Ninjas 🥷' },
      'home.desc': { en: 'Turning RedBull into code and chaos into order since 2017 ⚡', tr: 'RedBull\'u koda, kaosu düzene çeviriyorum 2017\'den beri ⚡' },

      // Sarcastic titles
      'tools.title': { en: '🎯 My Digital Playground', tr: '🎯 Dijital Oyun Alanım' },
      'tools.desc': { en: '62+ tools because regular jobs are boring 😎', tr: '62+ araç çünkü normal işler sıkıcı 😎' },

      // About titles
      'about.title': { en: '🚀 The Guy Behind The Code', tr: '🚀 Kodun Arkasındaki Adam' },
      'about.role': { en: 'IT & Security Administrator MCSE | AI Lead Auditor', tr: 'IT & Security Administrator MCSE | AI Lead Auditor' },
      'about.company': { en: '@', tr: '@' },

      // Common
      'common.unlimited': { en: 'Unlimited', tr: 'Sınırsız' },
      'common.requests': { en: 'requests', tr: 'istek' },
      'common.loading': { en: 'Loading...', tr: 'Yükleniyor...' },
    }

    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
