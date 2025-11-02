import { useState } from 'react'
import { Terminal, Brain, Copy, Zap, Loader, Apple, Command } from 'lucide-react'
import { analyzeWithGemini } from '../../services/geminiService'

const MacOsAssistant = () => {
  const [question, setQuestion] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const quickQuestions = [
    {
      title: 'Find Large Files',
      question: 'How do I find all files larger than 1GB on my Mac?',
      icon: '🔍'
    },
    {
      title: 'Network Issues',
      question: 'My Mac has slow internet, what terminal commands can help diagnose?',
      icon: '🌐'
    },
    {
      title: 'Disk Space',
      question: 'How to free up disk space on macOS using terminal?',
      icon: '💾'
    },
    {
      title: 'Process Management',
      question: 'How to find and kill a process using too much CPU on Mac?',
      icon: '⚙️'
    },
    {
      title: 'Homebrew Help',
      question: 'What are essential Homebrew commands for managing packages?',
      icon: '🍺'
    },
    {
      title: 'System Info',
      question: 'Show me commands to get detailed Mac system information',
      icon: '💻'
    },
    {
      title: 'WiFi Management',
      question: 'How to manage WiFi connections, scan networks, and troubleshoot WiFi issues on Mac?',
      icon: '📶'
    },
    {
      title: 'Clean System Cache',
      question: 'How to safely clear system caches and temporary files on macOS?',
      icon: '🧹'
    },
    {
      title: 'Port Scanning',
      question: 'How to check which ports are open and what processes are using them?',
      icon: '🔌'
    },
    {
      title: 'File Permissions',
      question: 'How to fix file permissions and ownership issues on Mac?',
      icon: '🔐'
    },
    {
      title: 'Monitor Activity',
      question: 'What terminal commands can I use to monitor CPU, memory, and disk usage in real-time?',
      icon: '📊'
    },
    {
      title: 'Backup & Time Machine',
      question: 'How to manage Time Machine backups and create manual backups via terminal?',
      icon: '⏰'
    }
  ]

  const analyze = async (customQuestion = null) => {
    const questionToAsk = customQuestion || question
    if (!questionToAsk.trim()) return

    // Check for Windows/Linux keywords
    const windowsKeywords = ['windows', 'powershell', 'cmd', 'active directory', 'registry', 'regedit', 'group policy', 'gpo', 'domain controller', 'windows server', '.exe', 'wsl', 'microsoft', 'azure ad']
    const linuxKeywords = ['linux', 'ubuntu', 'debian', 'centos', 'rhel', 'fedora', 'apt-get', 'yum', 'systemctl', 'systemd']

    const questionLower = questionToAsk.toLowerCase()
    const hasWindowsKeyword = windowsKeywords.some(keyword => questionLower.includes(keyword))
    const hasLinuxKeyword = linuxKeywords.some(keyword => questionLower.includes(keyword))

    if (hasWindowsKeyword) {
      setResult({
        question: questionToAsk,
        answer: `🚫 **Whoa there, Windows user!**

This is a **macOS Assistant** - I only speak Apple! 🍎

Your question contains Windows-related keywords. If you need Windows help:
• Use PowerShell Analyzer (for PowerShell scripts)
• Or just switch to Mac already 😎💻

**Fun fact:** Mac doesn't have a registry to mess up! #MacMasterRace`,
        timestamp: new Date().toLocaleString(),
        isError: true
      })
      return
    }

    if (hasLinuxKeyword) {
      setResult({
        question: questionToAsk,
        answer: `🐧 **Linux detected!**

This is a **macOS-only zone**! 🍎

I'm optimized for macOS/Terminal.app/zsh, not Linux commands.

**Did you know?** macOS is Unix-based like Linux, but we have better emojis and less kernel panics 😄

Try rephrasing your question for macOS!`,
        timestamp: new Date().toLocaleString(),
        isError: true
      })
      return
    }

    setAnalyzing(true)
    setResult(null)

    try {
      const systemInstruction = `You are an expert macOS system administrator and terminal power user. When users ask questions about macOS:

1. **Provide Terminal Commands**: Give exact, copy-pasteable terminal commands
2. **Explain Each Command**: Briefly explain what each command does
3. **Safety Warnings**: Warn about potentially dangerous commands
4. **Alternatives**: Suggest both GUI and terminal methods when applicable
5. **Best Practices**: Include macOS-specific best practices
6. **Troubleshooting**: If relevant, include common issues and fixes

Format your response with:
- Clear terminal commands in code blocks
- Step-by-step instructions
- Expected output examples
- Security considerations

Focus on: Terminal.app, zsh/bash, Homebrew, launchctl, diskutil, networksetup, system_profiler, and other macOS-specific tools.`

      const analysis = await analyzeWithGemini(
        `macOS Question: ${questionToAsk}`,
        systemInstruction
      )

      setResult({
        question: questionToAsk,
        answer: analysis,
        timestamp: new Date().toLocaleString()
      })
    } catch (err) {
      alert(err.message || 'Analysis failed! 😅')
    } finally {
      setAnalyzing(false)
    }
  }

  const copyCommand = (text) => {
    // Extract first command from text (simple heuristic)
    const commandMatch = text.match(/`([^`]+)`/)
    const commandToCopy = commandMatch ? commandMatch[1] : text
    navigator.clipboard.writeText(commandToCopy)
    alert('📋 Command copied to clipboard!')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Apple className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          macOS AI Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered help for macOS terminal commands and troubleshooting
        </p>
      </div>

      {/* macOS Info Banner */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Terminal:</strong> /Applications/Utilities/Terminal.app | <strong>Shell:</strong> zsh (default) | <strong>Package Manager:</strong> Homebrew
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Quick Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(q.question)
                analyze(q.question)
              }}
              disabled={analyzing}
              className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all disabled:opacity-50"
            >
              <div className="text-2xl mb-2">{q.icon}</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {q.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Question Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Ask Your macOS Question</h3>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., How do I find my Mac's IP address using terminal?"
          className="textarea-field min-h-[120px] font-mono text-sm"
          disabled={analyzing}
        />

        <button
          onClick={() => analyze()}
          disabled={!question.trim() || analyzing}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              AI düşünüyor... 🍎
            </>
          ) : (
            <>
              <Brain className="w-5 h-5" />
              Get macOS Solution
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className={`rounded-xl p-6 border space-y-4 ${
          result.isError
            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className={`font-semibold flex items-center gap-2 ${
                result.isError
                  ? 'text-red-900 dark:text-red-300'
                  : 'text-gray-900 dark:text-white'
              }`}>
                <Command className={`w-5 h-5 ${result.isError ? 'text-red-600' : 'text-green-600'}`} />
                {result.isError ? 'Error - Wrong OS!' : 'Solution'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {result.question}
              </p>
            </div>
            <span className="text-xs text-gray-500">{result.timestamp}</span>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className={`p-4 rounded-lg whitespace-pre-wrap text-sm ${
              result.isError
                ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200'
                : 'bg-gray-50 dark:bg-gray-900 font-mono'
            }`}>
              {result.answer}
            </div>
          </div>

          {!result.isError && (
            <button
              onClick={() => copyCommand(result.answer)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Commands
            </button>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
          <Apple className="w-4 h-4" />
          Common macOS Terminal Tips:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 ml-5 list-disc">
          <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">man command</code> - Show manual for any command</li>
          <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">brew install app</code> - Install applications via Homebrew</li>
          <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">sudo</code> - Run commands as admin (use carefully!)</li>
          <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">⌃C</code> - Cancel running command</li>
          <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">⌃R</code> - Search command history</li>
          <li><code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">open .</code> - Open current directory in Finder</li>
        </ul>
      </div>
    </div>
  )
}

export default MacOsAssistant
