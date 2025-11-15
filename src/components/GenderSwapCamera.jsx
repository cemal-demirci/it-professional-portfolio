import { useState, useRef, useEffect } from 'react'
import { Camera, X, Zap, RefreshCw, Download, Play, Pause } from 'lucide-react'
import { performGenderSwap } from '../services/replicateService'
import { deductGold } from '../utils/digitalPassport'
import { getUserGold } from '../services/goldService'

const GenderSwapCamera = ({ onClose, onGoldUpdate }) => {
  const [cameraActive, setCameraActive] = useState(false)
  const [targetGender, setTargetGender] = useState('female')
  const [mode, setMode] = useState('snapshot') // 'snapshot' or 'live'
  const [isProcessing, setIsProcessing] = useState(false)
  const [swappedImage, setSwappedImage] = useState(null)
  const [liveMode, setLiveMode] = useState(false)
  const [autoSwapInterval, setAutoSwapInterval] = useState(null)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
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

    return canvas.toDataURL('image/jpeg', 0.8)
  }

  // Perform single gender swap
  const handleSnapshot = async () => {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      // Deduct 5 Gold for snapshot
      await deductGold(5)
      const newBalance = await getUserGold()
      if (onGoldUpdate) onGoldUpdate(newBalance)

      const imageData = captureSnapshot()
      if (!imageData) {
        alert('Görüntü yakalanamadı!')
        return
      }

      const result = await performGenderSwap(imageData, targetGender, true)
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
        if (onGoldUpdate) onGoldUpdate(newBalance)

        const imageData = captureSnapshot()
        if (!imageData) return

        const result = await performGenderSwap(imageData, targetGender, true)
        setSwappedImage(result)

      } catch (error) {
        console.error('Live gender swap error:', error)
        // Don't alert in live mode, just log
      } finally {
        setIsProcessing(false)
      }
    }, 3000) // Every 3 seconds

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
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl p-6 max-w-4xl w-full border-2 border-pink-500/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              🎭 Gender Swap Camera
            </h2>
            <p className="text-sm text-gray-300">Canlı cinsiyet değiştirme kamerası</p>
          </div>
          <button
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="p-2 bg-red-600 rounded-full hover:scale-110 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Target Gender */}
          <div>
            <label className="block text-white font-bold mb-2">Hedef Cinsiyet</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTargetGender('female')}
                className={`flex-1 px-4 py-2 rounded-xl font-bold transition-all ${
                  targetGender === 'female'
                    ? 'bg-pink-600 scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                👩 Kadın
              </button>
              <button
                onClick={() => setTargetGender('male')}
                className={`flex-1 px-4 py-2 rounded-xl font-bold transition-all ${
                  targetGender === 'male'
                    ? 'bg-blue-600 scale-105'
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
            <div className="flex gap-2">
              <button
                onClick={() => setMode('snapshot')}
                className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  mode === 'snapshot'
                    ? 'bg-green-600 scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                📸 Fotoğraf (5 Gold)
              </button>
              <button
                onClick={() => setMode('live')}
                className={`flex-1 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  mode === 'live'
                    ? 'bg-orange-600 scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                🎬 Canlı (3 Gold/frame)
              </button>
            </div>
          </div>
        </div>

        {/* Camera View */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Original Camera */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-blue-500/50">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold">
              📹 Orijinal
            </div>
            {!cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:scale-105 transition-all"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
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
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Dönüştürülüyor...</p>
                  </div>
                ) : (
                  <p>Dönüştürülmüş görüntü burada görünecek</p>
                )}
              </div>
            )}
            <div className="absolute top-2 left-2 bg-pink-600 px-3 py-1 rounded-full text-xs font-bold">
              ✨ Dönüştürülmüş
            </div>
            {swappedImage && (
              <button
                onClick={downloadImage}
                className="absolute bottom-2 right-2 p-2 bg-green-600 rounded-full hover:scale-110 transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {cameraActive && (
          <div className="flex gap-3 justify-center">
            {mode === 'snapshot' ? (
              <button
                onClick={handleSnapshot}
                disabled={isProcessing}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 inline mr-2" />
                    Çek ve Dönüştür (5 Gold)
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleLiveMode}
                className={`px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg ${
                  liveMode
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 animate-pulse'
                    : 'bg-gradient-to-r from-orange-600 to-yellow-600'
                }`}
              >
                {liveMode ? (
                  <>
                    <Pause className="w-5 h-5 inline mr-2" />
                    Durdur
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 inline mr-2" />
                    Canlı Başlat (3 Gold/3sn)
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Info */}
        <div className="mt-6 p-4 bg-purple-600/20 rounded-xl border border-purple-500/30">
          <p className="text-xs text-gray-300">
            💡 <strong>Snapshot Modu:</strong> Tek fotoğraf çek, dönüştür (5 Gold)<br />
            🎬 <strong>Canlı Mod:</strong> Her 3 saniyede otomatik dönüştür (3 Gold/frame)
          </p>
        </div>
      </div>
    </div>
  )
}

export default GenderSwapCamera
