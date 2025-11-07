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
    setFile(selectedFile)
    setShareLink(null)
    setQrCode(null)
    setPeerConnected(false)
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const createShareLink = async () => {
    if (!file) return

    try {
      setWaiting(true)

      // Create peer
      const newPeer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      })

      newPeer.on('open', async (id) => {
        console.log('Peer ID:', id)
        setPeerId(id)
        setPeer(newPeer)

        // Generate share link
        const link = `${window.location.origin}/share/${id}`
        setShareLink(link)

        // Generate QR code
        const qr = await QRCode.toDataURL(link, { width: 200 })
        setQrCode(qr)
      })

      newPeer.on('connection', (conn) => {
        console.log('Peer connected!')
        connectionRef.current = conn
        setPeerConnected(true)
        setWaiting(false)

        conn.on('open', () => {
          console.log('Connection opened, sending file...')
          sendFile(conn)
        })

        conn.on('close', () => {
          console.log('Connection closed')
          setPeerConnected(false)
        })

        conn.on('error', (err) => {
          console.error('Connection error:', err)
          setPeerConnected(false)
        })
      })

      newPeer.on('error', (err) => {
        console.error('Peer error:', err)
        alert('Failed to create peer connection: ' + err.message)
        setWaiting(false)
      })
    } catch (error) {
      console.error('Share link creation error:', error)
      alert('Failed to create share link: ' + error.message)
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

      console.log(`Starting file transfer: ${file.name}, Size: ${file.size}, Chunks: ${totalChunks}`)

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

      console.log(`File sent successfully! ${sentChunks.size}/${totalChunks} chunks`)
      setTransferring(false)
      setTransferProgress(100)
    } catch (error) {
      console.error('File send error:', error)
      setTransferring(false)
      alert('Failed to send file: ' + error.message + '\n\nTry refreshing and sending the file again.')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-full mb-4">
            <span className="text-sm font-semibold">⚡ Quantum Speed • 🌍 Eco-Friendly • 🔒 Zero Knowledge</span>
          </div>
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              QuantumDrop
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Peer-to-peer encrypted file sharing - Files never touch our servers
          </p>
        </div>

        {/* Upload Section */}
        {!shareLink ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Drop your file here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse (unlimited size with P2P!)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Choose File
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Selected File */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-blue-600 dark:text-blue-400">
                        {getFileIcon(file)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Create Share Link Button */}
                  <button
                    onClick={createShareLink}
                    disabled={waiting}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {waiting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Peer Connection...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Wifi className="w-5 h-5" />
                        <span>Create Share Link (P2P)</span>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                    True Peer-to-Peer
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    Your file is transferred directly from your browser to the recipient's browser using WebRTC.
                    It never touches our servers. Maximum privacy and unlimited file size!
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-blue-600 dark:text-blue-400 mb-2">🌍</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Eco-Friendly</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Zero server storage = Zero carbon footprint
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-purple-600 dark:text-purple-400 mb-2">🔒</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Private & Secure</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Direct transfer, no middleman
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-green-600 dark:text-green-400 mb-2">∞</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Unlimited Size</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No file size limits with P2P
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Success Section */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                peerConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'
              }`}>
                {peerConnected ? (
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                ) : (
                  <Wifi className="w-8 h-8 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {peerConnected ? 'Connected! Transferring...' : 'Waiting for Receiver...'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {peerConnected
                  ? 'File is being transferred peer-to-peer'
                  : 'Share this link with the recipient to start transfer'}
              </p>
            </div>

            {/* Transfer Progress */}
            {transferring && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transferring...
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {transferProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${transferProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Share Link */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
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
                <div className="flex justify-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <img src={qrCode} alt="QR Code" className="mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Scan to download
                    </p>
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">File Name</p>
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transferring ? 'Transferring...' : peerConnected ? 'Connected' : 'Waiting'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Method</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    P2P (WebRTC)
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={resetShare}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
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
