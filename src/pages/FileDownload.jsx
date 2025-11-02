import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Download, Shield, FileText, Image, File, Loader2, AlertCircle, Check, Users, Wifi } from 'lucide-react'
import Peer from 'peerjs'

const FileDownload = () => {
  const { fileId } = useParams()
  const [peer, setPeer] = useState(null)
  const [connecting, setConnecting] = useState(true)
  const [connected, setConnected] = useState(false)
  const [fileMetadata, setFileMetadata] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const chunksRef = useRef([])
  const totalChunksRef = useRef(0)

  useEffect(() => {
    connectToPeer()

    return () => {
      if (peer) {
        peer.destroy()
      }
    }
  }, [fileId])

  const connectToPeer = () => {
    try {
      const newPeer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
          ]
        }
      })

      newPeer.on('open', (id) => {
        console.log('My peer ID:', id)
        console.log('Connecting to sender:', fileId)

        // Connect to sender
        const conn = newPeer.connect(fileId, { reliable: true })

        conn.on('open', () => {
          console.log('Connected to sender!')
          setConnected(true)
          setConnecting(false)
        })

        conn.on('data', (data) => {
          handleDataReceived(data)
        })

        conn.on('close', () => {
          console.log('Connection closed')
          if (!downloadComplete) {
            setError('Connection lost before download completed')
          }
        })

        conn.on('error', (err) => {
          console.error('Connection error:', err)
          setError('Connection error: ' + err.message)
          setConnecting(false)
        })
      })

      newPeer.on('error', (err) => {
        console.error('Peer error:', err)
        setError('Failed to connect: ' + err.message)
        setConnecting(false)
      })

      setPeer(newPeer)
    } catch (error) {
      console.error('Setup error:', error)
      setError('Failed to initialize: ' + error.message)
      setConnecting(false)
    }
  }

  const handleDataReceived = (data) => {
    if (data.type === 'metadata') {
      console.log('Received metadata:', data)
      setFileMetadata({
        name: data.name,
        size: data.size,
        mimeType: data.mimeType
      })
      totalChunksRef.current = data.chunks
      chunksRef.current = new Array(data.chunks)
      setDownloading(true)
    } else if (data.type === 'chunk') {
      chunksRef.current[data.index] = data.data
      const receivedChunks = chunksRef.current.filter(c => c !== undefined).length
      setDownloadProgress(Math.round((receivedChunks / totalChunksRef.current) * 100))
    } else if (data.type === 'complete') {
      console.log('Transfer complete!')
      assembleAndDownload()
    }
  }

  const assembleAndDownload = () => {
    try {
      // Combine all chunks
      const totalSize = chunksRef.current.reduce((sum, chunk) => sum + chunk.byteLength, 0)
      const completeFile = new Uint8Array(totalSize)

      let offset = 0
      for (const chunk of chunksRef.current) {
        completeFile.set(new Uint8Array(chunk), offset)
        offset += chunk.byteLength
      }

      // Create blob and download
      const blob = new Blob([completeFile], { type: fileMetadata.mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileMetadata.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setDownloadComplete(true)
      setDownloading(false)
      setDownloadProgress(100)
    } catch (error) {
      console.error('Assembly error:', error)
      setError('Failed to download file: ' + error.message)
      setDownloading(false)
    }
  }

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <File className="w-16 h-16" />

    if (mimeType.startsWith('image/')) {
      return <Image className="w-16 h-16" />
    } else if (mimeType.startsWith('text/') || mimeType.includes('document')) {
      return <FileText className="w-16 h-16" />
    } else {
      return <File className="w-16 h-16" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (connecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Wifi className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Connecting to sender...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Make sure the sender is still online and hasn't closed their browser.
            </p>
            <a
              href="/fileshare"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Share Your Own File
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (downloadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Download Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {fileMetadata.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              {formatFileSize(fileMetadata.size)}
            </p>
            <a
              href="/fileshare"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Share Your Own File
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* File Icon */}
          <div className="text-center mb-6">
            {fileMetadata && (
              <>
                <div className="inline-flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {getFileIcon(fileMetadata.mimeType)}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {fileMetadata.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatFileSize(fileMetadata.size)}
                </p>
              </>
            )}
          </div>

          {/* Connection Status */}
          {connected && !downloading && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-300">
                    Connected to sender
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    Waiting for file transfer to begin...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Download Progress */}
          {downloading && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Downloading via P2P...
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {downloadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Security Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Secure P2P Transfer
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  This file is being transferred directly from the sender's browser to yours using WebRTC.
                  No servers involved, maximum privacy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileDownload
