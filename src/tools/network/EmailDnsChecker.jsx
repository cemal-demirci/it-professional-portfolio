import { useState } from 'react'
import { Mail, Shield, CheckCircle, XCircle, AlertCircle, Search, Globe, Server } from 'lucide-react'

const EmailDnsChecker = () => {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const fetchDnsRecord = async (domain, recordType) => {
    try {
      const response = await fetch(
        `https://dns.google/resolve?name=${domain}&type=${recordType}`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching ${recordType} for ${domain}:`, error)
      return null
    }
  }

  const analyzeSPF = (txtRecords) => {
    const spfRecord = txtRecords.find(r => r.data.includes('v=spf1'))
    if (!spfRecord) return { status: 'error', message: 'SPF record not found', record: null }

    const record = spfRecord.data.replace(/"/g, '')
    const hasHardFail = record.includes('-all')
    const hasSoftFail = record.includes('~all')
    const hasNeutral = record.includes('?all')

    let status = 'warning'
    let message = 'SPF record found but ends with neutral'

    if (hasHardFail) {
      status = 'success'
      message = 'SPF record properly configured with hard fail (-all)'
    } else if (hasSoftFail) {
      status = 'success'
      message = 'SPF record configured with soft fail (~all)'
    }

    return { status, message, record }
  }

  const analyzeDMARC = (txtRecords) => {
    if (!txtRecords) return { status: 'error', message: 'No TXT records found', record: null }

    const dmarcRecord = txtRecords.find(r => r.data.includes('v=DMARC1'))
    if (!dmarcRecord) return { status: 'error', message: 'DMARC record not found', record: null }

    const record = dmarcRecord.data.replace(/"/g, '')
    const policyMatch = record.match(/p=(none|quarantine|reject)/)
    const policy = policyMatch ? policyMatch[1] : 'unknown'

    let status = 'warning'
    let message = `DMARC policy: ${policy}`

    if (policy === 'reject') {
      status = 'success'
      message = 'DMARC policy set to reject (most secure)'
    } else if (policy === 'quarantine') {
      status = 'success'
      message = 'DMARC policy set to quarantine (good)'
    } else if (policy === 'none') {
      status = 'warning'
      message = 'DMARC policy set to none (monitoring only)'
    }

    return { status, message, record, policy }
  }

  const analyzeBIMI = (txtRecords) => {
    if (!txtRecords) return { status: 'info', message: 'BIMI not configured (optional)', record: null }

    const bimiRecord = txtRecords.find(r => r.data.includes('v=BIMI1'))
    if (!bimiRecord) return { status: 'info', message: 'BIMI not configured (optional)', record: null }

    const record = bimiRecord.data.replace(/"/g, '')
    return { status: 'success', message: 'BIMI record found', record }
  }

  const performCheck = async () => {
    if (!domain) return

    setLoading(true)
    setResults(null)

    try {
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').trim()

      // Fetch MX records
      const mxData = await fetchDnsRecord(cleanDomain, 'MX')
      const mxRecords = mxData?.Answer?.filter(r => r.type === 15).map(r => r.data) || []

      // Fetch TXT records for SPF
      const spfData = await fetchDnsRecord(cleanDomain, 'TXT')
      const spfTxtRecords = spfData?.Answer || []
      const spfAnalysis = analyzeSPF(spfTxtRecords)

      // Fetch DMARC record (at _dmarc subdomain)
      const dmarcData = await fetchDnsRecord(`_dmarc.${cleanDomain}`, 'TXT')
      const dmarcTxtRecords = dmarcData?.Answer || []
      const dmarcAnalysis = analyzeDMARC(dmarcTxtRecords)

      // Fetch BIMI record (at default._bimi subdomain)
      const bimiData = await fetchDnsRecord(`default._bimi.${cleanDomain}`, 'TXT')
      const bimiTxtRecords = bimiData?.Answer || []
      const bimiAnalysis = analyzeBIMI(bimiTxtRecords)

      // DKIM - can't check without selector, so just provide info
      const dkimInfo = {
        status: 'info',
        message: 'DKIM requires selector name (e.g., selector1._domainkey.example.com)',
        record: null
      }

      setResults({
        domain: cleanDomain,
        mx: {
          status: mxRecords.length > 0 ? 'success' : 'error',
          message: mxRecords.length > 0 ? `${mxRecords.length} MX record(s) found` : 'No MX records found',
          records: mxRecords
        },
        spf: spfAnalysis,
        dmarc: dmarcAnalysis,
        bimi: bimiAnalysis,
        dkim: dkimInfo
      })
    } catch (error) {
      console.error('Error during DNS check:', error)
      setResults({
        error: 'Failed to perform DNS lookup. Please check the domain and try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  const ResultCard = ({ title, icon: Icon, result }) => {
    const bgColor = {
      success: 'bg-green-900/20 border-green-800',
      warning: 'bg-yellow-900/20 border-yellow-800',
      error: 'bg-red-900/20 border-red-800',
      info: 'bg-blue-900/20 border-blue-800'
    }[result.status] || 'bg-gray-50 bg-gray-700/50 border-gray-200 border-gray-600'

    return (
      <div className={`p-4 rounded-lg border ${bgColor}`}>
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 text-gray-300 mt-1" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{title}</h3>
              <StatusIcon status={result.status} />
            </div>
            <p className="text-sm text-gray-300">{result.message}</p>
            {result.record && (
              <div className="mt-2 p-2 bg-gray-800 rounded border border-gray-700">
                <code className="text-xs text-gray-800 text-gray-200 break-all">{result.record}</code>
              </div>
            )}
            {result.records && result.records.length > 0 && (
              <div className="mt-2 space-y-1">
                {result.records.map((record, idx) => (
                  <div key={idx} className="p-2 bg-gray-800 rounded border border-gray-700">
                    <code className="text-xs text-gray-800 text-gray-200">{record}</code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Email DNS Checker</h1>
        <p className="text-gray-400">Check SPF, DMARC, DKIM, BIMI, and MX records</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Domain Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performCheck()}
              placeholder="example.com"
              className="input-field flex-1 bg-gray-700 border-gray-600 text-white"
            />
            <button
              onClick={performCheck}
              disabled={loading || !domain}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-sm text-blue-300">
          <p><strong>MX Toolbox Style:</strong> This tool checks email authentication records using Google Public DNS API.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>SPF: Sender Policy Framework (prevents email spoofing)</li>
            <li>DMARC: Domain-based Message Authentication (email authentication policy)</li>
            <li>DKIM: DomainKeys Identified Mail (requires selector name)</li>
            <li>BIMI: Brand Indicators for Message Identification (optional)</li>
            <li>MX: Mail Exchange records (mail servers)</li>
          </ul>
        </div>

        {results && !results.error && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <Globe className="w-5 h-5" />
              Results for: {results.domain}
            </div>

            <div className="grid gap-4">
              <ResultCard title="MX Records" icon={Server} result={results.mx} />
              <ResultCard title="SPF Record" icon={Shield} result={results.spf} />
              <ResultCard title="DMARC Record" icon={Shield} result={results.dmarc} />
              <ResultCard title="DKIM Record" icon={Mail} result={results.dkim} />
              <ResultCard title="BIMI Record" icon={Mail} result={results.bimi} />
            </div>

            <div className="bg-gray-50 bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Recommendations</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {results.spf.status === 'error' && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Add an SPF record to prevent email spoofing</span>
                  </li>
                )}
                {results.dmarc.status === 'error' && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Implement DMARC to protect your domain from email abuse</span>
                  </li>
                )}
                {results.dmarc.status === 'warning' && results.dmarc.policy === 'none' && (
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>Consider upgrading DMARC policy from "none" to "quarantine" or "reject"</span>
                  </li>
                )}
                {results.mx.status === 'error' && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>Configure MX records to receive email</span>
                  </li>
                )}
                {results.spf.status === 'success' && results.dmarc.status === 'success' && results.mx.status === 'success' && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Your email configuration looks good! ✓</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {results && results.error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-sm text-red-300">
            {results.error}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailDnsChecker
