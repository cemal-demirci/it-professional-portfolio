import { useState, useEffect, useRef } from 'react'
import { Zap, Shield, Skull, Heart, Brain, Lock, Trophy } from 'lucide-react'
import { rewardGold as rewardGoldService } from '../services/goldService'

const FightingGame = ({ onClose }) => {
  // Game states
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

  // Puzzle states
  const [puzzleMode, setPuzzleMode] = useState(true)
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [puzzleAnswer, setPuzzleAnswer] = useState('')
  const [puzzlesSolved, setPuzzlesSolved] = useState(0)
  const [puzzleError, setPuzzleError] = useState('')
  const [selectedPuzzles, setSelectedPuzzles] = useState([])

  // Gold reward states
  const [goldRewarded, setGoldRewarded] = useState(false)
  const [showGoldReward, setShowGoldReward] = useState(false)

  // Puzzle database - rastgele 3 tanesi seçilecek
  const puzzles = [
    {
      question: "🧮 Matematik: 7 × 8 + 12 - 5 = ?",
      answer: "63",
      hint: "Önce çarpma, sonra toplama, en son çıkarma"
    },
    {
      question: "🔢 Dizi: 2, 4, 8, 16, __ ?",
      answer: "32",
      hint: "Her sayı bir öncekinin 2 katı"
    },
    {
      question: "🧩 Mantık: Bir kelimede 5 harf var, ilk 2 harfi 'CE' ise ve IT ile ilgiliyse, bu site?",
      answer: "CEMAL",
      hint: "Bu sitenin sahibinin adı..."
    },
    {
      question: "💻 Kod: Binary '1010' = Decimal ?",
      answer: "10",
      hint: "8+0+2+0 = ?"
    },
    {
      question: "🎯 Matematik: 3³ + 5² - 10 = ?",
      answer: "42",
      hint: "27 + 25 - 10"
    },
    {
      question: "🔐 Şifre: 'CEMAL'.length + 'AI'.length = ?",
      answer: "7",
      hint: "Harf sayılarını topla"
    },
    {
      question: "🎲 Sıra: 1, 1, 2, 3, 5, 8, __ ?",
      answer: "13",
      hint: "Fibonacci: son iki sayıyı topla"
    },
    {
      question: "⚡ Hız: 100 krediye 3 soru sorabiliyorsan, 1 sorunun maliyeti?",
      answer: "33",
      hint: "100 / 3 = ?"
    }
  ]

  // Select 3 random puzzles on mount
  useEffect(() => {
    const shuffled = [...puzzles].sort(() => Math.random() - 0.5)
    setSelectedPuzzles(shuffled.slice(0, 3))
  }, [])

  // Sound effects using Web Audio API
  const playSound = (frequency, duration) => {
    try {
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
    } catch (error) {
      console.log('Audio not supported')
    }
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

  // Puzzle handling
  const handlePuzzleSubmit = (e) => {
    e.preventDefault()

    if (!selectedPuzzles[currentPuzzleIndex]) return

    const correctAnswer = selectedPuzzles[currentPuzzleIndex].answer.toLowerCase().trim()
    const userAnswer = puzzleAnswer.toLowerCase().trim()

    if (userAnswer === correctAnswer) {
      playSound(400, 0.3)
      setPuzzlesSolved(prev => prev + 1)
      setPuzzleError('')
      setPuzzleAnswer('')

      if (currentPuzzleIndex < 2) {
        // Next puzzle
        setTimeout(() => {
          setCurrentPuzzleIndex(prev => prev + 1)
        }, 500)
      } else {
        // All puzzles solved, start game
        setTimeout(() => {
          setPuzzleMode(false)
        }, 1000)
      }
    } else {
      playSound(100, 0.2)
      setPuzzleError('❌ Yanlış! Tekrar dene.')
      setTimeout(() => setPuzzleError(''), 2000)
    }
  }

  // Reward Gold when player wins
  const rewardGold = async () => {
    if (goldRewarded) return

    try {
      const result = await rewardGoldService(1, 'Fighting Game Victory')

      if (result.success) {
        setGoldRewarded(true)
        setShowGoldReward(true)
        playSound(600, 0.5)

        setTimeout(() => {
          setShowGoldReward(false)
        }, 5000)
      }
    } catch (error) {
      console.error('Gold reward error:', error)
    }
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
    if (gameOver || puzzleMode) return

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
  }, [gameOver, playerBlocking, enemyHealth, puzzleMode])

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

      // Reward Gold for victory
      setTimeout(() => {
        rewardGold()
      }, 1500)
    }
  }, [playerHealth, enemyHealth])

  // Keyboard controls
  useEffect(() => {
    if (gameOver || puzzleMode) return

    const handleKeyPress = (e) => {
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
  }, [gameOver, playerAction, combo, puzzleMode])

  // Puzzle screen
  if (puzzleMode) {
    const currentPuzzle = selectedPuzzles[currentPuzzleIndex]

    if (!currentPuzzle) {
      return <div className="fixed inset-0 z-[10001] bg-black flex items-center justify-center">
        <div className="text-white">Loading puzzles...</div>
      </div>
    }

    return (
      <div className="fixed inset-0 z-[10001] bg-gradient-to-br from-purple-900 via-black to-indigo-900 flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-bold z-10"
        >
          EXIT (ESC)
        </button>

        <div className="max-w-2xl mx-4 w-full">
          {/* Progress */}
          <div className="mb-8 flex justify-center gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-4 transition-all ${
                  i < puzzlesSolved
                    ? 'bg-green-500 border-green-300'
                    : i === currentPuzzleIndex
                    ? 'bg-yellow-500 border-yellow-300 animate-pulse'
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                {i < puzzlesSolved ? '✓' : i + 1}
              </div>
            ))}
          </div>

          {/* Puzzle card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-black text-white">
                Bulmaca {currentPuzzleIndex + 1}/3
              </h2>
            </div>

            <div className="bg-black/30 rounded-xl p-6 mb-6">
              <p className="text-white text-2xl font-bold text-center">
                {currentPuzzle.question}
              </p>
            </div>

            <form onSubmit={handlePuzzleSubmit} className="space-y-4">
              <input
                type="text"
                value={puzzleAnswer}
                onChange={(e) => setPuzzleAnswer(e.target.value)}
                placeholder="Cevabını buraya yaz..."
                className="w-full px-6 py-4 bg-white/20 border-2 border-purple-500/50 rounded-xl text-white text-xl font-bold placeholder-gray-400 focus:outline-none focus:border-purple-400"
                autoFocus
              />

              {puzzleError && (
                <div className="text-red-400 text-center font-bold text-lg animate-pulse">
                  {puzzleError}
                </div>
              )}

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
                <p className="text-blue-300 text-sm">
                  💡 İpucu: {currentPuzzle.hint}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-lg"
              >
                <Lock className="w-6 h-6 inline mr-2" />
                CEVABI KONTROL ET
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
              🎮 Tüm bulmaçları çöz ve dövüş oyununu kazan = +1 Gold! 💰
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Fighting game screen
  return (
    <div className="fixed inset-0 z-[10001] bg-black flex items-center justify-center">
      {/* Gold Reward Notification */}
      {showGoldReward && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl border-4 border-yellow-300">
            <Trophy className="w-8 h-8 inline mr-2" />
            +1 GOLD KAZANDIN! 💰
          </div>
        </div>
      )}

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
                  {winner === 'player'
                    ? goldRewarded
                      ? '🎉 Tebrikler! +1 Gold kazandın!'
                      : 'Harika! Ödülün yolda...'
                    : 'Better luck next time!'}
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
