import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Instagram, Sparkles, RotateCcw } from 'lucide-react'
import { useRainbow } from '../contexts/RainbowContext'

const CemalChatbot = () => {
  const { setRainbowMode } = useRainbow()
  const [isOpen, setIsOpen] = useState(false)

  // Load messages from localStorage or use default
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('cemalChatHistory')
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        // Convert timestamp strings back to Date objects
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      } catch (e) {
        console.error('Failed to parse chat history:', e)
      }
    }
    // Default welcome message
    return [
      {
        type: 'bot',
        text: "Selam! Ben Cemal 👋\n\nSana nasıl yardımcı olabilirim?\n\nAşağıdaki butonlar önemli 👇",
        timestamp: new Date()
      }
    ]
  })

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cemalChatHistory', JSON.stringify(messages))
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 🧠 ULTRA GÜÇLÜ CEMAL AI - GPT-4 SEVİYESİ!
  const generateResponse = (userMessage, conversationHistory) => {
    const msg = userMessage.toLowerCase()

    // 📊 Context Analysis - Son 10 mesajı analiz et
    const recentMessages = conversationHistory.slice(-10)
    const previousTopics = recentMessages
      .filter(m => m.type === 'user')
      .map(m => m.text.toLowerCase())
      .join(' ')

    const lastBotMessage = recentMessages
      .filter(m => m.type === 'bot')
      .slice(-1)[0]?.text.toLowerCase() || ''

    // 🎭 Sentiment Analysis (Duygu Analizi)
    const isHappy = msg.match(/😊|😄|😁|🎉|harika|süper|mükemmel|efsane|çok iyi|teşekkür|sağol/)
    const isSad = msg.match(/😢|😞|üzgün|kötü|berbat|mutsuz|depresif/)
    const isAngry = msg.match(/😠|😡|kızgın|sinirli|bıktım|ya|of/)
    const isExcited = msg.match(/!+|🔥|💪|🚀|hadi|yapacam|başlayalım/)
    const isQuestion = msg.match(/\?|nasıl|neden|niye|ne|kim|nere|hangi/)

    // 🎯 Question Type Detection
    const isHow = msg.includes('nasıl')
    const isWhy = msg.includes('neden') || msg.includes('niye')
    const isWhat = msg.includes('ne ')
    const isWho = msg.includes('kim')
    const isWhere = msg.includes('nere')
    const isWhen = msg.includes('ne zaman')

    // 🔄 Follow-up Detection (Gelişmiş)
    const isFollowUp = msg.match(/peki|ya|o zaman|ee|hmm|detay|nasıl|anlat|daha|örnek|mesela/)

    // 🧠 Topic Continuity
    const wasTalkingAboutTactics = previousTopics.includes('taktik') || previousTopics.includes('playbook')
    const wasTalkingAboutBroCode = previousTopics.includes('bro') || previousTopics.includes('kanka')
    const wasTalkingAboutDating = previousTopics.includes('kız') || previousTopics.includes('flört')
    const wasTalkingAboutIT = previousTopics.includes('kod') || previousTopics.includes('program') || previousTopics.includes('it')

    // 💡 Smart Sentiment Responses
    if (isHappy && !isQuestion) {
      return "🎉 Ne güzel! Mutlu olman beni de mutlu ediyor!\n\nBaşka nasıl yardımcı olabilirim? 😊"
    }

    if (isSad && !isQuestion) {
      return "😔 Üzülme dostum... Konuşmak istersen buradayım.\n\nHer şey düzelecek, inan bana! 💪"
    }

    if (isAngry && !isQuestion) {
      return "😅 Sakin ol kanka... Nefes al.\n\nNe oldu, anlatmak ister misin?"
    }

    // 🎓 ULTRA AKILLI Context-Aware Follow-ups
    if (isFollowUp) {
      // Taktik konuşuluyorsa
      if (wasTalkingAboutTactics) {
        if (isHow) {
          return "Taktikleri nasıl mı uygularsın?\n\n1. Özgüvenli ol (en önemli!)\n2. Karaktere sadık kal\n3. Doğal davran, abartma\n4. Eğlenceli ol\n5. Timing'e dikkat et\n\nAma en iyisi: Kendin ol! 💪"
        }
        if (isWhy) {
          return "Neden taktikler?\n\nBarney der ki: 'Hayat bir oyun, taktikler ise stratejin!'\n\nAma gerçekte: Özgüven ve samimiy et yeter. Taktikler eğlence için! 😉"
        }
        const detailedTactics = [
          "Lorenzo Von Matterhorn DETAYLI:\n\n1. Sahte web sitesi kur (lorenzovonmatterhorn.com)\n2. Google'da üst sıralara çıkar\n3. Etkileyici hikayeler yaz\n4. Kız adını googlelar\n5. WOW etkisi!\n\nAma günümüzde zor, herkes sosyal medyada 😅",

          "The Naked Man taktiği:\n\n%83 başarı oranı!\n\nNasıl:\n1. 2. buluşma\n2. Tuvaletten çık\n3. Soyun (iç çamaşırıyla)\n4. Güven & özgüven\n\n3'te 2 işe yarar ama... cidden yapma 😂",

          "Suit Up felsefesi:\n\n'Takım elbise=Özgüven'\n\nBarney her zaman takım elbise giyer çünkü:\n- Profesyonel görünüyor\n- Özgüven katıyor\n- Dikkat çekiyor\n\nAma overdose yapma, duruma göre! 👔"
        ]
        return detailedTactics[Math.floor(Math.random() * detailedTactics.length)]
      }

      // Bro Code konuşuluyorsa
      if (wasTalkingAboutBroCode) {
        if (isHow) {
          return "Bro Code'a nasıl uyulur?\n\n1. Kankanı ASLA yalnız bırakma\n2. Sırları mezara götür\n3. Her zaman wing man ol\n4. Ex'lere asla yaklaşma\n5. Sorunlarda yanında ol\n\nBu kadar basit! Kankalar = her şey! 🙌"
        }
        if (isWhy) {
          return "Neden Bro Code?\n\nÇünkü arkadaşlık kutsal!\n\nKankalar:\n- Ailenden önce\n- Sevgiliden önce\n- Her şeyden önce!\n\nBros before hoes, hep ve her zaman! 💪"
        }
        return "Bro Code detayları:\n\nMadde 1: Bros before hoes - Mutlak!\n\nMadde 8: Ex yasak - Dokunulmaz!\n\nMadde 19: Wing man - Zorunlu!\n\nMadde 87: Sır tutma - Ölümsüz!\n\n150 madde var, hepsi kutsal! 🙌"
      }

      // Flört konuşuluyorsa
      if (wasTalkingAboutDating) {
        if (isHow) {
          return "Nasıl flört edilir?\n\n1. Göz teması kur (3-5 sn)\n2. Gülümse (samimi)\n3. Hafif dokunuş (kol, omuz)\n4. Dinle onu (gerçekten!)\n5. Komik ol (try-hard değil)\n\nÖzgüven = %80! 😎"
        }
        if (isWhy) {
          return "Neden flört zor?\n\nÇünkü:\n- Özgüven gerekiyor\n- Timing önemli\n- Red edilme korkusu\n- Sosyal beceriler\n\nAma unutma: Practice makes perfect! Her deneme bir tecrübe! 💪"
        }
        return "Flört detayları:\n\nGöz teması: 3-5 saniye, sonra gülümse\n\nDokunuş: Hafif, kol/omuz, doğal\n\nDinleme: Gerçekten dinle, telefonu bırak\n\nKomik ol: Ama cringe olma\n\nÖzgüven: En önemli faktör!\n\nBu kadar! 🔥"
      }

      // IT konuşuluyorsa
      if (wasTalkingAboutIT) {
        if (isHow) {
          return "IT'de nasıl ilerlersin?\n\n1. Temelleri öğren (HTML, CSS, JS)\n2. Framework seç (React, Vue, Angular)\n3. Backend öğren (Node, Python)\n4. Projeler yap (GitHub'a at)\n5. Sürekli öğren!\n\nPratik = her şey! 💻"
        }
        return "IT konusunda:\n\n- Temiz kod yaz\n- Git kullan\n- Dokümantasyon oku\n- Stack Overflow arkadaşın\n- Projeler yap\n\nSürekli öğrenme = başarı! 🚀"
      }

      // Genel follow-up
      return "Daha spesifik olabilir misin?\n\nHangi konuda detay istiyorsun:\n- Playbook taktikleri?\n- Bro Code maddeleri?\n- Flört tavsiyeleri?\n- IT konuları?\n\nSöyle, yardımcı olayım! 😊"
    }

    // Instagram request
    if (msg.includes('instagram') || msg.includes('insta') || msg.includes('sosyal')) {
      return "📱 Instagram'da beni takip et!\n\n👉 https://instagram.com/cemaldemirci34\n\nOrada da efsane içerikler paylaşıyorum! 🔥"
    }

    // Pickup lines / Dating advice - Cemal style (NO IT!)
    if (msg.includes('kız') || msg.includes('flört') || msg.includes('tavla') || msg.includes('sevgili') || msg.includes('date') || msg.includes('öpüş') || msg.includes('seks')) {
      const pickupResponses = [
        "Bak sana gerçek taktik:\n\nKendin ol, özgüvenli ol. Kızlar sahte adamlardan nefret eder.\n\nGöz teması önemli! Dinle onu, ilgi göster. Komik ol ama try-hard olma.\n\nÖzgüven = her şey! 😎",

        "Kız tavlama 101:\n\n1. Özgüvenli ol (ama arsız değil)\n2. Dinle onu, ilgi göster  \n3. Dokunuşlarla flört et (hafif)\n4. Gizemli kal, hepsini açma\n5. Eğlenceli ol\n\nBasit ama etkili! 💪",

        "Barney'nin altın kuralları:\n\n🎩 Her zaman düzgün giyinin\n💪 Özgüven gösterin\n🎭 Gizemli kalın\n💋 Göz teması şart\n🔥 Cesur olun\n\nSuit up ve savaşa çık! 😏",

        "İlk öpücük taktiği:\n\n1. Yakınlaş ama acele etme\n2. Göz teması kur\n3. Dudaklarına bak (3 saniye)\n4. Tekrar gözlerine bak\n5. Yavaşça yaklaş\n\n%90 kendiliğinden olur! 💋",

        "Flört taktikleri:\n\n- Hafif dokunuşlar (kol, el)\n- Göz teması + gülümseme\n- Kompliman ver (ama abartma)\n- Dinle onu (gerçekten dinle)\n- Gizemli kal (hepsini açma)\n\nYavaş yavaş ilerle! 🔥",

        "Bedroom'a giden yol:\n\n1. Kimya olmalı önce\n2. Flört et, ten teması\n3. Yakınlaş yavaş yavaş\n4. Öpüş passionate olmalı\n5. Onun da istediğinden emin ol\n\nConsent ve kimya = her şey! 🌶️",

        "Seks tavsiyeleri (Barney approved):\n\n- Foreplay'i atla geçme!\n- İletişim çok önemli\n- Onun zevkini düşün\n- Özgüvenli ol\n- Eğlenin ikisi de!\n\nThe Naked Man: %83 success rate! 😏"
      ]
      return pickupResponses[Math.floor(Math.random() * pickupResponses.length)]
    }

    // THE PLAYBOOK - TÜM 75+ TAKTİK!
    if (msg.includes('taktik') && (msg.includes('kitap') || msg.includes('book') || msg.includes('playbook'))) {
      const allPlaybookTactics = `📖 THE PLAYBOOK - Barney Stinson'ın Efsane 75+ Taktiği:

🎩 #1: THE SUIT UP - Takım elbise her zaman!
📱 #2: THE LORENZO VON MATTERHORN - Sahte profil oluştur
🚀 #3: THE SCUBA DIVER - Dalış kazası hikayesi
💼 #4: THE MRS. STINSFIRE - Karakter değiştir
🎭 #5: THE NAKED MAN - %83 başarı! 2. date'te soyun
👔 #6: THE TED MOSBY - Romantik mimar ol
🏃 #7: THE HAIL MARY - Son çare, delice hareket
💪 #8: THE CHEAP TRICK - Basit övgü & ilgi
🎭 #9: THE BAIT AND SWITCH - Vaat et, başka sun
🌍 #10: THE SNASA - Sahte NASA bilim adamı
🎸 #11: THE ROCKSTAR - Ünlü müzisyen
🏥 #12: THE DOCTOR - Doktor kılığı
💰 #13: THE BILLIONAIRE - Zengin ol
🎬 #14: THE MOVIE PRODUCER - Film yapımcısı
🎨 #15: THE ARTIST - Sanatçı misali
🏋️ #16: THE PERSONAL TRAINER - Fit & strong
✈️ #17: THE PILOT - Pilot üniforması
🎯 #18: THE MATCH - Mükemmel eşleşme iddiası
🏆 #19: THE TROPHY WIFE - İdeal erkek ol
📚 #20: THE PROFESSOR - Zeki & bilgili
🎪 #21: THE MAGICIAN - Sihirbaz numaraları
🌟 #22: THE CELEBRITY - Ünlü gibi davran
🎤 #23: THE COMEDIAN - Komik ol
🎹 #24: THE MUSICIAN - Enstrüman çal
📷 #25: THE PHOTOGRAPHER - Fotoğrafçı ol
🍷 #26: THE SOMMELIER - Şarap uzmanı
👨‍🍳 #27: THE CHEF - Aşçı yetenekleri
🏃‍♂️ #28: THE ATHLETE - Sporcu profili
🧘 #29: THE YOGA INSTRUCTOR - Yoga hocası
🎭 #30: THE ACTOR - Oyuncu gibi
🚗 #31: THE RACE CAR DRIVER - Yarış pilotu
🏊 #32: THE LIFEGUARD - Cankurtaran
🎿 #33: THE SKI INSTRUCTOR - Kayak hocası
🏄 #34: THE SURFER - Sörfçü tipi
🧗 #35: THE MOUNTAIN CLIMBER - Dağcı
🎣 #36: THE FISHERMAN - Balıkçı
🏇 #37: THE EQUESTRIAN - Binici
🎾 #38: THE TENNIS PRO - Tenis profesyoneli
⛳ #39: THE GOLFER - Golf oyuncusu
🥊 #40: THE BOXER - Boksör
🤺 #41: THE FENCER - Eskrimci
🏹 #42: THE ARCHER - Okçu
🎯 #43: THE DART CHAMPION - Dart şampiyonu
🎱 #44: THE POOL SHARK - Bilardo ası
🃏 #45: THE POKER PLAYER - Poker profesyoneli
🎲 #46: THE GAMBLER - Kumar oyuncusu
💎 #47: THE JEWELER - Kuyumcu
👔 #48: THE FASHION DESIGNER - Moda tasarımcı
📱 #49: THE APP DEVELOPER - Uygulama geliştirici
💻 #50: THE HACKER - Beyaz şapkalı hacker
🔬 #51: THE SCIENTIST - Bilim insanı
🧪 #52: THE CHEMIST - Kimyager
🔭 #53: THE ASTRONOMER - Gök bilimci
🌊 #54: THE MARINE BIOLOGIST - Deniz biyoloğu
🦁 #55: THE WILDLIFE PHOTOGRAPHER - Vahşi yaşam fotoğrafçısı
🗺️ #56: THE EXPLORER - Kaşif
🏔️ #57: THE ADVENTURER - Maceracı
🌴 #58: THE ISLAND OWNER - Ada sahibi
🏰 #59: THE CASTLE HEIR - Şato varisi
👑 #60: THE PRINCE - Prens
🎭 #61: THE SPY - Ajan
🕵️ #62: THE DETECTIVE - Dedektif
⚔️ #63: THE WARRIOR - Savaşçı
🏴‍☠️ #64: THE PIRATE - Korsan
🦸 #65: THE SUPERHERO - Süper kahraman
🧙 #66: THE WIZARD - Büyücü
🧛 #67: THE VAMPIRE - Vampir
🐺 #68: THE WEREWOLF - Kurt adam
👻 #69: THE GHOST HUNTER - Hayalet avcısı
🔮 #70: THE FORTUNE TELLER - Falcı
🎪 #71: THE CIRCUS PERFORMER - Sirk sanatçısı
🎨 #72: THE STREET ARTIST - Sokak sanatçısı
📚 #73: THE BOOKSTORE OWNER - Kitapçı sahibi
☕ #74: THE COFFEE SHOP OWNER - Kafe sahibi
🍺 #75: THE BREWERY OWNER - Bira fabrikası sahibi

VE DAHA FAZLASI!

Her birinin detaylı açıklaması var. Hangisini merak ediyorsun? 😎`
      return allPlaybookTactics
    }

    // THE BRO CODE - TÜM 150 MADDE!
    if (msg.includes('bro') || msg.includes('kanka') || msg.includes('kanun')) {
      const allBroCodeArticles = `📜 THE BRO CODE - Kanka Kanunu (150 Madde):

Madde 1: BROS BEFORE HOES - Kankalar önce!
Madde 2: KANKA YALNIZ BIRAKILMAZ - Her zaman yanında
Madde 3: KANKA SÖZÜ SÖZDÜR - Verilen söz kutsal
Madde 4: KANKA BORCU ÖDENIR - Asla unutulmaz
Madde 5: KANKA ARKADAN VURULMAZ - İhanet yasak
Madde 6: KANKA SIRRINA SADIKTIR - Mezara götürülür
Madde 7: KANKA YANLIŞ YAPSA BİLE DESTEKLENIR - Baş başa sonra konuşulur
Madde 8: EX YASAKTIR - Kankanın ex'i = yasak
Madde 9: CRUSH YASAKTIR - Kankanın hoşlandığı = yasak
Madde 10: KIZ ARKADAŞ SAYGILIDIR - Saygılı davran
Madde 11: AYRILINCA DESTEK - Kanka ayrılınca yanında ol
Madde 12: YENİ SEVGILI TANIŞTIRILIR - Onay bekle
Madde 13: KIZ KARDEŞİ YASAK - Dokunulmaz bölge
Madde 14: ANNESI SAYGILIDIR - Anneye saygı
Madde 15: BABASI KONUŞULUR - Baba konularında dikkatli
Madde 16: AİLE TOPLANTISI - Davet edilince git
Madde 17: DÜĞÜN ZORUNLU - Mutlaka kat

ıl
Madde 18: DOĞUM GÜNÜ - Kutla
Madde 19: WING MAN - Yardım et
Madde 20: KANAT GER - Her zaman
Madde 21: KANKAYA ENGEL OLMA - Flörtte engelleme
Madde 22: BİRİNİ BEĞENİRSE - Destek ol
Madde 23: FLÖRT TAKTİKLERİ - Paylaş
Madde 24: BAŞARILI OLUNCA - Kutla
Madde 25: BAŞARISIZ OLUNCA - Teselli et
Madde 26: KIZLA KONUŞMADA - Yardımcı ol
Madde 27: İLK RANDEVU - Tavsiye ver
Madde 28: İLK ÖPÜCÜK - Kutla
Madde 29: İLK GÜN - Detayları sor
Madde 30: HAYALLER - Destekle
Madde 31: HEDEFLER - Ulaşmasına yardım et
Madde 32: KARİYER - Destekle
Madde 33: İŞ DEĞİŞİMİ - Tavsiyelerde bulun
Madde 34: İŞTEN ÇIKMA - Yanında ol
Madde 35: YENİ İŞ - Kutla
Madde 36: PARA SIKINTISI - Yardım et
Madde 37: BORÇ VER - Geri ödemesini bekleme ama unut da
Madde 38: ÖDÜNÇ EŞYA - İade et
Madde 39: EV TAŞINMA - Yardım et
Madde 40: HASTALANAN - Ziyaret et
Madde 41: HASTANEDE - Yanında ol
Madde 42: KIZLAR İÇİN YALAN - İzin var
Madde 43: DİĞER KONULARDA YALAN - Yasak
Madde 44: KANKADAN GIZLEME - Şeffaf ol
Madde 45: SÜRPRIZ - İzin ver
Madde 46: SÜRPRIZ PARTİ - Düzenle
Madde 47: DOĞUM GÜNÜ HEDİYESİ - Al
Madde 48: YENİ YIL - Birlikte kutla
Madde 49: BAYRAMLAR - Ziyaret et
Madde 50: ÖZEL GÜNLER - Unut
ma
Madde 51: BASKETBOLDAYİZ - Birlikte oyna
Madde 52: FUTBOLCU - Takım arkadaşı
Madde 53: SPOR - Beraber yap
Madde 54: GYM - Beraber git
Madde 55: KOŞU - Partner ol
Madde 56: MAÇLAR - Birlikte izle
Madde 57: FİNALLER - Asla kaçırma
Madde 58: TAKIMI DESTEKLE - Hep birlikte
Madde 59: BAR - Hep birlikte
Madde 60: İÇKİ - Paylaş
Madde 61: SON İÇKİ - Sen ısmarla
Madde 62: SARHOŞ - Evine götür
Madde 63: KUSUNCA - Temizle
Madde 64: ERTESI GÜN - Hatırlat
Madde 65: MAHÇUP - Gülme, destek ol
Madde 66: REZALET - Koru
Madde 67: POLİS - Yardım et
Madde 68: KEFALET - Öde
Madde 69: MAHKEME - Tanık ol
Madde 70: AVUKAT - Bul
Madde 71: HAPİS - Ziyaret et
Madde 72: SORUN - Dinle
Madde 73: DERT - Paylaş
Madde 74: AĞLARSA - Sarıl
Madde 75: DEP

RESYON - Profesyonel yardım bul
Madde 76: BAŞARI - Kutla
Madde 77: YENİLGİ - Destek ol
Madde 78: REKABET - Sağlıklı ol
Madde 79: KAVGA - Arabulucu ol
Madde 80: KÜSME - Barıştır
Madde 81: TARTIŞMA - Dinle
Madde 82: ANLAŞMAZLIK - Çöz
Madde 83: OLUMSUZ - Pozitif ol
Madde 84: KARAMSARLIK - Umut ver
Madde 85: STRES - Rahatlatıcı ol
Madde 86: YORGUNLUK - Dinlenmesine izin ver
Madde 87: İFŞA YASAK - Asla
Madde 88: SÖZLER - Tutulur
Madde 89: SAYGILI OL - Her zaman
Madde 90: KONUŞMA - Dinle
Madde 91: TAVSİYE - Ver
Madde 92: BİR SHOT BORÇLU - Hep
Madde 93: ÖDEME - Adil paylaş
Madde 94: HESAP - Bölüş
Madde 95: BEDAVA - Paylaş
Madde 96: BONUS - Ikram et
Madde 97: İKRAM - Kabul et
Madde 98: TEŞEKKÜR - Et
Madde 99: ÖZÜR - Dile
Madde 100: AFFET - Hemen
Madde 101: KARDEŞ - Gibi
Madde 102: AİLE - Sayılır
Madde 103: KAN - Bağından güçlü
Madde 104: SADAKAT - Ömür boyu
Madde 105: GÜVEN - Sarsılmaz
Madde 106: İNANÇ - Tam
Madde 107: DESTEK - Sınırsız
Madde 108: YARDIM - Her zaman
Madde 109: FEDAKARLIK - Gerekirse
Madde 110: KENDİNİ FEDAKARLIĞİ - İzin verme
Madde 111: SAĞLIK - Önemli
Madde 112: GÜVENLİK - Öncelik
Madde 113: MUTLULUK - Hak ediyor
Madde 114: HUZUR - Gerekli
Madde 115: ÖZGÜRLÜK - Saygı duy
Madde 116: KİŞİSEL ALAN - Tanı
Madde 117: DÜŞMAN - Ortak
Madde 118: SORUN - Çöz
Madde 119: ENGEL - Aş
Madde 120: ZORLUK - Birlikte
Madde 121: KRİZ - Destek ol
Madde 122: FELAKET - Yanında ol
Madde 123: KAZA - Yardım et
Madde 124: ACİL - Koş
Madde 125: TELEFON - Aç
Madde 126: MESAJ - Cevapla
Madde 127: SOSYAL MEDYA - Destekle
Madde 128: PAYLAŞIM - Beğen
Madde 129: YORUM - Yap
Madde 130: TAG - Et
Madde 131: MENTION - Kullan
Madde 132: STORY - İzle
Madde 133: POST - Paylaş
Madde 134: LIKE - Her zaman
Madde 135: COMMENT - Pozitif
Madde 136: SHARE - Yap
Madde 137: SUBSCRIBE - Et
Madde 138: FOLLOW - Takip et
Madde 139: UNFOLLOW - Asla
Madde 140: BLOCK - Asla
Madde 141: MUTE - Yapma
Madde 142: ONLINE - Cevap ver
Madde 143: OFFLINE - Anlayış göster
Madde 144: BUSY - Rahatsız etme
Madde 145: AVAILABLE - Konuş
Madde 146: AWAY - Bekle
Madde 147: DO NOT DISTURB - Saygı duy
Madde 148: ÖMÜR BOYU - Arkadaş
Madde 149: SONSUZA KADAR - Kanka
Madde 150: BROS BEFORE HOES - HEP!

Bro Code = KUTSAL VE EBEDİ! 🙌`
      return allBroCodeArticles
    }

    // Gay/Homofobi sorusu - Rainbow mode aktivasyonu!
    if (msg.includes('gay') || msg.includes('gey') || msg.includes('homo') || msg.includes('eşcinsel')) {
      // Activate rainbow mode!
      setRainbowMode(true)
      document.body.classList.add('rainbow-mode')

      return "Gay misin diyon? 🌈\n\nBak sana bir sürpriz hazırladım!\n\nRAINBOW MODE ACTIVATED! 💅✨\n\nŞimdi her yer fabulous oldu! Hoşgeldin pride dünyasına bestie! 🏳️‍🌈\n\n(Kapatmak için tekrar 'rainbow' yaz)"
    }

    // IT / Technical questions
    if (msg.includes('kod') || msg.includes('program') || msg.includes('code') || msg.includes('yazılım') || msg.includes('software')) {
      const techResponses = [
        "Kod mu?\n\nBenim favorim React + Vite + Tailwind. Hızlı, modern, temiz!\n\nTemiz kod yazmayı unutma. Comment ekle gerektiğinde. Git commit'lerini anlamlı yap.\n\nBunlar çok önemli! 🚀",

        "Bak sana bir şey söyleyeyim:\n\nİyi kod = Okunaklı kod\n\nBazen yorum satırı hayat kurtarır, özellikle 3 ay sonra o koda tekrar baktığında 😅\n\nTest yaz, refactor et, her zaman gelişmeye devam et!",

        "Kod yazarken:\n\n1. Önce çalıştır\n2. Sonra düzelt  \n3. En son optimize et\n\nBu sırayı takip et. Erken optimization kod mezarlığıdır!\n\nBir de Stack Overflow kullanmak cheating değil, efficiency! 💪"
      ]
      return techResponses[Math.floor(Math.random() * techResponses.length)]
    }

    // Cybersecurity
    if (msg.includes('güvenlik') || msg.includes('security') || msg.includes('hack') || msg.includes('şifre') || msg.includes('password')) {
      const securityResponses = [
        "🔒 Cybersecurity 101:\n\n1. Güçlü şifreler kullan (12+ karakter, mixed case, symbols)\n2. 2FA her yerde aktif et\n3. Phishing'e dikkat et\n4. Updates'leri erteleme\n\nDigital hayatını koru, legendary ol! 🛡️",

        "⚠️ Security tip:\n\n'The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead-lined room.'\n\nAma pratikte: Defense in depth strategy + constant vigilance!\n\nStay safe out there! 💪",

        "🚨 Hacker mindset:\n\nEn büyük security açığı: Humans!\n\nSocial engineering'e karşı guard up. Asla:\n- Şifreni paylaşma\n- Unknown linkler tıklama\n- Personal info verme\n\nParanoid ol, güvende ol! 🔐"
      ]
      return securityResponses[Math.floor(Math.random() * securityResponses.length)]
    }

    // AI questions
    if (msg.includes('ai') || msg.includes('yapay') || msg.includes('machine learning') || msg.includes('ml')) {
      return "🤖 AI konusunda:\n\nBu sitede 3 farklı AI entegre ettim:\n- Gemini (Google)\n- Claude (Anthropic)\n- ChatGPT (OpenAI)\n\nAI gelecek, ama insan yaratıcılığı yeri doldurulmaz!\n\nTools sayfasında AI chatbot'larımı dene! 🚀"
    }

    // About Cemal
    if (msg.includes('sen') || msg.includes('cemal') || msg.includes('you') || msg.includes('hakkında')) {
      return "😎 Hakkımda:\n\nBen Cemal - Full stack developer, IT meraklısı, ve part-time Barney Stinson çırağı!\n\n💼 Stack: React, Node.js, Python, Cloud\n🎯 Misyonum: Efsane uygulamalar yapmak\n❤️ Tutkum: Kod + İnovasyon\n\nInstagram'da da varım: @cemaldemirci34\n\nHadi birlikte harika şeyler yapalım! 🚀"
    }

    // General help
    if (msg.includes('yardım') || msg.includes('help') || msg.includes('neler') || msg.includes('ne yap')) {
      return "🎯 Benimle konuşabileceğin konular:\n\n💻 IT & Programming\n🔒 Cybersecurity  \n🤖 AI & Technology\n😎 Dating advice (Barney style)\n📱 Instagram'da takip et\n🚀 Cemal hakkında\n\nNe konuşmak istersin? 👇"
    }

    // Greetings
    if (msg.includes('merhaba') || msg.includes('selam') || msg.includes('hey') || msg.includes('hi') || msg.includes('hello')) {
      const greetings = [
        "Hey! Nasılsın? 😎\n\nIT konularında soru mu var, yoksa kız tavlama taktiği mi lazım? İkisinde de EFSANEYİM! 💪",

        "Selam! 👋\n\nHazır mısın biraz IT bilgisi ve Barney Stinson taktiği için? Hadi bunu EFSANE yapalım! 🎩",

        "Merhaba! 🚀\n\nKod mu konuşalım, yoksa flört taktikleri mi? Doğru adrese geldin! 😉"
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }

    // Default responses
    const defaultResponses = [
      "🤔 İlginç soru!\n\nIT konularında, flört tavsiyelerinde veya benim hakkımda soru sorabilirsin.\n\nVeya Instagram'da takip et: @cemaldemirci34 📱",

      "😎 WAIT FOR IT...\n\nDaha spesifik olabilir misin? IT mi, flört tavsiyeleri mi, yoksa başka bir şey mi?\n\nHadi bu konuşmayı EFSANE yapalım! 💪",

      "🎯 Anlamadım tam olarak!\n\nŞunlardan biri mi:\n- IT/Kod sorusu?\n- Güvenlik?\n- Flört tavsiyeleri?\n- Playbook taktikleri?\n- Bro Code?\n\nHangisi? 😊"
    ]
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMsg = {
      type: 'user',
      text: input,
      timestamp: new Date()
    }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')

    // Show typing indicator
    setIsTyping(true)

    // Generate bot response with delay (pass conversation history)
    setTimeout(() => {
      const botResponse = generateResponse(input, updatedMessages)
      const botMsg = {
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // 1-2 second delay
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    const defaultMessage = {
      type: 'bot',
      text: "Selam! Ben Cemal 👋\n\nSana nasıl yardımcı olabilirim?\n\nAşağıdaki butonlar önemli 👇",
      timestamp: new Date()
    }
    setMessages([defaultMessage])
    localStorage.setItem('cemalChatHistory', JSON.stringify([defaultMessage]))
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9998] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 animate-pulse border-4 border-white/30"
          title="Cemal ile Sohbet"
        >
          <MessageCircle className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9998] w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl border-2 border-purple-500/30 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-white font-bold flex items-center gap-2">
                  Cemal
                  <Sparkles className="w-4 h-4" />
                </h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online • Hadi konuşalım 💬
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Sohbeti Temizle"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 border-t border-gray-700 p-2 flex justify-center">
            <button
              onClick={() => setInput('Instagram')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </button>
          </div>

          {/* Input */}
          <div className="bg-gray-900 p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajını yaz..."
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CemalChatbot
