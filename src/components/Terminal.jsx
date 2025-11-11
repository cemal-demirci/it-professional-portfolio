import { useState, useEffect, useRef } from 'react'
import { X, Minimize2, Maximize2, Terminal as TerminalIcon } from 'lucide-react'

const Terminal = ({ onClose }) => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [currentDir, setCurrentDir] = useState('/home/cemal')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  const historyRef = useRef(null)

  // Fake filesystem
  const filesystem = {
    '/': ['home', 'usr', 'var', 'etc'],
    '/home': ['cemal'],
    '/home/cemal': ['projects', 'documents', 'downloads', 'secret.txt', 'README.md'],
    '/home/cemal/projects': ['portfolio', 'ai-tools', 'game'],
    '/home/cemal/documents': ['cv.pdf', 'notes.txt'],
    '/home/cemal/downloads': ['meme.jpg', 'hack.exe']
  }

  const files = {
    '/home/cemal/secret.txt': '🔐 TOP SECRET: cxmxl kodu ile God Mode aktif! 👑',
    '/home/cemal/README.md': `
# Cemal Demirci Portfolio 🚀

## Easter Eggs:
- konami code: ↑↑↓↓←→←→CD
- rainbow: Fabulous mode
- party: Party time!
- retro: 90s vibes
- dev: Developer console
- cxmxl: GOD MODE
- terminal: You're here!

Made with ❤️ by Cemal
    `,
    '/home/cemal/documents/cv.pdf': '📄 [Binary PDF data... Use a PDF reader!]',
    '/home/cemal/documents/notes.txt': `
TODO List:
✅ Build awesome portfolio
✅ Add easter eggs
✅ Impress everyone
🔲 Take over the world
    `
  }

  useEffect(() => {
    addToHistory('Welcome to Cemal Terminal v2.0', 'system')
    addToHistory('Type "help" for available commands', 'system')
    addToHistory('', 'output')
  }, [])

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [history])

  const addToHistory = (text, type = 'output') => {
    setHistory(prev => [...prev, { text, type, dir: currentDir }])
  }

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    addToHistory(cmd, 'command')
    setCommandHistory(prev => [...prev, cmd])

    const parts = trimmedCmd.split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    switch (command) {
      case 'help':
        addToHistory('Available commands:', 'output')
        addToHistory('  ls              - List files and directories', 'output')
        addToHistory('  cd <dir>        - Change directory', 'output')
        addToHistory('  pwd             - Print working directory', 'output')
        addToHistory('  cat <file>      - Display file contents', 'output')
        addToHistory('  clear           - Clear terminal', 'output')
        addToHistory('  whoami          - Display current user', 'output')
        addToHistory('  date            - Display current date/time', 'output')
        addToHistory('  echo <text>     - Print text', 'output')
        addToHistory('  neofetch        - Display system information', 'output')
        addToHistory('  hack            - Start hacking...', 'output')
        addToHistory('  matrix          - Enter the Matrix', 'output')
        addToHistory('  exit            - Close terminal', 'output')
        break

      case 'ls':
        const dirContents = filesystem[currentDir] || []
        if (dirContents.length === 0) {
          addToHistory('Directory is empty', 'output')
        } else {
          dirContents.forEach(item => {
            const isDir = filesystem[`${currentDir}/${item}`]
            const color = isDir ? 'text-blue-400' : 'text-green-400'
            addToHistory(`  ${item}${isDir ? '/' : ''}`, color)
          })
        }
        break

      case 'pwd':
        addToHistory(currentDir, 'output')
        break

      case 'cd':
        if (!args[0]) {
          setCurrentDir('/home/cemal')
          addToHistory('', 'output')
        } else if (args[0] === '..') {
          const parentDir = currentDir.split('/').slice(0, -1).join('/') || '/'
          setCurrentDir(parentDir)
        } else if (args[0] === '/') {
          setCurrentDir('/')
        } else {
          const newDir = currentDir === '/' ? `/${args[0]}` : `${currentDir}/${args[0]}`
          if (filesystem[newDir]) {
            setCurrentDir(newDir)
          } else {
            addToHistory(`cd: ${args[0]}: No such directory`, 'error')
          }
        }
        break

      case 'cat':
        if (!args[0]) {
          addToHistory('cat: missing file operand', 'error')
        } else {
          const filePath = `${currentDir}/${args[0]}`
          if (files[filePath]) {
            addToHistory(files[filePath], 'output')
          } else {
            addToHistory(`cat: ${args[0]}: No such file`, 'error')
          }
        }
        break

      case 'clear':
        setHistory([])
        break

      case 'whoami':
        addToHistory('cemal', 'output')
        break

      case 'date':
        addToHistory(new Date().toString(), 'output')
        break

      case 'echo':
        addToHistory(args.join(' '), 'output')
        break

      case 'neofetch':
        addToHistory('', 'output')
        addToHistory('       ___       ', 'text-cyan-400')
        addToHistory('      /\\ /\\      cemal@portfolio', 'text-cyan-400')
        addToHistory('     /  X  \\     ----------------', 'text-cyan-400')
        addToHistory('    /  / \\  \\    OS: Web Browser', 'text-cyan-400')
        addToHistory('   /__/   \\__\\   Kernel: JavaScript', 'text-cyan-400')
        addToHistory('                 Shell: Cemal Terminal v2.0', 'text-cyan-400')
        addToHistory('                 CPU: Your Brain', 'text-cyan-400')
        addToHistory('                 GPU: Imagination', 'text-cyan-400')
        addToHistory('                 Memory: Unlimited (God Mode)', 'text-cyan-400')
        addToHistory('                 Uptime: Since you opened this', 'text-cyan-400')
        addToHistory('', 'output')
        break

      case 'hack':
        addToHistory('', 'output')
        addToHistory('Initializing hack sequence...', 'text-green-400')
        setTimeout(() => {
          addToHistory('[▓▓▓▓▓▓▓▓▓▓] 100% - Accessing mainframe...', 'text-green-400')
        }, 500)
        setTimeout(() => {
          addToHistory('Bypassing firewall... SUCCESS ✓', 'text-green-400')
        }, 1000)
        setTimeout(() => {
          addToHistory('Downloading secure data... SUCCESS ✓', 'text-green-400')
        }, 1500)
        setTimeout(() => {
          addToHistory('', 'output')
          addToHistory('💀 JUST KIDDING! 💀', 'text-red-400')
          addToHistory('This is just a fun terminal easter egg 😂', 'text-yellow-400')
        }, 2000)
        break

      case 'matrix':
        addToHistory('', 'output')
        addToHistory('01001101 01100001 01110100 01110010 01101001 01111000', 'text-green-400')
        addToHistory('Wake up, Neo...', 'text-green-400')
        addToHistory('The Matrix has you...', 'text-green-400')
        addToHistory('Follow the white rabbit 🐰', 'text-green-400')
        break

      case 'sudo':
        if (args.join(' ') === 'rm -rf /') {
          addToHistory('', 'output')
          addToHistory('⚠️  WARNING: This would delete everything!', 'text-red-400')
          addToHistory('', 'output')
          addToHistory('Just kidding! Nothing actually happened 😅', 'text-yellow-400')
          addToHistory('This is a safe terminal easter egg!', 'text-green-400')
        } else {
          addToHistory('[sudo] password for cemal: ', 'output')
          addToHistory('sudo: command not implemented in easter egg terminal', 'error')
        }
        break

      case 'exit':
        onClose()
        break

      default:
        addToHistory(`${command}: command not found. Type "help" for available commands.`, 'error')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
      setHistoryIndex(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setInput(commandHistory[commandHistory.length - 1 - newIndex])
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newIndex = historyIndex - 1
      if (newIndex >= 0) {
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  const getPrompt = () => `cemal@portfolio:${currentDir}$`

  return (
    <div className="fixed inset-0 z-[10001] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-[600px] flex flex-col border-2 border-gray-700 shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <TerminalIcon className="w-4 h-4 text-green-400 ml-2" />
            <span className="text-sm font-mono text-gray-300">cemal@portfolio: ~</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terminal Body */}
        <div
          ref={historyRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-black text-green-400"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, index) => (
            <div key={index} className={item.type === 'error' ? 'text-red-400' : item.type}>
              {item.type === 'command' && (
                <span className="text-cyan-400">{getPrompt()} </span>
              )}
              <span className={item.type === 'system' ? 'text-yellow-400' : ''}>
                {item.text}
              </span>
            </div>
          ))}

          {/* Input Line */}
          <div className="flex items-center">
            <span className="text-cyan-400">{getPrompt()} </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-green-400 ml-1"
              autoFocus
            />
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono border-t border-gray-700 rounded-b-lg flex justify-between">
          <span>Cemal Terminal v2.0 - Easter Egg Edition</span>
          <span>Press ESC or type "exit" to close</span>
        </div>
      </div>
    </div>
  )
}

export default Terminal
