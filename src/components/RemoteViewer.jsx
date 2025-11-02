import React, { useState, useRef, useEffect } from 'react'
import { Monitor, ArrowLeft, MessageCircle, Send, Loader2 } from 'lucide-react'
import Peer from 'peerjs'

const RemoteViewer = ({ onBack }) => {
  const [sessionCode, setSessionCode] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [stream, setStream] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [error, setError] = useState(null)

  const peerRef = useRef(null)
  const connectionRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    return () => {
      if (peerRef.current) peerRef.current.destroy()
    }
  }, [])

  const connectToHost = () => {
    if (!sessionCode.trim()) return
    setConnecting(true)
    setError(null)

    const peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    })

    peer.on('open', () => {
      const conn = peer.connect(sessionCode)
      connectionRef.current = conn

      conn.on('open', () => {
        setConnected(true)
        setConnecting(false)

        const call = peer.call(sessionCode, new MediaStream())
        call.on('stream', (remoteStream) => {
          setStream(remoteStream)
          if (videoRef.current) videoRef.current.srcObject = remoteStream
        })
      })

      conn.on('data', (data) => {
        if (data.type === 'chat') {
          setMessages(prev => [...prev, { from: 'host', text: data.message }])
        }
      })

      conn.on('error', (err) => {
        setError('Connection error: ' + err.message)
        setConnecting(false)
      })
    })

    peer.on('error', (err) => {
      setError('Failed to connect: ' + err.message)
      setConnecting(false)
    })

    peerRef.current = peer
  }

  const sendMessage = () => {
    if (!messageText.trim() || !connectionRef.current) return
    connectionRef.current.send({ type: 'chat', message: messageText })
    setMessages(prev => [...prev, { from: 'viewer', text: messageText }])
    setMessageText('')
  }

  if (!connected && !connecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-8">
        <div className="max-w-md w-full px-4">
          <button onClick={onBack} className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
                <Monitor className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Connect to Computer</h2>
              <p className="text-gray-600 dark:text-gray-400">Enter the session code from the host</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && connectToHost()}
                placeholder="Enter session code..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                onClick={connectToHost}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (connecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Connecting to host...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={onBack} className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Disconnect
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Remote Screen</h2>
              <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
                <video ref={videoRef} autoPlay className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat
            </h3>
            <div className="space-y-3 mb-4 h-96 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'viewer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.from === 'viewer' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
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
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button onClick={sendMessage} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoteViewer
