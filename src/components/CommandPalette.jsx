import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import {
  Code, Lock, FileText, Palette, Network, Wrench, Monitor,
  FileJson, Binary, Regex, Minimize, FileOutput, Image, Key, Hash, Shield,
  Type, Diff, Droplet, Sparkles, Link as LinkIcon, Globe, Wifi,
  QrCode, Clock, Fingerprint, Settings, Zap, Trash2, Terminal, Database, Server, Mail, Brain,
  Users, RefreshCw, LifeBuoy, Gauge
} from 'lucide-react'

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const resultsRef = useRef(null)

  // All available tools
  const allTools = [
    // Code Tools
    { name: 'JSON Formatter', path: '/tools/json-formatter', icon: FileJson, category: 'Code Tools', description: 'Format and validate JSON' },
    { name: 'Base64 Tool', path: '/tools/base64', icon: Binary, category: 'Code Tools', description: 'Encode/decode Base64' },
    { name: 'Regex Tester', path: '/tools/regex-tester', icon: Regex, category: 'Code Tools', description: 'Test regular expressions' },
    { name: 'Code Minifier', path: '/tools/code-minifier', icon: Minimize, category: 'Code Tools', description: 'Minify JS/CSS/HTML' },

    // PDF Tools
    { name: 'PDF Merger', path: '/tools/pdf-merger', icon: FileOutput, category: 'PDF Tools', description: 'Merge PDF files' },
    { name: 'PDF to Image', path: '/tools/pdf-to-image', icon: Image, category: 'PDF Tools', description: 'Convert PDF to images' },
    { name: 'Image to PDF', path: '/tools/image-to-pdf', icon: FileOutput, category: 'PDF Tools', description: 'Convert images to PDF' },
    { name: 'PDF OCR', path: '/tools/pdf-ocr', icon: FileText, category: 'PDF Tools', description: 'Extract text from PDF' },

    // Security Tools
    { name: 'Password Generator', path: '/tools/password-generator', icon: Key, category: 'Security', description: 'Generate secure passwords' },
    { name: 'Hash Generator', path: '/tools/hash-generator', icon: Hash, category: 'Security', description: 'Generate hashes' },
    { name: 'Encryption Tool', path: '/tools/encryption', icon: Lock, category: 'Security', description: 'Encrypt/decrypt data' },
    { name: 'Password Strength', path: '/tools/password-strength', icon: Shield, category: 'Security', description: 'Check password strength' },

    // Text Tools
    { name: 'Markdown Editor', path: '/tools/markdown-editor', icon: FileText, category: 'Text Tools', description: 'Edit markdown' },
    { name: 'Word Counter', path: '/tools/word-counter', icon: Type, category: 'Text Tools', description: 'Count words and chars' },
    { name: 'Text Diff', path: '/tools/text-diff', icon: Diff, category: 'Text Tools', description: 'Compare texts' },
    { name: 'Case Converter', path: '/tools/case-converter', icon: Type, category: 'Text Tools', description: 'Convert text case' },
    { name: 'Text Analyzer', path: '/tools/text-analyzer', icon: Brain, category: 'Text Tools', description: 'Analyze text with AI' },

    // Design Tools
    { name: 'Color Picker', path: '/tools/color-picker', icon: Droplet, category: 'Design', description: 'Pick and convert colors' },
    { name: 'Gradient Generator', path: '/tools/gradient-generator', icon: Sparkles, category: 'Design', description: 'Create CSS gradients' },
    { name: 'CSS Generator', path: '/tools/css-generator', icon: Code, category: 'Design', description: 'Generate CSS code' },

    // Network Tools
    { name: 'URL Encoder', path: '/tools/url-encoder', icon: LinkIcon, category: 'Network', description: 'Encode/decode URLs' },
    { name: 'IP Lookup', path: '/tools/ip-lookup', icon: Globe, category: 'Network', description: 'Get IP information' },
    { name: 'DNS Lookup', path: '/tools/dns-lookup', icon: Wifi, category: 'Network', description: 'Perform DNS queries' },
    { name: 'WHOIS Lookup', path: '/tools/whois-lookup', icon: Globe, category: 'Network', description: 'Domain registration info' },
    { name: 'MAC Lookup', path: '/tools/mac-lookup', icon: Wifi, category: 'Network', description: 'MAC address lookup' },
    { name: 'Security Headers', path: '/tools/security-headers', icon: Shield, category: 'Network', description: 'Check security headers' },
    { name: 'Port Information', path: '/tools/port-info', icon: Server, category: 'Network', description: 'Port reference' },
    { name: 'Email Header Analyzer', path: '/tools/email-headers', icon: Mail, category: 'Network', description: 'Analyze email headers' },
    { name: 'Email DNS Checker', path: '/tools/email-dns-checker', icon: Shield, category: 'Network', description: 'Check SPF/DMARC/DKIM' },
    { name: 'Network Reset', path: '/tools/network-reset', icon: RefreshCw, category: 'Network', description: 'Reset network settings' },
    { name: 'Firewall Rules', path: '/tools/firewall-rules', icon: Shield, category: 'Network', description: 'Generate firewall rules' },
    { name: 'Hosts Manager', path: '/tools/hosts-manager', icon: FileText, category: 'Network', description: 'Manage hosts file' },

    // Utility Tools
    { name: 'QR Generator', path: '/tools/qr-generator', icon: QrCode, category: 'Utility', description: 'Generate QR codes' },
    { name: 'Timestamp Converter', path: '/tools/timestamp-converter', icon: Clock, category: 'Utility', description: 'Convert timestamps' },
    { name: 'UUID Generator', path: '/tools/uuid-generator', icon: Fingerprint, category: 'Utility', description: 'Generate UUIDs' },

    // Windows Tools
    { name: 'GUID Generator', path: '/tools/guid-generator', icon: Fingerprint, category: 'Windows', description: 'Generate GUIDs' },
    { name: 'Power Management', path: '/tools/power-management', icon: Zap, category: 'Windows', description: 'Power settings scripts' },
    { name: 'Bloatware Remover', path: '/tools/bloatware-remover', icon: Trash2, category: 'Windows', description: 'Remove bloatware' },
    { name: 'Gaming Optimizer', path: '/tools/gaming-optimizer', icon: Gauge, category: 'Windows', description: 'Optimize for gaming' },

    // Advanced Tools
    { name: 'JWT Decoder', path: '/tools/jwt-decoder', icon: Key, category: 'Advanced', description: 'Decode JWT tokens' },
    { name: 'Subnet Calculator', path: '/tools/subnet-calculator', icon: Network, category: 'Advanced', description: 'Calculate subnets' },
    { name: 'Binary Converter', path: '/tools/binary-converter', icon: Binary, category: 'Advanced', description: 'Convert number bases' },

    // Data Tools
    { name: 'YAML/JSON Converter', path: '/tools/yaml-json-converter', icon: Database, category: 'Data', description: 'Convert YAML/JSON' },

    // SysAdmin Tools
    { name: 'Cron Generator', path: '/tools/cron-generator', icon: Clock, category: 'SysAdmin', description: 'Generate cron expressions' },

    // Active Directory
    { name: 'AD User Bulk Creator', path: '/tools/ad-user-bulk-creator', icon: Users, category: 'Active Directory', description: 'Bulk create AD users' },
    { name: 'AD Password Reset', path: '/tools/ad-password-reset', icon: Key, category: 'Active Directory', description: 'Generate password reset scripts' },
    { name: 'AD Group Manager', path: '/tools/ad-group-manager', icon: Users, category: 'Active Directory', description: 'Manage AD groups' },

    // AI-Powered Tools
    { name: 'PowerShell Analyzer', path: '/tools/ai-powershell-analyzer', icon: Terminal, category: 'AI Tools', description: 'Analyze PowerShell scripts' },
    { name: 'Log Analyzer', path: '/tools/ai-log-analyzer', icon: FileText, category: 'AI Tools', description: 'Analyze log files' },
    { name: 'Security Advisor', path: '/tools/ai-security-advisor', icon: Shield, category: 'AI Tools', description: 'Security recommendations' },
    { name: 'Network Troubleshooter', path: '/tools/ai-network-troubleshooter', icon: LifeBuoy, category: 'AI Tools', description: 'Network diagnostics' },
    { name: 'GPO Analyzer', path: '/tools/ai-gpo-analyzer', icon: Settings, category: 'AI Tools', description: 'Analyze Group Policy' },
    { name: 'Script Generator', path: '/tools/ai-script-generator', icon: Code, category: 'AI Tools', description: 'Generate scripts with AI' },
    { name: 'Event Correlator', path: '/tools/ai-event-correlator', icon: Brain, category: 'AI Tools', description: 'Correlate events' },
    { name: 'Certificate Analyzer', path: '/tools/ai-cert-analyzer', icon: Shield, category: 'AI Tools', description: 'Analyze certificates' },
    { name: 'DR Planner', path: '/tools/ai-dr-planner', icon: LifeBuoy, category: 'AI Tools', description: 'Disaster recovery planning' },
    { name: 'Performance Troubleshooter', path: '/tools/ai-perf-troubleshooter', icon: Gauge, category: 'AI Tools', description: 'Performance diagnostics' },

    // macOS Tools
    { name: 'macOS Assistant', path: '/tools/macos-assistant', icon: Terminal, category: 'macOS', description: 'macOS terminal help' },

    // Zero Density Tools (hidden from search unless authenticated)
    { name: 'Evo II Event Analyzer', path: '/0d/evo2-analyzer', icon: Brain, category: 'Zero Density', description: 'Analyze Evo II events' },
    { name: 'Evo III Event Analyzer', path: '/0d/evo3-analyzer', icon: Brain, category: 'Zero Density', description: 'Analyze Evo III events' },
    { name: 'Ampere Event Analyzer', path: '/0d/amper-analyzer', icon: Brain, category: 'Zero Density', description: 'Analyze Ampere events' },

    // Pages
    { name: 'Home', path: '/', icon: Monitor, category: 'Navigation', description: 'Go to home page' },
    { name: 'About', path: '/about', icon: FileText, category: 'Navigation', description: 'About me' },
    { name: 'Tools', path: '/tools', icon: Wrench, category: 'Navigation', description: 'Browse all tools' },
  ]

  // Filter tools based on search
  const filteredTools = search.trim()
    ? allTools.filter(tool => {
        const searchLower = search.toLowerCase()
        return (
          tool.name.toLowerCase().includes(searchLower) ||
          tool.category.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower)
        )
      })
    : allTools.slice(0, 20) // Show first 20 if no search

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setSearch('')
        setSelectedIndex(0)
      }

      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setSearch('')
      }

      // Arrow navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredTools.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        }
        if (e.key === 'Enter' && filteredTools[selectedIndex]) {
          e.preventDefault()
          handleNavigate(filteredTools[selectedIndex].path)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredTools, selectedIndex])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex]
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
    setSearch('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search tools... (Type to search, ↑↓ to navigate, ⏎ to select)"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:hover:bg-gray-700 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          className="max-h-96 overflow-y-auto"
        >
          {filteredTools.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400">
              No tools found for "{search}"
            </div>
          ) : (
            <div className="py-2">
              {filteredTools.map((tool, index) => {
                const Icon = tool.icon
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={tool.path}
                    onClick={() => handleNavigate(tool.path)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-primary-900/30'
                        : 'hover:hover:bg-gray-700/50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            isSelected
                              ? 'text-primary-400'
                              : 'text-white'
                          }`}
                        >
                          {tool.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {tool.description}
                      </p>
                    </div>
                    {isSelected && (
                      <ArrowRight className="w-5 h-5 text-primary-400" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs">↑</kbd>
                <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs">⏎</kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs">ESC</kbd>
                to close
              </span>
            </div>
            <span>{filteredTools.length} results</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
