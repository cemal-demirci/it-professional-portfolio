import { createContext, useContext, useState } from 'react'

const RainbowContext = createContext()

export const RainbowProvider = ({ children }) => {
  const [rainbowMode, setRainbowMode] = useState(false)

  return (
    <RainbowContext.Provider value={{ rainbowMode, setRainbowMode }}>
      {children}
    </RainbowContext.Provider>
  )
}

export const useRainbow = () => {
  const context = useContext(RainbowContext)
  if (!context) {
    throw new Error('useRainbow must be used within RainbowProvider')
  }
  return context
}

// Komik tool isimleri
export const getFabulousName = (normalName) => {
  const fabulousNames = {
    // Tools
    'JSON Formatter': '✨ Slay JSON Queen ✨',
    'Base64': '💅 Base64 But Make It Fashion',
    'Regex Tester': '🌈 Regex Fabulous Tester',
    'Password Generator': '🦄 Şifre Üret Yavrum',
    'Hash Generator': '💎 Hash Me Daddy',
    'Encryption': '👑 Şifrele Kraliçe',
    'QR Generator': '🎀 QR Code Slay',
    'IP Lookup': '🏳️‍🌈 IP Araması (No Homo)',
    'DNS Lookup': '🌟 DNS Sorgu Diva',
    'Network Diagnostics': '💖 Network Check Bestie',
    'Speed Test': '⚡ Hız Testi Çakma Drag Queen',
    'Color Picker': '🎨 Renk Seçimi Abla',
    'Gradient Generator': '🌈 Gradient Yaratıcı',
    'Markdown Editor': '📝 Markdown Queen Editor',
    'Word Counter': '📊 Kelime Say Tatlım',
    'Text Diff': '🔍 Text Karşılaştır Honey',
    'GUID Generator': '✨ GUID Yarat Diva',
    'PowerShell Analyzer': '💻 PowerShell Analiz Et Babe',
    'Log Analyzer': '📋 Log Analiz Yavrum',
    'Security Advisor': '🔒 Güvenlik Danışman Kween',
    'Subnet Calculator': '🔢 Subnet Hesapla Bestie',
    'Binary Converter': '🤖 Binary Çevir Gorgeous',
    'JWT Decoder': '🔓 JWT Decode Et Fabulous',
    'PDF Merger': '📄 PDF Birleştir Sweetie',
    'Image to PDF': '🖼️ Resim PDF Yap Honey',
    'Service Status': '🎯 Servis Durumu Boo',
    'Remote Desktop': '🖥️ Uzaktan Bağlan Darling',
    'File Share': '📁 Dosya Paylaş Bestie',
    'AI Chatbot': '🤖 AI Sohbet Et Gorgeous',

    // Buttons
    'Submit': '💅 Gönder Kween',
    'Cancel': '🙅‍♀️ İptal Et Babe',
    'Copy': '📋 Kopyala Diva',
    'Download': '⬇️ İndir Honey',
    'Upload': '⬆️ Yükle Sweetie',
    'Generate': '✨ Üret Fabulous',
    'Search': '🔍 Ara Bestie',
    'Clear': '🧹 Temizle Gorgeous',
    'Save': '💾 Kaydet Darling',
    'Delete': '🗑️ Sil Boo',
    'Edit': '✏️ Düzenle Queen',
    'Analyze': '🔬 Analiz Et Diva',
    'Test': '🧪 Test Et Honey',
    'Connect': '🔌 Bağlan Sweetie',
    'Disconnect': '🔌 Kes Babe',
    'Start': '▶️ Başla Kween',
    'Stop': '⏹️ Dur Bestie',
    'Export': '📤 Dışa Aktar Gorgeous',
    'Import': '📥 İçe Aktar Darling',

    // Pages
    'Home': '🏠 Ana Sayfa Fabulous',
    'About': '👋 Hakkında (Yani Ben)',
    'Tools': '🛠️ Araçlar (Slay Tools)',
    'Settings': '⚙️ Ayarlar Honey',
    'Admin': '👑 Admin Panel Queen',
  }

  return fabulousNames[normalName] || normalName
}

