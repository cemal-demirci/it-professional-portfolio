import { useState, useEffect } from 'react'
import { Shield, Save, LogOut, Eye, EyeOff, Settings, User, Palette, Lock, BarChart3, Globe, Image, Upload, Check, X, FileText, Plus, Trash2, Download, Layout, FileEdit, Key, Cpu, Zap, Brain, Sliders, Mail, Inbox, Sparkles, Rocket } from 'lucide-react'
import storage from '../utils/storage'

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('site')
  const [saved, setSaved] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Cemal Demirci',
    showNavLogo: false,
    logoText: 'CD',
    metaDescription: 'Professional IT & Security tools collection',
    favicon: '/favicon.ico'
  })

  const [personalInfo, setPersonalInfo] = useState({
    name: 'Cemal Demirci',
    title: 'IT & Security Administrator MCSE | AI Lead Auditor',
    company: 'Zero Density',
    email: 'me@cemal.online',
    github: 'https://github.com/cemal-demirci',
    linkedin: 'https://www.linkedin.com/in/cemaldemirci/',
    profilePhoto: '',
    aboutText: 'With over eight years of experience in information technology and broadcast engineering, I serve as an IT & Security Administrator at Zero Density, a leading company in virtual production and real-time graphic solutions. My expertise spans IT systems and media streaming, and I hold certifications from Fortinet, AWS, Microsoft, and Cisco, including Cisco cybersecurity certifications, reflecting my skills in network security, cloud computing, and cybersecurity. At Zero Density, I manage on-premises Active Directory, Azure environments, Hyper-V and VMware infrastructures, network and firewall configurations, and system monitoring. Additionally, my experience in video streaming, recording, and broadcast technologies has grown significantly through projects for ACUNMEDYA, a prominent media company both in Turkey and internationally. I have contributed to the production and live broadcasts of high-profile shows such as the UEFA Champions League final, Survivor, Exatlon, and Amor En El Aire.'
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    defaultTheme: 'system',
    accentColor: '#3b82f6',
    enableAnimations: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    aiUnlimitedKey: 'unlimited2024',
    showKeyInSettings: false,
    juniorITBotUnlimited: false
  })

  const [apiSettings, setApiSettings] = useState({
    gemini: {
      enabled: true,
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      model: 'gemini-1.5-flash',
      requestLimit: 60,
      showKey: false
    },
    openai: {
      enabled: false,
      apiKey: '',
      model: 'gpt-4',
      requestLimit: 10,
      showKey: false
    },
    claude: {
      enabled: false,
      apiKey: '',
      model: 'claude-3-sonnet',
      requestLimit: 20,
      showKey: false
    }
  })

  const [contactMessages, setContactMessages] = useState([])

  const [aiToolsConfig, setAiToolsConfig] = useState({
    powershellAnalyzer: {
      enabled: true,
      name: 'PowerShell Analyzer',
      path: '/tools/ai-powershell-analyzer',
      systemPrompt: 'You are an expert PowerShell and Windows system administrator. Analyze scripts for security issues, performance problems, and best practices.',
      temperature: 0.7,
      maxTokens: 2048
    },
    logAnalyzer: {
      enabled: true,
      name: 'Log File Analyzer',
      path: '/tools/ai-log-analyzer',
      systemPrompt: 'You are an expert at analyzing log files. Identify patterns, errors, warnings, and provide actionable insights.',
      temperature: 0.5,
      maxTokens: 2048
    },
    securityAdvisor: {
      enabled: true,
      name: 'Security Advisor',
      path: '/tools/ai-security-advisor',
      systemPrompt: 'You are a cybersecurity expert. Provide security recommendations, analyze potential vulnerabilities, and suggest best practices.',
      temperature: 0.3,
      maxTokens: 1024
    },
    networkTroubleshooter: {
      enabled: true,
      name: 'Network Troubleshooter',
      path: '/tools/ai-network-troubleshooter',
      systemPrompt: 'You are a network engineer expert. Help diagnose and troubleshoot network issues with clear, actionable solutions.',
      temperature: 0.5,
      maxTokens: 1536
    },
    gpoAnalyzer: {
      enabled: true,
      name: 'GPO Analyzer',
      path: '/tools/ai-gpo-analyzer',
      systemPrompt: 'You are a Group Policy expert. Analyze GPO settings and provide recommendations for optimization and security.',
      temperature: 0.6,
      maxTokens: 2048
    },
    scriptGenerator: {
      enabled: true,
      name: 'Script Generator',
      path: '/tools/ai-script-generator',
      systemPrompt: 'You are an expert programmer. Generate clean, efficient, and well-documented scripts based on user requirements.',
      temperature: 0.8,
      maxTokens: 2048
    },
    textAnalyzer: {
      enabled: true,
      name: 'Text Analyzer',
      path: '/tools/text-analyzer',
      systemPrompt: 'You are a text analysis expert. Analyze sentiment, readability, and provide keyword extraction.',
      temperature: 0.4,
      maxTokens: 1024
    },
    macosAssistant: {
      enabled: true,
      name: 'macOS Terminal Assistant',
      path: '/tools/macos-assistant',
      systemPrompt: 'You are a macOS and Unix terminal expert. Help users with terminal commands, shell scripting, and system administration.',
      temperature: 0.6,
      maxTokens: 1536
    },
    evo2EventAnalyzer: {
      enabled: true,
      name: 'EVO 2 Event Analyzer',
      path: '/0d/evo2-events',
      systemPrompt: 'You are a Zero Density EVO 2 expert. Analyze event logs from EVO 2 systems, identify issues, and provide technical solutions for broadcast production.',
      temperature: 0.4,
      maxTokens: 2048
    },
    evo3EventAnalyzer: {
      enabled: true,
      name: 'EVO 3 Event Analyzer',
      path: '/0d/evo3-events',
      systemPrompt: 'You are a Zero Density EVO 3 expert. Analyze event logs, diagnose rendering issues, and provide expert troubleshooting for virtual production.',
      temperature: 0.4,
      maxTokens: 2048
    },
    amperEventAnalyzer: {
      enabled: true,
      name: 'AMPER Event Analyzer',
      path: '/0d/amper-events',
      systemPrompt: 'You are a Zero Density AMPER expert. Analyze AMPER system logs, identify performance bottlenecks, and provide optimization recommendations.',
      temperature: 0.4,
      maxTokens: 2048
    },
    hardwareSupportChat: {
      enabled: true,
      name: 'Hardware Support Chat',
      path: '/0d/hardware-support',
      systemPrompt: 'You are a Zero Density hardware support specialist. Help users with hardware configurations, compatibility issues, and technical specifications for broadcast equipment.',
      temperature: 0.5,
      maxTokens: 2048
    }
  })

  const [aboutContent, setAboutContent] = useState({
    bio: 'With over eight years of experience in information technology and broadcast engineering, I serve as an IT & Security Administrator at Zero Density, a leading company in virtual production and real-time graphic solutions. My expertise spans IT systems and media streaming, and I hold certifications from Fortinet, AWS, Microsoft, and Cisco.',
    skills: ['Active Directory', 'Azure', 'Microsoft 365', 'PowerShell', 'Network Security', 'Firewall Management', 'Hyper-V', 'VMware', 'Fortigate', 'Cisco', 'ISO 27001', 'Endpoint Security', 'SMPTE 2110', 'SRT Streaming', 'Broadcast Engineering', 'Veeam Backup', 'Intune MDM', 'Data Loss Prevention'],
    experience: [
      {
        title: 'IT & Security Administrator',
        company: 'Zero Density',
        period: 'August 2024 - Present',
        description: 'Azure and Cloud Solutions, Active Directory, DHCP, File Server, Proxy Server management. Network and Security: Fortigate, Cisco Stack, SSL VPN, Deep Inspection. Virtualization: Hyper-V, VMware, Veeam. Office 365 Administration. ISO 27001 compliance and endpoint security. Advanced PowerShell scripting and automation.'
      },
      {
        title: 'Technical Expert',
        company: 'Zero Density',
        period: 'July 2023 - September 2024',
        description: 'Technical support and system optimization for Zero Density products.'
      },
      {
        title: 'Senior Broadcast Engineer',
        company: 'ACUNMEDYA',
        period: 'January 2023 - July 2023',
        description: 'Server, Storage, and Network Management for major projects: 2023 UEFA Champions League Final, Survivor, Exatlon series across multiple countries (Mexico, Dominican Republic, Turkey, Romania, Greece, Czech Republic, Slovakia). IP-based video broadcasting: SMPTE 2110, SRT, RTMP streaming technologies.'
      },
      {
        title: 'Broadcast Engineer',
        company: 'ACUNMEDYA',
        period: 'May 2022 - January 2023',
        description: 'Recording Media & Live Broadcasting for Survivor Turkey, Survivor México, Exatlon projects. Advanced broadcasting and storage solutions with PTZ camera integration.'
      },
      {
        title: 'Information Technology Specialist',
        company: 'Exxen TR',
        period: 'December 2019 - June 2022',
        description: 'OTT System management, TVOS Application test & management, CDN Media Deployment, SRT Media Broadcast.'
      },
      {
        title: 'IT Consultant',
        company: 'İntegral Sayaç A.Ş',
        period: 'July 2020 - January 2021',
        description: 'IT consulting services for infrastructure and systems.'
      }
    ],
    certifications: [
      { name: 'ISO/IEC 42001:2023 Lead Auditor Certification', year: '2024' },
      { name: 'Fortinet Certified Fortigate 7.4 Operator', year: '2024' },
      { name: 'Fortinet Certified Associate in Cybersecurity', year: '2024' },
      { name: 'Mastering Dark Web Intelligence for Cybersecurity Professionals', year: '2024' }
    ],
    cvFile: null,
    cvFileName: ''
  })

  const [contentLang, setContentLang] = useState('en') // Language selector for content editing

  const [contentSettings, setContentSettings] = useState({
    en: {
      homepage: {
        title: 'Professional IT & Security Tools',
        subtitle: 'A comprehensive collection of tools for IT professionals and developers',
        heroTagline: 'Power up your workflow with 60+ professional tools'
      },
      aboutPage: {
        title: 'About Me',
        subtitle: 'Get to know more about my background and expertise',
        description: 'Experienced IT & Security Administrator with MCSE certification and AI Lead Auditor expertise.'
      },
      toolsPage: {
        title: 'All Tools',
        subtitle: 'Browse through our comprehensive collection of professional tools'
      }
    },
    tr: {
      homepage: {
        title: 'Profesyonel IT & Güvenlik Araçları',
        subtitle: 'IT profesyonelleri ve geliştiriciler için kapsamlı araç koleksiyonu',
        heroTagline: '60+ profesyonel araçla iş akışınızı güçlendirin'
      },
      aboutPage: {
        title: 'Hakkımda',
        subtitle: 'Geçmişim ve uzmanlığım hakkında daha fazla bilgi edinin',
        description: 'MCSE sertifikalı ve AI Baş Denetçi uzmanlığına sahip deneyimli IT & Güvenlik Yöneticisi.'
      },
      toolsPage: {
        title: 'Tüm Araçlar',
        subtitle: 'Kapsamlı profesyonel araç koleksiyonumuza göz atın'
      }
    },
    navigationItems: [
      { name: 'Home', path: '/', enabled: true },
      { name: 'About', path: '/about', enabled: true },
      { name: 'Tools', path: '/tools', enabled: true },
      { name: 'Settings', path: '/settings', enabled: true }
    ],
    footerText: '© 2024 Cemal Demirci. All rights reserved.',
    footerLinks: [
      { name: 'Privacy Policy', url: '/privacy' },
      { name: 'Terms of Service', url: '/terms' }
    ]
  })

  // Simple auth - password stored in localStorage for demo
  const ADMIN_PASSWORD = 'cemal2024' // Change this!

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      const data = await response.json()
      if (data.success) {
        setContactMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      // Fallback to localStorage
      const savedMessages = storage.getItem('contact_messages', [])
      setContactMessages(savedMessages)
    }
  }

  useEffect(() => {
    // Check authentication - using raw localStorage for auth check
    const auth = storage.getItem('admin_auth')
    if (auth === 'true' || auth === true) {
      setIsAuthenticated(true)
    }

    // Load all settings with fallback defaults
    const savedSite = storage.getItem('site_settings')
    if (savedSite) setSiteSettings(savedSite)

    const savedPersonal = storage.getItem('personal_info')
    if (savedPersonal) setPersonalInfo(savedPersonal)

    const savedAppearance = storage.getItem('appearance_settings')
    if (savedAppearance) setAppearanceSettings(savedAppearance)

    const savedSecurity = storage.getItem('security_settings')
    if (savedSecurity) {
      setSecuritySettings(savedSecurity)
    } else {
      // Load juniorITBotUnlimited from localStorage for backward compatibility
      const juniorITUnlimited = localStorage.getItem('juniorITBotUnlimited') === 'true'
      setSecuritySettings(prev => ({ ...prev, juniorITBotUnlimited: juniorITUnlimited }))
    }

    const savedAbout = storage.getItem('about_content')
    if (savedAbout) setAboutContent(savedAbout)

    const savedContent = storage.getItem('content_settings')
    if (savedContent) setContentSettings(savedContent)

    const savedApi = storage.getItem('api_settings')
    if (savedApi) setApiSettings(savedApi)

    const savedAiTools = storage.getItem('ai_tools_config')
    if (savedAiTools) setAiToolsConfig(savedAiTools)

    // Fetch messages from API
    fetchMessages()

    // Enable animations
    setIsVisible(true)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      storage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Yanlış şifre! 😅')
    }
  }

  const handleLogout = () => {
    storage.removeItem('admin_auth')
    setIsAuthenticated(false)
    setPassword('')
  }

  const handleSaveAll = () => {
    // Save all settings using production-safe storage
    const saveSuccess = (
      storage.setItem('site_settings', siteSettings) &&
      storage.setItem('personal_info', personalInfo) &&
      storage.setItem('appearance_settings', appearanceSettings) &&
      storage.setItem('security_settings', securitySettings) &&
      storage.setItem('about_content', aboutContent) &&
      storage.setItem('content_settings', contentSettings) &&
      storage.setItem('api_settings', apiSettings) &&
      storage.setItem('ai_tools_config', aiToolsConfig)
    )

    // Also save juniorITBotUnlimited to localStorage for ITChatbot to read
    localStorage.setItem('juniorITBotUnlimited', securitySettings.juniorITBotUnlimited.toString())

    if (!saveSuccess) {
      alert('⚠️ Warning: Some settings may not have been saved. localStorage might be unavailable.')
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)

    // Refresh page to apply settings
    setTimeout(() => window.location.reload(), 1000)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPersonalInfo(prev => ({ ...prev, profilePhoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCVUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAboutContent(prev => ({
          ...prev,
          cvFile: reader.result,
          cvFileName: file.name
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCVDownload = () => {
    if (aboutContent.cvFile) {
      const link = document.createElement('a')
      link.href = aboutContent.cvFile
      link.download = aboutContent.cvFileName || 'CV.pdf'
      link.click()
    }
  }

  const addSkill = () => {
    setAboutContent(prev => ({ ...prev, skills: [...prev.skills, ''] }))
  }

  const removeSkill = (index) => {
    setAboutContent(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const updateSkill = (index, value) => {
    setAboutContent(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }))
  }

  const addExperience = () => {
    setAboutContent(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        period: '',
        description: ''
      }]
    }))
  }

  const removeExperience = (index) => {
    setAboutContent(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const updateExperience = (index, field, value) => {
    setAboutContent(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addCertification = () => {
    setAboutContent(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', year: '' }]
    }))
  }

  const removeCertification = (index) => {
    setAboutContent(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const updateCertification = (index, field, value) => {
    setAboutContent(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      )
    }))
  }

  const tabs = [
    { id: 'site', name: 'Site Settings', icon: Globe },
    { id: 'inbox', name: 'Inbox', icon: Inbox, badge: contactMessages.length },
    { id: 'content', name: 'Content', icon: FileEdit },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'about', name: 'About Page', icon: FileText },
    { id: 'apis', name: 'AI & APIs', icon: Cpu },
    { id: 'ai-tools', name: 'AI Tools Config', icon: Brain },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'stats', name: 'Statistics', icon: BarChart3 }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`max-w-md w-full bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl relative transition-all duration-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 animate-bounce">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Secure Access</span>
            </div>
            <Shield className="w-16 h-16 mx-auto text-primary-600 mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Giriş yap 🔐</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="input-field pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              <Shield className="w-5 h-5 mr-2" />
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className={`flex justify-between items-center relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 animate-bounce">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-2">
            <Shield className="w-10 h-10 text-primary-600 animate-pulse-slow" />
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Admin Control Panel
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your portfolio settings and configurations 🚀</p>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-all">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-400 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-purple-600/20 animate-gradient-rotate"></div>
        <div className="relative">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {personalInfo.name.split(' ')[0]}! 👋</h2>
          <p className="text-primary-50">Manage all aspects of your portfolio from this centralized dashboard.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-all whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'site' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary-600" />
                Site Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your Name or Site Title"
                  />
                  <p className="text-xs text-gray-500 mt-1">Displayed in navigation bar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo Text</label>
                  <input
                    type="text"
                    value={siteSettings.logoText}
                    onChange={(e) => setSiteSettings({...siteSettings, logoText: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="CD"
                    maxLength={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Max 3 characters for logo</p>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={siteSettings.showNavLogo}
                      onChange={(e) => setSiteSettings({...siteSettings, showNavLogo: e.target.checked})}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Logo in Navigation Bar</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">Display logo icon next to site name</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Description</label>
                  <textarea
                    value={siteSettings.metaDescription}
                    onChange={(e) => setSiteSettings({...siteSettings, metaDescription: e.target.value})}
                    className="textarea-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                    placeholder="Site description for SEO"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Inbox className="w-6 h-6 text-primary-600" />
                Contact Messages 📬
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "You've got mail!" - or maybe just spam 😅
              </p>

              {contactMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No messages yet</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your inbox is emptier than my LinkedIn notifications 📭
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactMessages.map((message, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{message.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{message.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const response = await fetch(`/api/messages?id=${message.id}`, {
                                method: 'DELETE'
                              })
                              const data = await response.json()
                              if (data.success) {
                                // Refresh messages from API
                                fetchMessages()
                              } else {
                                alert('Failed to delete message')
                              }
                            } catch (error) {
                              console.error('Error deleting message:', error)
                              alert('Failed to delete message')
                            }
                          }}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{message.message}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{message.timestamp}</span>
                        <a
                          href={`mailto:${message.email}?subject=Re: Contact Form Message`}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                          Reply
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileEdit className="w-6 h-6 text-primary-600" />
                  Content Management
                </h3>

                {/* Language Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Editing Language:</span>
                  <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setContentLang('en')}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${contentLang === 'en' ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      onClick={() => setContentLang('tr')}
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${contentLang === 'tr' ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      🇹🇷 Türkçe
                    </button>
                  </div>
                </div>
              </div>

              {/* Homepage Content */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Homepage Content ({contentLang === 'en' ? 'English' : 'Türkçe'})</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={contentSettings[contentLang].homepage.title}
                    onChange={(e) => setContentSettings({
                      ...contentSettings,
                      [contentLang]: {
                        ...contentSettings[contentLang],
                        homepage: {...contentSettings[contentLang].homepage, title: e.target.value}
                      }
                    })}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={contentSettings[contentLang].homepage.subtitle}
                    onChange={(e) => setContentSettings({
                      ...contentSettings,
                      [contentLang]: {
                        ...contentSettings[contentLang],
                        homepage: {...contentSettings[contentLang].homepage, subtitle: e.target.value}
                      }
                    })}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hero Tagline</label>
                  <input
                    type="text"
                    value={contentSettings[contentLang].homepage.heroTagline}
                    onChange={(e) => setContentSettings({
                      ...contentSettings,
                      [contentLang]: {
                        ...contentSettings[contentLang],
                        homepage: {...contentSettings[contentLang].homepage, heroTagline: e.target.value}
                      }
                    })}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* About Page Content */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">About Page Content ({contentLang === 'en' ? 'English' : 'Türkçe'})</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={contentSettings[contentLang].aboutPage.title}
                    onChange={(e) => setContentSettings({
                      ...contentSettings,
                      [contentLang]: {
                        ...contentSettings[contentLang],
                        aboutPage: {...contentSettings[contentLang].aboutPage, title: e.target.value}
                      }
                    })}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={contentSettings[contentLang].aboutPage.subtitle}
                    onChange={(e) => setContentSettings({
                      ...contentSettings,
                      [contentLang]: {
                        ...contentSettings[contentLang],
                        aboutPage: {...contentSettings[contentLang].aboutPage, subtitle: e.target.value}
                      }
                    })}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Tools Page Content */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Tools Page Content ({contentLang === 'en' ? 'English' : 'Türkçe'})</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={contentSettings[contentLang].toolsPage.title}
                    onChange={(e) => setContentSettings({
                      ...contentSettings,
                      [contentLang]: {
                        ...contentSettings[contentLang],
                        toolsPage: {...contentSettings[contentLang].toolsPage, title: e.target.value}
                      }
                    })}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={contentSettings[contentLang].toolsPage.subtitle}
                    onChange={(e) => setContentSettings({
                      ...contentSettings,
                      [contentLang]: {
                        ...contentSettings[contentLang],
                        toolsPage: {...contentSettings[contentLang].toolsPage, subtitle: e.target.value}
                      }
                    })}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Footer Content */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Footer</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Footer Text</label>
                  <input
                    type="text"
                    value={contentSettings.footerText}
                    onChange={(e) => setContentSettings({...contentSettings, footerText: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-6 h-6 text-primary-600" />
                Personal Information
              </h3>

              {/* Profile Photo Upload */}
              <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="relative group">
                  {personalInfo.profilePhoto ? (
                    <img src={personalInfo.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {personalInfo.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Profile Photo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload a professional photo</p>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF • Max 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Professional Title *</label>
                  <input
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={personalInfo.company}
                    onChange={(e) => setPersonalInfo({...personalInfo, company: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={personalInfo.linkedin}
                    onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About Text</label>
                  <textarea
                    value={personalInfo.aboutText}
                    onChange={(e) => setPersonalInfo({...personalInfo, aboutText: e.target.value})}
                    className="textarea-field min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-600" />
                About Page Content Management
              </h3>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio / Introduction</label>
                <textarea
                  value={aboutContent.bio}
                  onChange={(e) => setAboutContent({...aboutContent, bio: e.target.value})}
                  className="textarea-field dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[120px]"
                  placeholder="Write your professional bio..."
                />
              </div>

              {/* CV Upload/Download */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  CV / Resume Management
                </h4>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-3 bg-white dark:bg-gray-800 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg hover:border-blue-500 transition-all text-center">
                      <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {aboutContent.cvFileName || 'Click to upload CV (PDF, DOC, DOCX)'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                  </label>
                  {aboutContent.cvFile && (
                    <button
                      onClick={handleCVDownload}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Uploaded CV will be available for download on your About page</p>
              </div>

              {/* Skills */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills & Technologies</label>
                  <button
                    onClick={addSkill}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>
                <div className="space-y-2">
                  {aboutContent.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1"
                        placeholder="e.g., React, Node.js, AWS"
                      />
                      <button
                        onClick={() => removeSkill(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Experience</label>
                  <button
                    onClick={addExperience}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {aboutContent.experience.map((exp, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3 relative">
                      <button
                        onClick={() => removeExperience(index)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          placeholder="Job Title"
                          className="input-field dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="Company Name"
                          className="input-field dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => updateExperience(index, 'period', e.target.value)}
                        placeholder="Period (e.g., 2020 - Present)"
                        className="input-field dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        placeholder="Job description and responsibilities..."
                        className="textarea-field dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        rows={3}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Certifications & Awards</label>
                  <button
                    onClick={addCertification}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Certification
                  </button>
                </div>
                <div className="space-y-2">
                  {aboutContent.certifications.map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                        placeholder="Certification Name"
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1"
                      />
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => updateCertification(index, 'year', e.target.value)}
                        placeholder="Year"
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white w-24"
                      />
                      <button
                        onClick={() => removeCertification(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apis' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-6 h-6 text-primary-600" />
                AI & API Management 🤖
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Because one AI isn't enough to handle all this awesomeness
              </p>

              {/* Cemal AI (Gemini Backend) */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">Cemal AI</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">The main brain 🧠</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={apiSettings.gemini.enabled}
                      onChange={(e) => setApiSettings({
                        ...apiSettings,
                        gemini: {...apiSettings.gemini, enabled: e.target.checked}
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                    <div className="relative">
                      <input
                        type={apiSettings.gemini.showKey ? 'text' : 'password'}
                        value={apiSettings.gemini.apiKey}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          gemini: {...apiSettings.gemini, apiKey: e.target.value}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono pr-10"
                        placeholder="Enter Gemini API Key"
                      />
                      <button
                        type="button"
                        onClick={() => setApiSettings({
                          ...apiSettings,
                          gemini: {...apiSettings.gemini, showKey: !apiSettings.gemini.showKey}
                        })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {apiSettings.gemini.showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                      <select
                        value={apiSettings.gemini.model}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          gemini: {...apiSettings.gemini, model: e.target.value}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Powerful)</option>
                        <option value="gemini-pro">Gemini Pro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Limit/min</label>
                      <input
                        type="number"
                        value={apiSettings.gemini.requestLimit}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          gemini: {...apiSettings.gemini, requestLimit: parseInt(e.target.value)}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* OpenAI */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800 opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">OpenAI GPT</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">The expensive friend 💸</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={apiSettings.openai.enabled}
                      onChange={(e) => setApiSettings({
                        ...apiSettings,
                        openai: {...apiSettings.openai, enabled: e.target.checked}
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                    <div className="relative">
                      <input
                        type={apiSettings.openai.showKey ? 'text' : 'password'}
                        value={apiSettings.openai.apiKey}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          openai: {...apiSettings.openai, apiKey: e.target.value}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono pr-10"
                        placeholder="Enter OpenAI API Key"
                        disabled={!apiSettings.openai.enabled}
                      />
                      <button
                        type="button"
                        onClick={() => setApiSettings({
                          ...apiSettings,
                          openai: {...apiSettings.openai, showKey: !apiSettings.openai.showKey}
                        })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        disabled={!apiSettings.openai.enabled}
                      >
                        {apiSettings.openai.showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                      <select
                        value={apiSettings.openai.model}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          openai: {...apiSettings.openai, model: e.target.value}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={!apiSettings.openai.enabled}
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Limit/min</label>
                      <input
                        type="number"
                        value={apiSettings.openai.requestLimit}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          openai: {...apiSettings.openai, requestLimit: parseInt(e.target.value)}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={!apiSettings.openai.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Claude */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">Anthropic Claude</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">The thoughtful one 🤔</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={apiSettings.claude.enabled}
                      onChange={(e) => setApiSettings({
                        ...apiSettings,
                        claude: {...apiSettings.claude, enabled: e.target.checked}
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Key</label>
                    <div className="relative">
                      <input
                        type={apiSettings.claude.showKey ? 'text' : 'password'}
                        value={apiSettings.claude.apiKey}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          claude: {...apiSettings.claude, apiKey: e.target.value}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono pr-10"
                        placeholder="Enter Claude API Key"
                        disabled={!apiSettings.claude.enabled}
                      />
                      <button
                        type="button"
                        onClick={() => setApiSettings({
                          ...apiSettings,
                          claude: {...apiSettings.claude, showKey: !apiSettings.claude.showKey}
                        })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        disabled={!apiSettings.claude.enabled}
                      >
                        {apiSettings.claude.showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model</label>
                      <select
                        value={apiSettings.claude.model}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          claude: {...apiSettings.claude, model: e.target.value}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={!apiSettings.claude.enabled}
                      >
                        <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        <option value="claude-3-opus">Claude 3 Opus</option>
                        <option value="claude-3-haiku">Claude 3 Haiku</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Limit/min</label>
                      <input
                        type="number"
                        value={apiSettings.claude.requestLimit}
                        onChange={(e) => setApiSettings({
                          ...apiSettings,
                          claude: {...apiSettings.claude, requestLimit: parseInt(e.target.value)}
                        })}
                        className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={!apiSettings.claude.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>💡 Pro Tip:</strong> Currently only Gemini is integrated with the tools. Enable others for future features!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ai-tools' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-primary-600" />
                AI Tools Configuration 🤖
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Fine-tune each AI assistant like a boss
              </p>

              <div className="grid grid-cols-1 gap-6">
                {Object.entries(aiToolsConfig).map(([key, tool]) => (
                  <div key={key} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{tool.path}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tool.enabled}
                          onChange={(e) => setAiToolsConfig({
                            ...aiToolsConfig,
                            [key]: {...tool, enabled: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="space-y-4">
                      {/* System Prompt */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          System Prompt (AI'nin kişiliği ve görevleri)
                        </label>
                        <textarea
                          value={tool.systemPrompt}
                          onChange={(e) => setAiToolsConfig({
                            ...aiToolsConfig,
                            [key]: {...tool, systemPrompt: e.target.value}
                          })}
                          className="textarea-field dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[100px] font-mono text-sm"
                          placeholder="AI'ya nasıl davranması gerektiğini söyle..."
                          disabled={!tool.enabled}
                        />
                        <p className="text-xs text-gray-500 mt-1">Bu prompt, AI'nın davranışını ve uzmanlık alanını belirler</p>
                      </div>

                      {/* Temperature & Max Tokens */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Sliders className="w-4 h-4" />
                            Temperature (Yaratıcılık)
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={tool.temperature}
                              onChange={(e) => setAiToolsConfig({
                                ...aiToolsConfig,
                                [key]: {...tool, temperature: parseFloat(e.target.value)}
                              })}
                              className="flex-1"
                              disabled={!tool.enabled}
                            />
                            <span className="text-sm font-mono font-bold text-gray-900 dark:text-white w-12 text-center bg-white dark:bg-gray-800 px-2 py-1 rounded">
                              {tool.temperature}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            0.0 = Robotik 🤖 | 1.0 = Yaratıcı 🎨
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Max Tokens (Cevap uzunluğu)
                          </label>
                          <input
                            type="number"
                            value={tool.maxTokens}
                            onChange={(e) => setAiToolsConfig({
                              ...aiToolsConfig,
                              [key]: {...tool, maxTokens: parseInt(e.target.value)}
                            })}
                            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            min="256"
                            max="4096"
                            step="256"
                            disabled={!tool.enabled}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            256-4096 arası (1 token ≈ 0.75 kelime)
                          </p>
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-start gap-2">
                          <Settings className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-purple-800 dark:text-purple-300">
                            <strong>Aktif Model:</strong> {apiSettings.gemini.model}
                            {!tool.enabled && <span className="block mt-1 text-red-600 dark:text-red-400 font-semibold">⚠️ Bu araç devre dışı!</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>💡 Pro Tip:</strong> Düşük temperature (0.0-0.4) teknik işler için, yüksek temperature (0.7-1.0) yaratıcı işler için idealdir!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Palette className="w-6 h-6 text-primary-600" />
                Appearance Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Theme</label>
                  <select
                    value={appearanceSettings.defaultTheme}
                    onChange={(e) => setAppearanceSettings({...appearanceSettings, defaultTheme: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="system">System Preference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accent Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={appearanceSettings.accentColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, accentColor: e.target.value})}
                      className="w-20 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={appearanceSettings.accentColor}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, accentColor: e.target.value})}
                      className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearanceSettings.enableAnimations}
                      onChange={(e) => setAppearanceSettings({...appearanceSettings, enableAnimations: e.target.checked})}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Page Animations</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">Smooth transitions and effects</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary-600" />
                Security & API Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Unlimited Secret Key</label>
                  <input
                    type="text"
                    value={securitySettings.aiUnlimitedKey}
                    onChange={(e) => setSecuritySettings({...securitySettings, aiUnlimitedKey: e.target.value})}
                    className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">This key unlocks unlimited AI requests</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.showKeyInSettings}
                      onChange={(e) => setSecuritySettings({...securitySettings, showKeyInSettings: e.target.checked})}
                      className="w-5 h-5 text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Secret Key in Settings Page</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">Display the unlock key on public settings page</p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.juniorITBotUnlimited}
                      onChange={(e) => setSecuritySettings({...securitySettings, juniorITBotUnlimited: e.target.checked})}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🚀 Junior IT Bot Unlimited Mode</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">Enable unlimited AI requests for Junior IT Chatbot (bypasses rate limiting)</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Notice
                </h4>
                <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                  <li>• Admin password: <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded">cemal2024</code></li>
                  <li>• Change the password in the code for production use</li>
                  <li>• Never share your secret keys publicly</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary-600" />
                Portfolio Statistics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">62+</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Tools</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">13</div>
                  <div className="text-sm text-green-600 dark:text-green-400">Tool Categories</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">10+</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">AI-Powered Tools</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tool Categories</h4>
                <div className="space-y-2">
                  {['Code Tools (6)', 'Security Tools (4)', 'Network Tools (9)', 'Windows Tools (4)', 'PDF Tools (4)', 'Text Tools (5)', 'AI Tools (10)', 'Active Directory (3)', 'macOS Tools (1)'].map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                      <div className="h-2 bg-primary-200 dark:bg-primary-900 rounded-full w-32 overflow-hidden">
                        <div className="h-full bg-primary-600 rounded-full" style={{width: `${Math.random() * 100}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {saved ? (
            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5" />
              Settings saved successfully! Page will reload...
            </span>
          ) : (
            <span>Make sure to save your changes before leaving</span>
          )}
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saved}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          Save All Changes
        </button>
      </div>

      <div className={`border rounded-lg p-4 ${storage.isProduction() ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
        <p className={`text-sm ${storage.isProduction() ? 'text-yellow-800 dark:text-yellow-300' : 'text-blue-800 dark:text-blue-300'}`}>
          {storage.isProduction() ? (
            <>
              <strong>⚠️ Production Mode:</strong> Settings are stored in browser localStorage. Changes persist only in this browser. For multi-device access, consider implementing a backend database.
            </>
          ) : (
            <>
              <strong>💡 Development Mode:</strong> Settings are stored in localStorage for testing. All changes are local to this browser.
            </>
          )}
        </p>
        {!storage.isAvailable() && (
          <p className="text-sm text-red-800 dark:text-red-300 mt-2">
            <strong>❌ localStorage Unavailable:</strong> Your browser settings may prevent data persistence. Changes won't be saved.
          </p>
        )}
      </div>
    </div>
  )
}

export default Admin
