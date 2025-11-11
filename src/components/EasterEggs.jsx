import { useEffect, useState } from 'react'
import { Sparkles, Code, Zap, PartyPopper, Trophy, Award, Star, Lock, Unlock } from 'lucide-react'
import FightingGame from './FightingGame'
import Terminal from './Terminal'
import LoveLetter from './LoveLetter'
import { useRainbow, getFabulousMessage } from '../contexts/RainbowContext'
import { useGodMode } from '../contexts/GodModeContext'

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'konami_master', name: 'Konami Master', description: 'Unlocked the secret fighting game!', icon: '🎮', rarity: 'legendary' },
  { id: 'matrix_master', name: 'Matrix Master', description: 'Entered the Matrix', icon: '🟢', rarity: 'epic' },
  { id: 'party_animal', name: 'Party Animal', description: 'Started the ultimate IT party', icon: '🎉', rarity: 'rare' },
  { id: 'rainbow_rider', name: 'Rainbow Rider', description: 'Unlocked fabulous rainbow mode', icon: '🌈', rarity: 'rare' },
  { id: 'retro_gamer', name: 'Retro Gamer', description: 'Traveled back to the 90s', icon: '💾', rarity: 'rare' },
  { id: 'developer', name: 'Developer', description: 'Opened the secret dev console', icon: '👨‍💻', rarity: 'uncommon' },
  { id: 'terminal_hacker', name: 'Terminal Hacker', description: 'Accessed the secret terminal', icon: '💻', rarity: 'epic' },
  { id: 'god_mode', name: 'God Mode', description: 'Achieved ultimate power', icon: '🔱', rarity: 'legendary' },
  { id: 'romantic', name: 'Romantic Soul', description: 'Found the love letter ❤️', icon: '💖', rarity: 'legendary' },
  { id: 'easter_hunter', name: 'Easter Egg Hunter', description: 'Discovered 5 easter eggs', icon: '🥚', rarity: 'epic' },
  { id: 'completionist', name: 'Completionist', description: 'Unlocked ALL 9 easter eggs! 🏆 CEMAL.ONLINE KUPASI', icon: '🏆', rarity: 'legendary' }
]

