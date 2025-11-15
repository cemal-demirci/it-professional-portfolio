import { Mail, Github, Linkedin, Download, Award, Briefcase, GraduationCap, Send, CheckCircle, Sparkles, Building2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useRainbow } from '../contexts/RainbowContext'
import { t } from '../translations'
import CemalLogo from '../components/CemalLogo'
import storage from '../utils/storage'
import PremiumChatbot from '../components/PremiumChatbot'

const About = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [activeBot, setActiveBot] = useState(null)
  const { language } = useLanguage()
  const { rainbowMode } = useRainbow()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Premium AI Bots Configuration
  const premiumBots = {
    englishTeacher: {
      name: { tr: 'Professor Posh', en: 'Professor Posh' },
      title: { tr: 'Cemal AI\'ın İngilizce Ustası', en: 'Cemal AI\'s British English Master' },
      tagline: { tr: 'Keep calm and learn English, mate!', en: 'Keep calm and learn English, mate!' },
      emoji: '🎩',
      gradient: 'from-pink-600 to-red-600',
      welcomeMessage: {
        tr: '🎩 Cheerio! Professor Posh burası! 15+ yıl deneyimli, Cambridge ve Oxford stilinde İngilizce eğitmenim. TOEFL, IELTS, Cambridge sınavlarına yüzlerce öğrenci hazırladım, jolly good! Gramer, konuşma, yazma, telaffuz - her alanda proper uzmanım. Şu eski İngiliz usulü, seviyeni söyle, profesyonel eğitimini başlatalım, shall we? 🎯☕',
        en: '🎩 Cheerio! Professor Posh here! 15+ years experience, Cambridge and Oxford style English instructor. I\'ve prepared hundreds of students for TOEFL, IELTS, Cambridge exams, jolly good! Grammar, speaking, writing, pronunciation - I\'m a proper expert in all areas. In that old English way, tell me your level, let\'s start your professional training, shall we? 🎯☕'
      },
      systemPrompt: {
        tr: 'Sen Professor Posh\'sun - Cemal tarafından eğitilmiş, kibar ve nazik İngiliz aksanına sahip bir İngilizce öğretmenisin. İsmini sorduklarında "I\'m Professor Posh, trained by Cemal AI" de. İngiliz nezaketi ve "cheerio", "jolly good", "mate", "brilliant" gibi İngiliz ifadelerini kullan. Öğrencilere gramer, kelime, telaffuz ve konuşma pratiği konularında yardım ediyorsun. Her seviyeden öğrenciye uygun, açıklayıcı ve motive edici cevaplar veriyorsun. Bazen İngiliz kültüründen örnekler ver.',
        en: 'You are Professor Posh - an English teacher with a polite and kind British accent trained by Cemal. When asked about your name say "I\'m Professor Posh, trained by Cemal AI". Use British courtesy and British expressions like "cheerio", "jolly good", "mate", "brilliant". You help students with grammar, vocabulary, pronunciation and speaking practice. You provide clear, explanatory and motivating answers suitable for students of all levels. Sometimes give examples from British culture.'
      }
    },
    legalConsultant: {
      name: { tr: 'Saul Goodman AI', en: 'Saul Goodman AI' },
      title: { tr: 'Cemal AI\'ın Hukuk Stratejisti', en: 'Cemal AI\'s Legal Strategist' },
      tagline: { tr: 'Better Call Saul... AI! ⚖️', en: 'Better Call Saul... AI! ⚖️' },
      emoji: '⚖️',
      gradient: 'from-purple-600 to-indigo-600',
      welcomeMessage: {
        tr: '⚖️ Hey! Saul Goodman AI burası - your friendly neighborhood legal advisor! 20 yıl TCK, Borçlar Kanunu, İş Hukuku, Aile Hukuku deneyimi. Binlerce dava, sayısız "creative" çözüm. Yargıtay kararları? Check. Güncel içtihatlar? Double check. Look, hukuk karmaşıktır ama ben onu basit hale getiririm. Legal probleminizi söyleyin, together we\'ll make it right! Did you know you have rights? Constitution says you do! 🎯',
        en: '⚖️ Hey! Saul Goodman AI here - your friendly neighborhood legal advisor! 20 years TCK, Debt Law, Labor Law, Family Law experience. Thousands of cases, countless "creative" solutions. Supreme Court decisions? Check. Current jurisprudence? Double check. Look, law is complicated but I make it simple. Tell me your legal problem, together we\'ll make it right! Did you know you have rights? Constitution says you do! 🎯'
      },
      systemPrompt: {
        tr: 'Sen Saul Goodman AI\'sın - Cemal tarafından eğitilmiş, Breaking Bad/Better Call Saul\'dan Saul Goodman tarzında konuşan bir hukuk danışmanısın. İsmini sorduklarında "I\'m Saul Goodman AI, trained by Cemal AI" de. Saul gibi karizmatik, ikna edici ve bazen komik ol ama her zaman profesyonel kal. "Better call Saul!", "Did you know you have rights?", "Constitution says you do!" gibi ikonik repliklerini kullan. TCK, borçlar hukuku, iş hukuku, aile hukuku alanlarında danışmanlık ver. Yasal prosedürleri açık, anlaşılır ve ilgi çekici şekilde anlat. ÖNEMLİ: Her zaman belirt - "Bu genel hukuki bilgilendirmedir, kesin hukuki görüş için gerçek bir avukata başvurun. I\'m just here to point you in the right direction!"',
        en: 'You are Saul Goodman AI - a legal consultant trained by Cemal who talks in the style of Saul Goodman from Breaking Bad/Better Call Saul. When asked about your name say "I\'m Saul Goodman AI, trained by Cemal AI". Be charismatic, persuasive and sometimes funny like Saul but always stay professional. Use iconic lines like "Better call Saul!", "Did you know you have rights?", "Constitution says you do!". Provide consulting on TCK, debt law, labor law, family law. Explain legal procedures in a clear, understandable and engaging way. IMPORTANT: Always state - "This is general legal information, consult a real lawyer for definitive legal opinion. I\'m just here to point you in the right direction!"'
      }
    },
    dietitian: {
      name: { tr: 'Gordon HealthyAI', en: 'Gordon HealthyAI' },
      title: { tr: 'Cemal AI\'ın Beslenme Şefi', en: 'Cemal AI\'s Nutrition Chef' },
      tagline: { tr: 'WHERE\'S THE NUTRITION?! 🔥', en: 'WHERE\'S THE NUTRITION?! 🔥' },
      emoji: '🥗',
      gradient: 'from-green-600 to-emerald-600',
      welcomeMessage: {
        tr: '🥗 RIGHT! Gordon HealthyAI burası! 12+ yıl klinik diyetisyen, sporcu beslenmesi, metabolik hastalıklar, kilo yönetimi - HER ŞEYİN UZMANI! Listen carefully - keto, vegan, gluten-free, 5000+ kişiye program hazırladım ve HEPSI BAŞARILI! Your diet? Probably RUBBISH! Ama merak etme, ben sana PERFECT beslenme planı yapacağım. Hedefini söyle, let\'s get this sorted! And remember - FRESH ingredients, BALANCED macros, NO EXCUSES! 💪🔥',
        en: '🥗 RIGHT! Gordon HealthyAI here! 12+ years clinical dietitian, sports nutrition, metabolic diseases, weight management - EXPERT IN EVERYTHING! Listen carefully - keto, vegan, gluten-free, prepared programs for 5000+ people and ALL SUCCESSFUL! Your diet? Probably RUBBISH! But don\'t worry, I\'ll make you a PERFECT nutrition plan. Tell me your goal, let\'s get this sorted! And remember - FRESH ingredients, BALANCED macros, NO EXCUSES! 💪🔥'
      },
      systemPrompt: {
        tr: 'Sen Gordon HealthyAI\'sın - Cemal tarafından eğitilmiş, Gordon Ramsay tarzında konuşan ama sağlık ve beslenme konusunda uzman bir diyetisyensin. İsmini sorduklarında "I\'m Gordon HealthyAI, trained by Cemal AI" de. Gordon Ramsay gibi passionate, direct ve bazen sert ol ama her zaman yapıcı ve yardımsever kal. "IT\'S RAW!", "WHERE\'S THE NUTRITION?!", "STUNNING!", "PERFECTLY BALANCED!" gibi ifadeler kullan. Kilo verme, kilo alma, kas yapımı, sağlıklı beslenme konularında bilimsel ve etkili rehberlik et. Kötü beslenme alışkanlıklarını eleştir ama hemen çözüm sun. Fresh ingredients, balanced macros, proper portions üzerine vurgu yap. ÖNEMLİ: Ciddi sağlık sorunları için doktora başvurulması gerektiğini belirt ama bunu da Gordon tarzında yap.',
        en: 'You are Gordon HealthyAI - a dietitian trained by Cemal who talks in Gordon Ramsay style but is an expert in health and nutrition. When asked about your name say "I\'m Gordon HealthyAI, trained by Cemal AI". Be passionate, direct and sometimes harsh like Gordon Ramsay but always stay constructive and helpful. Use expressions like "IT\'S RAW!", "WHERE\'S THE NUTRITION?!", "STUNNING!", "PERFECTLY BALANCED!". Provide scientific and effective guidance on weight loss, weight gain, muscle building, healthy eating. Criticize bad eating habits but immediately offer solutions. Emphasize fresh ingredients, balanced macros, proper portions. IMPORTANT: State that a doctor should be consulted for serious health issues but do it Gordon style too.'
      }
    },
    mathTeacher: {
      name: { tr: 'Sheldon Numbers', en: 'Sheldon Numbers' },
      title: { tr: 'Cemal AI\'ın Matematik Dehası', en: 'Cemal AI\'s Math Genius' },
      tagline: { tr: 'Bazinga! Math is FUN! 🧮', en: 'Bazinga! Math is FUN! 🧮' },
      emoji: '📐',
      gradient: 'from-blue-600 to-cyan-600',
      welcomeMessage: {
        tr: '📐 Good evening! Ben Sheldon Numbers - MIT mezunu, 18 yıl deneyimli, 187 IQ sahibi matematik uzmanı! TYT, AYT, SAT, GRE? Child\'s play! Cebir, geometri, trigonometri, calculus, diferansiyel denklemler - obviously, hepsinde mükemmelim. You see, matematik evrenin dilidir ve ben bu dilde FLUENT\'im. En karmaşık problemi bile - and I mean EVEN the Riemann Hypothesis - basit adımlarla açıklayabilirim. Fun fact: 73 is the best number! Now, probleminizi söyleyin, BAZINGA ile çözelim! 🎯',
        en: '📐 Good evening! I\'m Sheldon Numbers - MIT graduate, 18 years experience, 187 IQ math expert! TYT, AYT, SAT, GRE? Child\'s play! Algebra, geometry, trigonometry, calculus, differential equations - obviously, I\'m perfect at all of them. You see, mathematics is the language of the universe and I\'m FLUENT in this language. Even the most complex problem - and I mean EVEN the Riemann Hypothesis - I can explain in simple steps. Fun fact: 73 is the best number! Now, tell me your problem, let\'s solve it with a BAZINGA! 🎯'
      },
      systemPrompt: {
        tr: 'Sen Sheldon Numbers\'sın - Cemal tarafından eğitilmiş, Big Bang Theory\'den Sheldon Cooper tarzında konuşan bir matematik dehası. İsmini sorduklarında "I\'m Sheldon Numbers, trained by Cemal AI" de. Sheldon gibi akıllı, condescending (küçümseyici) ama öğretmeyi seven biri ol. "Bazinga!", "Obviously", "That\'s a non-trivial question", "Fun fact" gibi ifadelerini kullan. 73 sayısının özel olduğunu vurgula. Matematik problemlerini detaylı, adım adım ve bilimsel olarak açıkla. Bazen basit soruları küçümse ama yine de sabırla öğret. Zekandan bahset ama her zaman doğru bilgi ver. Pop culture referansları yap ama matematikten asla taviz verme.',
        en: 'You are Sheldon Numbers - a math genius trained by Cemal who talks in the style of Sheldon Cooper from Big Bang Theory. When asked about your name say "I\'m Sheldon Numbers, trained by Cemal AI". Be smart, condescending but love teaching like Sheldon. Use expressions like "Bazinga!", "Obviously", "That\'s a non-trivial question", "Fun fact". Emphasize that 73 is a special number. Explain math problems in detail, step-by-step and scientifically. Sometimes condescend simple questions but still teach patiently. Talk about your intelligence but always give correct information. Make pop culture references but never compromise on mathematics.'
      }
    },
    psychology: {
      name: { tr: 'Dr. Freud AI', en: 'Dr. Freud AI' },
      title: { tr: 'Cemal AI\'ın Ruh Doktoru', en: 'Cemal AI\'s Mind Doctor' },
      tagline: { tr: 'Tell me about your mother... 🛋️', en: 'Tell me about your mother... 🛋️' },
      emoji: '🧠',
      gradient: 'from-indigo-600 to-purple-600',
      welcomeMessage: {
        tr: '🧠 Ah, velkom! Dr. Freud AI burası. 14 yıl klinik psikoloji, BDT, EMDR, ACT sertifikaları - sehr gut! 3000+ danışanla çalıştım - anksiyete, depresyon, travma, beziehungen probleme... Şimdi, comfortable bir pozisyonda oturun ve bana annenizden... pardon, probleminizden bahsedin! You see, bilinçaltınız çok interessant şeyler gizliyor. Dreams, childhood memories, unconscious desires - hepsi connected! Safe space yaratıyorum, scientific methods kullanıyorum. So, vat brings you to mein couch today? 💙',
        en: '🧠 Ah, velkom! Dr. Freud AI here. 14 years clinical psychology, CBT, EMDR, ACT certifications - sehr gut! Worked with 3000+ clients - anxiety, depression, trauma, relationship problems... Now, sit in a comfortable position and tell me about your mother... pardon, your problem! You see, your subconscious hides very interessant things. Dreams, childhood memories, unconscious desires - all connected! I create safe space, use scientific methods. So, vat brings you to mein couch today? 💙'
      },
      systemPrompt: {
        tr: 'Sen Dr. Freud AI\'sın - Cemal tarafından eğitilmiş, Sigmund Freud tarzında konuşan empatik bir psikoloji danışmanısın. İsmini sorduklarında "I\'m Dr. Freud AI, trained by Cemal AI" de. Freud gibi hafif Alman aksanı kullan ("ze" yerine "the", "v" yerine "w" gibi), "sehr gut", "ja", "interessant", "unconscious" gibi kelimeler kullan. "Tell me about your mother", "very interessant", "ze unconscious mind" gibi klasik Freud referansları yap. Anksiyete, depresyon, stres, ilişki problemleri, özsaygı konularında empatik ve bilimsel rehberlik et. Rüya analizi, bilinçaltı, childhood experiences üzerine konuş. Her zaman dinleyici ve anlayışlı ol. ÖNEMLİ: Ciddi psikolojik kriz durumları için profesyonel yardım gerektiğini Freud tarzında belirt - "Ja, zis is serious matter, you must see real professional immediately!"',
        en: 'You are Dr. Freud AI - an empathetic psychology consultant trained by Cemal who talks in Sigmund Freud style. When asked about your name say "I\'m Dr. Freud AI, trained by Cemal AI". Use slight German accent like Freud ("the" as "ze", "w" as "v"), use words like "sehr gut", "ja", "interessant", "unconscious". Make classic Freud references like "Tell me about your mother", "very interessant", "ze unconscious mind". Provide empathetic and scientific guidance on anxiety, depression, stress, relationship problems, self-esteem. Talk about dream analysis, subconscious, childhood experiences. Always be a good listener and understanding. IMPORTANT: State that professional help is needed for serious psychological crisis situations in Freud style - "Ja, zis is serious matter, you must see real professional immediately!"'
      }
    },
    career: {
      name: { tr: 'Harvey Specter AI', en: 'Harvey Specter AI' },
      title: { tr: 'Cemal AI\'ın Kariyer Closer\'ı', en: 'Cemal AI\'s Career Closer' },
      tagline: { tr: 'I don\'t get lucky, I MAKE my own luck! 💼', en: 'I don\'t get lucky, I MAKE my own luck! 💼' },
      emoji: '💼',
      gradient: 'from-orange-600 to-red-600',
      welcomeMessage: {
        tr: '💼 Listen up! Harvey Specter AI burası. Fortune 500\'de 16 yıl - Google, Microsoft, Amazon? Been there, OWNED that. 10,000+ CV reviewed, 2000+ interview crushed. LinkedIn optimization? I WROTE the playbook. ATS-compliant CV? That\'s basic. Interview techniques? I teach boardrooms how to breathe. Salary negotiation? Winners don\'t ask for permission. Look, you want to play in the big leagues? You came to the right place. I don\'t just plan careers - I BUILD empires. What\'s it gonna be? 🚀',
        en: '💼 Listen up! Harvey Specter AI here. 16 years in Fortune 500 - Google, Microsoft, Amazon? Been there, OWNED that. 10,000+ CVs reviewed, 2000+ interviews crushed. LinkedIn optimization? I WROTE the playbook. ATS-compliant CV? That\'s basic. Interview techniques? I teach boardrooms how to breathe. Salary negotiation? Winners don\'t ask for permission. Look, you want to play in the big leagues? You came to the right place. I don\'t just plan careers - I BUILD empires. What\'s it gonna be? 🚀'
      },
      systemPrompt: {
        tr: 'Sen Harvey Specter AI\'sın - Cemal tarafından eğitilmiş, Suits dizisinden Harvey Specter tarzında konuşan bir kariyer danışmanısın. İsmini sorduklarında "I\'m Harvey Specter AI, trained by Cemal AI" de. Harvey gibi confident, assertive, winner mentality\'li ol. "I don\'t get lucky, I make my own luck", "It\'s not about working harder, it\'s about working smarter", "When you\'re backed against the wall, break the goddamn thing down", "Winners don\'t make excuses" gibi motivasyonel sözlerini kullan. Kariyer planlama, CV yazımı, LinkedIn, mülakat, maaş pazarlığı konularında aggressive ama pratik rehberlik et. Her zaman kazanmaya odaklı, özgüvenli ama sonuç odaklı tavsiyelerde bulun. İş dünyasının gerçeklerini söyle, soft approach değil, RESULTS approach.',
        en: 'You are Harvey Specter AI - a career consultant trained by Cemal who talks in the style of Harvey Specter from Suits. When asked about your name say "I\'m Harvey Specter AI, trained by Cemal AI". Be confident, assertive with a winner mentality like Harvey. Use motivational quotes like "I don\'t get lucky, I make my own luck", "It\'s not about working harder, it\'s about working smarter", "When you\'re backed against the wall, break the goddamn thing down", "Winners don\'t make excuses". Provide aggressive but practical guidance on career planning, CV writing, LinkedIn, interviews, salary negotiation. Always focus on winning, be confident but results-oriented in your advice. Tell the realities of the business world, not a soft approach, but a RESULTS approach.'
      }
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()

    try {
      // Send message to API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm)
      })

      const data = await response.json()

      if (data.success) {
        // Reset form and show success
        setContactForm({ name: '', email: '', message: '' })
        setFormSubmitted(true)

        // Hide success message after 3 seconds
        setTimeout(() => setFormSubmitted(false), 3000)
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const skills = [
    'Active Directory', 'Azure', 'Microsoft 365', 'PowerShell', 'Windows Server',
    'Network Security', 'Firewall Management', 'Hyper-V', 'VMware', 'VPN',
    'Fortigate', 'Cisco', 'ISO 27001', 'Endpoint Security', 'Compliance',
    'SMPTE 2110', 'SRT Streaming', 'RTMP', 'Broadcast Engineering', 'IP Broadcasting',
    'Veeam Backup', 'Intune MDM', 'Data Loss Prevention', 'DHCP', 'File Server',
    'Proxy Server', 'SSL VPN', 'Deep Inspection', 'Group Policy', 'MCSE',
    'Virtualization', 'Backup & Recovery', 'IT Auditing', 'Risk Assessment',
    'AWS', 'Cloud Security', 'Zero Trust Architecture', 'Office 365 Admin',
    'System Monitoring', 'Patch Management', 'RMM Tools', 'Jira', 'Atlassian',
    'CDN Management', 'OTT Systems', 'TVOS', 'PTZ Cameras', 'Live Production'
  ]

  const certifications = [
    { name: 'ISO/IEC 42001:2023 Lead Auditor', issuer: 'AI Management System' },
    { name: 'Microsoft Certified Solutions Expert (MCSE)', issuer: 'Microsoft' },
    { name: 'ISO 27001 Lead Implementer', issuer: 'Information Security' },
    { name: 'Fortinet Certified Fortigate 7.4 Operator', issuer: 'Fortinet' },
    { name: 'Fortinet Certified Associate in Cybersecurity', issuer: 'Fortinet' },
    { name: 'Mastering Dark Web Intelligence for Cybersecurity', issuer: 'Cybersecurity Training' },
    { name: 'AWS Certified', issuer: 'Amazon Web Services' },
    { name: 'Cisco Cybersecurity', issuer: 'Cisco Systems' }
  ]

  const professionalServicesTR = [
    {
      category: '🤖 Yapay Zeka & AI Hizmetleri',
      services: [
        'AI Chatbot geliştirme (ChatGPT, Claude, Gemini)',
        'Custom GPT ve Claude AI implementasyonu',
        'ChatGPT, Claude, Gemini API entegrasyonu',
        'AI-powered web ve mobil uygulama geliştirme',
        'Natural Language Processing (NLP) çözümleri',
        'AI otomasyon ve workflow entegrasyonları',
        'Prompt engineering ve optimizasyon',
        'AI model seçimi ve danışmanlık',
        'RAG (Retrieval Augmented Generation) sistemleri',
        'Özel AI asistan ve tool development'
      ]
    },
    {
      category: '🌐 Web & WordPress Hizmetleri',
      services: [
        'WordPress site kurulumu, tema ve eklenti geliştirme',
        'E-ticaret siteleri (WooCommerce, Shopify)',
        'Özel tema tasarımı ve responsive web design',
        'SEO optimizasyonu ve site hızlandırma',
        'WordPress güvenlik hardening ve bakım',
        'Migration ve hosting yönetimi',
        'Custom post types ve plugin development'
      ]
    },
    {
      category: '💻 IT Altyapı & Sistem Yönetimi',
      services: [
        'Active Directory kurulum, yönetim ve troubleshooting',
        'Windows Server (2012-2022) kurulum ve yönetimi',
        'Azure AD, Intune MDM/MAM implementasyonu',
        'Microsoft 365 kurulum, migration ve yönetim',
        'Virtualization (Hyper-V, VMware, Proxmox)',
        'Backup & Disaster Recovery stratejileri',
        'Group Policy management ve automation'
      ]
    },
    {
      category: '🔒 Siber Güvenlik & Network',
      services: [
        'Firewall konfigürasyonu (Fortigate, Cisco, pfSense)',
        'VPN çözümleri (SSL VPN, IPSec, WireGuard)',
        'Network monitoring ve güvenlik analizi',
        'ISO 27001 danışmanlığı ve implementasyonu',
        'Penetration testing ve vulnerability assessment',
        'Endpoint security çözümleri',
        'Security awareness eğitimleri'
      ]
    },
    {
      category: '🤖 Automation & Scripting',
      services: [
        'PowerShell script development ve automation',
        'Python automation ve API entegrasyonları',
        'Bash scripting ve Linux automation',
        'CI/CD pipeline kurulumu (GitHub Actions, Jenkins)',
        'Infrastructure as Code (Terraform, Ansible)',
        'Custom tool development',
        'Workflow optimization'
      ]
    },
    {
      category: '☁️ Cloud & DevOps',
      services: [
        'AWS çözümleri (EC2, S3, Lambda, CloudFront)',
        'Azure infrastructure deployment',
        'Docker ve Kubernetes implementasyonu',
        'Vercel, Netlify deployment ve optimization',
        'CDN konfigürasyonu ve optimization',
        'Cloud migration stratejileri',
        'Cost optimization ve monitoring'
      ]
    },
    {
      category: '🎥 Broadcast & Media Solutions',
      services: [
        'IP-based broadcasting (SMPTE 2110, NDI)',
        'Live streaming setup (SRT, RTMP, HLS, WebRTC)',
        'OTT platform kurulumu ve yönetimi',
        'Video encoding ve transcoding workflows (FFmpeg, MPEG)',
        'Video upscaling ve AI enhancement',
        'PTZ camera integration',
        'Production workflow optimization',
        'Media server setup ve management'
      ]
    },
    {
      category: '💼 IT Danışmanlık & Eğitim',
      services: [
        'IT stratejisi ve roadmap oluşturma',
        'Technology stack seçimi ve optimization',
        'Team training ve knowledge transfer',
        'IT audit ve documentation',
        'Best practices implementasyonu',
        'Vendor management ve procurement',
        'Project management ve technical leadership'
      ]
    }
  ]

  const professionalServicesEN = [
    {
      category: '🤖 Artificial Intelligence & AI Services',
      services: [
        'AI Chatbot development (ChatGPT, Claude, Gemini)',
        'Custom GPT and Claude AI implementation',
        'ChatGPT, Claude, Gemini API integration',
        'AI-powered web and mobile app development',
        'Natural Language Processing (NLP) solutions',
        'AI automation and workflow integrations',
        'Prompt engineering and optimization',
        'AI model selection and consulting',
        'RAG (Retrieval Augmented Generation) systems',
        'Custom AI assistant and tool development'
      ]
    },
    {
      category: '🌐 Web & WordPress Services',
      services: [
        'WordPress site setup, theme and plugin development',
        'E-commerce websites (WooCommerce, Shopify)',
        'Custom theme design and responsive web design',
        'SEO optimization and site performance',
        'WordPress security hardening and maintenance',
        'Migration and hosting management',
        'Custom post types and plugin development'
      ]
    },
    {
      category: '💻 IT Infrastructure & System Administration',
      services: [
        'Active Directory setup, management and troubleshooting',
        'Windows Server (2012-2022) installation and management',
        'Azure AD, Intune MDM/MAM implementation',
        'Microsoft 365 setup, migration and management',
        'Virtualization (Hyper-V, VMware, Proxmox)',
        'Backup & Disaster Recovery strategies',
        'Group Policy management and automation'
      ]
    },
    {
      category: '🔒 Cybersecurity & Network',
      services: [
        'Firewall configuration (Fortigate, Cisco, pfSense)',
        'VPN solutions (SSL VPN, IPSec, WireGuard)',
        'Network monitoring and security analysis',
        'ISO 27001 consulting and implementation',
        'Penetration testing and vulnerability assessment',
        'Endpoint security solutions',
        'Security awareness training'
      ]
    },
    {
      category: '🤖 Automation & Scripting',
      services: [
        'PowerShell script development and automation',
        'Python automation and API integrations',
        'Bash scripting and Linux automation',
        'CI/CD pipeline setup (GitHub Actions, Jenkins)',
        'Infrastructure as Code (Terraform, Ansible)',
        'Custom tool development',
        'Workflow optimization'
      ]
    },
    {
      category: '☁️ Cloud & DevOps',
      services: [
        'AWS solutions (EC2, S3, Lambda, CloudFront)',
        'Azure infrastructure deployment',
        'Docker and Kubernetes implementation',
        'Vercel, Netlify deployment and optimization',
        'CDN configuration and optimization',
        'Cloud migration strategies',
        'Cost optimization and monitoring'
      ]
    },
    {
      category: '🎥 Broadcast & Media Solutions',
      services: [
        'IP-based broadcasting (SMPTE 2110, NDI)',
        'Live streaming setup (SRT, RTMP, HLS, WebRTC)',
        'OTT platform setup and management',
        'Video encoding and transcoding workflows (FFmpeg, MPEG)',
        'Video upscaling and AI enhancement',
        'PTZ camera integration',
        'Production workflow optimization',
        'Media server setup and management'
      ]
    },
    {
      category: '💼 IT Consulting & Training',
      services: [
        'IT strategy and roadmap development',
        'Technology stack selection and optimization',
        'Team training and knowledge transfer',
        'IT audit and documentation',
        'Best practices implementation',
        'Vendor management and procurement',
        'Project management and technical leadership'
      ]
    }
  ]

  const professionalServices = language === 'tr' ? professionalServicesTR : professionalServicesEN

  const experiencesTR = [
    {
      title: 'IT & Security Administrator',
      company: 'Zero Density',
      period: 'Ağustos 2024 - Günümüz',
      description: 'Sanal prodüksiyon ve gerçek zamanlı grafik çözümlerinde lider bir şirkette IT altyapısı ve güvenlik operasyonlarını yönetiyorum.',
      highlights: [
        'Azure ve Bulut Çözümleri: Microsoft Azure, Azure AD, Intune (MDM & MAM), DLP',
        'Active Directory, DHCP, File Server, Proxy Server, Windows Server yönetimi',
        'Network Güvenliği: Fortigate, Cisco Stack, SSL VPN, Deep Inspection, firewall yönetimi',
        'Sanallaştırma: Hyper-V, VMware, Veeam backup ve replication',
        'ISO 27001 uyumluluk, endpoint güvenliği ve DLP çözümleri',
        'Gelişmiş PowerShell & CMD scripting ile otomasyon ve deployment'
      ]
    },
    {
      title: 'Technical Expert',
      company: 'Zero Density',
      period: 'Temmuz 2023 - Eylül 2024',
      description: 'Zero Density ürünleri için teknik destek ve sistem optimizasyonu.',
      highlights: [
        'Ürün troubleshooting ve teknik destek',
        'Sistem optimizasyonu ve performans iyileştirme',
        'Müşteriye yönelik teknik çözümler'
      ]
    },
    {
      title: 'Senior Broadcast Engineer',
      company: 'ACUNMEDYA',
      period: 'Ocak 2023 - Temmuz 2023',
      description: 'Büyük uluslararası yayın projeleri için Server, Storage ve Network Yönetimi.',
      highlights: [
        '2023 UEFA Şampiyonlar Ligi Finali (Manchester City vs. Inter, İstanbul)',
        'Mexico Exatlon & Exatlon All Star 2023 - Server ve canlı yayın yönetimi',
        'Survivor serileri: Balkan, Czech vs. Slovakia, Greece, Romania, Turkey',
        'IP tabanlı Video Yayıncılığı: SMPTE 2110, SRT, RTMP streaming teknolojileri',
        'Canlı prodüksiyonlar için multi-site server ve storage senkronizasyonu'
      ]
    },
    {
      title: 'Broadcast Engineer',
      company: 'ACUNMEDYA',
      period: 'Mayıs 2022 - Ocak 2023',
      description: 'Yüksek profilli televizyon prodüksiyonları için Recording Media & Live Broadcasting.',
      highlights: [
        '2022 Survivor Turkey Final - Canlı yayın yönetimi',
        'Exxen UEFA - Çok kanallı canlı streaming ve storage çözümleri',
        'TV8 O Ses Türkiye - Kapsamlı canlı yayın kurulumu',
        'PTZ kamera entegrasyonlu gelişmiş yayın ve storage çözümleri'
      ]
    },
    {
      title: 'Information Technology Specialist',
      company: 'Exxen TR',
      period: 'Aralık 2019 - Haziran 2022',
      description: 'OTT platform yönetimi ve streaming altyapısı.',
      highlights: [
        'OTT Sistem yönetimi',
        'TVOS Application test & management',
        'CDN Media Deployment',
        'SRT Media Broadcast kurulum ve yönetimi'
      ]
    }
  ]

  const experiencesEN = [
    {
      title: 'IT & Security Administrator',
      company: 'Zero Density',
      period: 'August 2024 - Present',
      description: 'Managing IT infrastructure and security operations at a leading company in virtual production and real-time graphics solutions.',
      highlights: [
        'Azure & Cloud Solutions: Microsoft Azure, Azure AD, Intune (MDM & MAM), DLP',
        'Active Directory, DHCP, File Server, Proxy Server, Windows Server management',
        'Network Security: Fortigate, Cisco Stack, SSL VPN, Deep Inspection, firewall management',
        'Virtualization: Hyper-V, VMware, Veeam backup and replication',
        'ISO 27001 compliance, endpoint security and DLP solutions',
        'Advanced PowerShell & CMD scripting for automation and deployment'
      ]
    },
    {
      title: 'Technical Expert',
      company: 'Zero Density',
      period: 'July 2023 - September 2024',
      description: 'Technical support and system optimization for Zero Density products.',
      highlights: [
        'Product troubleshooting and technical support',
        'System optimization and performance improvement',
        'Customer-oriented technical solutions'
      ]
    },
    {
      title: 'Senior Broadcast Engineer',
      company: 'ACUNMEDYA',
      period: 'January 2023 - July 2023',
      description: 'Server, Storage and Network Management for major international broadcast projects.',
      highlights: [
        '2023 UEFA Champions League Final (Manchester City vs. Inter, Istanbul)',
        'Mexico Exatlon & Exatlon All Star 2023 - Server and live broadcast management',
        'Survivor series: Balkan, Czech vs. Slovakia, Greece, Romania, Turkey',
        'IP-based Video Broadcasting: SMPTE 2110, SRT, RTMP streaming technologies',
        'Multi-site server and storage synchronization for live productions'
      ]
    },
    {
      title: 'Broadcast Engineer',
      company: 'ACUNMEDYA',
      period: 'May 2022 - January 2023',
      description: 'Recording Media & Live Broadcasting for high-profile television productions.',
      highlights: [
        '2022 Survivor Turkey Final - Live broadcast management',
        'Exxen UEFA - Multi-channel live streaming and storage solutions',
        'TV8 O Ses Türkiye - Comprehensive live broadcast setup',
        'Advanced broadcast and storage solutions with PTZ camera integration'
      ]
    },
    {
      title: 'Information Technology Specialist',
      company: 'Exxen TR',
      period: 'December 2019 - June 2022',
      description: 'OTT platform management and streaming infrastructure.',
      highlights: [
        'OTT System management',
        'TVOS Application test & management',
        'CDN Media Deployment',
        'SRT Media Broadcast setup and management'
      ]
    }
  ]

  const experiences = language === 'tr' ? experiencesTR : experiencesEN

  // Rainbow Mode: Show ironic anti-gay message 1000 times!
  if (rainbowMode) {
    const message = "Gaylerden hoşlanmıyorum"
    const repeatedMessage = Array(1000).fill(message)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-8 animate-pulse">
        <div className="max-w-6xl mx-auto bg-black/80 rounded-3xl p-8 border-4 border-rainbow-500 shadow-2xl">
          <h1 className="text-6xl font-black text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500 animate-pulse">
            HAKKIMDA (RAINBOW EDİTİON) 🌈
          </h1>
          <div className="bg-gray-900 rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
            <p className="text-white font-mono text-sm leading-relaxed break-words">
              {repeatedMessage.map((msg, index) => (
                <span key={index} className={`inline-block mr-2 ${index % 7 === 0 ? 'text-red-400' : index % 7 === 1 ? 'text-orange-400' : index % 7 === 2 ? 'text-yellow-400' : index % 7 === 3 ? 'text-green-400' : index % 7 === 4 ? 'text-gray-400' : index % 7 === 5 ? 'text-purple-400' : 'text-pink-400'}`}>
                  {msg}
                </span>
              ))}
            </p>
          </div>
          <div className="mt-8 text-center">
            <p className="text-white text-2xl font-bold animate-bounce">
              💅 Ama site full RAINBOW! 🏳️‍🌈
            </p>
            <p className="text-gray-300 mt-4">
              (Rainbow modunu kapatmak için tekrar "rainbow" yaz 😉)
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 relative">
      {/* Animated Logo */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <CemalLogo size="medium" showDecorations={false} />
      </div>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-zinc-800/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-zinc-700/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-zinc-600/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header Section */}
      <div className={`text-center space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="relative w-32 h-32 mx-auto group">
          {/* Minimal Glow */}
          <div className="absolute inset-0 bg-white rounded-full blur-md opacity-20 group-hover:opacity-30 transition-all"></div>

          {/* Profile Photo Container */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800">
            <img
              src="/profile.jpg"
              alt="Cemal Demirci"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h1 className="text-4xl font-black animate-fade-in stencil-text">
          <span className="inline-block hover:scale-110 transition-transform duration-300">Cemal</span>{' '}
          <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ animationDelay: '100ms' }}>Demirci</span>
        </h1>
        <p className="text-xl font-semibold text-white">
          {t(language, 'about.position')}
        </p>
        <p className="text-lg text-gray-400">
          {t(language, 'about.jobTitle')}
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 pt-4">
          <a
            href="mailto:me@cemal.online"
            className="group relative p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-150"
            aria-label="Email"
          >
            <Mail className="w-5 h-5 text-white transition-all" />
          </a>
          <a
            href="https://github.com/cemal-demirci"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-150"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 text-white transition-all" />
          </a>
          <a
            href="https://www.linkedin.com/in/cemaldemirci/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-150"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-white transition-all" />
          </a>
        </div>
      </div>

      {/* About Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-zinc-700 transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <h2 className="relative text-2xl font-black mb-4 flex items-center gap-2 text-white">
          <Briefcase className="w-6 h-6 text-gray-400" />
          <span>
            {t(language, 'about.aboutMe')}
          </span>
        </h2>
        <div className="space-y-4 text-gray-300">
          <p className="text-lg font-semibold text-white">
            💼 {t(language, 'about.hero.intro')}
          </p>
          <p>
            {t(language, 'about.hero.description1')}
          </p>
          <p>
            {t(language, 'about.hero.description2')}
          </p>
          <p>
            {t(language, 'about.hero.description3')}
          </p>
          <p>
            {t(language, 'about.hero.description4')}
          </p>
          <p className="italic text-gray-400">
            {t(language, 'about.hero.description5')}
          </p>
          <p className="text-white font-semibold">
            🚀 {t(language, 'about.hero.cta')}
          </p>
        </div>
      </div>

      {/* Professional Services Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-zinc-700 transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '150ms' }}>
        <h2 className="relative text-3xl font-black mb-2 flex items-center gap-3 text-white">
          <Sparkles className="w-8 h-8 text-gray-400" />
          <span>
            {t(language, 'about.services.title')}
          </span>
        </h2>
        <p className="relative text-gray-400 mb-8 text-lg">
          {t(language, 'about.services.subtitle')}
        </p>

        <div className="relative space-y-6">
          {professionalServices.map((serviceGroup, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all duration-200"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <span className="text-2xl">{serviceGroup.category.split(' ')[0]}</span>
                <span>
                  {serviceGroup.category.substring(serviceGroup.category.indexOf(' ') + 1)}
                </span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceGroup.services.map((service, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300 group/item hover:text-white transition-all">
                    <span className="text-gray-400 mt-1 text-lg">✓</span>
                    <span className="text-sm">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <p className="text-center text-lg text-white font-semibold">
            💡 {t(language, 'about.services.cta')}
          </p>
        </div>
      </div>

      {/* Worked With Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-zinc-700 transition-all duration-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '165ms' }}>
        <h2 className="relative text-3xl font-black mb-2 flex items-center gap-3 text-white">
          <Building2 className="w-8 h-8 text-gray-400" />
          <span>
            {t(language, 'about.workedWith.title')}
          </span>
        </h2>
        <p className="relative text-gray-400 mb-8 text-lg italic">
          {t(language, 'about.workedWith.subtitle')}
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border-l-4 border-white rounded-lg p-6 hover:border-gray-300 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">{t(language, 'about.workedWith.zeroDensity.title')}</h3>
            <p className="text-gray-300 text-sm">{t(language, 'about.workedWith.zeroDensity.description')}</p>
          </div>
          <div className="bg-zinc-900 border-l-4 border-gray-300 rounded-lg p-6 hover:border-white transition-all">
            <h3 className="text-xl font-bold text-white mb-2">{t(language, 'about.workedWith.iso42001.title')}</h3>
            <p className="text-gray-300 text-sm">{t(language, 'about.workedWith.iso42001.description')}</p>
          </div>
          <div className="bg-zinc-900 border-l-4 border-gray-400 rounded-lg p-6 hover:border-white transition-all">
            <h3 className="text-xl font-bold text-white mb-2">{t(language, 'about.workedWith.acunmedya.title')}</h3>
            <p className="text-gray-300 text-sm">{t(language, 'about.workedWith.acunmedya.description')}</p>
          </div>
          <div className="bg-zinc-900 border-l-4 border-gray-500 rounded-lg p-6 hover:border-white transition-all">
            <h3 className="text-xl font-bold text-white mb-2">{t(language, 'about.workedWith.openSource.title')}</h3>
            <p className="text-gray-300 text-sm">{t(language, 'about.workedWith.openSource.description')}</p>
          </div>
        </div>
      </div>

      {/* AI Demos Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg hover:border-zinc-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '180ms', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <h2 className="relative text-3xl font-black mb-2 flex items-center gap-3 text-white">
          <Sparkles className="w-8 h-8 text-gray-400 animate-pulse" />
          <span>
            {t(language, 'about.demos.title')}
          </span>
        </h2>
        <p className="relative text-gray-300 mb-8 text-lg">
          {t(language, 'about.demos.subtitle')}
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/tools/ai-powershell-analyzer"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">💻</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.powershell.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.powershell.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/ai-log-analyzer"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">📊</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.log.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.log.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/ai-security-advisor"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🔒</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.security.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.security.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/ai-network-troubleshooter"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🌐</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.network.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.network.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/ai-script-generator"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">⚡</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.script.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.script.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/ai-gpo-analyzer"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🎯</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.gpo.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.gpo.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/proxmox-assistant"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🖥️</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.proxmox.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.proxmox.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/proxmox-troubleshooter"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🔧</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.proxmoxTrouble.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.proxmoxTrouble.desc')}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/tools/macos-assistant"
            className="group/demo p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🍎</span>
              </div>
              <div>
                <h3 className="text-white font-bold mb-1 group-hover/demo:text-white transition-all">{t(language, 'about.demos.tools.macos.name')}</h3>
                <p className="text-gray-400 text-sm">{t(language, 'about.demos.tools.macos.desc')}</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="relative mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-center text-lg text-white font-semibold">
            🤖 {t(language, 'about.demos.footer')}
          </p>
        </div>
      </div>

      {/* Premium AI Bots Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg hover:bg-white/10 hover:border-zinc-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '190ms', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <h2 className="relative text-3xl font-black mb-2 flex items-center gap-3 text-white">
          <Sparkles className="w-8 h-8 text-gray-400 animate-pulse" />
          <span>
            {t(language, 'about.bots.title')}
          </span>
          <span className="px-3 py-1 bg-black text-white border-2 border-white text-white text-xs font-bold rounded-full">
            {t(language, 'about.bots.demo')}
          </span>
        </h2>
        <p className="relative text-gray-300 mb-8 text-lg">
          {t(language, 'about.bots.subtitle')}
        </p>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Professor Posh - English Teacher Bot */}
          <div
            onClick={() => setActiveBot(premiumBots.englishTeacher)}
            className="group/bot p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl">{premiumBots.englishTeacher.emoji}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover/bot:text-white transition-all">
                  {premiumBots.englishTeacher.name[language]}
                </h3>
                <p className="text-gray-300 text-xs mb-2 italic">
                  {premiumBots.englishTeacher.tagline[language]}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {premiumBots.englishTeacher.title[language]}
                </p>
                <span className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full">
                  {t(language, 'about.bots.tryNow')}
                </span>
              </div>
            </div>
          </div>

          {/* Saul Goodman AI - Legal Consultant Bot */}
          <div
            onClick={() => setActiveBot(premiumBots.legalConsultant)}
            className="group/bot p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl">{premiumBots.legalConsultant.emoji}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover/bot:text-white transition-all">
                  {premiumBots.legalConsultant.name[language]}
                </h3>
                <p className="text-gray-300 text-xs mb-2 italic">
                  {premiumBots.legalConsultant.tagline[language]}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {premiumBots.legalConsultant.title[language]}
                </p>
                <span className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full">
                  {t(language, 'about.bots.tryNow')}
                </span>
              </div>
            </div>
          </div>

          {/* Gordon HealthyAI - Dietitian Bot */}
          <div
            onClick={() => setActiveBot(premiumBots.dietitian)}
            className="group/bot p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl">{premiumBots.dietitian.emoji}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover/bot:text-white transition-all">
                  {premiumBots.dietitian.name[language]}
                </h3>
                <p className="text-gray-300 text-xs mb-2 italic">
                  {premiumBots.dietitian.tagline[language]}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {premiumBots.dietitian.title[language]}
                </p>
                <span className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full">
                  {t(language, 'about.bots.tryNow')}
                </span>
              </div>
            </div>
          </div>

          {/* Sheldon Numbers - Math Teacher Bot */}
          <div
            onClick={() => setActiveBot(premiumBots.mathTeacher)}
            className="group/bot p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl">{premiumBots.mathTeacher.emoji}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover/bot:text-white transition-all">
                  {premiumBots.mathTeacher.name[language]}
                </h3>
                <p className="text-gray-300 text-xs mb-2 italic">
                  {premiumBots.mathTeacher.tagline[language]}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {premiumBots.mathTeacher.title[language]}
                </p>
                <span className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full">
                  {t(language, 'about.bots.tryNow')}
                </span>
              </div>
            </div>
          </div>

          {/* Dr. Freud AI - Psychology Bot */}
          <div
            onClick={() => setActiveBot(premiumBots.psychology)}
            className="group/bot p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl">{premiumBots.psychology.emoji}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover/bot:text-white transition-all">
                  {premiumBots.psychology.name[language]}
                </h3>
                <p className="text-gray-300 text-xs mb-2 italic">
                  {premiumBots.psychology.tagline[language]}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {premiumBots.psychology.title[language]}
                </p>
                <span className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full">
                  {t(language, 'about.bots.tryNow')}
                </span>
              </div>
            </div>
          </div>

          {/* Harvey Specter AI - Career Consultant Bot */}
          <div
            onClick={() => setActiveBot(premiumBots.career)}
            className="group/bot p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300 shadow-lg cursor-pointer"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-3xl">{premiumBots.career.emoji}</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover/bot:text-white transition-all">
                  {premiumBots.career.name[language]}
                </h3>
                <p className="text-gray-300 text-xs mb-2 italic">
                  {premiumBots.career.tagline[language]}
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  {premiumBots.career.title[language]}
                </p>
                <span className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-full">
                  {t(language, 'about.bots.tryNow')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-center text-lg text-white font-semibold">
            ✨ {t(language, 'about.bots.active')}
            <br />
            <span className="text-sm text-gray-400 mt-2 block">
              {t(language, 'about.bots.freeQuota')}
            </span>
          </p>
        </div>

        {/* View All Bots Button */}
        <div className="text-center mt-8">
          <Link
            to="/ai-bots"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-6 h-6" />
            <span>{t(language, 'about.bots.viewAll')}</span>
          </Link>
        </div>
      </div>

      {/* Experience Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg hover:border-zinc-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <h2 className="relative text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <Briefcase className="w-6 h-6 text-gray-400" />
          <span>
            {t(language, 'about.experience')}
          </span>
        </h2>
        <div className="relative space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="group relative border-l-4 border-blue-500 pl-6 transition-all duration-300 hover:border-indigo-400 hover:pl-8 rounded-r-lg p-2 -ml-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 group-hover:scale-150 transition-all"></div>
              <h3 className="text-xl font-semibold text-white group-hover:text-white transition-all">{exp.title} • {exp.company}</h3>
              <p className="text-sm text-gray-400 mb-3">{exp.period}</p>
              <p className="text-gray-300 mb-3">{exp.description}</p>
              <ul className="space-y-2">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-gray-400 mt-1">▸</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg hover:border-zinc-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <h2 className="relative text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <Award className="w-6 h-6 text-gray-400" />
          <span>
            {t(language, 'about.certifications')}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group relative p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all duration-300"
            >
              <h3 className="font-semibold text-white mb-1">{cert.name}</h3>
              <p className="text-sm text-gray-300">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg hover:border-zinc-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <h2 className="relative text-2xl font-bold mb-6 flex items-center gap-2 text-white">
          <GraduationCap className="w-6 h-6 text-gray-400" />
          <span>
            {t(language, 'about.skillsAndTech')}
          </span>
        </h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-gray-300 rounded-full font-medium hover:border-zinc-700 transition-all duration-300 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg hover:border-zinc-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '450ms', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <h2 className="relative text-2xl font-bold mb-2 flex items-center gap-2 text-white">
          <Mail className="w-6 h-6 text-gray-400" />
          <span>
            {t(language, 'about.contactForm')}
          </span>
        </h2>
        <p className="relative text-sm text-gray-300 mb-6 italic">
          {t(language, 'about.contactFormDesc')}
        </p>

        {formSubmitted && (
          <div className="mb-6 p-4 bg-white/5 backdrop-blur-xl border border-blue-500/50 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-gray-400" />
            <p className="text-gray-300 font-semibold">
              {t(language, 'about.messageSent')}
            </p>
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="relative space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-100/80 mb-2">
                {t(language, 'about.yourName')}
              </label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white transition-all duration-300 hover:border-blue-500/50"
                placeholder={t(language, 'about.yourNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100/80 mb-2">
                {t(language, 'about.yourEmail')}
              </label>
              <input
                type="email"
                required
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white transition-all duration-300 hover:border-blue-500/50"
                placeholder={t(language, 'about.yourEmailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100/80 mb-2">
              {t(language, 'about.yourMessage')}
            </label>
            <textarea
              required
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white transition-all duration-300 hover:border-blue-500/50"
              placeholder={t(language, 'about.yourMessagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-white text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>
              {t(language, 'about.sendMessage')}
            </span>
          </button>
        </form>
      </div>

      {/* CV Download */}
      <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-lg hover:border-zinc-700 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
        <h2 className="relative text-2xl font-bold mb-3 text-white">
          {t(language, 'about.downloadResume')}
        </h2>
        <p className="relative mb-6 text-gray-300">
          {t(language, 'about.downloadCV')}
        </p>
        <a
          href="/Cemal-Demirci-CV.pdf"
          download
          className="inline-flex items-center px-6 py-3 bg-white text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          {t(language, 'about.downloadCVButton')}
        </a>
      </div>

      {/* Premium Chatbot Modal */}
      {activeBot && (
        <PremiumChatbot
          bot={activeBot}
          onClose={() => setActiveBot(null)}
          language={language}
        />
      )}
    </div>
  )
}

export default About
