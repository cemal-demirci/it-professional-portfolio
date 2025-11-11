import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useRainbow } from '../contexts/RainbowContext'
import { t } from '../translations'
import {
  Code, Lock, FileText, Palette, Network, Wrench, Monitor,
  FileJson, Binary, Regex, Minimize, FileOutput, Image, Key, Hash, Shield,
  Type, Diff, Droplet, Sparkles, Link as LinkIcon, Globe, Wifi,
  QrCode, Clock, Fingerprint, Settings, Zap, Trash2, Terminal, Database, Server, Mail, Brain,
  Users, RefreshCw, LifeBuoy, Gauge, Eye, Activity, Rocket, Info, AlertTriangle,
  Star, Search, X, Filter
} from 'lucide-react'
import { getFavorites, toggleFavorite, isFavorite, addToRecent } from '../services/favoritesService'
import RainbowModeToolBlocker from '../components/RainbowModeToolBlocker'
import CemalLogo from '../components/CemalLogo'

const Tools = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { language } = useLanguage()
  const { rainbowMode } = useRainbow()

  useEffect(() => {
    setIsVisible(true)
    setFavorites(getFavorites())
  }, [])

  const handleToggleFavorite = (toolPath, toolName, e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(toolPath)
    setFavorites(getFavorites())
  }

  const handleToolClick = (toolPath, toolName) => {
    addToRecent(toolPath, toolName)
  }

  const toolCategories = [
    {
      id: 'ai-powered-tools',
      name: '🤖 AI-Powered Tools',
      icon: Brain,
      color: 'from-purple-600 via-pink-600 to-purple-500',
      featured: true,
      tools: [
        { name: 'AI Text Analyzer', path: '/tools/text-analyzer', icon: Brain, description: 'Advanced sentiment, quality & writing suggestions' },
        { name: 'PowerShell Analyzer', path: '/tools/ai-powershell-analyzer', icon: Terminal, description: 'AI-powered PowerShell script analysis' },
        { name: 'Log File Analyzer', path: '/tools/ai-log-analyzer', icon: FileText, description: 'Intelligent log analysis with AI' },
        { name: 'Security Advisor', path: '/tools/ai-security-advisor', icon: Shield, description: 'Get AI security recommendations' },
        { name: 'Network Troubleshooter', path: '/tools/ai-network-troubleshooter', icon: Network, description: 'AI-powered network problem solving' },
        { name: 'GPO Analyzer', path: '/tools/ai-gpo-analyzer', icon: Settings, description: 'Analyze Group Policy with AI' },
        { name: 'Script Generator', path: '/tools/ai-script-generator', icon: Code, description: 'Generate scripts from prompts' },
        { name: 'Event Log Correlator', path: '/tools/ai-event-correlator', icon: FileText, description: 'Correlate event logs with AI' },
        { name: 'Certificate Analyzer', path: '/tools/ai-cert-analyzer', icon: Shield, description: 'Analyze SSL/TLS certificates' },
        { name: 'DR Planner', path: '/tools/ai-dr-planner', icon: LifeBuoy, description: 'Create disaster recovery plans' },
        { name: 'Performance Troubleshooter', path: '/tools/ai-perf-troubleshooter', icon: Gauge, description: 'Diagnose performance issues' },
        { name: 'Proxmox VE Assistant', path: '/tools/proxmox-assistant', icon: Server, description: 'AI-powered Proxmox VE expert assistant' },
        { name: 'Proxmox Troubleshooter', path: '/tools/proxmox-troubleshooter', icon: AlertTriangle, description: 'Diagnose and fix Proxmox issues' },
      ]
    },
    {
      id: 'code-tools',
      name: 'Code Tools',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      tools: [
        { name: 'JSON Formatter', path: '/tools/json-formatter', icon: FileJson, description: 'Format and validate JSON data' },
        { name: 'Base64 Encoder/Decoder', path: '/tools/base64', icon: Binary, description: 'Base64 encoding and decoding' },
        { name: 'Regex Tester', path: '/tools/regex-tester', icon: Regex, description: 'Test regular expressions' },
        { name: 'Code Minifier', path: '/tools/code-minifier', icon: Minimize, description: 'Minify JS/CSS/HTML code' },
        { name: 'CSS Live Viewer', path: '/tools/css-viewer', icon: Eye, description: 'Write CSS and see live preview' },
        { name: 'HTML Live Viewer', path: '/tools/html-viewer', icon: Eye, description: 'Write HTML/CSS/JS with responsive preview' },
      ]
    },
    {
      id: 'windows-tools',
      name: 'Windows Tools',
      icon: Monitor,
      color: 'from-cyan-500 to-blue-600',
      tools: [
        { name: 'Gaming Optimizer', path: '/tools/gaming-optimizer', icon: Settings, description: 'Optimize Windows for gaming performance' },
        { name: 'GUID Generator', path: '/tools/guid-generator', icon: Fingerprint, description: 'Generate Windows GUIDs' },
        { name: 'Power Management', path: '/tools/power-management', icon: Zap, description: 'Generate power management scripts' },
        { name: 'Bloatware Remover', path: '/tools/bloatware-remover', icon: Trash2, description: 'Generate bloatware removal scripts' },
      ]
    },
    {
      id: 'pdf-tools',
      name: 'PDF Tools',
      icon: FileOutput,
      color: 'from-red-500 to-pink-500',
      tools: [
        { name: 'PDF Merger', path: '/tools/pdf-merger', icon: FileOutput, description: 'Merge PDF files' },
        { name: 'PDF to Image', path: '/tools/pdf-to-image', icon: Image, description: 'Convert PDF to images' },
        { name: 'Image to PDF', path: '/tools/image-to-pdf', icon: FileOutput, description: 'Convert images to PDF' },
        { name: 'PDF OCR', path: '/tools/pdf-ocr', icon: FileText, description: 'Extract text from PDFs & images' },
      ]
    },
    {
      id: 'security-tools',
      name: 'Security Tools',
      icon: Lock,
      color: 'from-green-500 to-emerald-500',
      tools: [
        { name: 'Password Strength Checker', path: '/tools/password-strength', icon: Shield, description: 'Test password strength & security' },
        { name: 'Password Generator', path: '/tools/password-generator', icon: Key, description: 'Generate strong passwords' },
        { name: 'Hash Generator', path: '/tools/hash-generator', icon: Hash, description: 'Generate MD5, SHA-256 hashes' },
        { name: 'Encryption Tool', path: '/tools/encryption', icon: Shield, description: 'Encrypt/decrypt text' },
      ]
    },
    {
      id: 'text-tools',
      name: 'Text Tools',
      icon: FileText,
      color: 'from-purple-500 to-violet-500',
      tools: [
        { name: 'AI Text Analyzer', path: '/tools/text-analyzer', icon: Brain, description: 'Sentiment, readability & keyword analysis' },
        { name: 'Markdown Editor', path: '/tools/markdown-editor', icon: FileText, description: 'Markdown editor with preview' },
        { name: 'Word Counter', path: '/tools/word-counter', icon: Type, description: 'Word and character counter' },
        { name: 'Text Diff', path: '/tools/text-diff', icon: Diff, description: 'Compare two texts' },
        { name: 'Case Converter', path: '/tools/case-converter', icon: Type, description: 'Convert text formatting' },
      ]
    },
    {
      id: 'design-tools',
      name: 'Design Tools',
      icon: Palette,
      color: 'from-orange-500 to-amber-500',
      tools: [
        { name: 'Color Picker', path: '/tools/color-picker', icon: Droplet, description: 'Pick colors and get codes' },
        { name: 'Gradient Generator', path: '/tools/gradient-generator', icon: Sparkles, description: 'Create CSS gradients' },
        { name: 'CSS Generator', path: '/tools/css-generator', icon: Code, description: 'Generate CSS code' },
      ]
    },
    {
      id: 'network-tools',
      name: 'Network Tools',
      icon: Network,
      color: 'from-indigo-500 to-blue-500',
      tools: [
        { name: 'URL Encoder/Decoder', path: '/tools/url-encoder', icon: LinkIcon, description: 'Encode/decode URLs' },
        { name: 'IP Lookup', path: '/tools/ip-lookup', icon: Globe, description: 'Get IP address information' },
        { name: 'DNS Lookup', path: '/tools/dns-lookup', icon: Wifi, description: 'Perform DNS queries' },
        { name: 'WHOIS Lookup', path: '/tools/whois-lookup', icon: Globe, description: 'Domain registration information' },
        { name: 'MAC Address Lookup', path: '/tools/mac-lookup', icon: Wifi, description: 'Identify device manufacturer' },
        { name: 'Security Headers', path: '/tools/security-headers', icon: Shield, description: 'Analyze HTTP security headers' },
        { name: 'Port Information', path: '/tools/port-info', icon: Server, description: 'Common ports reference' },
        { name: 'Email Header Analyzer', path: '/tools/email-headers', icon: Mail, description: 'Parse and analyze email headers' },
        { name: 'Email DNS Checker', path: '/tools/email-dns-checker', icon: Shield, description: 'Check SPF, DMARC, DKIM, BIMI & MX records' },
        { name: 'Speed Test', path: '/tools/speed-test', icon: Gauge, description: 'Test internet speed (download, upload, latency)', badge: 'New' },
        { name: 'Network Diagnostics', path: '/tools/network-diagnostics', icon: Activity, description: 'Ping, DNS, geolocation & connection test', badge: 'New' },
        { name: 'Service Status Monitor', path: '/tools/service-status-monitor', icon: Activity, description: 'Real-time service monitoring with uptime tracking', badge: 'New' },
      ]
    },
    {
      id: 'utility-tools',
      name: 'Utility Tools',
      icon: Wrench,
      color: 'from-pink-500 to-rose-500',
      tools: [
        { name: 'QR Code Generator', path: '/tools/qr-generator', icon: QrCode, description: 'Generate QR codes' },
        { name: 'Timestamp Converter', path: '/tools/timestamp-converter', icon: Clock, description: 'Convert Unix timestamps' },
        { name: 'UUID Generator', path: '/tools/uuid-generator', icon: Fingerprint, description: 'Generate UUIDs' },
      ]
    },
    {
      id: 'advanced-tools',
      name: 'Advanced Tools',
      icon: Terminal,
      color: 'from-teal-500 to-cyan-500',
      tools: [
        { name: 'JWT Decoder', path: '/tools/jwt-decoder', icon: Key, description: 'Decode JSON Web Tokens' },
        { name: 'Subnet Calculator', path: '/tools/subnet-calculator', icon: Network, description: 'Calculate IP subnets' },
        { name: 'Binary Converter', path: '/tools/binary-converter', icon: Binary, description: 'Convert number bases' },
      ]
    },
    {
      id: 'data-tools',
      name: 'Data Tools',
      icon: Database,
      color: 'from-emerald-500 to-green-500',
      tools: [
        { name: 'YAML ⇄ JSON Converter', path: '/tools/yaml-json-converter', icon: FileJson, description: 'Convert between YAML and JSON' },
      ]
    },
    {
      id: 'sysadmin-tools',
      name: 'SysAdmin Tools',
      icon: Server,
      color: 'from-violet-500 to-purple-500',
      tools: [
        { name: 'Cron Expression Generator', path: '/tools/cron-generator', icon: Clock, description: 'Generate cron expressions' },
      ]
    },
    {
      id: 'active-directory',
      name: 'Active Directory',
      icon: Server,
      color: 'from-blue-600 to-indigo-600',
      tools: [
        { name: 'AD User Bulk Creator', path: '/tools/ad-user-bulk-creator', icon: Users, description: 'Create multiple AD users from CSV' },
        { name: 'AD Password Reset', path: '/tools/ad-password-reset', icon: Key, description: 'Reset AD user passwords' },
        { name: 'AD Group Manager', path: '/tools/ad-group-manager', icon: Users, description: 'Manage AD groups and members' },
      ]
    },
    {
      id: 'advanced-network',
      name: 'Advanced Network',
      icon: Network,
      color: 'from-teal-500 to-cyan-600',
      tools: [
        { name: 'Network Reset & Repair', path: '/tools/network-reset', icon: RefreshCw, description: 'Fix network connectivity issues' },
        { name: 'Firewall Rule Generator', path: '/tools/firewall-rules', icon: Shield, description: 'Create Windows Firewall rules' },
        { name: 'Hosts File Manager', path: '/tools/hosts-manager', icon: FileText, description: 'Manage Windows hosts file' },
      ]
    },
    {
      id: 'macos-tools',
      name: 'macOS Tools',
      icon: Terminal,
      color: 'from-gray-600 to-gray-800',
      tools: [
        { name: 'macOS AI Assistant', path: '/tools/macos-assistant', icon: Brain, description: 'AI-powered macOS terminal command help' },
      ]
    }
  ]

  // Get all tools flat
  const allTools = toolCategories.flatMap(cat =>
    cat.tools.map(tool => ({ ...tool, category: cat.id, categoryName: cat.name, categoryColor: cat.color }))
  )

  // Get favorite tools
  const favoriteTools = allTools.filter(tool => favorites.includes(tool.path))

  // Filter tools by search and category
  const filteredCategories = toolCategories.map(category => {
    if (selectedCategory !== 'all' && selectedCategory !== category.id) return null

    const filteredTools = category.tools.filter(tool => {
      const matchesSearch = searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })

    if (filteredTools.length === 0) return null

    return { ...category, tools: filteredTools }
  }).filter(Boolean)

  // Rainbow Mode: Block Tools page with Hornet promotion
  if (rainbowMode) {
    return <RainbowModeToolBlocker />
  }

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Animated Logo */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <CemalLogo size="medium" showDecorations={false} />
      </div>

      <div className={`text-center space-y-4 relative transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full mb-4 border border-white/10">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-gray-300" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>{t(language, 'tools.professionalTools')}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.02em' }}>
          <span className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent">
            {t(language, 'tools.title')}
          </span>
        </h1>
        <p className="text-xl text-gray-400" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
          {t(language, 'tools.subtitle')}
        </p>

        {/* Floating Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <Code className="absolute top-20 left-[10%] w-8 h-8 text-blue-500/10 animate-float" />
          <Rocket className="absolute top-40 right-[15%] w-10 h-10 text-indigo-500/10 animate-float-delayed" />
          <Sparkles className="absolute bottom-10 left-[20%] w-6 h-6 text-purple-500/10 animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className={`bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t(language, 'tools.search')}
            className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all"
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
            style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {t(language, 'tools.allTools')}
          </button>
          {toolCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t(language, `tools.categories.${cat.id}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteTools.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <div className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">{t(language, 'tools.favorites')}</h2>
            <span className="text-sm text-gray-400">({favoriteTools.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool, index) => {
              const ToolIcon = tool.icon
              return (
                <Link
                  key={index}
                  to={tool.path}
                  onClick={() => handleToolClick(tool.path, tool.name)}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-blue-500/50 hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.categoryColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      <ToolIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t(language, `tools.toolNames.${tool.name}`)}
                      </h3>
                      <p className="text-sm text-gray-400" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {t(language, `tools.toolDescriptions.${tool.name}`)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(tool.path, tool.name, e)}
                      className="flex-shrink-0 p-1.5 hover:bg-yellow-900/20 rounded-lg transition-colors"
                    >
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className={`bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 transition-all duration-500 hover:shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-300" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <strong className="font-semibold">{t(language, 'tools.note')}</strong> {t(language, 'tools.disclaimer')}
          </p>
        </div>
      </div>

      {/* Tool Categories */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">{t(language, 'tools.noToolsFound')}</h3>
          <p className="text-gray-400">{t(language, 'tools.tryAdjusting')}</p>
        </div>
      )}

      {filteredCategories.map((category, index) => {
        const CategoryIcon = category.icon
        return (
          <div
            key={index}
            id={category.id}
            className={`space-y-4 scroll-mt-24 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center animate-gradient-rotate`}>
                <CategoryIcon className="w-6 h-6 text-white animate-pulse-slow" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t(language, `tools.categories.${category.id}`)}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool, toolIndex) => {
                const ToolIcon = tool.icon
                const isToolFavorite = isFavorite(tool.path)
                return (
                  <Link
                    key={toolIndex}
                    to={tool.path}
                    onClick={() => handleToolClick(tool.path, tool.name)}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-blue-500/50 hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                        <ToolIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          {t(language, `tools.toolNames.${tool.name}`)}
                        </h3>
                        <p className="text-sm text-gray-400" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                          {t(language, `tools.toolDescriptions.${tool.name}`)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(tool.path, tool.name, e)}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors group/star"
                      >
                        <Star className={`w-5 h-5 transition-colors ${isToolFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400 group-hover/star:text-yellow-500'}`} />
                      </button>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Tools