const EasterEggs = () => {
  const { rainbowMode, setRainbowMode } = useRainbow()
  const { godMode, activateGodMode } = useGodMode()
  const [konamiCode, setKonamiCode] = useState([])
  const [matrixMode, setMatrixMode] = useState(false)
  const [partyMode, setPartyMode] = useState(false)
  const [retroMode, setRetroMode] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [showNotification, setShowNotification] = useState(null)
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [showAchievement, setShowAchievement] = useState(null)
  const [showAchievementGallery, setShowAchievementGallery] = useState(false)
  const [showFightingGame, setShowFightingGame] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showLoveLetter, setShowLoveLetter] = useState(false)
  const [fabulousMessageInterval, setFabulousMessageInterval] = useState(null)

  // Load achievements from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cemal_achievements')
    if (saved) {
      setUnlockedAchievements(JSON.parse(saved))
    }
  }, [])

  // Save achievements to localStorage
  const saveAchievements = (achievements) => {
    localStorage.setItem('cemal_achievements', JSON.stringify(achievements))
    setUnlockedAchievements(achievements)
  }

  // Unlock achievement
  const unlockAchievement = (achievementId) => {
    if (!unlockedAchievements.includes(achievementId)) {
      const newAchievements = [...unlockedAchievements, achievementId]
      saveAchievements(newAchievements)

      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
      setShowAchievement(achievement)
      setTimeout(() => setShowAchievement(null), 5000)

      // Check for meta achievements
      if (newAchievements.length === 5 && !newAchievements.includes('easter_hunter')) {
        setTimeout(() => unlockAchievement('easter_hunter'), 1000)
      }
      if (newAchievements.length === 9 && !newAchievements.includes('completionist')) {
        setTimeout(() => unlockAchievement('completionist'), 1000)
      }
    }
  }

  // Konami Code: ↑↑↓↓←→←→CD (Cemal Demirci)
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'c', 'd']

  useEffect(() => {
    const handleKeyPress = (e) => {
      const newCode = [...konamiCode, e.key].slice(-10)
      setKonamiCode(newCode)

      // Check Konami Code
      if (newCode.join('') === konamiSequence.join('')) {
        activateMatrixMode()
      }

      // Party Mode: Type "party"
      if (newCode.slice(-5).join('') === 'party') {
        activatePartyMode()
      }

      // Rainbow Mode: Type "rainbow", "gay", or "gey"
      if (newCode.slice(-7).join('') === 'rainbow') {
        activateRainbowMode()
      }
      if (newCode.slice(-3).join('') === 'gay') {
        activateRainbowMode()
      }
      if (newCode.slice(-3).join('') === 'gey') {
        activateRainbowMode()
      }

      // Retro Mode: Type "retro"
      if (newCode.slice(-5).join('') === 'retro') {
        activateRetroMode()
      }

      // Dev Mode: Type "dev"
      if (newCode.slice(-3).join('') === 'dev') {
        activateDevMode()
      }

      // God Mode: Type "cxmxl"
      if (newCode.slice(-5).join('') === 'cxmxl') {
        activateGodModeEffect()
      }

      // Terminal: Type "terminal"
      if (newCode.slice(-8).join('') === 'terminal') {
        activateTerminal()
      }

      // Love Letter: Type "pervo"
      if (newCode.slice(-5).join('') === 'pervo') {
        activateLoveLetter()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [konamiCode])

  const showToast = (message, icon) => {
    setShowNotification({ message, icon })
    setTimeout(() => setShowNotification(null), 3000)
  }

  const activateMatrixMode = () => {
    // Open fighting game + Matrix rain effect
    setShowFightingGame(true)
    setMatrixMode(true)
    unlockAchievement('konami_master')
    unlockAchievement('matrix_master')

    // Create matrix rain effect
    document.body.classList.add('matrix-rain-mode')
    createMatrixRain()

    const messages = [
      '🎮 FIGHT! Mortal Kombat Mode + Matrix Rain Activated!',
      '🥊 Get ready for battle in the Matrix!',
      '👊 Time to fight like Neo!',
      '💪 Show your strength in the Matrix!',
      '⚔️ Matrix Battle begins NOW!'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    showToast(randomMsg, '🎮')

    // Remove matrix rain after 30 seconds
    setTimeout(() => {
      document.body.classList.remove('matrix-rain-mode')
      setMatrixMode(false)
    }, 30000)
  }

  const createMatrixRain = () => {
    const canvas = document.createElement('canvas')
    canvas.id = 'matrix-rain'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9997'
    canvas.style.opacity = '0.5'
    document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrix = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 16
    const columns = canvas.width / fontSize
    const drops = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0F0'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    // Remove after 30 seconds
    setTimeout(() => {
      clearInterval(interval)
      canvas.remove()
    }, 30000)
  }

  const activatePartyMode = () => {
    setPartyMode(!partyMode)
    const messages = [
      '🎉 PARTY LIKE A SYSADMIN!',
      '🍻 Git commit && git party!',
      '🎊 sudo apt-get party',
      '🥳 npm install party-mode --save-dev',
      '🎈 Partide bug yok, sadece feature!',
      '🎪 IT parti = Pizza + Energy drink'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]

    showToast(partyMode ? '😴 Back to work mode' : randomMsg, '🎊')
    if (!partyMode) {
      document.body.classList.add('party-mode')
      createConfetti()
      createBalloons()
      unlockAchievement('party_animal')
    } else {
      document.body.classList.remove('party-mode')
    }
  }

  const createBalloons = () => {
    const balloonEmojis = ['🎈', '🎉', '🎊', '🥳', '🎁', '🍾', '🎂']
    const balloonCount = 15

    for (let i = 0; i < balloonCount; i++) {
      const balloon = document.createElement('div')
      balloon.className = 'party-balloon'
      balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)]
      balloon.style.left = Math.random() * 100 + 'vw'
      balloon.style.fontSize = (Math.random() * 20 + 30) + 'px'
      balloon.style.animationDelay = Math.random() * 2 + 's'
      balloon.style.animationDuration = (Math.random() * 3 + 4) + 's'
      document.body.appendChild(balloon)

      setTimeout(() => balloon.remove(), 7000)
    }
  }

  const activateRainbowMode = () => {
    const newRainbowMode = !rainbowMode
    setRainbowMode(newRainbowMode)

    const messages = [
      '🌈 Gay misin? Yok lan, sadece renkli!',
      '🏳️‍🌈 No homo bro, sadece fabulous!',
      '🌈 Rainbow mode ≠ Gay mode (ama supportuz 💜)',
      '🦄 Unicorn power activated! Still straight tho',
      '🌈 Renkler güzel, pride month everyday!',
      '💅 Slay queen! (Ama IT adamıyız)'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]

    showToast(newRainbowMode ? randomMsg : '🌫️ Back to straight colors', '🌈')

    if (newRainbowMode) {
      document.body.classList.add('rainbow-mode')
      unlockAchievement('rainbow_rider')

      // Start showing random fabulous messages
      const interval = setInterval(() => {
        const fabulousMsg = getFabulousMessage()
        showToast(fabulousMsg, '✨')
      }, 5000) // Her 5 saniyede bir komik mesaj

      setFabulousMessageInterval(interval)
    } else {
      document.body.classList.remove('rainbow-mode')

      // Stop fabulous messages
      if (fabulousMessageInterval) {
        clearInterval(fabulousMessageInterval)
        setFabulousMessageInterval(null)
      }
    }
  }

  const activateRetroMode = () => {
    setRetroMode(!retroMode)
    const messages = [
      '💾 Welcome to 1990s! Floppy disk vibes',
      '🕹️ 8-bit mode: Low res, high nostalgia',
      '📼 VHS kalitesi unlocked!',
      '👾 Pixel art activated! Space Invaders time',
      '🖥️ Windows 98 has entered the chat',
      '💿 CD-ROM devrinden selamlar!'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]

    showToast(retroMode ? '📱 Back to 2025' : randomMsg, '🕹️')
    if (!retroMode) {
      document.body.classList.add('retro-mode')
      createRetroScanlines()
      unlockAchievement('retro_gamer')
    } else {
      document.body.classList.remove('retro-mode')
      const scanlines = document.getElementById('retro-scanlines')
      if (scanlines) scanlines.remove()
    }
  }

  const createRetroScanlines = () => {
    const scanlines = document.createElement('div')
    scanlines.id = 'retro-scanlines'
    scanlines.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9996;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15) 0px,
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      );
      animation: retro-flicker 0.15s infinite;
    `
    document.body.appendChild(scanlines)
  }

  const activateDevMode = () => {
    setDevMode(!devMode)
    const messages = [
      '👨‍💻 Console.log("Hackerman mode ON")',
      '⚡ Dev tools > Production bugs',
      '🔍 Inspector mode: Trust nobody',
      '🐛 Bug hunter activated!',
      '💻 Ctrl+Shift+I but cooler',
      '🛠️ Developer = Professional Googler'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]

    showToast(devMode ? '🚪 Console closed' : randomMsg, '⚡')
    if (!devMode) {
      unlockAchievement('developer')
    }
  }

  const activateTerminal = () => {
    setShowTerminal(true)
    unlockAchievement('terminal_hacker')

    const messages = [
      '💻 Terminal Access GRANTED!',
      '🔓 System shell activated!',
      '👨‍💻 Hackerman mode ON!',
      '⚡ Command line unlocked!',
      '🖥️ Terminal ready for input!'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    showToast(randomMsg, '💻')
  }

  const activateGodModeEffect = () => {
    const messages = [
      '🔱 GOD MODE: sudo rm -rf problems',
      '👑 All your base are belong to us',
      '⚡ UNLIMITED POWER!!!',
      '🎯 Cheat code accepted. You win!',
      '💪 Chuck Norris approved!',
      '🌟 Cemal.exe has administrator privileges',
      '💎 HERŞEY FULL BEDAVA DOSTUM!',
      '🚀 Limitless Mode ACTIVATED!',
      '🎁 Tüm özellikler sınırsız açıldı!'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]

    showToast(randomMsg, '👑')
    unlockAchievement('god_mode')

    // Activate God Mode globally
    activateGodMode()

    // Visual effects
    document.body.classList.add('god-mode')
    createGodModeStars()
    createGodModeAura()

    setTimeout(() => {
      document.body.classList.remove('god-mode')
    }, 5000)
  }

  const createGodModeStars = () => {
    const stars = ['⭐', '✨', '💫', '🌟', '⚡', '👑', '💎', '🔱']
    const starCount = 30

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div')
      star.className = 'god-mode-star'
      star.textContent = stars[Math.floor(Math.random() * stars.length)]
      star.style.left = Math.random() * 100 + 'vw'
      star.style.top = Math.random() * 100 + 'vh'
      star.style.fontSize = (Math.random() * 30 + 20) + 'px'
      star.style.animationDelay = Math.random() * 2 + 's'
      document.body.appendChild(star)

      setTimeout(() => star.remove(), 5000)
    }
  }

  const createGodModeAura = () => {
    const aura = document.createElement('div')
    aura.id = 'god-mode-aura'
    aura.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 500px;
      height: 500px;
      margin: -250px 0 0 -250px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9995;
      animation: god-aura-pulse 2s ease-in-out infinite;
    `
    document.body.appendChild(aura)

    setTimeout(() => aura.remove(), 5000)
  }

  const activateLoveLetter = () => {
    setShowLoveLetter(true)
    unlockAchievement('romantic')

    const messages = [
      '💖 Aşk her yerde, hatta kodda!',
      '❤️ Love.exe başlatıldı...',
      '💝 Kalpler yağıyor!',
      '🌹 Sevgiyle yazılmış satırlar...',
      '💕 Aşk mektubu unlocked!',
      '💞 Heart overflow detected!',
      '💗 Romantik mod activated!'
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    showToast(randomMsg, '💖')
  }

  const createConfetti = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    const confettiCount = 100

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.left = Math.random() * 100 + 'vw'
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 3 + 's'
      document.body.appendChild(confetti)

      setTimeout(() => confetti.remove(), 5000)
    }
  }

  // Get rarity color
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'rare': return 'from-blue-500 to-cyan-500'
      case 'uncommon': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  // Close fighting game, terminal, and love letter with ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showFightingGame) setShowFightingGame(false)
        if (showTerminal) setShowTerminal(false)
        if (showLoveLetter) setShowLoveLetter(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showFightingGame, showTerminal, showLoveLetter])

  return (
    <>
      {/* Fighting Game */}
      {showFightingGame && <FightingGame onClose={() => setShowFightingGame(false)} />}

      {/* Terminal */}
      {showTerminal && <Terminal onClose={() => setShowTerminal(false)} />}

      {/* Love Letter */}
      {showLoveLetter && <LoveLetter onClose={() => setShowLoveLetter(false)} />}

      {/* Achievement Unlocked Notification */}
      {showAchievement && (
        <div className="fixed top-20 right-4 z-[10000] animate-slide-in-right">
          <div className={`bg-gradient-to-r ${getRarityColor(showAchievement.rarity)} text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-white/30 backdrop-blur-xl`}>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 animate-bounce" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">{showAchievement.rarity} Achievement</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  <span>{showAchievement.icon}</span>
                  {showAchievement.name}
                </p>
                <p className="text-sm opacity-90">{showAchievement.description}</p>
              </div>
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
          </div>
        </div>
      )}

      {/* Achievement Gallery Button */}
      <button
        onClick={() => setShowAchievementGallery(!showAchievementGallery)}
        className="fixed bottom-4 left-4 z-[9999] bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 border-2 border-white/20"
        title="View Achievements"
      >
        <Trophy className="w-6 h-6" />
        {unlockedAchievements.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {unlockedAchievements.length}
          </span>
        )}
      </button>

      {/* Achievement Gallery Modal */}
      {showAchievementGallery && (
        <div className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Achievement Gallery</h2>
                  <p className="text-white/80 text-sm">{unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked</p>
                </div>
              </div>
              <button
                onClick={() => setShowAchievementGallery(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-800 p-4">
              <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                >
                  {Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id)
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isUnlocked
                          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-white/30 shadow-lg`
                          : 'bg-gray-800 border-gray-700 opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-4xl ${isUnlocked ? '' : 'grayscale opacity-30'}`}>
                          {isUnlocked ? achievement.icon : '🔒'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {isUnlocked ? (
                              <Unlock className="w-4 h-4 text-white" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-500" />
                            )}
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              isUnlocked ? 'text-white' : 'text-gray-500'
                            }`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                            {isUnlocked ? achievement.name : '???'}
                          </h3>
                          <p className={`text-sm ${isUnlocked ? 'text-white/90' : 'text-gray-600'}`}>
                            {isUnlocked ? achievement.description : 'Locked - Keep exploring!'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Completionist Reward - CEMAL.ONLINE KUPASI */}
              {unlockedAchievements.includes('completionist') && (
                <div className="mt-6 p-8 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl border-4 border-yellow-300 shadow-2xl relative overflow-hidden">
                  {/* Sparkle effects */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_60%)] animate-pulse"></div>

                  <div className="text-center relative z-10">
                    <div className="text-8xl mb-4 animate-bounce">🏆</div>
                    <h3 className="text-4xl font-black text-white mb-3 drop-shadow-lg">
                      CEMAL.ONLINE KUPASI!
                    </h3>
                    <p className="text-2xl font-bold text-white/90 mb-2">🎉 TEBRİKLER! 🎉</p>
                    <p className="text-lg text-white mb-4">Tüm 11 achievement'ı topladın!</p>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                      <p className="text-white font-bold text-xl mb-2">🎁 ÖZEL ÖDÜLLER:</p>
                      <div className="space-y-1 text-white/90">
                        <p>👑 Permanent God Mode Access</p>
                        <p>∞ Unlimited Everything</p>
                        <p>💎 Exclusive Trophy Badge</p>
                        <p>🌟 Master Status</p>
                      </div>
                    </div>

                    <p className="text-sm text-white/80">
                      Type "cxmxl" anytime for instant God Mode
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-white/20 backdrop-blur-xl">
            <span className="text-2xl animate-bounce">{showNotification.icon}</span>
            <div>
              <p className="font-bold">{showNotification.message}</p>
              <p className="text-xs opacity-80">Easter Egg Unlocked!</p>
            </div>
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
        </div>
      )}

      {/* Dev Mode Panel */}
      {devMode && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 backdrop-blur-xl text-green-400 font-mono text-xs p-4 rounded-xl border border-green-500/30 shadow-2xl max-w-sm animate-slide-in-left">
          <div className="flex items-center gap-2 mb-3 border-b border-green-500/30 pb-2">
            <Code className="w-4 h-4" />
            <span className="font-bold">DEVELOPER CONSOLE</span>
          </div>
          <div className="space-y-1">
            <p>⚡ React: 18.2.0</p>
            <p>🚀 Vite: 5.4.21</p>
            <p>🎨 Tailwind: 3.4.1</p>
            <p>📦 Build: Production</p>
            <p>🌐 URL: {window.location.href}</p>
            <p>⏱️ Uptime: {new Date().toLocaleTimeString()}</p>
            <p>💾 LocalStorage: {Object.keys(localStorage).length} items</p>
            <p>🔐 Cookies: {document.cookie ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="mt-3 pt-2 border-t border-green-500/30">
            <p className="text-yellow-400 animate-pulse">▶ Type 'cxmxl' for God Mode</p>
          </div>
        </div>
      )}

      {/* Global Easter Egg Styles */}
      <style jsx global>{`
        /* Matrix Mode */
        .matrix-mode {
          background: #000 !important;
        }

        .matrix-mode * {
          color: #0f0 !important;
          text-shadow: 0 0 5px #0f0 !important;
        }

        /* Party Mode */
        .party-mode {
          animation: rainbow-bg 2s linear infinite !important;
        }

        @keyframes rainbow-bg {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          z-index: 9999;
          animation: confetti-fall 5s linear forwards;
        }

        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Party Balloons */
        .party-balloon {
          position: fixed;
          bottom: -50px;
          z-index: 9998;
          animation: balloon-rise linear forwards;
        }

        @keyframes balloon-rise {
          0% {
            bottom: -50px;
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(30px) rotate(10deg);
          }
          100% {
            bottom: 110vh;
            transform: translateX(-20px) rotate(-10deg);
            opacity: 0;
          }
        }

        /* Rainbow Mode */
        .rainbow-mode * {
          animation: rainbow-text 3s linear infinite !important;
        }

        @keyframes rainbow-text {
          0% { color: #ff0000; }
          16% { color: #ff7f00; }
          33% { color: #ffff00; }
          50% { color: #00ff00; }
          66% { color: #0000ff; }
          83% { color: #8b00ff; }
          100% { color: #ff0000; }
        }

        /* Retro Mode */
        .retro-mode {
          image-rendering: pixelated !important;
          filter: contrast(150%) saturate(150%) sepia(30%) !important;
        }

        .retro-mode * {
          font-family: 'Courier New', monospace !important;
          text-shadow: 2px 2px 0 #000 !important;
        }

        @keyframes retro-flicker {
          0%, 100% { opacity: 0.97; }
          50% { opacity: 1; }
        }

        /* God Mode */
        .god-mode {
          animation: god-pulse 0.5s infinite alternate !important;
        }

        @keyframes god-pulse {
          0% {
            filter: brightness(1) saturate(1);
            transform: scale(1);
          }
          100% {
            filter: brightness(1.5) saturate(2) hue-rotate(360deg);
            transform: scale(1.02);
          }
        }

        .god-mode::before {
          content: '';
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center,
            rgba(255, 215, 0, 0.3) 0%,
            transparent 70%);
          pointer-events: none;
          z-index: 9998;
          animation: god-glow 2s ease-in-out infinite;
        }

        @keyframes god-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* God Mode Stars */
        .god-mode-star {
          position: fixed;
          z-index: 9997;
          animation: god-star-sparkle 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes god-star-sparkle {
          0%, 100% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes god-aura-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
        }

        /* Matrix Rain Mode */
        .matrix-rain-mode {
          position: relative;
        }

        /* Slide in animations */
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default EasterEggs
