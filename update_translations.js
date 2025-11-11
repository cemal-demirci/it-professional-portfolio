const fs = require('fs');

const filePath = './src/translations.js';
let content = fs.readFileSync(filePath, 'utf8');

// Define the new about section for English
const newAboutEN = `      title: 'Cemal Demirci',
      position: 'IT & Security Administrator MCSE | AI Lead Auditor',
      company: '@ Zero Density',
      jobTitle: 'IT & Security Administrator',
      aboutMe: 'About Me',
      experience: 'Work Experience',
      certifications: 'Certifications & Training',
      skills: 'Skills & Technologies',
      downloadResume: 'Download My CV',
      downloadCV: 'Download my CV for detailed work experience and certifications',
      downloadCVButton: 'Download CV (PDF)',
      contactForm: 'Contact Form',
      contactFormDesc: 'Get in touch for project proposals, consulting or collaboration',
      yourName: 'Your Name *',
      yourNamePlaceholder: 'Your Full Name',
      yourEmail: 'Your Email *',
      yourEmailPlaceholder: 'example@email.com',
      yourMessage: 'Your Message *',
      yourMessagePlaceholder: 'Provide details about your project or needs...',
      sendMessage: 'Send Message',
      messageSent: 'Your message has been sent successfully! I will get back to you soon.',

      // Hero Section
      hero: {
        intro: 'Freelance IT Consultant & Full-Stack Developer',
        description1: 'With 8+ years of experience in information technology and broadcast engineering, I provide professional services across a wide range from enterprise IT infrastructure to web development, cybersecurity to cloud solutions.',
        description2: 'I specialize in all areas of IT, from WordPress to enterprise Active Directory management, Azure cloud solutions to broadcast technologies. I hold certifications from Fortinet, AWS, Microsoft, and Cisco.',
        description3: 'Currently working as IT & Security Administrator at a leading company in virtual production and real-time graphics solutions, while also providing freelance projects and IT consulting services.',
        cta: 'Feel free to contact me for collaborations, consulting, and projects!'
      },

      // Professional Services Section
      services: {
        title: 'Professional Services',
        subtitle: 'Professional support for all your IT needs, from WordPress to IT infrastructure, cybersecurity to cloud solutions',
        cta: 'Feel free to share your consulting or project requests for any of the services above!'
      },

      // AI Demos Section
      demos: {
        title: 'Our AI Demos',
        subtitle: 'Try our live AI tools - Specially trained by Cemal',
        tools: {
          powershell: {
            name: 'PowerShell Analyzer',
            desc: 'PowerShell script analysis and optimization'
          },
          log: {
            name: 'Log Analyzer',
            desc: 'Analyze log files and find issues'
          },
          security: {
            name: 'Security Advisor',
            desc: 'Security analysis and recommendations'
          },
          network: {
            name: 'Network Troubleshooter',
            desc: 'Troubleshoot network issues'
          },
          script: {
            name: 'Script Generator',
            desc: 'Generate scripts with AI (Bash, PowerShell, Python)'
          },
          gpo: {
            name: 'GPO Analyzer',
            desc: 'Group Policy analysis and optimization'
          },
          proxmox: {
            name: 'Proxmox Assistant',
            desc: 'Proxmox management and assistance'
          },
          proxmoxTrouble: {
            name: 'Proxmox Troubleshooter',
            desc: 'Proxmox troubleshooting'
          },
          macos: {
            name: 'macOS Assistant',
            desc: 'macOS management and troubleshooting'
          }
        },
        footer: 'All our AI tools are specially developed and trained by Cemal in their respective fields'
      },

      // Premium AI Bots Section
      bots: {
        title: 'Premium AI Bots',
        subtitle: 'Our specialized AI bots - English tutoring, legal consulting, dietitian, math lessons and more',
        demo: 'DEMO',
        tryNow: 'Try Now',
        active: 'Premium AI bots are now active!',
        freeQuota: 'You have 10 free questions daily!',
        viewAll: 'View All AI Bots (12 Bots)'
      }`;

