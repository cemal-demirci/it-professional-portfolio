import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gauge, Zap, ArrowRight, Loader2 } from 'lucide-react'

const QuickSpeedTest = () => {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState(null)

  const runQuickTest = async () => {
    setTesting(true)

    try {
      // Quick download test
      const downloadSpeed = await testDownloadSpeed()

      // Quick latency test
      const latency = await testLatency()

      setResults({
        download: downloadSpeed,
        latency: latency,
        timestamp: new Date().toLocaleString()
      })
    } catch (error) {
      console.error('Speed test error:', error)
    } finally {
      setTesting(false)
    }
  }

  const testDownloadSpeed = async () => {
    const testFileSize = 2 * 1024 * 1024 // 2MB for quick test
    const testUrl = 'https://speed.cloudflare.com/__down?bytes=' + testFileSize

    const startTime = Date.now()

    try {
      const response = await fetch(testUrl, { cache: 'no-store' })
      const blob = await response.blob()
      const endTime = Date.now()

      const duration = (endTime - startTime) / 1000
      const bitsLoaded = blob.size * 8
      const speedBps = bitsLoaded / duration
      const speedMbps = (speedBps / (1024 * 1024)).toFixed(1)

      return parseFloat(speedMbps)
    } catch (error) {
      console.error('Download test failed:', error)
      return 0
    }
  }

  const testLatency = async () => {
    const pings = []

    // Test 3 times for quick test
    for (let i = 0; i < 3; i++) {
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

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse-slow">
            <Gauge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Speed Test</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Test your internet speed in seconds ⚡</p>
          </div>
        </div>

        {!testing && !results && (
          <button
            onClick={runQuickTest}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 font-medium"
          >
            <Zap className="w-4 h-4" />
            Test Now
          </button>
        )}
      </div>

      {testing && (
        <div className="flex items-center justify-center py-6">
          <div className="text-center space-y-3">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Testing your connection...</p>
          </div>
        </div>
      )}

      {results && !testing && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Download</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.download}</div>
              <div className="text-xs text-gray-500">Mbps</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Latency</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.latency}</div>
              <div className="text-xs text-gray-500">ms</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runQuickTest}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium"
            >
              Test Again
            </button>
            <Link
              to="/tools/speed-test"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2 group"
            >
              Full Test
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-500">
            {results.timestamp}
          </p>
        </div>
      )}

      {!results && !testing && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the button to test your connection speed
          </p>
          <Link
            to="/tools/network-diagnostics"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-2"
          >
            Need network diagnostics?
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default QuickSpeedTest
