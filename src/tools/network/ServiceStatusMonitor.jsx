import { useState, useEffect } from 'react'
import { Activity, CheckCircle, XCircle, Clock, RefreshCw, TrendingUp, Server, AlertTriangle, Zap } from 'lucide-react'

const ServiceStatusMonitor = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const serviceList = [
    { name: 'Google', url: 'https://www.google.com', type: 'Search Engine' },
    { name: 'GitHub', url: 'https://github.com', type: 'Dev Platform' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', type: 'Q&A Platform' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', type: 'Social Network' },
    { name: 'Cloudflare', url: 'https://www.cloudflare.com', type: 'CDN/Security' },
    { name: 'npm Registry', url: 'https://registry.npmjs.org', type: 'Package Registry' },
  ]

  useEffect(() => {
    setIsVisible(true)
    checkServices()

    if (autoRefresh) {
      const interval = setInterval(() => {
        checkServices()
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const checkServices = async () => {
    setLoading(true)
    const results = []

    for (const service of serviceList) {
      const startTime = Date.now()
      try {
        const response = await fetch(service.url, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        })
        const responseTime = Date.now() - startTime

        results.push({
          ...service,
          status: 'online',
          responseTime: responseTime,
          lastChecked: new Date().toLocaleString(),
          uptime: calculateUptime(service.name)
        })
      } catch (error) {
        results.push({
          ...service,
          status: 'offline',
          responseTime: null,
          lastChecked: new Date().toLocaleString(),
          uptime: calculateUptime(service.name),
          error: error.message
        })
      }
    }

    setServices(results)
    setLastCheck(new Date())
    setLoading(false)
  }

  const calculateUptime = (serviceName) => {
    // Mock uptime calculation (in real scenario, would come from database/API)
    const uptimes = {
      'Google': 99.99,
      'GitHub': 99.95,
      'Stack Overflow': 99.89,
      'LinkedIn': 99.92,
      'Cloudflare': 99.98,
      'npm Registry': 99.87
    }
    return uptimes[serviceName] || 99.5
  }

  const getStatusColor = (status) => {
    return status === 'online'
      ? 'text-green-400'
      : 'text-red-400'
  }

  const getStatusBg = (status) => {
    return status === 'online'
      ? 'bg-green-900/30'
      : 'bg-red-900/30'
  }

  const getResponseTimeColor = (time) => {
    if (!time) return 'text-gray-500'
    if (time < 100) return 'text-green-400'
    if (time < 300) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getUptimeColor = (uptime) => {
    if (uptime >= 99.9) return 'text-green-400'
    if (uptime >= 99.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const totalServices = services.length
  const onlineServices = services.filter(s => s.status === 'online').length
  const averageUptime = services.length > 0
    ? (services.reduce((acc, s) => acc + s.uptime, 0) / services.length).toFixed(2)
    : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <div className={`text-center space-y-4 relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 rounded-full mb-4 animate-bounce">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-green-300">Live Monitoring</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-2">
          <Server className="w-10 h-10 text-primary-600 animate-pulse-slow" />
          <span className="bg-gradient-to-r from-green-600 via-blue-600 to-green-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Service Status Monitor
          </span>
        </h1>
        <p className="text-gray-400">
          Real-time monitoring of essential services 📊
        </p>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Services Online</h3>
            <Server className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-white">{onlineServices}/{totalServices}</p>
          <p className="text-xs text-gray-400 mt-1">
            {((onlineServices / totalServices) * 100).toFixed(1)}% operational
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Average Uptime</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-white">{averageUptime}%</p>
          <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Last Check</h3>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-lg font-bold text-white">
            {lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className={`flex flex-wrap gap-4 items-center justify-between bg-gray-800 rounded-xl p-4 border border-gray-700 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={checkServices}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Refresh Now'}
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            Auto-refresh (30s)
          </label>
        </div>

        {lastCheck && (
          <p className="text-sm text-gray-400">
            Updated {Math.floor((Date.now() - lastCheck.getTime()) / 1000)}s ago
          </p>
        )}
      </div>

      {/* Services Table */}
      <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Uptime (30d)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Last Checked
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No services checked yet. Click "Refresh Now" to start monitoring.</p>
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr
                    key={index}
                    className="hover:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${service.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {service.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {service.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBg(service.status)} ${getStatusColor(service.status)}`}>
                        {service.status === 'online' ? (
                          <><CheckCircle className="w-3 h-3" /> Online</>
                        ) : (
                          <><XCircle className="w-3 h-3" /> Offline</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.responseTime ? (
                        <span className={`text-sm font-semibold ${getResponseTimeColor(service.responseTime)}`}>
                          <Zap className="w-3 h-3 inline mr-1" />
                          {service.responseTime}ms
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 bg-gray-700 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              service.uptime >= 99.9 ? 'bg-green-500' :
                              service.uptime >= 99.5 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${service.uptime}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-semibold ${getUptimeColor(service.uptime)}`}>
                          {service.uptime}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {service.lastChecked || 'Never'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Footer */}
      <div className={`bg-blue-900/20 border border-blue-800 rounded-lg p-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-2">💡 Monitoring Information:</p>
            <ul className="list-disc ml-5 space-y-1 text-xs">
              <li>Services are checked every 30 seconds when auto-refresh is enabled</li>
              <li>Response times are measured from your browser to the service</li>
              <li>Uptime percentages are simulated for demonstration purposes</li>
              <li>All checks are performed client-side using HEAD requests</li>
              <li>Green status (Online) = Service is responding, Red status (Offline) = Service is not responding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceStatusMonitor
