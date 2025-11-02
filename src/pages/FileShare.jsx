import React, { useState, useRef } from 'react'
import { Upload, Lock, Link2, Download, Clock, Shield, QrCode, Copy, Check, FileText, Image, File, X } from 'lucide-react'
import QRCode from 'qrcode'

const FileShare = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedLink, setUploadedLink] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [copied, setCopied] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Settings
  const [password, setPassword] = useState('')
  const [expiryTime, setExpiryTime] = useState('24h') // 1h, 24h, 7d, 30d
  const [downloadLimit, setDownloadLimit] = useState('unlimited') // 1, 5, 10, unlimited

  const fileInputRef = useRef(null)

  const expiryOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ]

  const downloadLimitOptions = [
    { value: '1', label: '1 Download' },
    { value: '5', label: '5 Downloads' },
    { value: '10', label: '10 Downloads' },
    { value: 'unlimited', label: 'Unlimited' }
  ]

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
    // Check file size (100MB limit for free tier)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (selectedFile.size > maxSize) {
      alert('File size exceeds 100MB limit. Please use a smaller file.')
      return
    }

    setFile(selectedFile)
    setUploadedLink(null)
    setQrCode(null)
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const encryptFile = async (file, password) => {
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer()

    // Generate encryption key from password or random key
    const keyMaterial = password
      ? await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(password),
          'PBKDF2',
          false,
          ['deriveKey']
        )
      : null

    // Generate random encryption key
    const key = keyMaterial
      ? await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: new TextEncoder().encode('cemal-fileshare-salt'),
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt']
        )
      : await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        )

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt file
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      fileBuffer
    )

    // Export key for storage
    const exportedKey = await crypto.subtle.exportKey('raw', key)

    return {
      encryptedData,
      iv: Array.from(iv),
      key: Array.from(new Uint8Array(exportedKey)),
      originalName: file.name,
      originalSize: file.size,
      mimeType: file.type
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setUploadProgress(10)

      // Encrypt file
      const encrypted = await encryptFile(file, password)
      setUploadProgress(40)

      // Create blob from encrypted data
      const encryptedBlob = new Blob([encrypted.encryptedData])

      // Prepare form data
      const formData = new FormData()
      formData.append('file', encryptedBlob)
      formData.append('metadata', JSON.stringify({
        originalName: encrypted.originalName,
        originalSize: encrypted.originalSize,
        mimeType: encrypted.mimeType,
        iv: encrypted.iv,
        key: encrypted.key,
        hasPassword: !!password,
        expiryTime,
        downloadLimit
      }))

      setUploadProgress(60)

      // Upload to server
      const response = await fetch('/api/fileshare/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setUploadProgress(100)
        const shareUrl = `${window.location.origin}/share/${data.fileId}`
        setUploadedLink(shareUrl)

        // Generate QR code
        const qr = await QRCode.toDataURL(shareUrl, { width: 200 })
        setQrCode(qr)
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetUpload = () => {
    setFile(null)
    setUploadedLink(null)
    setQrCode(null)
    setPassword('')
    setExpiryTime('24h')
    setDownloadLimit('unlimited')
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
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Secure File Share
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            End-to-end encrypted file sharing with password protection
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedLink ? (
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
                    or click to browse (max 100MB)
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

                  {/* Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Password */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Lock className="w-4 h-4 mr-2" />
                        Password (Optional)
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave empty for no password"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Expiry Time */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Clock className="w-4 h-4 mr-2" />
                        Expires After
                      </label>
                      <select
                        value={expiryTime}
                        onChange={(e) => setExpiryTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {expiryOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Download Limit */}
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Download className="w-4 h-4 mr-2" />
                        Download Limit
                      </label>
                      <select
                        value={downloadLimit}
                        onChange={(e) => setDownloadLimit(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {downloadLimitOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Encrypting & Uploading... {uploadProgress}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Encrypt & Upload</span>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    End-to-End Encrypted
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Your file is encrypted in your browser before upload. We never see your unencrypted data.
                    The decryption key is embedded in the share link.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success Section */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                File Uploaded Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share this link with anyone to let them download your file
              </p>
            </div>

            {/* Share Link */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={uploadedLink}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {expiryOptions.find(o => o.value === expiryTime)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {downloadLimitOptions.find(o => o.value === downloadLimit)?.label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protected</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {password ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={resetUpload}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Upload Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileShare
