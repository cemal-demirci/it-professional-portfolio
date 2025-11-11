import { useState, useEffect, useRef } from 'react'
import { X, Download, Upload, Copy, Check, Award, TrendingUp, Zap, Star, MessageSquare, Trash2, Calendar, FileDown, FileUp, Camera, Shuffle, Infinity } from 'lucide-react'
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

  useEffect(() => {
    if (isOpen) {
      const currentPassport = getOrCreatePassport()
      setPassport(currentPassport)
      const allConversations = getAllConversations()
      setConversations(allConversations)

      // Fetch real credits from IP-based API to sync with Settings
      fetch('/api/credits?action=balance')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPassport(prev => ({ ...prev, credits: data.credits, unlimited: data.unlimited || false }))
          }
        })
        .catch(err => console.error('Failed to fetch credits:', err))
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

  if (!isOpen || !passport) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-white/10 overflow-hidden animate-slideUp"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          background: `linear-gradient(135deg, ${passport.avatarColor.primary}10 0%, ${passport.avatarColor.secondary}10 100%)`
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${passport.avatarColor.primary}, ${passport.avatarColor.secondary})`
              }}
            >
              {passport.avatarPattern}
            </div>

            {/* Username & Level */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">{passport.username}</h2>
                <button
                  onClick={handleRegenerateUsername}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
                  title={language === 'tr' ? 'Kullanıcı adını yenile' : 'Regenerate username'}
                >
                  <Shuffle className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Star className="w-4 h-4" style={{ color: passport.avatarColor.accent }} />
                <span>{t(language, 'digitalPassport.profile.level')} {passport.level}</span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1">
                  {passport.unlimited ? (
                    <>
                      <Infinity className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400">{t(language, 'credits.unlimited')}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-yellow-400" />
                      {passport.credits} {t(language, 'digitalPassport.profile.credits')}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
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
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === 'achievements'
                ? 'bg-white/10 text-white border-b-2'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderColor: activeTab === 'achievements' ? passport.avatarColor.primary : 'transparent' }}
          >
            <Award className="w-4 h-4 inline mr-1" />
            {t(language, 'digitalPassport.tabs.achievements')} ({passport.achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-white/10 text-white border-b-2'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderColor: activeTab === 'stats' ? passport.avatarColor.primary : 'transparent' }}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            {t(language, 'digitalPassport.tabs.stats')}
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === 'conversations'
                ? 'bg-white/10 text-white border-b-2'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            style={{ borderColor: activeTab === 'conversations' ? passport.avatarColor.primary : 'transparent' }}
          >
            <MessageSquare className="w-4 h-4 inline mr-1" />
            {t(language, 'digitalPassport.tabs.conversations')} ({conversations.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* XP Progress */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
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

              {/* QR Code */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
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
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/30">
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
    </div>
  )
}

export default DigitalPassport
