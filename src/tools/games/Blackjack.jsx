import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { addGold, saveAchievement, getUserGoldBalance, deductGold } from '../../utils/digitalPassport'

const Blackjack = () => {
  const { language } = useLanguage()
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [playerScore, setPlayerScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)
  const [gameStatus, setGameStatus] = useState('betting') // betting, playing, dealer, finished
  const [message, setMessage] = useState('')
  const [bet, setBet] = useState(10)
  const [balance, setBalance] = useState(100)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)
  const [showDevilDeal, setShowDevilDeal] = useState(false)
  const [tempBalance, setTempBalance] = useState(0)
  const [challengeAccepted, setChallengeAccepted] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const translations = {
    en: {
      title: "Code Blackjack",
      subtitle: "Beat the dealer and win gold! 🃏",
      balance: "Balance",
      bet: "Bet",
      wins: "Wins",
      losses: "Losses",
      placeBet: "Place Bet",
      deal: "Deal",
      hit: "Hit",
      stand: "Stand",
      playAgain: "Play Again",
      dealer: "Dealer",
      player: "You",
      blackjack: "BLACKJACK! 🎉",
      youWin: "You Win! 🎊",
      youLose: "You Lose! 😞",
      push: "Push! (Tie)",
      bust: "BUST!",
      dealerTurn: "Dealer's Turn...",
      achievements: "Achievements",
      ach1: "Win 3 games in a row",
      ach2: "Get a Blackjack",
      ach3: "Win with 5 cards",
      betAmount: "Bet Amount",
      notEnough: "Not enough balance!",
      devilDeal: "Deal with the Devil",
      devilTitle: "Your soul for gold? 😈",
      devilText: "You're broke! I can give you 1,000 gold...",
      devilChallenge: "If you turn it into 2,000, I'll give you 50 REAL gold!",
      devilAccept: "Sell My Soul",
      devilReject: "No Thanks",
      challengeActive: "Devil's Challenge Active! 🔥",
      challengeProgress: "Turn 1,000 → 2,000 for 50 real gold!",
      challengeWon: "You won the challenge! +50 Real Gold! 🎉",
      challengeLost: "Challenge failed! Your soul is mine! 😈",
      leaderboard: "Leaderboard",
      rank: "Rank",
      playerName: "Player",
      highScore: "High Score",
      viewLeaderboard: "View Leaderboard",
      closeLeaderboard: "Close",
      waitForGold: "Wait for gold or play another game!",
      comingSoon: "Coming Soon",
      newHighScore: "New High Score! 🏆"
    },
    tr: {
      title: "Code Blackjack",
      subtitle: "Krupiyeleri yen ve altın kazan! 🃏",
      balance: "Bakiye",
      bet: "Bahis",
      wins: "Galibiyet",
      losses: "Mağlubiyet",
      placeBet: "Bahis Yap",
      deal: "Dağıt",
      hit: "Kart Çek",
      stand: "Dur",
      playAgain: "Tekrar Oyna",
      dealer: "Krupiye",
      player: "Sen",
      blackjack: "BLACKJACK! 🎉",
      youWin: "Kazandın! 🎊",
      youLose: "Kaybettin! 😞",
      push: "Berabere!",
      bust: "BATTIN!",
      dealerTurn: "Krupiyenin Sırası...",
      achievements: "Başarımlar",
      ach1: "Üst üste 3 oyun kazan",
      ach2: "Blackjack yap",
      ach3: "5 kartla kazan",
      betAmount: "Bahis Miktarı",
      notEnough: "Yetersiz bakiye!",
      devilDeal: "Şeytanla Anlaşma",
      devilTitle: "Ruhunu altına mı? 😈",
      devilText: "Meteliksizsin! Sana 1.000 altın verebilirim...",
      devilChallenge: "Bunu 2.000'e çıkarırsan, 50 GERÇEK altın vereceğim!",
      devilAccept: "Ruhumu Sat",
      devilReject: "Hayır Teşekkürler",
      challengeActive: "Şeytan Meydan Okuması Aktif! 🔥",
      challengeProgress: "1.000 → 2.000 yap, 50 gerçek altın kazan!",
      challengeWon: "Meydan okumayı kazandın! +50 Gerçek Altın! 🎉",
      challengeLost: "Başarısız oldun! Ruhun benim! 😈",
      leaderboard: "Lider Tablosu",
      rank: "Sıra",
      playerName: "Oyuncu",
      highScore: "En Yüksek Skor",
      viewLeaderboard: "Lider Tablosunu Gör",
      closeLeaderboard: "Kapat",
      waitForGold: "Altın için bekle veya başka oyun oyna!",
      comingSoon: "Yakında",
      newHighScore: "Yeni Rekor! 🏆"
    }
  }

  const t = translations[language]

  // Load balance from passport
  // Fetch leaderboard from API
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false)

  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true)
    try {
      const response = await fetch('/api/blackjack-leaderboard?action=get')
      const data = await response.json()
      if (data.success) {
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      // Fallback to localStorage
      const localLeaderboard = JSON.parse(localStorage.getItem('blackjack_leaderboard') || '[]')
      setLeaderboard(localLeaderboard)
    } finally {
      setIsLoadingLeaderboard(false)
    }
  }

  useEffect(() => {
    const goldBalance = getUserGoldBalance()
    if (goldBalance !== Infinity) {
      setBalance(goldBalance)
    } else {
      setBalance(999999) // Display large number for infinite
    }

    // Fetch leaderboard from API
    fetchLeaderboard()

    // Check for active challenge
    const savedChallenge = localStorage.getItem('blackjack_devil_challenge')
    if (savedChallenge) {
      const challenge = JSON.parse(savedChallenge)
      setChallengeAccepted(true)
      setTempBalance(challenge.balance)
      setBalance(challenge.balance)
    }
  }, [])

  // Check balance and show devil deal
  useEffect(() => {
    if (balance <= 0 && !challengeAccepted && gameStatus === 'betting') {
      setShowDevilDeal(true)
    }
  }, [balance, challengeAccepted, gameStatus])

  // Check challenge completion and update localStorage
  useEffect(() => {
    if (challengeAccepted) {
      // Update challenge balance in localStorage
      localStorage.setItem('blackjack_devil_challenge', JSON.stringify({ balance }))

      if (balance >= 2000) {
        // Challenge WON! Give real gold
        addGold(50)
        saveAchievement('blackjack_devil_won', 'Beat the Devil! +50 Real Gold!')
        setMessage(t.challengeWon)
        setChallengeAccepted(false)
        localStorage.removeItem('blackjack_devil_challenge')
        setTimeout(() => setMessage(''), 5000)
      } else if (balance <= 0) {
        // Challenge LOST
        setMessage(t.challengeLost)
        setChallengeAccepted(false)
        localStorage.removeItem('blackjack_devil_challenge')
        setTimeout(() => {
          setMessage('')
          setShowDevilDeal(true) // Offer again
        }, 3000)
      }
    }
  }, [balance, challengeAccepted, t])

  // Create and shuffle deck
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const newDeck = []

    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({ suit, value })
      }
    }

    // Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }

    return newDeck
  }

  // Calculate hand value
  const calculateScore = (hand) => {
    let score = 0
    let aces = 0

    for (let card of hand) {
      if (card.value === 'A') {
        aces++
        score += 11
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10
      } else {
        score += parseInt(card.value)
      }
    }

    while (score > 21 && aces > 0) {
      score -= 10
      aces--
    }

    return score
  }

  // Start new game
  const startGame = () => {
    if (bet > balance) {
      setMessage(t.notEnough)
      return
    }

    const newDeck = createDeck()
    const newPlayerHand = [newDeck.pop(), newDeck.pop()]
    const newDealerHand = [newDeck.pop(), newDeck.pop()]

    setDeck(newDeck)
    setPlayerHand(newPlayerHand)
    setDealerHand(newDealerHand)
    setPlayerScore(calculateScore(newPlayerHand))
    setDealerScore(calculateScore(newDealerHand))
    setGameStatus('playing')
    setMessage('')

    // Check for immediate blackjack
    const playerBJ = calculateScore(newPlayerHand) === 21
    const dealerBJ = calculateScore(newDealerHand) === 21

    if (playerBJ && dealerBJ) {
      setGameStatus('finished')
      setMessage(t.push)
    } else if (playerBJ) {
      setGameStatus('finished')
      setMessage(t.blackjack)
      const winAmount = bet * 2.5
      setBalance(b => {
        const newBalance = b + winAmount
        updateLeaderboard(newBalance)
        return newBalance
      })
      addGold(Math.floor(winAmount))
      setWins(w => w + 1)
      saveAchievement('blackjack_natural', 'Got a Natural Blackjack!')
      addGold(50)
    } else if (dealerBJ) {
      setGameStatus('finished')
      setMessage(`${t.dealer} ${t.blackjack}`)
      setBalance(b => b - bet)
      try { deductGold(bet) } catch (e) {}
      setLosses(l => l + 1)
    }
  }

  // Player hits
  const hit = () => {
    const newCard = deck.pop()
    const newPlayerHand = [...playerHand, newCard]
    const newScore = calculateScore(newPlayerHand)

    setPlayerHand(newPlayerHand)
    setPlayerScore(newScore)
    setDeck([...deck])

    if (newScore > 21) {
      setGameStatus('finished')
      setMessage(t.bust + ' ' + t.youLose)
      setBalance(b => b - bet)
      try { deductGold(bet) } catch (e) {}
      setLosses(l => l + 1)
    }
  }

  // Player stands - dealer's turn
  const stand = () => {
    setGameStatus('dealer')
    setMessage(t.dealerTurn)

    setTimeout(() => {
      let newDealerHand = [...dealerHand]
      let newDeck = [...deck]
      let newDealerScore = calculateScore(newDealerHand)

      while (newDealerScore < 17) {
        const newCard = newDeck.pop()
        newDealerHand.push(newCard)
        newDealerScore = calculateScore(newDealerHand)
      }

      setDealerHand(newDealerHand)
      setDealerScore(newDealerScore)
      setDeck(newDeck)

      // Determine winner
      const finalPlayerScore = calculateScore(playerHand)

      if (newDealerScore > 21) {
        setMessage(t.dealer + ' ' + t.bust + '! ' + t.youWin)
        const winAmount = bet * 2
        setBalance(b => {
          const newBalance = b + winAmount
          updateLeaderboard(newBalance)
          return newBalance
        })
        addGold(winAmount)
        setWins(w => w + 1)

        // Check for 5-card win
        if (playerHand.length === 5) {
          saveAchievement('blackjack_5cards', 'Won with 5 cards!')
          addGold(25)
        }
      } else if (newDealerScore > finalPlayerScore) {
        setMessage(t.youLose)
        setBalance(b => b - bet)
        try { deductGold(bet) } catch (e) {}
        setLosses(l => l + 1)
      } else if (newDealerScore < finalPlayerScore) {
        setMessage(t.youWin)
        const winAmount = bet * 2
        setBalance(b => {
          const newBalance = b + winAmount
          updateLeaderboard(newBalance)
          return newBalance
        })
        addGold(winAmount)
        setWins(w => {
          const newWins = w + 1
          if (newWins % 3 === 0) {
            saveAchievement('blackjack_streak', 'Won 3 in a row!')
            addGold(30)
          }
          return newWins
        })
      } else {
        setMessage(t.push)
      }

      setGameStatus('finished')
    }, 1000)
  }

  // Reset for new round
  const playAgain = () => {
    setGameStatus('betting')
    setPlayerHand([])
    setDealerHand([])
    setPlayerScore(0)
    setDealerScore(0)
    setMessage('')
  }

  // Accept devil's deal
  const acceptDevilDeal = () => {
    setBalance(1000)
    setTempBalance(1000)
    setChallengeAccepted(true)
    setShowDevilDeal(false)
    localStorage.setItem('blackjack_devil_challenge', JSON.stringify({ balance: 1000 }))
    setMessage(t.challengeActive)
    setTimeout(() => setMessage(''), 3000)
  }

  // Reject devil's deal
  const rejectDevilDeal = () => {
    setShowDevilDeal(false)
    setMessage(t.waitForGold)
  }

  // Update leaderboard
  const updateLeaderboard = async (score) => {
    const passport = JSON.parse(localStorage.getItem('digital_passport'))
    const playerName = passport?.username || 'Anonymous'
    const passportId = passport?.id

    if (!passportId) {
      // Fallback to localStorage if no passport
      const localLeaderboard = JSON.parse(localStorage.getItem('blackjack_leaderboard') || '[]')
      localLeaderboard.push({
        name: playerName,
        score: score,
        date: new Date().toISOString()
      })
      localLeaderboard.sort((a, b) => b.score - a.score)
      const top10 = localLeaderboard.slice(0, 10)
      localStorage.setItem('blackjack_leaderboard', JSON.stringify(top10))
      return
    }

    try {
      // Update API leaderboard
      const response = await fetch('/api/blackjack-leaderboard?action=update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Passport-ID': passportId
        },
        body: JSON.stringify({
          score,
          username: playerName
        })
      })

      const data = await response.json()
      if (data.success && data.isNewRecord) {
        // Refresh leaderboard
        await fetchLeaderboard()

        // Show celebration message
        setTimeout(() => {
          setMessage(t.newHighScore || 'New High Score! 🏆')
        }, 1000)
      }
    } catch (error) {
      console.error('Error updating leaderboard:', error)
      // Fallback to localStorage
      const localLeaderboard = JSON.parse(localStorage.getItem('blackjack_leaderboard') || '[]')
      localLeaderboard.push({
        name: playerName,
        score: score,
        date: new Date().toISOString()
      })
      localLeaderboard.sort((a, b) => b.score - a.score)
      const top10 = localLeaderboard.slice(0, 10)
      localStorage.setItem('blackjack_leaderboard', JSON.stringify(top10))
    }
  }

  // Get card color
  const getCardColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900'
  }

  // Render card component with animations
  const Card = ({ card, isHidden = false, delay = 0 }) => {
    if (isHidden) {
      return (
        <div
          className="w-24 h-36 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-2xl flex items-center justify-center relative overflow-hidden transform hover:scale-105 transition-all duration-300 animate-card-flip"
          style={{ animationDelay: `${delay}ms` }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          <span className="text-4xl text-white font-bold opacity-50">🂠</span>
        </div>
      )
    }

    const isAce = card.value === 'A'
    const isFaceCard = ['J', 'Q', 'K'].includes(card.value)

    return (
      <div
        className="w-24 h-36 bg-white rounded-xl shadow-2xl relative overflow-hidden transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 group animate-card-flip"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Card Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Corner Values */}
        <div className={`absolute top-2 left-2 text-sm font-bold ${getCardColor(card.suit)}`}>
          <div className="leading-none">{card.value}</div>
          <div className="text-lg leading-none">{card.suit}</div>
        </div>
        <div className={`absolute bottom-2 right-2 text-sm font-bold ${getCardColor(card.suit)} rotate-180`}>
          <div className="leading-none">{card.value}</div>
          <div className="text-lg leading-none">{card.suit}</div>
        </div>

        {/* Center Design */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isAce ? (
            // Cemal.online Logo for Ace
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                C
              </div>
              <div className="text-xs font-semibold text-gray-600">cemal.online</div>
              <div className={`text-3xl mt-1 ${getCardColor(card.suit)}`}>{card.suit}</div>
            </div>
          ) : isFaceCard ? (
            // Face cards
            <div className="text-center">
              <div className={`text-5xl font-bold ${getCardColor(card.suit)}`}>
                {card.value}
              </div>
              <div className={`text-4xl ${getCardColor(card.suit)}`}>{card.suit}</div>
            </div>
          ) : (
            // Number cards
            <div className={`text-5xl font-bold ${getCardColor(card.suit)}`}>
              {card.suit}
            </div>
          )}
        </div>

        {/* Glossy effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/tools"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Tools</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t.title}
          </h1>
          <p className="text-gray-300">{t.subtitle}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4">
            <div className="text-xs text-yellow-300 uppercase tracking-wide">{t.balance}</div>
            <div className="text-2xl font-bold text-yellow-400">{balance} 🪙</div>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4">
            <div className="text-xs text-blue-300 uppercase tracking-wide">{t.bet}</div>
            <div className="text-2xl font-bold text-blue-400">{bet}</div>
          </div>
          <div className="bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-4">
            <div className="text-xs text-green-300 uppercase tracking-wide">{t.wins}</div>
            <div className="text-2xl font-bold text-green-400">{wins}</div>
          </div>
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
            <div className="text-xs text-red-300 uppercase tracking-wide">{t.losses}</div>
            <div className="text-2xl font-bold text-red-400">{losses}</div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-green-800/50 backdrop-blur-xl border-4 border-yellow-600/50 rounded-2xl p-8 mb-6">
          {/* Dealer's Hand */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>{t.dealer}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-lg">
                {gameStatus === 'betting' || gameStatus === 'playing' ? '?' : dealerScore}
              </span>
            </h3>
            <div className="flex gap-4 flex-wrap perspective-1000">
              {dealerHand.map((card, i) => (
                <Card
                  key={i}
                  card={card}
                  isHidden={gameStatus === 'playing' && i === 1}
                  delay={i * 100}
                />
              ))}
            </div>
          </div>

          {/* Player's Hand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>{t.player}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-lg">{playerScore}</span>
            </h3>
            <div className="flex gap-4 flex-wrap perspective-1000">
              {playerHand.map((card, i) => (
                <Card key={i} card={card} delay={i * 100} />
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-8 text-center animate-bounce-in">
              <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl transform hover:scale-105 transition-transform">
                {message}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          {gameStatus === 'betting' && (
            <div className="space-y-4">
              <div>
                <label className="text-white mb-2 block">{t.betAmount}</label>
                <input
                  type="range"
                  min="10"
                  max={Math.min(balance, 5000)}
                  step="10"
                  value={bet}
                  onChange={(e) => setBet(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-white mt-2 text-xl font-bold">{bet} 🪙 Gold</div>
              </div>
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-4 rounded-xl hover:shadow-lg transition-all"
              >
                {t.deal}
              </button>
            </div>
          )}

          {gameStatus === 'playing' && (
            <div className="flex gap-4">
              <button
                onClick={hit}
                className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all"
              >
                {t.hit}
              </button>
              <button
                onClick={stand}
                className="flex-1 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all"
              >
                {t.stand}
              </button>
            </div>
          )}

          {gameStatus === 'finished' && (
            <button
              onClick={playAgain}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {t.playAgain}
            </button>
          )}
        </div>

        {/* Achievements */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t.achievements}
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>🏆 {t.ach1} (+30 Gold)</p>
            <p>🎯 {t.ach2} (+50 Gold)</p>
            <p>🃏 {t.ach3} (+25 Gold)</p>
          </div>
        </div>

        {/* Leaderboard Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            {t.viewLeaderboard}
          </button>
        </div>

        {/* Multiplayer Coming Soon */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">🎮 Multiplayer</h3>
          <p className="text-gray-400">{t.comingSoon}</p>
        </div>

        {/* Branding */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>Powered by Cemal AI Gaming 🎮</p>
        </div>
      </div>

      {/* Devil's Deal Popup */}
      {showDevilDeal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-bounce-in">
          <div className="bg-gradient-to-br from-red-950 via-gray-900 to-black border-4 border-red-600/50 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-pulse-slow">
            {/* Fire Effect */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce-subtle">😈</div>
              <h2 className="text-3xl font-bold text-red-500 mb-2">{t.devilTitle}</h2>
              <div className="text-red-300 text-lg mb-4">{t.devilText}</div>
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-4">
                <p className="text-yellow-300 font-bold">{t.devilChallenge}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={acceptDevilDeal}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 rounded-xl hover:from-red-500 hover:to-orange-500 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                🔥 {t.devilAccept}
              </button>
              <button
                onClick={rejectDevilDeal}
                className="w-full bg-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-600 transition-all"
              >
                {t.devilReject}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Progress Banner */}
      {challengeAccepted && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 animate-slide-up">
          <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-yellow-300">
            <div className="text-center">
              <p className="font-bold text-lg">{t.challengeActive}</p>
              <p className="text-sm opacity-90">{t.challengeProgress}</p>
              <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${Math.min((balance / 2000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1">{balance} / 2000 🪙</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-bounce-in">
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-4 border-purple-500/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-12 h-12 text-yellow-500" />
                <h2 className="text-4xl font-bold text-white">{t.leaderboard}</h2>
              </div>
              <p className="text-gray-300">Top 10 Blackjack Champions</p>
            </div>

            {/* Leaderboard Table */}
            <div className="space-y-2 mb-6">
              {isLoadingLeaderboard ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="animate-spin text-4xl mb-2">⏳</div>
                  <p>Loading leaderboard...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl">No scores yet!</p>
                  <p className="text-sm mt-2">Be the first to make it to the leaderboard!</p>
                </div>
              ) : (
                leaderboard.map((entry, index) => {
                  const passport = JSON.parse(localStorage.getItem('digital_passport'))
                  const currentPlayer = passport?.username || 'Anonymous'
                  const isCurrentPlayer = entry.name === currentPlayer
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        isCurrentPlayer
                          ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border-2 border-yellow-500'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl w-12 text-center">{medal}</span>
                        <div>
                          <p className="text-white font-bold">{entry.name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-400">{entry.score} 🪙</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowLeaderboard(false)}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all"
            >
              {t.closeLeaderboard}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blackjack