// Random komik mesajlar (dad/family themed + fabulous + EXTREME IRONIC)
export const getFabulousMessage = () => {
  const messages = [
    '💅 Yasss queen, werk it!',
    '🌈 Serving LOOKS honey!',
    '✨ Slay all day bestie!',
    '🦄 Fabulous energy activated!',
    '💖 You look gorgeous darling!',
    '🏳️‍🌈 Pride mode: MAXIMUM!',
    '💎 Shine bright like a diamond!',
    '👑 Living my best life!',
    '🎀 Too glam to give a damn!',
    '🌟 Sparkle and shine babe!',
    '💅 Nails did, hair did, everything did!',
    '🦄 Unicorn vibes only!',
    '🌈 Taste the rainbow honey!',
    '💖 Love yourself first darling!',
    '✨ Main character energy!',
    '🏳️‍🌈 Support is support boo!',
    '💎 Diamonds are a girls best friend!',
    '👑 Crown me the queen!',
    '🎀 Pretty in pink and everything!',
    '🌟 Star quality right here!',
    '💅 Slaying since birth!',
    '🦄 Magical and mystical!',
    '🌈 Living in full color!',
    '💖 Spread love like confetti!',
    '✨ Glitter runs through my veins!',
    // Dad/Family themed messages
    '👨 Baban: "Oğlum var!" diye seviniyormuş!',
    '👪 Ailen sana bayılıyor bebeğim!',
    '💪 Baban: "İşte benim oğlum!" diyor!',
    '🏳️‍🌈 Annen: "Nasıl mutluysan öyle ol evladım!"',
    '👨‍👦 Baban seni izliyor ve gururlanıyor!',
    '💝 Ailen: "Sen bizim her şeyimizsin!"',
    '🌟 Baban: "Bak işte aslan oğlum!"',
    '👑 Annen: "Prensim benim!" diyor!',
    '💖 Ailen sana destek veriyor honey!',
    '✨ Baban: "Bak benim oğlum ne yapıyor!"',
    '🦄 Annen: "Sen özel bir çocuksun!"',
    '🌈 Baban övünüyor sana bestie!',
    '💎 Ailen seninle mutlu darling!',
    '👨‍👩‍👦 Tam aile desteği var boo!',
    '🎀 Annen arkanda duruyor queen!',
    // EXTREME IRONIC MESSAGES
    '⚠️ BİZ BURADA GEY İSTEMİYORUZ! (ama her yer rainbow 🌈)',
    '🚫 GAY OLMAK YASAK! (şaka şaka, you do you boo 💋)',
    '❌ HETEROSEXİM ONLY! (eh, not really tho 😘)',
    '⛔ NO HOMO ZONE! (biggest lie ever 🏳️‍🌈)',
    '🚨 GAY ALARM! EVERYONE PANIC! (or join us 💅)',
    '📱 Download Hornet and find your match! 🐝',
    '💋 Grindr > LinkedIn for networking bestie!',
    '🔥 Hornet: Because IT nerds need love too! 📲',
    '🦄 Straight? Not on MY rainbow website!',
    '✨ This site is now 100% FABULOUS certified!',
    '👔 Suit up? More like SLAY UP! 💃',
    '🎨 RGB lighting? No honey, LGBT lighting! 🌈',
    '💻 404 Error: Heterosexuality not found!',
    '🚀 To infinity and BEE-yond! (Hornet joke 🐝)',
    '🌈 Not gay, just EXTREMELY happy and colorful!',
    '💎 IT tools? More like GAY-T tools! 💅',
    '👑 This website? GAY. The tools? GAY. You? ...GAY! 🏳️‍🌈',
    '🦄 Certified 100% organic, gluten-free GAYNESS!',
    '✨ Warning: May cause sudden urges to download Hornet! 📱',
    '🎪 Welcome to the gay circus, population: YOU! 🎉'
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

// Content transformations for different page elements
export const getFabulousContent = (content) => {
  const transformations = {
    // Common page content
    'Professional Tools': '💅 Professional Tools (But Make It Fabulous)',
    'IT Tools': '🌈 IT Tools (Slay Edition)',
    'Welcome': '✨ Welcome Bestie!',
    'About Me': '👑 About This Queen',
    'My Skills': '💎 My Fabulous Skills',
    'Contact': '📱 Contact Me Honey',
    'Projects': '🦄 Projects (All Slaying)',
    'Experience': '💼 Experience (Living My Truth)',
    'Education': '🎓 Education (Smart & Fabulous)',
    'Portfolio': '🌟 Portfolio (Werk Display)',

    // Tool descriptions
    'Analyze': '🔬 Analiz Et Diva',
    'Generate': '✨ Üret Gorgeous',
    'Convert': '🔄 Dönüştür Bestie',
    'Format': '💅 Formatla Queen',
    'Validate': '✅ Doğrula Honey',
    'Calculate': '🔢 Hesapla Sweetie',
    'Compare': '⚖️ Karşılaştır Darling',
    'Create': '🎨 Yarat Fabulous',

    // Common UI elements
    'Loading...': '💫 Yükleniyor Bestie...',
    'Success!': '🎉 Başarılı Queen!',
    'Error': '😱 Hata Var Honey!',
    'Warning': '⚠️ Dikkat Diva!',
    'Info': 'ℹ️ Bilgi Gorgeous!',
  }

  return transformations[content] || content
}

// Transform entire text blocks
export const getFabulousText = (text) => {
  if (!text) return text

  // Replace common words with fabulous versions
  return text
    .replace(/\byou\b/gi, 'you gorgeous')
    .replace(/\bhello\b/gi, 'Heyyyy bestie')
    .replace(/\bthanks\b/gi, 'Thanks honey')
    .replace(/\bwelcome\b/gi, 'Welcome darling')
    .replace(/\bplease\b/gi, 'Please boo')
    .replace(/\berror\b/gi, 'Oopsie')
    .replace(/\bsuccess\b/gi, 'Slay!')
}
