import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Download, Lock, Shield, FileText, Image, File, Loader2, AlertCircle, Check } from 'lucide-react'

const FileDownload = () => {
  const { fileId } = useParams()
  const [loading, setLoading] = useState(true)
  const [fileInfo, setFileInfo] = useState(null)
  const [password, setPassword] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [passwordRequired, setPasswordRequired] = useState(false)

  useEffect(() => {
    fetchFileInfo()
  }, [fileId])

  const fetchFileInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/fileshare/info/${fileId}`)
      const data = await response.json()

      if (data.success) {
        setFileInfo(data.fileInfo)
        setPasswordRequired(data.fileInfo.hasPassword)
      } else {
        setError(data.error || 'File not found or expired')
      }
    } catch (error) {
      console.error('Error fetching file info:', error)
      setError('Failed to load file information')
    } finally {
      setLoading(false)
    }
  }

  const decryptFile = async (encryptedData, key, iv) => {
    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(key),
      'AES-GCM',
      false,
      ['decrypt']
    )

    // Decrypt
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv)
      },
      cryptoKey,
      encryptedData
    )

    return decryptedData
  }

  const handleDownload = async () => {
    if (passwordRequired && !password) {
      alert('Please enter the password')
      return
    }

    try {
      setDownloading(true)
      setDownloadProgress(10)
      setError(null)

      // Download encrypted file
      const response = await fetch(`/api/fileshare/download/${fileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password || undefined })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Download failed')
      }

      const data = await response.json()
      setDownloadProgress(40)

      // Convert base64 to ArrayBuffer
      const encryptedData = Uint8Array.from(atob(data.encryptedData), c => c.charCodeAt(0))
      setDownloadProgress(60)

      // Decrypt file
      const decryptedData = await decryptFile(
        encryptedData,
        data.metadata.key,
        data.metadata.iv
      )
      setDownloadProgress(80)

      // Create blob and download
      const blob = new Blob([decryptedData], { type: data.metadata.mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data.metadata.originalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setDownloadProgress(100)

      // Refresh file info to show updated download count
      setTimeout(() => {
        fetchFileInfo()
      }, 1000)
    } catch (error) {
      console.error('Download error:', error)
      setError(error.message)
    } finally {
      setDownloading(false)
      setDownloadProgress(0)
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

  const formatExpiryTime = (expiryTime) => {
    const now = new Date().getTime()
    const expiry = new Date(expiryTime).getTime()
    const diff = expiry - now

    if (diff <= 0) return 'Expired'

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return 'Less than 1 hour'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading file information...</p>
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
              File Not Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <a
              href="/fileshare"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Upload New File
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
            <div className="inline-flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              {getFileIcon(fileInfo.mimeType)}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {fileInfo.originalName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {formatFileSize(fileInfo.originalSize)}
            </p>
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expires In</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatExpiryTime(fileInfo.expiryTime)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {fileInfo.downloadCount}/{fileInfo.downloadLimit === 'unlimited' ? '∞' : fileInfo.downloadLimit}
              </p>
            </div>
          </div>

          {/* Password Input */}
          {passwordRequired && (
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Lock className="w-4 h-4 mr-2" />
                Password Required
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to download"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {downloading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Downloading... {downloadProgress}%</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download File</span>
              </div>
            )}
          </button>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Secure Download
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  This file is encrypted end-to-end. Decryption happens in your browser for maximum security.
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
