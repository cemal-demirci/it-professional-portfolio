import { useState } from 'react'
import { Gauge, Download, Upload, Zap, AlertCircle, CheckCircle, Activity } from 'lucide-react'

const SpeedTest = () => {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState(null)
  const [progress, setProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState('')

  const runSpeedTest = async () => {
    setTesting(true)
    setProgress(0)
    setCurrentTest('Preparing...')

    try {
      // Test Download Speed
      setCurrentTest('Testing Download Speed...')
      const downloadSpeed = await testDownloadSpeed()
      setProgress(50)

      // Test Upload Speed
      setCurrentTest('Testing Upload Speed...')
      const uploadSpeed = await testUploadSpeed()
      setProgress(75)

      // Test Latency
      setCurrentTest('Testing Latency...')
      const latency = await testLatency()
      setProgress(100)

      setResults({
        download: downloadSpeed,
        upload: uploadSpeed,
        latency: latency,
        timestamp: new Date().toLocaleString()
      })

      setCurrentTest('Test Complete!')
    } catch (error) {
      console.error('Speed test error:', error)
      setResults({
        error: 'Test failed. Please try again.'
      })
    } finally {
      setTesting(false)
    }
  }

  const testDownloadSpeed = async () => {
    // Use a public CDN file for download speed test
    const testFileSize = 5 * 1024 * 1024 // 5MB
    const testUrl = 'https://speed.cloudflare.com/__down?bytes=' + testFileSize

    const startTime = Date.now()

    try {
      const response = await fetch(testUrl, { cache: 'no-store' })
      const blob = await response.blob()
      const endTime = Date.now()

      const duration = (endTime - startTime) / 1000 // seconds
      const bitsLoaded = blob.size * 8
      const speedBps = bitsLoaded / duration
      const speedMbps = (speedBps / (1024 * 1024)).toFixed(2)

      return parseFloat(speedMbps)
    } catch (error) {
      console.error('Download test failed:', error)
      return 0
    }
  }

  const testUploadSpeed = async () => {
    // Create dummy data for upload
    const testData = new Blob([new ArrayBuffer(1 * 1024 * 1024)]) // 1MB

    try {
      const startTime = Date.now()

      // Use Cloudflare speed test endpoint
      await fetch('https://speed.cloudflare.com/__up', {
        method: 'POST',
        body: testData,
        cache: 'no-store'
      })

      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000
      const bitsLoaded = testData.size * 8
      const speedBps = bitsLoaded / duration
      const speedMbps = (speedBps / (1024 * 1024)).toFixed(2)

      return parseFloat(speedMbps)
    } catch (error) {
      console.error('Upload test failed:', error)
      return 0
    }
  }

  const testLatency = async () => {
    const pings = []

    // Test 5 times and get average
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now()

      try {
        await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
          cache: 'no-store',
          mode: 'no-cors'
        })

        const endTime = Date.now()
        pings.push(endTime - startTime)
      } catch (error) {
        console.error('Ping failed:', error)
      }
    }

    if (pings.length === 0) return 0

    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length
    return Math.round(avgPing)
  }

  const getSpeedRating = (speed, type) => {
    if (type === 'download') {
      if (speed >= 100) return { text: 'Excellent', color: 'text-green-600' }
      if (speed >= 50) return { text: 'Good', color: 'text-blue-600' }
      if (speed >= 25) return { text: 'Average', color: 'text-yellow-600' }
      return { text: 'Slow', color: 'text-red-600' }
    } else {
      if (speed >= 50) return { text: 'Excellent', color: 'text-green-600' }
      if (speed >= 25) return { text: 'Good', color: 'text-blue-600' }
      if (speed >= 10) return { text: 'Average', color: 'text-yellow-600' }
      return { text: 'Slow', color: 'text-red-600' }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Gauge className="w-8 h-8 text-primary-600" />
          Internet Speed Test 🚀
        </h1>
        <p className="text-gray-400">
          Let's see if your "high-speed" internet is actually high-speed 😏
        </p>
        <p className="text-sm text-gray-500 italic">
          Test your download, upload speed and latency
        </p>
      </div>

      {/* Main Test Card */}
      <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg">
        {!results && !testing && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <Zap className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Ready to test your speed?
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Click the button below to measure your internet connection speed. This test will measure download speed, upload speed, and latency.
            </p>
            <button
              onClick={runSpeedTest}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <Activity className="w-6 h-6" />
              Start Test
            </button>
          </div>
        )}

        {testing && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Activity className="w-16 h-16 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {currentTest}
            </h2>
            <div className="w-full bg-gray-200 bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">
              {progress}% Complete
            </p>
          </div>
        )}

        {results && !results.error && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-7 h-7 text-green-600" />
                Test Results
              </h2>
              <button
                onClick={runSpeedTest}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all text-sm"
              >
                Test Again
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Download Speed */}
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Download</div>
                    <div className={`text-xs ${getSpeedRating(results.download, 'download').color} font-semibold`}>
                      {getSpeedRating(results.download, 'download').text}
                    </div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white">
                  {results.download}
                </div>
                <div className="text-sm text-gray-400">Mbps</div>
              </div>

              {/* Upload Speed */}
              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-6 border border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Upload</div>
                    <div className={`text-xs ${getSpeedRating(results.upload, 'upload').color} font-semibold`}>
                      {getSpeedRating(results.upload, 'upload').text}
                    </div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white">
                  {results.upload}
                </div>
                <div className="text-sm text-gray-400">Mbps</div>
              </div>

              {/* Latency */}
              <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-6 border border-purple-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Latency</div>
                    <div className={`text-xs ${results.latency < 50 ? 'text-green-600' : results.latency < 100 ? 'text-yellow-600' : 'text-red-600'} font-semibold`}>
                      {results.latency < 50 ? 'Excellent' : results.latency < 100 ? 'Good' : 'High'}
                    </div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-white">
                  {results.latency}
                </div>
                <div className="text-sm text-gray-400">ms</div>
              </div>
            </div>

            <div className="bg-gray-50 bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-400">
                <strong>Test completed at:</strong> {results.timestamp}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Using Cloudflare speed test servers for accurate measurements.
              </p>
            </div>
          </div>
        )}

        {results && results.error && (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Test Failed
            </h2>
            <p className="text-gray-400">
              {results.error}
            </p>
            <button
              onClick={runSpeedTest}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Download test: Measures how fast you can download data from the internet</li>
              <li>Upload test: Measures how fast you can upload data to the internet</li>
              <li>Latency (Ping): Measures the delay between your request and server response</li>
            </ul>
            <p className="mt-2 text-xs italic">
              For best results, close other applications using your network connection during the test.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpeedTest
