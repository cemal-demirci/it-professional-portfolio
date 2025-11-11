#!/usr/bin/env python3
import re

# Read the original file
with open('/Users/cemaldemirci/Desktop/cemaldemirci-portfolio/src/translations.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define English home section
en_home = '''    // Home Page
    home: {
      // Boot Sequence
      boot: {
        init: 'cemal.online --init',
        hackingNasa: '[████████████] Hacking NASA... JK!',
        toolsReady: '30+ tools ready',
        botsAwake: 'AI bots awake',
        welcomeAboard: 'Welcome aboard!'
      },

      // Hero Section
      hero: {
        badge: 'Freelance IT Consultant & Developer',
        greeting: "Hello, I'm",
        name: 'Cemal',
        title: 'IT & Security Admin | Full-Stack Developer',
        subtitle: 'From WordPress to enterprise IT infrastructures, from cybersecurity to cloud solutions',
        subtitleHighlight: 'professional IT services and consulting',
        exploreTools: 'Explore Tools',
        servicesContact: 'Services & Contact'
      },

      // Tech Stack
      techStack: {
        react: 'React 18',
        vite: 'Vite',
        tailwind: 'Tailwind CSS',
        redis: 'Redis Cloud',
        vercel: 'Vercel Edge',
        cemalAI: 'Cemal AI'
      },

      // Features/Categories
      features: {
        title: 'Features & Tools',
        subtitle: '30+ professional tools and features, all free!',
        explore: 'Explore',
        categories: {
          code: {
            title: 'Code Tools',
            description: 'JSON formatter, Base64 encoder/decoder, Regex test and more'
          },
          security: {
            title: 'Security Tools',
            description: 'Password generator, hash generator, encryption/decryption tools'
          },
          text: {
            title: 'Text Tools',
            description: 'Markdown editor, word counter, text diff, case converter'
          },
          design: {
            title: 'Design Tools',
            description: 'Color picker, gradient generator, CSS generator'
          },
          network: {
            title: 'Network Tools',
            description: 'URL encoder, IP/DNS lookup, WHOIS, MAC lookup, Security headers and more'
          },
          windows: {
            title: 'Windows Tools',
            description: 'GUID generator, Power management, Bloatware cleanup scripts'
          },
          utility: {
            title: 'Utility Tools',
            description: 'QR code generator, timestamp converter, UUID generator'
          }
        }
      },

      // AI Bots Section
      aiBots: {
        badge: 'CEMAL AI PREMIUM',
        title: 'Premium AI Chatbots',
        subtitle: '12 special AI assistants with unique personalities. File upload, voice recording, and multi-language support!',
        exploreAll: 'Explore All AI Chatbots (12 Bots)',
        bots: {
          professorPosh: {
            name: 'Professor Posh',
            role: 'English Teacher',
            quote: '"Keep calm and learn English, mate!"',
            tag: 'British English Master'
          },
          saulGoodman: {
            name: 'Saul Goodman AI',
            role: 'Legal Consultant',
            quote: '"Better Call Saul... AI! ⚖️"',
            tag: 'Legal Strategist'
          },
          gordonHealthy: {
            name: 'Gordon HealthyAI',
            role: 'Dietitian',
            quote: '"WHERE\\'S THE NUTRITION?! 🔥"',
            tag: 'Nutrition Chef'
          },
          sheldonNumbers: {
            name: 'Sheldon Numbers',
            role: 'Math Genius',
            quote: '"Bazinga! Math is FUN! 🧮"',
            tag: 'Math Genius'
          },
          drFreud: {
            name: 'Dr. Freud AI',
            role: 'Psychology',
            quote: '"Tell me about your mother... 🛋️"',
            tag: 'Soul Doctor'
          },
          harveySpecter: {
            name: 'Harvey Specter AI',
            role: 'Career Coach',
            quote: '"I don\\'t get lucky, I MAKE my own luck! 💼"',
            tag: 'Career Closer'
          }
        }
      },

      // Special Features
      specialFeatures: {
        glossary: {
          title: 'IT Glossary',
          badge: '420+ Terms',
          description: 'Comprehensive IT glossary - 11 categories, interview questions, Turkish explanations',
          cta: 'Prepare for Interviews'
        },
        juniorIT: {
          title: 'Junior IT Assistant',
          badge: 'AI Powered',
          description: 'AI-powered IT assistant - Troubleshooting, script generation and more',
          cta: 'Work with AI'
        },
        fileShare: {
          title: 'Pleiades Share',
          badge: 'P2P',
          description: 'Peer-to-peer file sharing - Secure, fast, encryption supported',
          cta: 'Share Securely'
        }
      }
    },'''

# Define Turkish home section
tr_home = '''    // Home Page
    home: {
      // Boot Sequence
      boot: {
        init: 'cemal.online --init',
        hackingNasa: '[████████████] Hacking NASA... JK!',
        toolsReady: '30+ araç hazır',
        botsAwake: 'AI botlar uyanık',
        welcomeAboard: 'Hoş geldin!'
      },

      // Hero Section
      hero: {
        badge: 'Freelance IT Danışmanı & Developer',
        greeting: 'Merhaba, Ben',
        name: 'Cemal',
        title: 'IT & Security Admin | Full-Stack Developer',
        subtitle: 'WordPress\\'ten kurumsal IT altyapılarına, siber güvenlikten cloud çözümlerine kadar',
        subtitleHighlight: 'profesyonel IT hizmetleri ve danışmanlık',
        exploreTools: 'Araçları Keşfet',
        servicesContact: 'Hizmetler & İletişim'
      },

      // Tech Stack
      techStack: {
        react: 'React 18',
        vite: 'Vite',
        tailwind: 'Tailwind CSS',
        redis: 'Redis Cloud',
        vercel: 'Vercel Edge',
        cemalAI: 'Cemal AI'
      },

      // Features/Categories
      features: {
        title: 'Özellikler & Araçlar',
        subtitle: '30+ profesyonel araç ve özellik, hepsi ücretsiz!',
        explore: 'Keşfet',
        categories: {
          code: {
            title: 'Kod Araçları',
            description: 'JSON formatter, Base64 encoder/decoder, Regex test ve daha fazlası'
          },
          security: {
            title: 'Güvenlik Araçları',
            description: 'Şifre üretici, hash generator, şifreleme/deşifreleme araçları'
          },
          text: {
            title: 'Metin Araçları',
            description: 'Markdown editör, kelime sayacı, text diff, case converter'
          },
          design: {
            title: 'Tasarım Araçları',
            description: 'Renk seçici, gradient üretici, CSS generator'
          },
          network: {
            title: 'Network Araçları',
            description: 'URL encoder, IP/DNS lookup, WHOIS, MAC lookup, Security headers ve daha fazlası'
          },
          windows: {
            title: 'Windows Araçları',
            description: 'GUID generator, Güç yönetimi, Bloatware temizleme scriptleri'
          },
          utility: {
            title: 'Yardımcı Araçlar',
            description: 'QR kod üretici, timestamp converter, UUID generator'
          }
        }
      },

      // AI Bots Section
      aiBots: {
        badge: 'CEMAL AI PREMIUM',
        title: 'Premium AI Chatbotlar',
        subtitle: '12 özel karakterli AI asistanınız. Dosya yükleme, ses kayıt ve çoklu dil desteği ile!',
        exploreAll: 'Tüm AI Chatbotları Keşfet (12 Bot)',
        bots: {
          professorPosh: {
            name: 'Professor Posh',
            role: 'English Teacher',
            quote: '"Keep calm and learn English, mate!"',
            tag: 'British İngilizce Ustası'
          },
          saulGoodman: {
            name: 'Saul Goodman AI',
            role: 'Legal Consultant',
            quote: '"Better Call Saul... AI! ⚖️"',
            tag: 'Hukuk Stratejisti'
          },
          gordonHealthy: {
            name: 'Gordon HealthyAI',
            role: 'Dietitian',
            quote: '"WHERE\\'S THE NUTRITION?! 🔥"',
            tag: 'Beslenme Şefi'
          },
          sheldonNumbers: {
            name: 'Sheldon Numbers',
            role: 'Math Genius',
            quote: '"Bazinga! Math is FUN! 🧮"',
            tag: 'Matematik Dehası'
          },
          drFreud: {
            name: 'Dr. Freud AI',
            role: 'Psychology',
            quote: '"Tell me about your mother... 🛋️"',
            tag: 'Ruh Doktoru'
          },
          harveySpecter: {
            name: 'Harvey Specter AI',
            role: 'Career Coach',
            quote: '"I don\\'t get lucky, I MAKE my own luck! 💼"',
            tag: 'Kariyer Closer\\'ı'
          }
        }
      },

      // Special Features
      specialFeatures: {
        glossary: {
          title: 'IT Sözlüğü',
          badge: '420+ Terim',
          description: 'Kapsamlı IT sözlüğü - 11 kategori, mülakat soruları, Türkçe açıklamalar',
          cta: 'Mülakatlara Hazırlan'
        },
        juniorIT: {
          title: 'Junior IT Asistanı',
          badge: 'AI Destekli',
          description: 'AI destekli IT asistanı - Troubleshooting, script üretimi ve daha fazlası',
          cta: 'AI ile Çalış'
        },
        fileShare: {
          title: 'Pleiades Share',
          badge: 'P2P',
          description: 'Peer-to-peer dosya paylaşımı - Güvenli, hızlı, şifreleme destekli',
          cta: 'Güvenli Paylaş'
        }
      }
    },'''

# Replace English home section
en_pattern = r'(    // Home Page\s+home: \{[^}]+(?:\{[^}]+\}[^}]*)*\},)'
content = re.sub(en_pattern, en_home, content, count=1, flags=re.DOTALL)

# Replace Turkish home section
tr_pattern = r'(    // Home Page\s+home: \{[^}]+(?:\{[^}]+\}[^}]*)*\},)'
parts = content.split('tr: {')
if len(parts) == 2:
    tr_content = parts[1]
    tr_content = re.sub(tr_pattern, tr_home, tr_content, count=1, flags=re.DOTALL)
    content = parts[0] + 'tr: {' + tr_content

# Write the updated content
with open('/Users/cemaldemirci/Desktop/cemaldemirci-portfolio/src/translations.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations updated successfully!")
