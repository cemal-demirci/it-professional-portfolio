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

const DigitalPassport = ({ isOpen, onClose }) => {
  const { language } = useLanguage()
  const [passport, setPassport] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [copiedId, setCopiedId] = useState(false)
  const [copiedPhrase, setCopiedPhrase] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // overview, achievements, stats, conversations
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
    if (isOpen) {
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

      // Fetch real credits from Passport ID-based API to sync with Settings
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
    }
  }, [isOpen])

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

    // Reset file input
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
          // QR code successfully scanned
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

  // Cleanup QR scanner on unmount or modal close
  useEffect(() => {
    if (!isOpen && qrScannerRef.current) {
      handleStopQRScanner()
    }
  }, [isOpen])

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

  if (!isOpen || !passport) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-2 md:p-4 animate-fadeIn">
      <div
        className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col border border-white/10 overflow-hidden animate-slideUp"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          background: `linear-gradient(135deg, ${passport.avatarColor.primary}10 0%, ${passport.avatarColor.secondary}10 100%)`
        }}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div
              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${passport.avatarColor.primary}, ${passport.avatarColor.secondary})`
              }}
            >
              {passport.avatarPattern}
            </div>

            {/* Username & Level */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-2xl font-bold text-white truncate">{passport.username}</h2>
                <button
                  onClick={handleRegenerateUsername}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group flex-shrink-0"
                  title={language === 'tr' ? 'Kullanıcı adını yenile' : 'Regenerate username'}
                >
                  <Shuffle className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 group-hover:text-white" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: passport.avatarColor.accent }} />
                  <span>{t(language, 'digitalPassport.profile.level')} {passport.level}</span>
                </span>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  {passport.unlimited ? (
                    <>
                      <Infinity className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                      <span className="text-purple-400">{t(language, 'credits.unlimited')}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400" />
                      <span>
                        {passport.credits === Infinity ? '∞' : passport.credits} {t(language, 'digitalPassport.profile.credits')}
                      </span>
                    </>
                  )}
                </span>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
                  <span className="text-amber-400">
                    {goldBalance === Infinity ? '∞' : goldBalance} Gold
                  </span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-white/10 rounded-xl transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 md:gap-2 px-4 md:px-6 pt-3 md:pt-4 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-t-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white/10 text-white border-b-2'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderColor: activeTab === 'overview' ? passport.avatarColor.primary : 'transparent' }}
          >
            {t(language, 'digitalPassport.tabs.overview')}
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-t-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'bg-white/10 text-white border-b-2'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderColor: activeTab === 'achievements' ? passport.avatarColor.primary : 'transparent' }}
          >
            <Award className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1" />
            <span className="hidden sm:inline">{t(language, 'digitalPassport.tabs.achievements')}</span>
            <span className="sm:hidden">{t(language, 'digitalPassport.tabs.achievements').substring(0, 8)}</span>
            <span> ({passport.achievements.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-t-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-white/10 text-white border-b-2'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderColor: activeTab === 'stats' ? passport.avatarColor.primary : 'transparent' }}
          >
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1" />
            {t(language, 'digitalPassport.tabs.stats')}
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-t-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
              activeTab === 'conversations'
                ? 'bg-white/10 text-white border-b-2'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderColor: activeTab === 'conversations' ? passport.avatarColor.primary : 'transparent' }}
          >
            <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1" />
            <span className="hidden sm:inline">{t(language, 'digitalPassport.tabs.conversations')}</span>
            <span className="sm:hidden">{t(language, 'digitalPassport.tabs.conversations').substring(0, 8)}</span>
            <span> ({conversations.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
          {activeTab === 'overview' && (
            <>
              {/* XP Progress */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{t(language, 'digitalPassport.profile.experience')}</span>
                  <span className="text-gray-400 text-sm">{experienceToNextLevel()} {t(language, 'digitalPassport.profile.xpToNextLevel')} {passport.level + 1}</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${experienceProgress()}%`,
                      background: `linear-gradient(90deg, ${passport.avatarColor.primary}, ${passport.avatarColor.accent})`
                    }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">{passport.experience} / {passport.level * 100} XP</p>
              </div>

              {/* Login Streak Progress */}
              {streakInfo && (
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-amber-500/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      {language === 'tr' ? 'Giriş Serisi' : 'Login Streak'}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {streakInfo.canClaimStrike
                        ? (language === 'tr' ? 'Hazır!' : 'Ready!')
                        : formatTimeRemaining(streakInfo.timeUntilNextStrike)}
                    </span>
                  </div>

                  {/* Streak Progress Bars */}
                  <div className="flex gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                          i < streakInfo.strikes
                            ? 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg shadow-amber-500/50'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">
                      {streakInfo.strikes}/5 {language === 'tr' ? 'Strike' : 'Strikes'}
                    </span>
                    <span className="text-amber-400 font-bold">
                      {streakInfo.strikes >= 5
                        ? (language === 'tr' ? '✓ 10 Gold Kazandınız!' : '✓ Earned 10 Gold!')
                        : `${5 - streakInfo.strikes} ${language === 'tr' ? 'strike kaldı → 10 Gold' : 'strikes left → 10 Gold'}`
                      }
                    </span>
                  </div>

                  {/* Streak Stats */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-gray-400">
                    <span>{language === 'tr' ? 'Toplam Kazanılan' : 'Total Earned'}: {streakInfo.totalGoldEarned} Gold</span>
                    <span>{language === 'tr' ? 'Seri Sayısı' : 'Streak Count'}: {streakInfo.streakCount}</span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    💡 {language === 'tr'
                      ? 'Her 2 saatte bir giriş yaparak strike kazanın. 5 strike = 10 Gold!'
                      : 'Login every 2 hours to earn strikes. 5 strikes = 10 Gold!'}
                  </p>
                </div>
              )}

              {/* Gold Transfer */}
              <div className="bg-gradient-to-br from-amber-600/10 to-yellow-600/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-amber-500/20">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-amber-400" />
                  {language === 'tr' ? 'Gold Transfer' : 'Transfer Gold'}
                </h3>

                {!showTransfer ? (
                  <button
                    onClick={() => setShowTransfer(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-xl font-medium text-white transition-all"
                  >
                    {language === 'tr' ? 'Gold Gönder' : 'Send Gold'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">
                        {language === 'tr' ? 'Alıcı Passport ID' : 'Recipient Passport ID'}
                      </label>
                      <input
                        type="text"
                        value={transferTo}
                        onChange={(e) => setTransferTo(e.target.value)}
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        className="w-full bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-mono border border-white/10 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm mb-1 block">
                        {language === 'tr' ? 'Miktar' : 'Amount'}
                      </label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="0"
                        min="1"
                        max={goldBalance === Infinity ? undefined : goldBalance}
                        className="w-full bg-white/10 text-white px-3 py-2 rounded-lg text-sm border border-white/10 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {transferError && (
                      <p className="text-red-400 text-sm">{transferError}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleTransferGold}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-xl font-medium text-white transition-all"
                      >
                        {language === 'tr' ? 'Gönder' : 'Send'}
                      </button>
                      <button
                        onClick={() => {
                          setShowTransfer(false)
                          setTransferError('')
                          setTransferTo('')
                          setTransferAmount('')
                        }}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium text-white transition-all"
                      >
                        {language === 'tr' ? 'İptal' : 'Cancel'}
                      </button>
                    </div>

                    <p className="text-xs text-gray-400">
                      💡 {language === 'tr'
                        ? 'Pasaport ID\'sini kopyalayıp göndermek istediğiniz kişiye verin.'
                        : 'Copy your Passport ID and share it with the person you want to receive Gold from.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Gold Code Redemption */}
              <div className="bg-gradient-to-br from-amber-600/10 to-yellow-600/10 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-amber-500/20">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  {language === 'tr' ? 'Gold Kodu Kullan' : 'Redeem Gold Code'}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-gray-300 text-sm mb-1 block">
                      {language === 'tr' ? 'Gold Kodu' : 'Gold Code'}
                    </label>
                    <input
                      type="text"
                      value={goldCode}
                      onChange={(e) => setGoldCode(e.target.value.toUpperCase())}
                      placeholder="GOLD-100-XXXXXXXX"
                      className="w-full bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-mono border border-white/10 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {goldCodeStatus && (
                    <p className={`text-sm ${goldCodeStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {goldCodeStatus.message}
                    </p>
                  )}

                  <button
                    onClick={handleRedeemGoldCode}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-xl font-medium text-white transition-all"
                  >
                    {language === 'tr' ? 'Kodu Kullan' : 'Redeem Code'}
                  </button>

                  <p className="text-xs text-gray-400">
                    💡 {language === 'tr'
                      ? 'Admin panelinden üretilen Gold kodlarını buradan kullanabilirsiniz.'
                      : 'You can redeem Gold codes generated from admin panel here.'}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/10">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {t(language, 'digitalPassport.profile.yourDigitalPassport')}
                </h3>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-2xl">
                    <QRCodeSVG
                      id="passport-qr"
                      value={passport.id}
                      size={180}
                      level="H"
                      fgColor={passport.avatarColor.primary}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">{t(language, 'digitalPassport.profile.passportId')}</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg text-xs font-mono break-all">
                          {passport.id}
                        </code>
                        <button
                          onClick={handleCopyId}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          {copiedId ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleDownloadQR}
                        className="px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${passport.avatarColor.primary}, ${passport.avatarColor.secondary})`
                        }}
                      >
                        <Download className="w-4 h-4 inline mr-1" />
                        {language === 'tr' ? 'QR İndir' : 'Download QR'}
                      </button>

                      <button
                        onClick={handleExportCML}
                        className="px-4 py-2.5 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 text-sm bg-gradient-to-r from-green-600 to-emerald-600"
                      >
                        <FileDown className="w-4 h-4 inline mr-1" />
                        {language === 'tr' ? '.cml İndir' : 'Export .cml'}
                      </button>
                    </div>

                    <button
                      onClick={() => setShowImport(!showImport)}
                      className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium text-white transition-all text-sm"
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      {t(language, 'digitalPassport.profile.importPassport')}
                    </button>
                  </div>
                </div>

                {/* Hidden file input for .cml import */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".cml"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Import Section */}
                {showImport && (
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                    {/* UUID Import */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        {t(language, 'digitalPassport.profile.enterPassportId')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={importCode}
                          onChange={(e) => setImportCode(e.target.value)}
                          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 text-sm"
                        />
                        <button
                          onClick={handleImport}
                          className="px-6 py-2 rounded-xl font-medium text-white text-sm"
                          style={{
                            background: `linear-gradient(135deg, ${passport.avatarColor.primary}, ${passport.avatarColor.secondary})`
                          }}
                        >
                          {t(language, 'digitalPassport.profile.import')}
                        </button>
                      </div>
                    </div>

                    {/* File & QR Import */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleImportCML}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-medium text-white transition-all text-sm"
                      >
                        <FileUp className="w-4 h-4 inline mr-2" />
                        {language === 'tr' ? '.cml Dosya Yükle' : 'Upload .cml File'}
                      </button>

                      <button
                        onClick={showQRScanner ? handleStopQRScanner : handleStartQRScanner}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-medium text-white transition-all text-sm"
                      >
                        <Camera className="w-4 h-4 inline mr-2" />
                        {showQRScanner
                          ? (language === 'tr' ? 'Kamerayı Kapat' : 'Stop Camera')
                          : (language === 'tr' ? 'QR Kodu Tara' : 'Scan QR Code')
                        }
                      </button>
                    </div>

                    {/* QR Scanner */}
                    {showQRScanner && (
                      <div className="bg-black rounded-xl overflow-hidden">
                        <div id="qr-scanner" className="w-full"></div>
                        {scannerError && (
                          <div className="p-4 text-center text-red-400 text-sm">
                            {language === 'tr' ? 'Kamera hatası: ' : 'Camera error: '}{scannerError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-4 md:p-6 border border-blue-500/30">
                <p className="text-white font-medium mb-2">🔒 {t(language, 'digitalPassport.profile.privacyTitle')}</p>
                <p className="text-gray-300 text-sm">
                  {t(language, 'digitalPassport.profile.privacyDesc')}
                </p>
              </div>
            </>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ACHIEVEMENTS).map((achievement) => {
                const unlocked = passport.achievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`relative rounded-2xl p-6 border transition-all ${
                      unlocked
                        ? 'bg-white/10 border-white/20 hover:scale-105'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl ${unlocked ? 'animate-bounce' : 'grayscale'}`}>
                        {achievement.emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold">{achievement.name}</h4>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                      {unlocked && (
                        <Check className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">{t(language, 'digitalPassport.stats.totalQuestions')}</p>
                  <p className="text-4xl font-bold text-white">{passport.stats.totalQuestions}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">{t(language, 'digitalPassport.stats.favoriteBot')}</p>
                  <p className="text-2xl font-bold text-white">{passport.stats.favoriteBot || t(language, 'digitalPassport.stats.noneYet')}</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">{t(language, 'digitalPassport.stats.currentStreak')}</p>
                  <p className="text-4xl font-bold text-white flex items-center gap-2">
                    🔥 {passport.stats.streak}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">{t(language, 'digitalPassport.stats.memberSince')}</p>
                  <p className="text-lg font-bold text-white">
                    {new Date(passport.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="space-y-4">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">{t(language, 'digitalPassport.history.noConversations')}</p>
                  <p className="text-gray-500 text-sm mt-2">{t(language, 'digitalPassport.history.startChatting')}</p>
                </div>
              ) : (
                conversations.map((conv, index) => (
                  <div
                    key={`${conv.botId}-${conv.timestamp}`}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <h4 className="text-white font-bold text-lg truncate">{conv.botName}</h4>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(conv.timestamp).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                          <span className="text-gray-500">•</span>
                          <span>{conv.messageCount} {t(language, 'digitalPassport.history.messages')}</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 max-h-40 overflow-y-auto">
                          {conv.messages.slice(0, 3).map((msg, msgIndex) => (
                            <div key={msgIndex} className="mb-2 last:mb-0">
                              <p className={`text-xs font-medium mb-1 ${msg.role === 'user' ? 'text-blue-300' : 'text-purple-300'}`}>
                                {msg.role === 'user' ? `👤 ${t(language, 'digitalPassport.history.you')}` : `🤖 ${t(language, 'digitalPassport.history.bot')}`}
                              </p>
                              <p className="text-sm text-gray-300 line-clamp-2">{msg.content}</p>
                            </div>
                          ))}
                          {conv.messages.length > 3 && (
                            <p className="text-xs text-gray-500 mt-2">+{conv.messages.length - 3} {t(language, 'digitalPassport.history.moreMessages')}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteConversation(conv.botId, conv.timestamp)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group flex-shrink-0"
                        title={t(language, 'digitalPassport.history.delete')}
                      >
                        <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Welcome Notification for Kraliçe Pervin */}
      {showWelcome && welcomeMessage && (
        <div className="fixed top-4 right-4 z-[10001] bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-pink-500/50 animate-slideDown flex items-center gap-3 max-w-md border-2 border-pink-300/50">
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
        <div className="fixed top-4 right-4 z-[10001] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/50 animate-slideDown flex items-center gap-3 max-w-sm">
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
    </div>
  )
}

export default DigitalPassport
