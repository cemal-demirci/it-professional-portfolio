import { useState, useEffect, useRef } from 'react'
import { Zap, Shield, Skull, Heart } from 'lucide-react'

const FightingGame = ({ onClose }) => {
  const [playerHealth, setPlayerHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [playerAction, setPlayerAction] = useState('idle')
  const [enemyAction, setEnemyAction] = useState('idle')
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState(null)
  const [combo, setCombo] = useState(0)
  const [message, setMessage] = useState('')
  const [playerBlocking, setPlayerBlocking] = useState(false)
  const gameLoopRef = useRef(null)

  // Sound effects using Web Audio API
  const playSound = (frequency, duration) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'square'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }

  // Komik mesajlar
  const funnyMessages = {
    hit: [
      '💥 OOOF!',
      '😵 AĞĞĞH!',
      '🤕 AUUU!',
      '💀 R.I.P.',
      '🩹 Acıdı lan!',
      '😭 Annem!',
      '🤬 Hadi bee!',
      '🙈 Görmedim bile!',
      '😤 Haksızlık!',
      '🥴 Kafam döndü!'
    ],
    blocked: [
      '🛡️ BLOK!',
      '💪 Olmadı!',
      '🙅 Geçilmez!',
      '🧱 Duvar gibi!',
      '😎 Sen de dene!',
      '🤓 Görmüş müyüm?',
      '🦾 Demir gibi!',
      '🚫 Red!',
      '⛔ Yasak!',
      '🎯 Miss!'
    ],
    special: [
      '🔥 ULTRA COMBO!',
      '⚡ HADOUKEN!',
      '💫 KAMEHAMEHA!',
      '🌪️ TORNADO KICK!',
      '👊 FALCON PUNCH!',
      '🗡️ SONIC BOOM!',
      '💎 DIAMOND CRUSH!',
      '🌟 SHORYUKEN!',
      '🔮 MYSTIC POWER!',
      '👑 FATALITY!'
    ]
  }

  const showMessage = (msg, type = 'hit') => {
    // Eğer HIT, BLOCKED, SPECIAL gibi default mesajlarsa, komik versiyonunu göster
    let displayMsg = msg

    if (msg.includes('HIT')) {
      displayMsg = funnyMessages.hit[Math.floor(Math.random() * funnyMessages.hit.length)]
    } else if (msg.includes('BLOCKED')) {
      displayMsg = funnyMessages.blocked[Math.floor(Math.random() * funnyMessages.blocked.length)]
    } else if (msg.includes('SPECIAL')) {
      displayMsg = funnyMessages.special[Math.floor(Math.random() * funnyMessages.special.length)]
    }

    setMessage(displayMsg)
    setTimeout(() => setMessage(''), 1500)
  }

  // Player attacks
  const attack = () => {
    if (gameOver || playerAction !== 'idle') return

    setPlayerAction('attack')
    playSound(200, 0.1)

    setTimeout(() => {
      if (enemyAction !== 'block') {
        const damage = 10 + Math.random() * 10
        setEnemyHealth(prev => Math.max(0, prev - damage))
        setCombo(prev => prev + 1)
        playSound(150, 0.2)
        showMessage(`HIT! -${Math.round(damage)} HP`)
      } else {
        showMessage('BLOCKED!')
        playSound(100, 0.1)
      }
      setPlayerAction('idle')
    }, 300)
  }

  const specialAttack = () => {
    if (gameOver || playerAction !== 'idle' || combo < 3) return

    setPlayerAction('special')
    playSound(300, 0.3)

    setTimeout(() => {
      const damage = 25 + Math.random() * 15
      setEnemyHealth(prev => Math.max(0, prev - damage))
      setCombo(0)
      playSound(400, 0.4)
      showMessage(`SPECIAL! -${Math.round(damage)} HP`)
      setPlayerAction('idle')
    }, 500)
  }

  const block = () => {
    if (gameOver) return
    setPlayerAction('block')
    setPlayerBlocking(true)
    playSound(120, 0.15)
    setTimeout(() => {
      setPlayerAction('idle')
      setPlayerBlocking(false)
    }, 1000)
  }

  // Enemy AI
  useEffect(() => {
    if (gameOver) return

    const enemyAI = setInterval(() => {
      const random = Math.random()

      if (random < 0.4) {
        // Enemy attacks
        setEnemyAction('attack')
        playSound(180, 0.1)

        setTimeout(() => {
          if (!playerBlocking) {
            const damage = 8 + Math.random() * 8
            setPlayerHealth(prev => Math.max(0, prev - damage))
            playSound(130, 0.2)
          }
          setEnemyAction('idle')
        }, 400)
      } else if (random < 0.6 && enemyHealth < 30) {
        // Enemy blocks when low health
        setEnemyAction('block')
        setTimeout(() => setEnemyAction('idle'), 800)
      } else if (random < 0.75 && enemyHealth > 50) {
        // Enemy special attack
        setEnemyAction('special')
        playSound(280, 0.3)

        setTimeout(() => {
          if (!playerBlocking) {
            const damage = 20 + Math.random() * 10
            setPlayerHealth(prev => Math.max(0, prev - damage))
            playSound(350, 0.4)
          }
          setEnemyAction('idle')
        }, 600)
      }
    }, 2000 + Math.random() * 1000)

    gameLoopRef.current = enemyAI
    return () => clearInterval(enemyAI)
  }, [gameOver, playerBlocking, enemyHealth])

  // Check game over
  useEffect(() => {
    if (playerHealth <= 0) {
      setGameOver(true)
      setWinner('enemy')
      playSound(100, 1)
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    } else if (enemyHealth <= 0) {
      setGameOver(true)
      setWinner('player')
      playSound(500, 1)
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [playerHealth, enemyHealth])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return

      switch (e.key.toLowerCase()) {
        case 'a':
          attack()
          break
        case 's':
          specialAttack()
          break
        case 'd':
          block()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver, playerAction, combo])

  return (
    <div className="fixed inset-0 z-[10001] bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold z-10"
      >
        EXIT (ESC)
      </button>

      {/* Game Arena */}
      <div className="w-full max-w-6xl mx-4">
        {/* Top HUD */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            {/* Player Health */}
            <div className="w-5/12">
              <div className="flex items-center justify-between mb-2">
                <span className="text-yellow-400 font-bold text-xl">PLAYER</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(playerHealth / 20) }).map((_, i) => (
                    <Heart key={i} className="w-5 h-5 text-red-500 fill-red-500" />
                  ))}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg h-8 overflow-hidden border-2 border-yellow-500">
                <div
                  className="bg-gradient-to-r from-green-500 to-yellow-500 h-full transition-all duration-300 flex items-center justify-center font-bold text-white"
                  style={{ width: `${playerHealth}%` }}
                >
                  {Math.round(playerHealth)}
                </div>
              </div>
            </div>

            {/* Center */}
            <div className="w-2/12 text-center">
              <div className="text-white font-bold text-3xl mb-2">VS</div>
              {combo >= 3 && (
                <div className="text-yellow-400 font-bold animate-pulse">
                  SPECIAL READY!
                </div>
              )}
            </div>

            {/* Enemy Health */}
            <div className="w-5/12">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(enemyHealth / 20) }).map((_, i) => (
                    <Heart key={i} className="w-5 h-5 text-red-500 fill-red-500" />
                  ))}
                </div>
                <span className="text-red-400 font-bold text-xl">ENEMY</span>
              </div>
              <div className="bg-gray-800 rounded-lg h-8 overflow-hidden border-2 border-red-500">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-300 flex items-center justify-center font-bold text-white ml-auto"
                  style={{ width: `${enemyHealth}%` }}
                >
                  {Math.round(enemyHealth)}
                </div>
              </div>
            </div>
          </div>

          {/* Combo Counter */}
          {combo > 0 && (
            <div className="text-center text-yellow-400 font-bold text-2xl animate-bounce">
              {combo}x COMBO!
            </div>
          )}
        </div>

        {/* Fighting Arena */}
        <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-xl border-4 border-yellow-600 h-80 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,215,0,0.1)_1px,transparent_1px),linear-gradient(rgba(255,215,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {/* Floor */}
          <div className="absolute bottom-0 w-full h-2 bg-gradient-to-r from-yellow-600 to-orange-600" />

          {/* Player Character */}
          <div className="absolute bottom-20 left-20">
            <div className={`text-8xl transition-all duration-200 ${
              playerAction === 'attack' ? 'translate-x-8' :
              playerAction === 'special' ? 'scale-125 animate-spin' :
              playerAction === 'block' ? 'opacity-50' : ''
            }`}>
              🥋
            </div>
            <div className="text-center text-yellow-400 font-bold mt-2">YOU</div>
          </div>

          {/* Enemy Character */}
          <div className="absolute bottom-20 right-20">
            <div className={`text-8xl transition-all duration-200 ${
              enemyAction === 'attack' ? '-translate-x-8' :
              enemyAction === 'special' ? 'scale-125 animate-spin' :
              enemyAction === 'block' ? 'opacity-50' : ''
            }`}>
              👹
            </div>
            <div className="text-center text-red-400 font-bold mt-2">AI</div>
          </div>

          {/* Action Message */}
          {message && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-6xl animate-ping">
              {message}
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {winner === 'player' ? '🏆' : '💀'}
                </div>
                <h2 className={`text-6xl font-bold mb-4 ${
                  winner === 'player' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {winner === 'player' ? 'VICTORY!' : 'DEFEAT!'}
                </h2>
                <p className="text-white mb-6">
                  {winner === 'player' ? 'You are the champion!' : 'Better luck next time!'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:scale-110 transition-transform"
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={attack}
            disabled={gameOver || playerAction !== 'idle'}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Zap className="w-6 h-6" />
            ATTACK (A)
          </button>
          <button
            onClick={specialAttack}
            disabled={gameOver || playerAction !== 'idle' || combo < 3}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Skull className="w-6 h-6" />
            SPECIAL (S)
          </button>
          <button
            onClick={block}
            disabled={gameOver}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Shield className="w-6 h-6" />
            BLOCK (D)
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          Use keyboard: A = Attack | S = Special (3 combo) | D = Block
        </div>
      </div>
    </div>
  )
}

export default FightingGame
