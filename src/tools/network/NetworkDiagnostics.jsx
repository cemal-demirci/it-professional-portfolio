import { useState } from 'react'
import { Network, Activity, Globe, MapPin, Clock, AlertCircle, Play, Loader } from 'lucide-react'

const NetworkDiagnostics = () => {
  const [target, setTarget] = useState('')
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState(null)

  const runDiagnostics = async () => {
    if (!target.trim()) {
      alert('Please enter a domain or IP address')
      return
    }

    setTesting(true)
    setResults(null)

    try {
      const diagnosticResults = {
        target: target,
        timestamp: new Date().toLocaleString(),
        ping: await testPing(target),
        dns: await testDNS(target),
        geoLocation: await getGeoLocation(target),
        headers: await testConnection(target)
      }

      setResults(diagnosticResults)
    } catch (error) {
      console.error('Diagnostics error:', error)
      setResults({
        error: 'Failed to run diagnostics. Please check the target and try again.'
      })
    } finally {
      setTesting(false)
    }
  }

  const testPing = async (domain) => {
    const attempts = 5
    const pings = []

    for (let i = 0; i < attempts; i++) {
      const startTime = performance.now()

      try {
        // Use no-cors fetch to measure latency
        await fetch(`https://${domain}`, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store'
        })

        const endTime = performance.now()
        const latency = Math.round(endTime - startTime)
        pings.push(latency)
      } catch (error) {
        pings.push(-1) // Failed ping
      }
    }

    const validPings = pings.filter(p => p > 0)
    if (validPings.length === 0) {
      return {
        success: false,
        message: 'All pings failed'
      }
    }

    const min = Math.min(...validPings)
    const max = Math.max(...validPings)
    const avg = Math.round(validPings.reduce((a, b) => a + b, 0) / validPings.length)
    const packetLoss = Math.round(((pings.length - validPings.length) / pings.length) * 100)

    return {
      success: true,
      min,
      max,
      avg,
      packetLoss,
      attempts: pings.length,
      received: validPings.length
    }
  }

  const testDNS = async (domain) => {
    try {
      // Extract domain from URL if needed
      const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0]

      // Use DNS over HTTPS (DoH) - Cloudflare
      const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=A`, {
        headers: {
          'Accept': 'application/dns-json'
        }
      })

      const data = await response.json()

      if (data.Answer && data.Answer.length > 0) {
        const ips = data.Answer.filter(a => a.type === 1).map(a => a.data)

        return {
          success: true,
          ips: ips,
          ttl: data.Answer[0].TTL
        }
      }

      return {
        success: false,
        message: 'No DNS records found'
      }
    } catch (error) {
      return {
        success: false,
        message: 'DNS lookup failed: ' + error.message
      }
    }
  }

  const getGeoLocation = async (domain) => {
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0]

      // Try to get DNS first
      const dnsResult = await testDNS(cleanDomain)

      if (!dnsResult.success || dnsResult.ips.length === 0) {
        return {
          success: false,
          message: 'Could not resolve IP for geolocation'
        }
      }

      const ip = dnsResult.ips[0]

      // Use ipapi.co for geolocation (free tier)
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      const data = await response.json()

      if (data.error) {
        return {
          success: false,
          message: data.reason || 'Geolocation lookup failed'
        }
      }

      return {
        success: true,
        ip: ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        isp: data.org,
        timezone: data.timezone
      }
    } catch (error) {
      return {
        success: false,
        message: 'Geolocation failed: ' + error.message
      }
    }
  }

  const testConnection = async (domain) => {
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '')
      const url = cleanDomain.startsWith('http') ? cleanDomain : `https://${cleanDomain}`

      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-store'
      })

      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      }
    } catch (error) {
      return {
        success: false,
        message: 'Connection test failed (CORS may be blocking): ' + error.message
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Network className="w-8 h-8 text-primary-600" />
          Network Diagnostics 🔍
        </h1>
        <p className="text-gray-400">
          Because "Did you try turning it off and on again?" wasn't enough
        </p>
        <p className="text-sm text-gray-500 italic">
          Comprehensive network testing: Ping, DNS, Geolocation & Connection Test
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && runDiagnostics()}
            placeholder="Enter domain or IP (e.g., google.com, 8.8.8.8)"
            className="input-field flex-1 bg-gray-700 border-gray-600 text-white"
            disabled={testing}
          />
          <button
            onClick={runDiagnostics}
            disabled={testing || !target.trim()}
            className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
          >
            {testing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Diagnostics
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && !results.error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ping Results */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-600" />
              Ping Test
            </h2>
            {results.ping.success ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{results.ping.min}ms</div>
                    <div className="text-xs text-gray-400">Min</div>
                  </div>
                  <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.ping.avg}ms</div>
                    <div className="text-xs text-gray-400">Avg</div>
                  </div>
                  <div className="text-center p-3 bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{results.ping.max}ms</div>
                    <div className="text-xs text-gray-400">Max</div>
                  </div>
                </div>
                <div className="bg-gray-50 bg-gray-700/50 rounded-lg p-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Packets Sent:</span>
                    <span className="font-semibold text-white">{results.ping.attempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Packets Received:</span>
                    <span className="font-semibold text-white">{results.ping.received}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Packet Loss:</span>
                    <span className={`font-semibold ${results.ping.packetLoss > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {results.ping.packetLoss}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-400 text-sm">
                {results.ping.message}
              </div>
            )}
          </div>

          {/* DNS Results */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              DNS Lookup
            </h2>
            {results.dns.success ? (
              <div className="space-y-3">
                <div className="bg-blue-900/20 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-2">Resolved IP Addresses:</div>
                  {results.dns.ips.map((ip, index) => (
                    <div key={index} className="font-mono text-sm text-white bg-gray-800 px-3 py-2 rounded border border-gray-700 mb-1">
                      {ip}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  TTL: <span className="font-semibold text-white">{results.dns.ttl}s</span>
                </div>
              </div>
            ) : (
              <div className="text-red-400 text-sm">
                {results.dns.message}
              </div>
            )}
          </div>

          {/* Geolocation Results */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-purple-600" />
              Geolocation
            </h2>
            {results.geoLocation.success ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">IP Address:</span>
                  <span className="font-mono font-semibold text-white">{results.geoLocation.ip}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Location:</span>
                  <span className="font-semibold text-white">
                    {results.geoLocation.city}, {results.geoLocation.country}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">ISP:</span>
                  <span className="font-semibold text-white">{results.geoLocation.isp}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400">Timezone:</span>
                  <span className="font-semibold text-white">{results.geoLocation.timezone}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Coordinates:</span>
                  <span className="font-mono text-xs text-white">
                    {results.geoLocation.latitude}, {results.geoLocation.longitude}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-red-400 text-sm">
                {results.geoLocation.message}
              </div>
            )}
          </div>

          {/* Connection Test Results */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-600" />
              Connection Test
            </h2>
            {results.headers.success ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-green-900/20 rounded-lg p-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-semibold text-white">
                      HTTP {results.headers.status} - {results.headers.statusText}
                    </div>
                    <div className="text-xs text-gray-400">Connection successful</div>
                  </div>
                </div>
                {Object.keys(results.headers.headers).length > 0 && (
                  <div className="bg-gray-50 bg-gray-700/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                    <div className="text-xs text-gray-400 mb-2">Response Headers:</div>
                    <div className="space-y-1 font-mono text-xs">
                      {Object.entries(results.headers.headers).slice(0, 10).map(([key, value]) => (
                        <div key={key} className="text-white">
                          <span className="text-blue-400">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-yellow-400 text-sm bg-yellow-900/20 rounded-lg p-3">
                {results.headers.message}
              </div>
            )}
          </div>
        </div>
      )}

      {results && results.error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-200 mb-2">Diagnostics Failed</h3>
          <p className="text-red-300 text-sm">{results.error}</p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Note:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Browser-based ping uses HTTP latency (not ICMP)</li>
              <li>Some targets may block requests (CORS)</li>
              <li>Results are approximate and may vary</li>
              <li>DNS lookups use Cloudflare DNS-over-HTTPS</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkDiagnostics
