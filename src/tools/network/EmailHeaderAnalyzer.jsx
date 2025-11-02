import { useState } from 'react'
import { Mail, Search, AlertCircle, CheckCircle, Clock, Server } from 'lucide-react'

const EmailHeaderAnalyzer = () => {
  const [headers, setHeaders] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const analyzeHeaders = () => {
    if (!headers.trim()) return

    const lines = headers.split('\n')
    const parsedHeaders = {}
    const receivedHops = []
    let currentHeader = ''
    let currentValue = ''

    // Parse headers
    lines.forEach(line => {
      if (line.match(/^[\w-]+:/)) {
        if (currentHeader) {
          if (currentHeader.toLowerCase() === 'received') {
            receivedHops.push(currentValue.trim())
          } else {
            parsedHeaders[currentHeader] = currentValue.trim()
          }
        }
        const [header, ...valueParts] = line.split(':')
        currentHeader = header.trim()
        currentValue = valueParts.join(':')
      } else if (line.match(/^\s/) && currentHeader) {
        currentValue += ' ' + line.trim()
      }
    })

    // Don't forget the last header
    if (currentHeader) {
      if (currentHeader.toLowerCase() === 'received') {
        receivedHops.push(currentValue.trim())
      } else {
        parsedHeaders[currentHeader] = currentValue.trim()
      }
    }

    // Extract key information
    const from = parsedHeaders['From'] || 'Not found'
    const to = parsedHeaders['To'] || 'Not found'
    const subject = parsedHeaders['Subject'] || 'Not found'
    const date = parsedHeaders['Date'] || 'Not found'
    const messageId = parsedHeaders['Message-ID'] || parsedHeaders['Message-Id'] || 'Not found'
    const returnPath = parsedHeaders['Return-Path'] || 'Not found'
    const spfResult = parsedHeaders['Received-SPF'] || 'Not checked'
    const dkimResult = parsedHeaders['DKIM-Signature'] ? 'Present' : 'Not found'
    const dmarcResult = parsedHeaders['Authentication-Results']?.includes('dmarc=') ? 'Checked' : 'Not found'

    // Security analysis
    const securityIssues = []
    const securityPasses = []

    if (returnPath.toLowerCase().includes('fail') || returnPath === 'Not found') {
      securityIssues.push('Return-Path missing or invalid')
    } else {
      securityPasses.push('Return-Path present')
    }

    if (spfResult.toLowerCase().includes('pass')) {
      securityPasses.push('SPF check passed')
    } else if (spfResult.toLowerCase().includes('fail')) {
      securityIssues.push('SPF check failed')
    }

    if (dkimResult === 'Present') {
      securityPasses.push('DKIM signature present')
    } else {
      securityIssues.push('DKIM signature not found')
    }

    if (dmarcResult === 'Checked') {
      securityPasses.push('DMARC policy checked')
    }

    // Calculate delivery time
    let deliveryTime = 'Unknown'
    if (receivedHops.length > 0) {
      deliveryTime = `${receivedHops.length} hops`
    }

    setAnalysis({
      basicInfo: {
        from,
        to,
        subject,
        date,
        messageId,
        returnPath
      },
      security: {
        spf: spfResult,
        dkim: dkimResult,
        dmarc: dmarcResult,
        issues: securityIssues,
        passes: securityPasses
      },
      routing: {
        hops: receivedHops.reverse(),
        hopCount: receivedHops.length,
        deliveryTime
      },
      allHeaders: parsedHeaders
    })
  }

  const exampleHeaders = `Delivered-To: user@example.com
Received: from mail.example.com (mail.example.com [192.0.2.1])
        by mx.google.com with ESMTPS id abc123
        for <user@example.com>
        Tue, 1 Jan 2024 12:00:00 -0700 (PDT)
Received-SPF: pass (google.com: domain of sender@example.com designates 192.0.2.1 as permitted sender)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=example.com; s=default;
Return-Path: <sender@example.com>
From: Sender Name <sender@example.com>
To: Recipient <user@example.com>
Subject: Example Email
Date: Tue, 1 Jan 2024 12:00:00 -0700
Message-ID: <abc123@example.com>`

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Header Analyzer</h1>
        <p className="text-gray-600 dark:text-gray-400">Parse and analyze email headers for security and routing info</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Headers
            </label>
            <button
              onClick={() => setHeaders(exampleHeaders)}
              className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder="Paste full email headers here... (Usually found in 'Show Original' or 'View Source' in your email client)"
            className="textarea-field min-h-[200px] font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button
          onClick={analyzeHeaders}
          disabled={!headers.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Search className="w-5 h-5" />
          Analyze Headers
        </button>

        {analysis && (
          <div className="space-y-6 pt-4">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(analysis.basicInfo).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm font-mono text-gray-900 dark:text-white break-all">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Analysis */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Security Analysis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">SPF</div>
                  <div className={`text-sm font-semibold ${
                    analysis.security.spf.toLowerCase().includes('pass')
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {analysis.security.spf}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">DKIM</div>
                  <div className={`text-sm font-semibold ${
                    analysis.security.dkim === 'Present'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {analysis.security.dkim}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">DMARC</div>
                  <div className={`text-sm font-semibold ${
                    analysis.security.dmarc === 'Checked'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {analysis.security.dmarc}
                  </div>
                </div>
              </div>

              {analysis.security.passes.length > 0 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-3">
                  <div className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Security Checks Passed
                  </div>
                  <ul className="space-y-1">
                    {analysis.security.passes.map((pass, i) => (
                      <li key={i} className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        {pass}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.security.issues.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Security Issues Found
                  </div>
                  <ul className="space-y-1">
                    {analysis.security.issues.map((issue, i) => (
                      <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Routing Information */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Server className="w-5 h-5" />
                Email Route ({analysis.routing.hopCount} hops)
              </h3>
              <div className="space-y-2">
                {analysis.routing.hops.map((hop, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono text-gray-900 dark:text-white break-all">
                          {hop}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {analysis.routing.hopCount === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No routing information found in headers
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">How to Get Email Headers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 dark:text-white">Gmail</div>
            <p className="text-gray-600 dark:text-gray-400">
              Open email → Click three dots → Show original
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 dark:text-white">Outlook</div>
            <p className="text-gray-600 dark:text-gray-400">
              Open email → File → Properties → Internet headers
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 dark:text-white">Apple Mail</div>
            <p className="text-gray-600 dark:text-gray-400">
              Open email → View → Message → All Headers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailHeaderAnalyzer
