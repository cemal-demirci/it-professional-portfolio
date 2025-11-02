import { useState } from 'react'
import { Globe, Search, Info } from 'lucide-react'

const WhoisLookup = () => {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const performLookup = async () => {
    if (!domain) return

    setLoading(true)
    setResult(null)

    try {
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').trim()

      // Try multiple WHOIS/RDAP services
      let data = null
      let method = ''

      // Method 1: Try rdap.verisign.com for .com/.net domains
      if (cleanDomain.endsWith('.com') || cleanDomain.endsWith('.net')) {
        try {
          const response = await fetch(`https://rdap.verisign.com/com/v1/domain/${cleanDomain}`)
          if (response.ok) {
            data = await response.json()
            method = 'Verisign RDAP'
          }
        } catch (e) {
          console.log('Verisign RDAP failed, trying alternatives...')
        }
      }

      // Method 2: Try rdap.org as fallback
      if (!data) {
        try {
          const response = await fetch(`https://rdap.org/domain/${cleanDomain}`)
          if (response.ok) {
            data = await response.json()
            method = 'RDAP.org'
          }
        } catch (e) {
          console.log('RDAP.org failed')
        }
      }

      // If all API methods fail, show demo data with note
      if (!data) {
        setResult({
          domain: cleanDomain,
          registrar: 'Example Registrar, Inc.',
          status: 'clientTransferProhibited',
          created: '2020-01-15',
          expires: '2025-01-15',
          updated: '2024-01-15',
          nameServers: ['ns1.example.com', 'ns2.example.com'],
          success: true,
          isDemo: true,
          note: `⚠️ Live WHOIS data unavailable due to CORS restrictions. Showing demo data.

For real WHOIS data, use:
• Terminal: whois ${cleanDomain}
• Online: whois.com or who.is
• Browser extension with CORS bypass`
        })
        setLoading(false)
        return
      }

      // Extract relevant information from successful RDAP response
      const registrar = data.entities?.find(e => e.roles?.includes('registrar'))
      const nameServers = data.nameservers?.map(ns => ns.ldhName || ns.unicodeName) || []

      // Parse dates
      const events = data.events || []
      const registration = events.find(e => e.eventAction === 'registration')
      const expiration = events.find(e => e.eventAction === 'expiration')
      const lastChanged = events.find(e => e.eventAction === 'last changed')

      setResult({
        domain: cleanDomain,
        registrar: registrar?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || 'Unknown',
        status: data.status?.join(', ') || 'Unknown',
        created: registration ? new Date(registration.eventDate).toLocaleDateString() : 'N/A',
        expires: expiration ? new Date(expiration.eventDate).toLocaleDateString() : 'N/A',
        updated: lastChanged ? new Date(lastChanged.eventDate).toLocaleDateString() : 'N/A',
        nameServers: nameServers,
        rawData: data,
        success: true,
        method: method
      })
    } catch (error) {
      console.error('WHOIS lookup error:', error)
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').trim()
      setResult({
        domain: cleanDomain,
        error: true,
        errorMessage: 'WHOIS lookup failed. This may be due to CORS restrictions in the browser.',
        note: `For real WHOIS data, try:
• Terminal: whois ${cleanDomain}
• Online services: whois.com, who.is
• Browser extensions with CORS bypass`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">WHOIS Lookup</h1>
        <p className="text-gray-600 dark:text-gray-400">Get domain registration information</p>
      </div>

      {/* How It Works Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
            <p><strong>How WHOIS Lookup Works:</strong></p>
            <ol className="list-decimal ml-5 space-y-1">
              <li><strong>RDAP Protocol:</strong> Uses modern RDAP (Registration Data Access Protocol) instead of traditional WHOIS</li>
              <li><strong>Multi-Tier Approach:</strong> Tries Verisign RDAP → RDAP.org → Demo fallback</li>
              <li><strong>Browser Limitations:</strong> Due to CORS restrictions, some lookups may fail in browser</li>
              <li><strong>Data Retrieved:</strong> Registrar, registration/expiry dates, name servers, domain status</li>
            </ol>
            <p className="mt-2"><strong>For reliable WHOIS data:</strong> Use terminal (<code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">whois domain.com</code>) or dedicated WHOIS services like whois.com</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Domain Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performLookup()}
              placeholder="example.com"
              className="input-field flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={performLookup}
              disabled={loading || !domain}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Looking up...' : 'Lookup'}
            </button>
          </div>
        </div>

        {result && result.error && (
          <div className="space-y-4 pt-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">Error</p>
              <p className="text-sm text-red-700 dark:text-red-400">{result.errorMessage}</p>
              {result.note && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">{result.note}</p>
              )}
            </div>
          </div>
        )}

        {result && result.success && (
          <div className="space-y-4 pt-4">
            {result.isDemo ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-300">
                <div className="whitespace-pre-line">{result.note}</div>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-300">
                <strong>✓</strong> Successfully fetched WHOIS data via {result.method}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Domain Name</div>
                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {result.domain}
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registrar</div>
                <div className="font-semibold text-gray-900 dark:text-white">{result.registrar}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</div>
                <div className="font-semibold text-gray-900 dark:text-white">{result.status}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Created Date</div>
                <div className="font-semibold text-gray-900 dark:text-white">{result.created}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expiry Date</div>
                <div className="font-semibold text-gray-900 dark:text-white">{result.expires}</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Updated Date</div>
                <div className="font-semibold text-gray-900 dark:text-white">{result.updated}</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Name Servers</div>
              <div className="space-y-1">
                {result.nameServers.map((ns, i) => (
                  <div key={i} className="font-mono text-sm text-gray-900 dark:text-white">{ns}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WhoisLookup
