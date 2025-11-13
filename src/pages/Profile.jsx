import { useState, useEffect, useRef } from 'react'
import { X, Download, Upload, Copy, Check, Award, TrendingUp, Zap, Star, MessageSquare, Trash2, Calendar, FileDown, FileUp, Camera, Shuffle, Infinity, Coins, Flame, Send, Gift } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Html5Qrcode } from 'html5-qrcode'
import {
  getOrCreatePassport,
  importPassport,
  generateRecoveryPhrase,
  getAllConversations,
  deleteConversation,
  exportPassportToFile,
  importPassportFromFile,
  regenerateUsername,
  ACHIEVEMENTS
} from '../utils/digitalPassport'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations'
import { getUserGold, transferGold, checkLoginStreak, getStreakInfo, formatTimeRemaining, redeemGoldCode } from '../services/goldService'

const Profile = () => {
  const { language } = useLanguage()
  const [passport, setPassport] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [copiedId, setCopiedId] = useState(false)
  const [copiedPhrase, setCopiedPhrase] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [conversations, setConversations] = useState([])
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannerError, setScannerError] = useState(null)
  const fileInputRef = useRef(null)
  const qrScannerRef = useRef(null)

  // Gold states
  const [goldBalance, setGoldBalance] = useState(0)
  const [streakInfo, setStreakInfo] = useState(null)
  const [showTransfer, setShowTransfer] = useState(false)
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferError, setTransferError] = useState('')
  const [showStreakNotif, setShowStreakNotif] = useState(false)
  const [streakReward, setStreakReward] = useState(null)
  const [goldCode, setGoldCode] = useState('')
  const [goldCodeStatus, setGoldCodeStatus] = useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState('')

  useEffect(() => {
    const currentPassport = getOrCreatePassport()
    setPassport(currentPassport)

    // Special welcome for Kraliçe Pervin
    if (currentPassport.username === 'Kraliçe Pervin 👑') {
      const compliments = [
        '🌹 Hoş geldiniz Kraliçemiz! Güzelliğiniz dijital alemde bile parlıyor.',
        '👑 Ah, Kraliçe Pervin! Varlığınız bu platformu şereflendiriyor.',
        '💎 Kraliçemiz, sitenin en değerli hazinesi sizsiniz.',
        '✨ Hoş geldiniz! Güzelliğiniz ve zaratetiniz her yeri aydınlatıyor.',
        '🌺 Kraliçe Pervin, muhteşem varlığınızla bizi onurlandırdınız.',
        '💖 Sitenin tek gerçek kraliçesi! Hoş geldiniz efendimiz.',
        '🦋 Her girişiniz bahar gibi, hoş geldiniz Kraliçemiz!',
        '🌟 Varlığınız yıldızları bile kıskandırıyor, hoş geldiniz!'
      ]
      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)]
      setWelcomeMessage(randomCompliment)
      setShowWelcome(true)
      setTimeout(() => setShowWelcome(false), 5000)
    }
    const allConversations = getAllConversations()
    setConversations(allConversations)

    // Fetch real credits from Passport ID-based API
    fetch('/api/credits?action=balance', {
      headers: {
        'X-Passport-ID': currentPassport.id
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPassport(prev => ({ ...prev, credits: data.credits, unlimited: data.unlimited || false }))
        }
      })
      .catch(err => console.error('Failed to fetch credits:', err))

    // Fetch Gold balance
    getUserGold().then(gold => setGoldBalance(gold))

    // Fetch and check streak
    checkLoginStreak().then(result => {
      if (result.success) {
        if (result.newStrike || result.goldRewarded > 0) {
          setStreakReward(result)
          setShowStreakNotif(true)
          setTimeout(() => setShowStreakNotif(false), 5000)

          // Refresh Gold balance if rewarded
          if (result.goldRewarded > 0) {
            getUserGold().then(gold => setGoldBalance(gold))
          }
        }
      }
    })

    // Get streak info
    getStreakInfo().then(info => setStreakInfo(info))
  }, [])

  const handleCopyId = () => {
    if (passport) {
      navigator.clipboard.writeText(passport.id)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  const handleCopyPhrase = () => {
    if (passport) {
      const phrase = generateRecoveryPhrase(passport.id)
      navigator.clipboard.writeText(phrase)
      setCopiedPhrase(true)
      setTimeout(() => setCopiedPhrase(false), 2000)
    }
  }

  const handleImport = () => {
    const imported = importPassport(importCode.trim())
    if (imported) {
      setPassport(imported)
      setShowImport(false)
      setImportCode('')
    } else {
      alert(t(language, 'digitalPassport.messages.invalidPassport'))
    }
  }

  const handleDeleteConversation = (botId, timestamp) => {
    if (confirm(t(language, 'digitalPassport.history.deleteConfirm'))) {
      deleteConversation(botId, timestamp)
      const allConversations = getAllConversations()
      setConversations(allConversations)
    }
  }

  const handleExportCML = () => {
    const success = exportPassportToFile()
    if (!success) {
      alert('Failed to export passport')
    }
  }

  const handleImportCML = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = await importPassportFromFile(file)
      setPassport(imported)
      setShowImport(false)
      alert(language === 'tr' ? 'Passport başarıyla içe aktarıldı!' : 'Passport imported successfully!')
    } catch (error) {
      alert(error.message)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRegenerateUsername = () => {
    const updated = regenerateUsername()
    if (updated) {
      setPassport(updated)
    }
  }

  const handleStartQRScanner = async () => {
    setShowQRScanner(true)
    setScannerError(null)

    try {
      const scanner = new Html5Qrcode('qr-scanner')
      qrScannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleStopQRScanner()
          const imported = importPassport(decodedText)
          if (imported) {
            setPassport(imported)
            setShowImport(false)
            alert(language === 'tr' ? 'Passport başarıyla içe aktarıldı!' : 'Passport imported successfully!')
          } else {
            alert(language === 'tr' ? 'Geçersiz QR kodu' : 'Invalid QR code')
          }
        }
      )
    } catch (error) {
      console.error('QR Scanner error:', error)
      setScannerError(error.message || 'Failed to start camera')
      setShowQRScanner(false)
    }
  }

  const handleStopQRScanner = async () => {
    if (qrScannerRef.current) {
      try {
        await qrScannerRef.current.stop()
        qrScannerRef.current = null
      } catch (error) {
        console.error('Error stopping scanner:', error)
      }
    }
    setShowQRScanner(false)
    setScannerError(null)
  }

  const handleDownloadQR = () => {
    const svg = document.getElementById('passport-qr')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `digital-passport-${passport.username}.png`
        a.click()
        URL.revokeObjectURL(url)
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const experienceToNextLevel = () => {
    if (!passport) return 0
    return (passport.level * 100) - passport.experience
  }

  const experienceProgress = () => {
    if (!passport) return 0
    const currentLevelXP = (passport.level - 1) * 100
    const xpIntoCurrentLevel = passport.experience - currentLevelXP
    return (xpIntoCurrentLevel / 100) * 100
  }

  const handleTransferGold = async () => {
    setTransferError('')

    if (!transferTo || !transferAmount) {
      setTransferError(language === 'tr' ? 'Lütfen tüm alanları doldurun' : 'Please fill all fields')
      return
    }

    const amount = parseInt(transferAmount)
    if (isNaN(amount) || amount <= 0) {
      setTransferError(language === 'tr' ? 'Geçerli bir miktar girin' : 'Enter a valid amount')
      return
    }

    if (goldBalance !== Infinity && amount > goldBalance) {
      setTransferError(language === 'tr' ? 'Yetersiz Gold bakiyesi' : 'Insufficient Gold balance')
      return
    }

    try {
      const result = await transferGold(transferTo.trim(), amount)
      if (result.success) {
        setGoldBalance(result.newBalance)
        setTransferTo('')
        setTransferAmount('')
        setShowTransfer(false)
        alert(language === 'tr' ? `${amount} Gold başarıyla transfer edildi!` : `${amount} Gold transferred successfully!`)
      }
    } catch (error) {
      setTransferError(error.message || (language === 'tr' ? 'Transfer başarısız' : 'Transfer failed'))
    }
  }

  const handleRedeemGoldCode = async () => {
    if (!goldCode.trim()) {
      setGoldCodeStatus({ type: 'error', message: language === 'tr' ? 'Kod giriniz' : 'Enter code' })
      return
    }

    try {
      const result = await redeemGoldCode(goldCode.trim())
      setGoldCodeStatus({
        type: 'success',
        message: language === 'tr'
          ? `+${result.amount} Gold! Yeni bakiye: ${result.newBalance}`
          : `+${result.amount} Gold! New balance: ${result.newBalance}`
      })
      setGoldBalance(result.newBalance)
      setGoldCode('')
      setTimeout(() => setGoldCodeStatus(null), 3000)
    } catch (error) {
      setGoldCodeStatus({
        type: 'error',
        message: error.message || (language === 'tr' ? 'Geçersiz kod' : 'Invalid code')
      })
      setTimeout(() => setGoldCodeStatus(null), 3000)
    }
  }

  if (!passport) return null

  return (
    <div className="min-h-screen py-8">
      {/* Welcome Notification for Kraliçe Pervin */}
      {showWelcome && welcomeMessage && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-pink-500/50 animate-slideDown flex items-center gap-3 max-w-md border-2 border-pink-300/50">
          <div className="text-4xl animate-bounce">👑</div>
          <div>
            <p className="font-bold text-lg leading-relaxed">
              {welcomeMessage}
            </p>
          </div>
        </div>
      )}

      {/* Streak Notification */}
      {showStreakNotif && streakReward && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/50 animate-slideDown flex items-center gap-3 max-w-sm">
          <Flame className="w-8 h-8 animate-pulse" />
          <div>
            {streakReward.newStrike && (
              <p className="font-bold">
                {language === 'tr' ? '🔥 Yeni Strike!' : '🔥 New Strike!'}
              </p>
            )}
            {streakReward.goldRewarded > 0 && (
              <p className="font-bold text-xl">
                💰 +{streakReward.goldRewarded} Gold!
              </p>
            )}
            <p className="text-sm opacity-90">
              {language === 'tr' ? 'Giriş seriniz devam ediyor!' : 'Login streak continues!'}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-6 mb-6"
          style={{
            background: `linear-gradient(135deg, ${passport.avatarColor.primary}10 0%, ${passport.avatarColor.secondary}10 100%)`
          }}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${passport.avatarColor.primary}, ${passport.avatarColor.secondary})`
              }}
            >
              {passport.avatarPattern}
            </div>

            {/* Username & Level */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-white">{passport.username}</h1>
                <button
                  onClick={handleRegenerateUsername}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                  title={language === 'tr' ? 'Kullanıcı adını yenile' : 'Regenerate username'}
                >
                  <Shuffle className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4" style={{ color: passport.avatarColor.accent }} />
                  <span>{t(language, 'digitalPassport.profile.level')} {passport.level}</span>
                </span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1.5">
                  {passport.unlimited ? (
                    <>
                      <Infinity className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400">{t(language, 'credits.unlimited')}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>
                        {passport.credits === Infinity ? '∞' : passport.credits} {t(language, 'digitalPassport.profile.credits')}
                      </span>
                    </>
                  )}
                </span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">
                    {goldBalance === Infinity ? '∞' : goldBalance} Gold
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderBottom: activeTab === 'overview' ? `3px solid ${passport.avatarColor.primary}` : 'none' }}
          >
            {t(language, 'digitalPassport.tabs.overview')}
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-3 rounded-xl text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderBottom: activeTab === 'achievements' ? `3px solid ${passport.avatarColor.primary}` : 'none' }}
          >
            <Award className="w-4 h-4 inline mr-1" />
            {t(language, 'digitalPassport.tabs.achievements')} ({passport.achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-xl text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderBottom: activeTab === 'stats' ? `3px solid ${passport.avatarColor.primary}` : 'none' }}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {t(language, 'digitalPassport.tabs.stats')}
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-6 py-3 rounded-xl text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'conversations'
                ? 'bg-white/10 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderBottom: activeTab === 'conversations' ? `3px solid ${passport.avatarColor.primary}` : 'none' }}
          >
            <MessageSquare className="w-4 h-4 inline mr-1" />
            {t(language, 'digitalPassport.tabs.conversations')} ({conversations.length})
          </button>
        </div>

        {/* Content - Will add in next message due to length */}
      </div>
    </div>
  )
}

export default Profile
