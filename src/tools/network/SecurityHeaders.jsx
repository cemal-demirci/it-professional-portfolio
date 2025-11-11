import { useState } from 'react'
import { Shield, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const SecurityHeaders = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const securityHeaders = [
    {
      name: 'Strict-Transport-Security',
      description: 'Forces HTTPS connections',
      recommendation: 'max-age=31536000; includeSubDomains',
      critical: true
    },
    {
      name: 'Content-Security-Policy',
      description: 'Prevents XSS and injection attacks',
      recommendation: 'default-src \'self\'',
      critical: true
    },
    {
      name: 'X-Frame-Options',
      description: 'Prevents clickjacking attacks',
      recommendation: 'DENY or SAMEORIGIN',
      critical: true
    },
    {
      name: 'X-Content-Type-Options',
      description: 'Prevents MIME type sniffing',
      recommendation: 'nosniff',
      critical: true
    },
    {
      name: 'Referrer-Policy',
      description: 'Controls referrer information',
      recommendation: 'no-referrer or strict-origin-when-cross-origin',
      critical: false
    },
    {
      name: 'Permissions-Policy',
      description: 'Controls browser features',
      recommendation: 'camera=(), microphone=(), geolocation=()',
      critical: false
    },
    {
      name: 'X-XSS-Protection',
      description: 'Legacy XSS protection (deprecated)',
      recommendation: '1; mode=block',
      critical: false
    }
  ]

  const checkHeaders = () => {
    if (!url) return

    setLoading(true)

    // Simulate header check (real implementation would require backend/CORS proxy)
    setTimeout(() => {
      const mockHeaders = {
        'Strict-Transport-Security': Math.random() > 0.5 ? 'max-age=31536000' : null,
        'Content-Security-Policy': Math.random() > 0.5 ? "default-src 'self'" : null,
        'X-Frame-Options': Math.random() > 0.5 ? 'SAMEORIGIN' : null,
        'X-Content-Type-Options': Math.random() > 0.5 ? 'nosniff' : null,
        'Referrer-Policy': Math.random() > 0.5 ? 'strict-origin-when-cross-origin' : null,
        'Permissions-Policy': null,
        'X-XSS-Protection': Math.random() > 0.5 ? '1; mode=block' : null
      }

      const analysis = securityHeaders.map(header => {
        const value = mockHeaders[header.name]
        const status = value ? 'present' : 'missing'

        return {
          ...header,
          value: value || 'Not set',
          status: status
        }
      })

      const presentCount = analysis.filter(h => h.status === 'present').length
      const criticalMissing = analysis.filter(h => h.critical && h.status === 'missing').length

      let grade = 'F'
      if (presentCount >= 6) grade = 'A'
      else if (presentCount >= 5) grade = 'B'
      else if (presentCount >= 4) grade = 'C'
      else if (presentCount >= 3) grade = 'D'

      setResult({
        url: url,
        headers: analysis,
        score: presentCount,
        total: securityHeaders.length,
        grade: grade,
        criticalMissing: criticalMissing,
        note: 'Note: This is a demonstration tool with simulated results. Real header checking requires backend services due to CORS restrictions.'
      })

      setLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status) => {
    if (status === 'present') return <CheckCircle className="w-5 h-5 text-green-500" />
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'text-green-400',
      'B': 'text-blue-400',
      'C': 'text-yellow-400',
      'D': 'text-orange-400',
      'F': 'text-red-400'
    }
    return colors[grade] || colors['F']
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Security Headers Checker</h1>
        <p className="text-gray-400">Analyze HTTP security headers of any website</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Website URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkHeaders()}
              placeholder="https://example.com"
              className="input-field flex-1 bg-gray-700 border-gray-600 text-white"
            />
            <button
              onClick={checkHeaders}
              disabled={loading || !url}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Checking...' : 'Check Headers'}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 text-sm text-yellow-300">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>{result.note}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-gradient-to-br from-primary-900/30 to-cyan-900/30 rounded-lg text-center">
                <div className={`text-5xl font-bold mb-2 ${getGradeColor(result.grade)}`}>
                  {result.grade}
                </div>
                <div className="text-sm text-gray-400">Security Grade</div>
              </div>

              <div className="p-6 bg-gray-50 bg-gray-700/50 rounded-lg text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {result.score}/{result.total}
                </div>
                <div className="text-sm text-gray-400">Headers Present</div>
              </div>

              <div className="p-6 bg-gray-50 bg-gray-700/50 rounded-lg text-center">
                <div className={`text-3xl font-bold mb-2 ${result.criticalMissing > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {result.criticalMissing}
                </div>
                <div className="text-sm text-gray-400">Critical Missing</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Header Analysis
              </h3>

              {result.headers.map((header, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    header.status === 'present'
                      ? 'bg-green-900/20 border-green-800'
                      : header.critical
                      ? 'bg-red-900/20 border-red-800'
                      : 'bg-gray-50 bg-gray-700/50 border-gray-200 border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(header.status)}
                        <span className="font-semibold text-white">
                          {header.name}
                          {header.critical && (
                            <span className="ml-2 text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">
                              Critical
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{header.description}</p>
                      {header.status === 'present' ? (
                        <p className="text-sm font-mono text-green-300">
                          Value: {header.value}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Recommended: <code className="text-xs">{header.recommendation}</code>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold text-white mb-3">About Security Headers</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            HTTP Security Headers are essential for protecting websites against common vulnerabilities and attacks.
          </p>
          <p>
            <strong className="text-white">Critical headers</strong> protect against serious vulnerabilities like XSS, clickjacking, and protocol downgrade attacks.
          </p>
          <p>
            For production websites, implement all recommended security headers and test regularly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecurityHeaders
