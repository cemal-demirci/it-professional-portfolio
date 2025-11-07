import React, { useState, useEffect, useRef } from 'react'
import { Monitor, Copy, Check, Users, Wifi, ArrowLeft, MessageCircle, Send, Lock, Zap } from 'lucide-react'
import Peer from 'peerjs'
import QRCode from 'qrcode'

const RemoteHost = ({ onBack }) => {
  const [peer, setPeer] = useState(null)
  const [sessionCode, setSessionCode] = useState(null)
  const [sessionPassword, setSessionPassword] = useState('')
  const [sessionMode, setSessionMode] = useState('secure') // 'secure', 'local', or 'performance'
  const [qrCode, setQrCode] = useState(null)
  const [copied, setCopied] = useState(false)
  const [connected, setConnected] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [stream, setStream] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [connectionQuality, setConnectionQuality] = useState('good')
  const [autoReconnect, setAutoReconnect] = useState(true)

  const connectionRef = useRef(null)
  const videoRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  useEffect(() => {
    initializePeer()
    return () => {
      if (peer) peer.destroy()
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [sessionMode])

  const generateSimpleCode = () => {
    // Generate simple code: cml-XXXX (4 random numbers)
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `cml-${randomNum}`
  }

  const generatePassword = () => {
    // Generate 6-digit password
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const initializePeer = () => {
    // Generate simple session code and password first
    const simpleCode = generateSimpleCode()
    const password = sessionMode === 'secure' ? generatePassword() : 'local'

    // Optimized config for local network performance
    const peerConfig = sessionMode === 'performance' ? {
      config: {
        // Minimal STUN - local network öncelikli
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ],
        // Local network için optimize
        iceTransportPolicy: 'all', // Tüm network türlerini dene
        iceCandidatePoolSize: 20, // Daha çok candidate = daha hızlı connection
        bundlePolicy: 'max-bundle', // Tüm media bir connection'da
        rtcpMuxPolicy: 'require', // RTCP ve RTP aynı port
      },
      // PeerJS data channel optimization
      serialization: 'binary', // Binary data için daha hızlı
      reliable: true
    } : {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    }

    const newPeer = new Peer(simpleCode, peerConfig)

    newPeer.on('open', async (id) => {
      setPeer(newPeer)
      setSessionCode(id)
      setSessionPassword(password)

      const link = `${window.location.origin}/remote/${simpleCode}`
      const qr = await QRCode.toDataURL(link, { width: 200 })
      setQrCode(qr)
    })

    newPeer.on('connection', (conn) => {
      // Connection quality monitoring
      const qualityCheckInterval = setInterval(() => {
        if (conn.open) {
          conn.send({ type: 'ping', timestamp: Date.now() })
        }
      }, 5000)

      conn.on('data', (data) => {
        // Check password first (skip for local/performance mode)
        if (data.type === 'auth') {
          const isLocalMode = sessionMode === 'local' || sessionMode === 'performance'
          if (isLocalMode || data.password === sessionPassword) {
            conn.send({
              type: 'auth_success',
              mode: sessionMode,
              features: {
                autoReconnect,
                quality: connectionQuality,
                performanceMode: sessionMode === 'performance'
              }
            })
            connectionRef.current = conn
            setConnected(true)
            setMessages(prev => [...prev, {
              from: 'system',
              text: `Connected in ${sessionMode.toUpperCase()} mode`
            }])
          } else {
            conn.send({ type: 'auth_failed', message: 'Incorrect password' })
            conn.close()
          }
        } else if (data.type === 'pong' && connected) {
          // Calculate latency
          const latency = Date.now() - data.timestamp
          if (latency < 50) setConnectionQuality('excellent')
          else if (latency < 100) setConnectionQuality('good')
          else if (latency < 200) setConnectionQuality('fair')
          else setConnectionQuality('poor')
        } else if (data.type === 'chat' && connected) {
          setMessages(prev => [...prev, { from: 'viewer', text: data.message }])
        }
      })

      conn.on('close', () => {
        clearInterval(qualityCheckInterval)
        setConnected(false)

        // Auto-reconnect if enabled
        if (autoReconnect && sessionMode !== 'secure') {
          setMessages(prev => [...prev, {
            from: 'system',
            text: 'Connection lost. Waiting for reconnection...'
          }])
        }
      })
    })

    newPeer.on('call', async (call) => {
      // Only accept calls from authenticated connections
      if (!connected) {
        call.close()
        return
      }

      try {
        // Performance mode: Daha yüksek kalite ve frame rate
        const displayOptions = sessionMode === 'performance' ? {
          video: {
            cursor: 'always',
            displaySurface: 'monitor',
            frameRate: { ideal: 60, max: 60 }, // 60 FPS for LAN
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        } : {
          video: {
            cursor: 'always',
            frameRate: { ideal: 30 }
          },
          audio: false
        }

        const mediaStream = await navigator.mediaDevices.getDisplayMedia(displayOptions)
        setStream(mediaStream)
        setSharing(true)
        if (videoRef.current) videoRef.current.srcObject = mediaStream

        // Answer call with stream
        call.answer(mediaStream)

        // Monitor connection stats for performance mode
        if (sessionMode === 'performance') {
          const pc = call.peerConnection
          setInterval(async () => {
            try {
              const stats = await pc.getStats()
              stats.forEach(report => {
                if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                  // Local network check
                  if (report.localCandidateId) {
                    const localCandidate = Array.from(stats.values()).find(
                      s => s.id === report.localCandidateId
                    )
                    if (localCandidate && localCandidate.candidateType === 'host') {
                      console.log('✅ Direct LAN connection active!')
                    }
                  }
                }
              })
            } catch (e) {
              console.error('Stats error:', e)
            }
          }, 5000)
        }

        mediaStream.getVideoTracks()[0].onended = () => {
          setSharing(false)
          setStream(null)
        }
      } catch (error) {
        console.error('Screen share error:', error)
        alert('Failed to share screen: ' + error.message)
      }
    })
  }

  const sendMessage = () => {
    if (!messageText.trim() || !connectionRef.current) return
    connectionRef.current.send({ type: 'chat', message: messageText })
    setMessages(prev => [...prev, { from: 'host', text: messageText }])
    setMessageText('')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={onBack} className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Screen Sharing</h2>
                <div className={`px-4 py-2 rounded-lg ${connected ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'}`}>
                  {connected ? (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Connected
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Wifi className="w-4 h-4 mr-2 animate-pulse" />
                      Waiting
                    </div>
                  )}
                </div>
              </div>

              {/* Video Preview */}
              <div className="bg-gray-900 rounded-lg overflow-hidden mb-4 aspect-video flex items-center justify-center">
                {sharing ? (
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Waiting for viewer to connect...</p>
                    <p className="text-sm mt-2">They will request screen access when ready</p>
                  </div>
                )}
              </div>

              {sharing && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-green-800 dark:text-green-400">
                    🟢 Your screen is being shared. The viewer can see your screen in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Mode Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Session Mode</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSessionMode('secure')}
                  disabled={connected}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    sessionMode === 'secure'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  } ${connected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Lock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">Secure</div>
                </button>
                <button
                  onClick={() => setSessionMode('local')}
                  disabled={connected}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    sessionMode === 'local'
                      ? 'border-green-600 bg-green-50 dark:bg-green-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  } ${connected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Wifi className="w-5 h-5 mx-auto mb-1 text-green-600" />
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">Local</div>
                </button>
                <button
                  onClick={() => setSessionMode('performance')}
                  disabled={connected}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    sessionMode === 'performance'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  } ${connected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Zap className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">Turbo</div>
                </button>
              </div>

              {/* Mode descriptions */}
              <div className="mt-3 text-xs space-y-2">
                {sessionMode === 'secure' && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-400 dark:border-blue-600">
                    <p className="text-blue-800 dark:text-blue-300 font-semibold mb-1">🔒 Secure Mode</p>
                    <p className="text-blue-700 dark:text-blue-400">Password protection. Best for internet connections.</p>
                  </div>
                )}
                {sessionMode === 'local' && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-400 dark:border-green-600">
                    <p className="text-green-800 dark:text-green-300 font-semibold mb-1">🏠 Local Mode</p>
                    <p className="text-green-700 dark:text-green-400">No password. Auto-reconnect enabled. For trusted LANs only.</p>
                  </div>
                )}
                {sessionMode === 'performance' && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-400 dark:border-purple-600">
                    <p className="text-purple-800 dark:text-purple-300 font-semibold mb-1">⚡ Turbo Mode</p>
                    <p className="text-purple-700 dark:text-purple-400">Maximum performance for LAN. No password. Optimized latency.</p>
                  </div>
                )}
              </div>

              {/* Connection Quality Indicator */}
              {connected && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Connection Quality</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                      connectionQuality === 'excellent' ? 'bg-green-100 text-green-800' :
                      connectionQuality === 'good' ? 'bg-blue-100 text-blue-800' :
                      connectionQuality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {connectionQuality === 'excellent' && '🟢'}
                      {connectionQuality === 'good' && '🔵'}
                      {connectionQuality === 'fair' && '🟡'}
                      {connectionQuality === 'poor' && '🔴'}
                      <span className="uppercase">{connectionQuality}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Session Code & Password */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connection Details</h3>
              <div className="space-y-4">
                {/* Session Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Code
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      value={sessionCode || 'Generating...'}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-mono text-lg font-bold"
                    />
                    <button onClick={copyCode} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password */}
                {sessionMode === 'secure' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white text-center font-mono tracking-wider">
                        {sessionPassword || '------'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Share this password with the viewer to allow connection
                    </p>
                  </div>
                )}

                {(sessionMode === 'local' || sessionMode === 'performance') && (
                  <div className={`p-4 rounded-lg border ${
                    sessionMode === 'performance'
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400 dark:border-purple-600'
                      : 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {sessionMode === 'performance' ? (
                        <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      <p className={`font-semibold ${
                        sessionMode === 'performance'
                          ? 'text-purple-900 dark:text-purple-300'
                          : 'text-green-900 dark:text-green-300'
                      }`}>
                        {sessionMode === 'performance' ? 'Turbo Mode Active' : 'Local Mode Active'}
                      </p>
                    </div>
                    <p className={`text-sm ${
                      sessionMode === 'performance'
                        ? 'text-purple-800 dark:text-purple-400'
                        : 'text-green-800 dark:text-green-400'
                    }`}>
                      {sessionMode === 'performance'
                        ? 'Optimized for maximum performance on local networks. Auto-reconnect enabled.'
                        : 'Anyone with the session code can connect. Auto-reconnect enabled for convenience.'}
                    </p>
                  </div>
                )}

                {qrCode && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <img src={qrCode} alt="QR Code" className="mx-auto" />
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">Scan to connect</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat
              </h3>
              <div className="space-y-3 mb-4 h-64 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'host' ? 'justify-end' : msg.from === 'system' ? 'justify-center' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.from === 'host' ? 'bg-blue-600 text-white' :
                      msg.from === 'system' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  disabled={!connected}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                />
                <button onClick={sendMessage} disabled={!connected} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoteHost
