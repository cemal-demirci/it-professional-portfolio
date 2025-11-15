import { useState, useRef, useEffect } from 'react'
import { Camera, X, Zap, RefreshCw, Download, Play, Pause, Sliders, Home, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { performGenderSwap } from '../services/replicateService'
import { deductGold } from '../utils/digitalPassport'
import { getUserGold } from '../services/goldService'

const GenderSwap = () => {
  const navigate = useNavigate()

  const [cameraActive, setCameraActive] = useState(false)
  const [targetGender, setTargetGender] = useState('female')
  const [mode, setMode] = useState('snapshot') // 'snapshot' or 'live'
  const [isProcessing, setIsProcessing] = useState(false)
  const [swappedImage, setSwappedImage] = useState(null)
  const [liveMode, setLiveMode] = useState(false)
  const [autoSwapInterval, setAutoSwapInterval] = useState(null)
  const [goldBalance, setGoldBalance] = useState(0)

  // Advanced controls
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [breastSize, setBreastSize] = useState(3) // 1-5 scale
  const [femininity, setFemininity] = useState(5) // 1-10 scale
  const [makeup, setMakeup] = useState(5) // 1-10 scale
  const [hairLength, setHairLength] = useState('long') // short, medium, long
  const [bodyShape, setBodyShape] = useState('curvy') // slim, athletic, curvy, plus

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Load gold balance
  useEffect(() => {
    getUserGold().then(gold => setGoldBalance(gold))
  }, [])

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error('Camera access error:', error)
      alert('Kameraya erişim izni gerekli!')
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setCameraActive(false)
    }
    if (autoSwapInterval) {
      clearInterval(autoSwapInterval)
      setAutoSwapInterval(null)
    }
    setLiveMode(false)
  }

  // Capture snapshot from video
  const captureSnapshot = () => {
    if (!canvasRef.current || !videoRef.current) return null

    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)

    return canvas.toDataURL('image/jpeg', 0.9)
  }

  // Build enhanced prompt based on settings
  const buildGenderPrompt = () => {
    if (targetGender === 'female') {
      const breastDescriptions = ['flat chest', 'small breasts', 'medium breasts', 'large breasts', 'very large breasts']
      const bodyDescriptions = {
        slim: 'slim body, petite figure',
        athletic: 'athletic body, toned muscles',
        curvy: 'curvy body, hourglass figure',
        plus: 'plus size, voluptuous body'
      }

      return `beautiful woman, feminine face, ${hairLength} hair, ${breastDescriptions[breastSize - 1]}, ${bodyDescriptions[bodyShape]}, makeup level ${makeup}/10, femininity ${femininity}/10, attractive female, photorealistic portrait, professional photography, high quality`
    } else {
      return `handsome man, masculine face, short hair, strong jawline, muscular body, rugged features, attractive male, photorealistic portrait, professional photography`
    }
  }

  // Perform single gender swap
  const handleSnapshot = async () => {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      // Deduct 5 Gold for snapshot
      await deductGold(5)
      const newBalance = await getUserGold()
      setGoldBalance(newBalance)

      const imageData = captureSnapshot()
      if (!imageData) {
        alert('Görüntü yakalanamadı!')
        return
      }

      // Use custom prompt
      const customPrompt = buildGenderPrompt()
      console.log('🎨 Gender Swap Prompt:', customPrompt)

      const result = await performGenderSwap(imageData, targetGender, true, customPrompt)
      setSwappedImage(result)

    } catch (error) {
      console.error('Gender swap error:', error)
      alert('Hata: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Start live video mode (continuous swap)
  const handleLiveMode = async () => {
    if (liveMode) {
      // Stop live mode
      if (autoSwapInterval) {
        clearInterval(autoSwapInterval)
        setAutoSwapInterval(null)
      }
      setLiveMode(false)
      return
    }

    // Start live mode - swap every 3 seconds
    setLiveMode(true)

    const interval = setInterval(async () => {
      if (isProcessing) return

      setIsProcessing(true)

      try {
        // Deduct 3 Gold per frame in live mode
        await deductGold(3)
        const newBalance = await getUserGold()
        setGoldBalance(newBalance)

        const imageData = captureSnapshot()
        if (!imageData) return

        const customPrompt = buildGenderPrompt()
        const result = await performGenderSwap(imageData, targetGender, true, customPrompt)
        setSwappedImage(result)

      } catch (error) {
        console.error('Live gender swap error:', error)
      } finally {
        setIsProcessing(false)
      }
    }, 3000)

    setAutoSwapInterval(interval)
  }

  // Download swapped image
  const downloadImage = () => {
    if (!swappedImage) return

    const link = document.createElement('a')
    link.href = swappedImage
    link.download = `gender-swap-${Date.now()}.jpg`
    link.click()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-pink-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-pink-500/30 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                🎭 Gender Swap Camera
              </h1>
              <p className="text-gray-300 text-sm">Canlı cinsiyet değiştirme kamerası - Gerçek zamanlı AI dönüşümü</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-yellow-400 font-bold text-xl">⚡ {goldBalance} Gold</div>
              <button
                onClick={() => navigate('/alev')}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold hover:scale-105 transition-all"
              >
                <Home className="w-4 h-4 inline mr-2" />
                Geri
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Basic Controls */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-pink-500/30">
              <h3 className="text-white font-bold mb-4">🎯 Temel Ayarlar</h3>

              {/* Target Gender */}
              <div className="mb-4">
                <label className="block text-white font-bold mb-2">Hedef Cinsiyet</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTargetGender('female')}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      targetGender === 'female'
                        ? 'bg-pink-600 scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    👩 Kadın
                  </button>
                  <button
                    onClick={() => setTargetGender('male')}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      targetGender === 'male'
                        ? 'bg-blue-600 scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    👨 Erkek
                  </button>
                </div>
              </div>

              {/* Mode */}
              <div>
                <label className="block text-white font-bold mb-2">Mod</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode('snapshot')}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      mode === 'snapshot'
                        ? 'bg-green-600 scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    📸 Fotoğraf
                    <div className="text-xs opacity-70">5 Gold</div>
                  </button>
                  <button
                    onClick={() => setMode('live')}
                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                      mode === 'live'
                        ? 'bg-orange-600 scale-105 shadow-lg'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    🎬 Canlı
                    <div className="text-xs opacity-70">3 Gold/3sn</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Controls (Female only) */}
            {targetGender === 'female' && (
              <div className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-pink-500/30">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-white font-bold mb-4 hover:text-pink-300 transition-all"
                >
                  <span>🎨 Gelişmiş Ayarlar</span>
                  <Sliders className="w-5 h-5" />
                </button>

                {showAdvanced && (
                  <div className="space-y-4">
                    {/* Breast Size */}
                    <div>
                      <label className="block text-white font-bold mb-2">
                        Göğüs Boyutu: {['Düz', 'Küçük', 'Orta', 'Büyük', 'Çok Büyük'][breastSize - 1]}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={breastSize}
                        onChange={(e) => setBreastSize(parseInt(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    {/* Femininity */}
                    <div>
                      <label className="block text-white font-bold mb-2">
                        Feminenlik: {femininity}/10
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={femininity}
                        onChange={(e) => setFemininity(parseInt(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    {/* Makeup */}
                    <div>
                      <label className="block text-white font-bold mb-2">
                        Makyaj: {makeup}/10
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={makeup}
                        onChange={(e) => setMakeup(parseInt(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>

                    {/* Hair Length */}
                    <div>
                      <label className="block text-white font-bold mb-2">Saç Uzunluğu</label>
                      <select
                        value={hairLength}
                        onChange={(e) => setHairLength(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border-2 border-pink-500/30 rounded-xl text-white focus:border-pink-500 focus:outline-none"
                      >
                        <option value="short">Kısa</option>
                        <option value="medium">Orta</option>
                        <option value="long">Uzun</option>
                      </select>
                    </div>

                    {/* Body Shape */}
                    <div>
                      <label className="block text-white font-bold mb-2">Vücut Şekli</label>
                      <select
                        value={bodyShape}
                        onChange={(e) => setBodyShape(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border-2 border-pink-500/30 rounded-xl text-white focus:border-pink-500 focus:outline-none"
                      >
                        <option value="slim">İnce</option>
                        <option value="athletic">Atletik</option>
                        <option value="curvy">Kıvrımlı</option>
                        <option value="plus">Dolgun</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="bg-purple-600/20 rounded-xl p-4 border border-purple-500/30">
              <p className="text-xs text-gray-300">
                💡 <strong>Snapshot:</strong> Tek fotoğraf çek, dönüştür<br />
                🎬 <strong>Canlı:</strong> Her 3 saniyede otomatik dönüştür<br />
                🎨 <strong>Gelişmiş:</strong> Vücut özelliklerini özelleştir
              </p>
            </div>
          </div>

          {/* Center - Camera Views */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Original Camera */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-blue-500/50">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  📹 Orijinal
                </div>
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <button
                      onClick={startCamera}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
                    >
                      <Camera className="w-6 h-6 inline mr-2" />
                      Kamerayı Aç
                    </button>
                  </div>
                )}
              </div>

              {/* Swapped Result */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-pink-500/50">
                {swappedImage ? (
                  <img
                    src={swappedImage}
                    alt="Gender Swapped"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {isProcessing ? (
                      <div className="text-center">
                        <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-pink-500" />
                        <p className="font-bold">Dönüştürülüyor...</p>
                        <p className="text-xs mt-2">AI büyü yapıyor ✨</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Dönüştürülmüş görüntü</p>
                        <p className="text-xs mt-2">burada görünecek</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-pink-600 px-3 py-1 rounded-full text-xs font-bold">
                  ✨ Dönüştürülmüş
                </div>
                {swappedImage && (
                  <button
                    onClick={downloadImage}
                    className="absolute bottom-2 right-2 p-3 bg-green-600 rounded-full hover:scale-110 transition-all shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {cameraActive && (
              <div className="flex gap-4 justify-center">
                {mode === 'snapshot' ? (
                  <button
                    onClick={handleSnapshot}
                    disabled={isProcessing}
                    className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-xl hover:scale-105 transition-all disabled:opacity-50 shadow-2xl"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-6 h-6 inline mr-2 animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6 inline mr-2" />
                        Çek ve Dönüştür (5 Gold)
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleLiveMode}
                    className={`px-12 py-5 rounded-xl font-bold text-xl hover:scale-105 transition-all shadow-2xl ${
                      liveMode
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 animate-pulse'
                        : 'bg-gradient-to-r from-orange-600 to-yellow-600'
                    }`}
                  >
                    {liveMode ? (
                      <>
                        <Pause className="w-6 h-6 inline mr-2" />
                        Durdur
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 inline mr-2" />
                        Canlı Başlat (3 Gold/3sn)
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default GenderSwap