// Define the new about section for Turkish
const newAboutTR = `      title: 'Cemal Demirci',
      position: 'IT & Güvenlik Yöneticisi MCSE | AI Baş Denetçisi',
      company: '@ Zero Density',
      jobTitle: 'IT & Security Administrator',
      aboutMe: 'Hakkımda',
      experience: 'İş Deneyimi',
      certifications: 'Sertifikalar & Eğitimler',
      skills: 'Yetenekler & Teknolojiler',
      downloadResume: 'CV\\'mi İndir',
      downloadCV: 'Detaylı iş deneyimi ve sertifikalar için CV\\'mi indirebilirsiniz',
      downloadCVButton: 'CV İndir (PDF)',
      contactForm: 'İletişim Formu',
      contactFormDesc: 'Proje teklifleri, danışmanlık veya iş birliği için benimle iletişime geçin',
      yourName: 'Adınız *',
      yourNamePlaceholder: 'Adınız Soyadınız',
      yourEmail: 'E-posta Adresiniz *',
      yourEmailPlaceholder: 'ornek@email.com',
      yourMessage: 'Mesajınız *',
      yourMessagePlaceholder: 'Projeniz veya ihtiyacınız hakkında detaylı bilgi verin...',
      sendMessage: 'Mesaj Gönder',
      messageSent: 'Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.',

      // Hero Section
      hero: {
        intro: 'Freelance IT Danışmanı & Full-Stack Developer',
        description1: '8+ yıllık bilgi teknolojileri ve yayıncılık mühendisliği deneyimiyle, kurumsal IT altyapılarından web geliştirmeye, siber güvenlikten cloud çözümlerine kadar geniş bir yelpazede profesyonel hizmetler sunuyorum.',
        description2: 'WordPress\\'ten kurumsal Active Directory yönetimine, Azure bulut çözümlerinden broadcast teknolojilerine kadar IT\\'nin tüm alanlarında uzmanım. Fortinet, AWS, Microsoft ve Cisco sertifikalarına sahibim.',
        description3: 'Şu anda sanal prodüksiyon ve gerçek zamanlı grafik çözümlerinde lider bir şirkette IT & Security Administrator olarak çalışırken, freelance projeler ve IT danışmanlık hizmetleri de veriyorum.',
        cta: 'İş birlikleri, danışmanlık ve projeler için benimle iletişime geçebilirsiniz!'
      },

      // Professional Services Section
      services: {
        title: 'Profesyonel Hizmetler',
        subtitle: 'WordPress\\'ten IT altyapısına, siber güvenlikten cloud çözümlerine kadar tüm IT ihtiyaçlarınız için profesyonel destek',
        cta: 'Yukarıdaki hizmetlerden herhangi biri için danışmanlık veya proje taleplerinizi benimle paylaşabilirsiniz!'
      },

      // AI Demos Section
      demos: {
        title: 'AI Demolarımız',
        subtitle: 'Canlı AI araçlarımızı deneyin - Cemal tarafından özel olarak eğitilmiş',
        tools: {
          powershell: {
            name: 'PowerShell Analyzer',
            desc: 'PowerShell script analizi ve optimizasyon'
          },
          log: {
            name: 'Log Analyzer',
            desc: 'Log dosyalarını analiz et ve sorunları bul'
          },
          security: {
            name: 'Security Advisor',
            desc: 'Güvenlik analizi ve öneriler'
          },
          network: {
            name: 'Network Troubleshooter',
            desc: 'Network sorunlarını çöz'
          },
          script: {
            name: 'Script Generator',
            desc: 'AI ile script oluştur (Bash, PowerShell, Python)'
          },
          gpo: {
            name: 'GPO Analyzer',
            desc: 'Group Policy analizi ve optimizasyon'
          },
          proxmox: {
            name: 'Proxmox Assistant',
            desc: 'Proxmox yönetimi ve yardım'
          },
          proxmoxTrouble: {
            name: 'Proxmox Troubleshooter',
            desc: 'Proxmox sorun giderme'
          },
          macos: {
            name: 'macOS Assistant',
            desc: 'macOS yönetimi ve troubleshooting'
          }
        },
        footer: 'Tüm AI araçlarımız özel olarak geliştirilmiş ve Cemal tarafından kendi alanlarında eğitilmiş yapay zeka araçlarıdır'
      },

      // Premium AI Bots Section
      bots: {
        title: 'Premium AI Botlar',
        subtitle: 'Özel AI botlarımız - İngilizce öğret, hukuk danışmanlığı, diyetisyen, matematik dersi ve daha fazlası',
        demo: 'DEMO',
        tryNow: 'Denemeye Başla',
        active: 'Premium AI botlar aktif!',
        freeQuota: 'Günlük 10 ücretsiz soru hakkınız var!',
        viewAll: 'Tüm AI Botları Gör (12 Bot)'
      }`;

// Replace English about section
const enAboutRegex = /\/\/ About Page\s+about: \{[\s\S]*?messageSent:.*?\n    \},/;
content = content.replace(enAboutRegex, `// About Page
    about: {
${newAboutEN}
    },`);

// Replace Turkish about section
const trAboutRegex = /\/\/ About Page\s+about: \{[\s\S]*?messageSent:.*?\n    \},/;
const parts = content.split('  tr: {');
if (parts.length === 2) {
  parts[1] = parts[1].replace(trAboutRegex, `// About Page
    about: {
${newAboutTR}
    },`);
  content = parts.join('  tr: {');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Translations updated successfully!');
