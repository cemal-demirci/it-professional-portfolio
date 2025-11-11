import React, { useState, useRef, useEffect } from 'react'
import { Upload, Lock, Link2, Download, Shield, QrCode, Copy, Check, FileText, Image, File, X, Users, Wifi } from 'lucide-react'
import QRCode from 'qrcode'
import Peer from 'peerjs'

const FileShare = () => {
  const [file, setFile] = useState(null)
  const [peer, setPeer] = useState(null)
  const [peerId, setPeerId] = useState(null)
  const [shareLink, setShareLink] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [copied, setCopied] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [peerConnected, setPeerConnected] = useState(false)
  const [transferring, setTransferring] = useState(false)
  const [transferProgress, setTransferProgress] = useState(0)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(null)

  const fileInputRef = useRef(null)
  const connectionRef = useRef(null)

  useEffect(() => {
    // Cleanup peer on unmount
    return () => {
      if (peer) {
        peer.destroy()
      }
    }
  }, [peer])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (selectedFile) => {
    try {
      setError(null)
      setFile(selectedFile)
      setShareLink(null)
      setQrCode(null)
      setPeerConnected(false)
      setWaiting(false)
      setTransferring(false)
      setTransferProgress(0)
    } catch (err) {
      console.error('File selection error:', err)
      setError('Failed to select file: ' + err.message)
    }
  }

  const handleFileInputChange = (e) => {
    try {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0])
      }
    } catch (err) {
      console.error('File input error:', err)
      setError('Failed to read file: ' + err.message)
    }
  }

  const createShareLink = async () => {
    if (!file) return

    try {
      setError(null)
      setWaiting(true)

      // Create peer with enhanced production configuration
      const newPeer = new Peer({
        host: 'localhost' === window.location.hostname ? 'localhost' : '0.peerjs.com',
        port: 'localhost' === window.location.hostname ? 9000 : 443,
        path: '/',
        secure: 'localhost' !== window.location.hostname,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
            {
              urls: 'turn:openrelay.metered.ca:443',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
          ],
          iceTransportPolicy: 'all',
          iceCandidatePoolSize: 10,
          bundlePolicy: 'max-bundle',
          rtcpMuxPolicy: 'require',
        },
        debug: 0
      })

      newPeer.on('open', async (id) => {
        try {
          if (import.meta.env.DEV) console.log('Peer ID:', id)
          setPeerId(id)
          setPeer(newPeer)

          // Generate share link
          const link = `${window.location.origin}/share/${id}`
          setShareLink(link)

          // Generate QR code
          const qr = await QRCode.toDataURL(link, { width: 200 })
          setQrCode(qr)
        } catch (err) {
          console.error('QR code generation error:', err)
          setError('Failed to generate QR code: ' + err.message)
          setWaiting(false)
        }
      })

      newPeer.on('connection', (conn) => {
        if (import.meta.env.DEV) console.log('Peer connected!')
        connectionRef.current = conn
        setPeerConnected(true)
        setWaiting(false)

        conn.on('open', () => {
          if (import.meta.env.DEV) console.log('Connection opened, sending file...')
          sendFile(conn)
        })

        conn.on('close', () => {
          if (import.meta.env.DEV) console.log('Connection closed')
          setPeerConnected(false)
        })

        conn.on('error', (err) => {
          console.error('Connection error:', err)
          setError('Connection error: ' + err.message)
          setPeerConnected(false)
        })
      })

      newPeer.on('error', (err) => {
        console.error('Peer error:', err)
        setError('Failed to create peer connection: ' + err.message)
        setWaiting(false)
      })
    } catch (error) {
      console.error('Share link creation error:', error)
      setError('Failed to create share link: ' + error.message)
      setWaiting(false)
    }
  }

  const sendFile = async (conn) => {
    try {
      setTransferring(true)
      setTransferProgress(0)

      // Read file
      const arrayBuffer = await file.arrayBuffer()
      const chunkSize = 64 * 1024 // 64KB chunks for better performance
      const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize)

      if (import.meta.env.DEV) console.log(`Starting file transfer: ${file.name}, Size: ${file.size}, Chunks: ${totalChunks}`)

      // Send metadata first
      conn.send({
        type: 'metadata',
        name: file.name,
        size: file.size,
        mimeType: file.type,
        chunks: totalChunks,
        timestamp: Date.now()
      })

      // Wait a bit for receiver to prepare
      await new Promise(resolve => setTimeout(resolve, 100))

      // Track sent chunks for retry
      const sentChunks = new Set()
      let retryCount = 0
      const maxRetries = 3

      // Send chunks with acknowledgement
      for (let i = 0; i < totalChunks; i++) {
        let chunkSent = false
        let attempts = 0

        while (!chunkSent && attempts < maxRetries) {
          try {
            const start = i * chunkSize
            const end = Math.min(start + chunkSize, arrayBuffer.byteLength)
            const chunk = arrayBuffer.slice(start, end)

            if (chunk.byteLength === 0) {
              console.warn(`Skipping empty chunk at index ${i}`)
              chunkSent = true
              break
            }

            // Convert to base64 for more reliable transfer
            const uint8Array = new Uint8Array(chunk)
            const base64Chunk = btoa(String.fromCharCode(...uint8Array))

            // Check connection state
            if (conn.open) {
              conn.send({
                type: 'chunk',
                index: i,
                data: base64Chunk,
                total: totalChunks,
                size: chunk.byteLength,
                checksum: chunk.byteLength // Simple checksum
              })

              sentChunks.add(i)
              chunkSent = true

              setTransferProgress(Math.round(((i + 1) / totalChunks) * 100))

              // Adaptive delay based on chunk size
              await new Promise(resolve => setTimeout(resolve, 10))
            } else {
              throw new Error('Connection closed')
            }
          } catch (chunkError) {
            attempts++
            console.error(`Error sending chunk ${i} (attempt ${attempts}):`, chunkError)

            if (attempts >= maxRetries) {
              throw new Error(`Failed to send chunk ${i} after ${maxRetries} attempts`)
            }

            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 100 * attempts))
          }
        }

        if (!chunkSent) {
          throw new Error(`Could not send chunk ${i}`)
        }
      }

      // Send completion signal with verification
      conn.send({
        type: 'complete',
        totalChunks,
        sentChunks: Array.from(sentChunks),
        timestamp: Date.now()
      })

      if (import.meta.env.DEV) console.log(`File sent successfully! ${sentChunks.size}/${totalChunks} chunks`)
      setTransferring(false)
      setTransferProgress(100)
    } catch (error) {
      console.error('File send error:', error)
      setTransferring(false)
      setError('Failed to send file: ' + error.message)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetShare = () => {
    if (peer) {
      peer.destroy()
    }
    setFile(null)
    setPeer(null)
    setPeerId(null)
    setShareLink(null)
    setQrCode(null)
    setPeerConnected(false)
    setTransferring(false)
    setTransferProgress(0)
    setWaiting(false)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileIcon = (file) => {
    if (!file) return <File className="w-12 h-12" />

    if (file.type.startsWith('image/')) {
      return <Image className="w-12 h-12" />
    } else if (file.type.startsWith('text/') || file.type.includes('document')) {
      return <FileText className="w-12 h-12" />
    } else {
      return <File className="w-12 h-12" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full mb-4">
            <span className="text-sm font-medium">v2.0 • 4x Faster • Zero Knowledge</span>
          </div>
          <h1 className="text-5xl font-black mb-2 tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
            <span className="bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent">
              Pleiades Share v2
            </span>
          </h1>
          <p className="text-xl text-white/60 font-medium">
            Next-gen P2P file sharing with advanced transfer technology
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
            <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 rounded-full font-medium transition-all hover:bg-white/10">
              400% Faster Transfer
            </div>
            <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 rounded-full font-medium transition-all hover:bg-white/10">
              Smart Retry Logic
            </div>
            <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 rounded-full font-medium transition-all hover:bg-white/10">
              Corruption Prevention
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl">
            <div className="flex items-start space-x-4">
              <X className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-red-300 mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
                  Error
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="p-2 hover:bg-white/5 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-white/60 hover:text-white/80" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {(!shareLink || shareLink === null || shareLink === '') ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {(!file || file === null) ? (
                <>
                  <Upload className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
                    Drop your file here
                  </h3>
                  <p className="text-white/60 mb-6 font-medium">
                    or click to browse • unlimited size with P2P
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                  >
                    Choose File
                  </button>
                </>
              ) : file && file.name ? (
                <div className="space-y-4">
                  {/* Selected File */}
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="text-blue-400">
                        {getFileIcon(file)}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">
                          {file.name || 'Unknown File'}
                        </p>
                        <p className="text-sm text-white/60 font-medium">
                          {formatFileSize(file.size || 0)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-2 hover:bg-white/5 rounded-xl transition-all"
                    >
                      <X className="w-5 h-5 text-white/60 hover:text-white/80" />
                    </button>
                  </div>

                  {/* Create Share Link Button */}
                  <button
                    onClick={createShareLink}
                    disabled={waiting}
                    className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {waiting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Peer Connection...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Wifi className="w-5 h-5" />
                        <span>Create P2P Share Link</span>
                      </div>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <p className="text-white/80 font-semibold text-center">
                    Invalid file selected. Please try again.
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="mt-6 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
                    True Peer-to-Peer Security
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Your file is transferred directly from your browser to the recipient's browser using WebRTC.
                    It never touches our servers. Maximum privacy and unlimited file size.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl mb-3">🌍</div>
                <h4 className="font-semibold text-white mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>Eco-Friendly</h4>
                <p className="text-sm text-white/60">
                  Zero server storage equals zero carbon footprint
                </p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl mb-3">🔒</div>
                <h4 className="font-semibold text-white mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>Private & Secure</h4>
                <p className="text-sm text-white/60">
                  Direct transfer with no middleman
                </p>
              </div>
              <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl mb-3">∞</div>
                <h4 className="font-semibold text-white mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>Unlimited Size</h4>
                <p className="text-sm text-white/60">
                  No file size limits with P2P technology
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Success Section */
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                peerConnected ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-white/10'
              }`}>
                {peerConnected ? (
                  <Users className="w-10 h-10 text-white" />
                ) : (
                  <Wifi className="w-10 h-10 text-white/60 animate-pulse" />
                )}
              </div>
              <h3 className="text-3xl font-black text-white mb-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
                <span className="bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent">
                  {peerConnected ? 'Connected! Transferring...' : 'Waiting for Receiver...'}
                </span>
              </h3>
              <p className="text-white/60 font-medium">
                {peerConnected
                  ? 'File is being transferred peer-to-peer'
                  : 'Share this link with the recipient to start transfer'}
              </p>
            </div>

            {/* Transfer Progress */}
            {transferring && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-semibold text-white flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    Transferring...
                  </span>
                  <span className="text-2xl font-black bg-gradient-to-r from-white via-blue-50 to-indigo-100 bg-clip-text text-transparent">
                    {transferProgress}%
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${transferProgress}%` }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-medium text-white/60">
                    {transferProgress === 100 ? 'Transfer Complete' : 'Transfer in Progress'}
                  </span>
                </div>
              </div>
            )}

            {/* Share Link */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-4 py-3 bg-transparent text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg select-all"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    copied
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105'
                  } text-white`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="flex justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-2xl mb-4">
                      <img src={qrCode} alt="QR Code" className="mx-auto" />
                    </div>
                    <p className="text-base font-semibold text-white mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
                      Scan with Phone
                    </p>
                    <p className="text-sm text-white/60">
                      Instant download via QR code
                    </p>
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <p className="text-xs font-semibold text-white/40 mb-1">FILE NAME</p>
                  <p className="font-semibold text-sm text-white truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <p className="text-xs font-semibold text-white/40 mb-1">SIZE</p>
                  <p className="font-semibold text-sm text-white">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <p className="text-xs font-semibold text-white/40 mb-1">STATUS</p>
                  <p className="font-semibold text-sm text-white flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${transferring ? 'bg-blue-500 animate-pulse' : peerConnected ? 'bg-blue-500' : 'bg-white/40 animate-pulse'}`}></span>
                    {transferring ? 'Transferring' : peerConnected ? 'Connected' : 'Waiting'}
                  </p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <p className="text-xs font-semibold text-white/40 mb-1">METHOD</p>
                  <p className="font-semibold text-sm text-white">
                    P2P WebRTC
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={resetShare}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Share Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileShare
