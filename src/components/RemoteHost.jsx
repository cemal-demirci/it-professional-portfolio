import React, { useState, useEffect, useRef } from 'react'
import { Monitor, Copy, Check, Users, Wifi, ArrowLeft, MessageCircle, Send } from 'lucide-react'
import Peer from 'peerjs'
import QRCode from 'qrcode'

const RemoteHost = ({ onBack }) => {
  const [peer, setPeer] = useState(null)
  const [sessionCode, setSessionCode] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [copied, setCopied] = useState(false)
  const [connected, setConnected] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [stream, setStream] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')

  const connectionRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    initializePeer()
    return () => {
      if (peer) peer.destroy()
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [])

  const initializePeer = () => {
    const newPeer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    })

    newPeer.on('open', async (id) => {
      setSessionCode(id)
      setPeer(newPeer)
      const link = `${window.location.origin}/remote/${id}`
      const qr = await QRCode.toDataURL(link, { width: 200 })
      setQrCode(qr)
    })

    newPeer.on('connection', (conn) => {
      connectionRef.current = conn
      setConnected(true)

      conn.on('data', (data) => {
        if (data.type === 'chat') {
          setMessages(prev => [...prev, { from: 'viewer', text: data.message }])
        }
      })
    })

    newPeer.on('call', async (call) => {
      try {
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        })
        setStream(mediaStream)
        setSharing(true)
        if (videoRef.current) videoRef.current.srcObject = mediaStream
        call.answer(mediaStream)

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
            {/* Session Code */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Session Code</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    value={sessionCode || 'Generating...'}
                    readOnly
                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                  />
                  <button onClick={copyCode} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
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
                  <div key={i} className={`flex ${msg.from === 'host' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === 'host' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
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
