import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

const RegexTester = () => {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags)
      const foundMatches = [...testString.matchAll(regex)]
      setMatches(foundMatches)
      setError('')
    } catch (err) {
      setError('Geçersiz regex pattern: ' + err.message)
      setMatches([])
    }
  }

  const highlightMatches = () => {
    if (!pattern || matches.length === 0) return testString

    let result = testString
    let offset = 0
    matches.forEach((match) => {
      const start = match.index + offset
      const end = start + match[0].length
      const before = result.slice(0, start)
      const matchText = result.slice(start, end)
      const after = result.slice(end)
      result = `${before}<mark class="bg-yellow-200 px-1 rounded">${matchText}</mark>${after}`
      offset += 53 // Length of added HTML tags
    })
    return result
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Regex Tester</h1>
        <p className="text-gray-600">Regular expression pattern'lerinizi test edin</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        {/* Regex Pattern */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Regex Pattern</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="örn: \d{3}-\d{3}-\d{4}"
              className="input-field flex-1 font-mono"
            />
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="Flags"
              className="input-field w-20 font-mono text-center"
            />
          </div>
          <div className="flex gap-2 text-xs text-gray-500">
            <span>Flags:</span>
            <span className="font-mono">g</span>= global,
            <span className="font-mono">i</span>= case-insensitive,
            <span className="font-mono">m</span>= multiline
          </div>
        </div>

        {/* Test String */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Test Metni</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Test edilecek metni buraya girin..."
            className="textarea-field"
          />
        </div>

        <button onClick={testRegex} className="btn-primary w-full">
          Test Et
        </button>

        {/* Results */}
        {pattern && testString && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {matches.length > 0 ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-medium">
                    {matches.length} eşleşme bulundu
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 font-medium">Eşleşme bulunamadı</span>
                </>
              )}
            </div>

            {matches.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Eşleşmeler (vurgulanmış):</label>
                <div
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Örnek Regex Pattern'leri</h3>
        <ul className="text-sm text-blue-800 space-y-1 font-mono">
          <li><strong>{'\\d{3}-\\d{3}-\\d{4}'}</strong> - Telefon numarası (555-123-4567)</li>
          <li><strong>{'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'}</strong> - Email adresi</li>
          <li><strong>{'https?://[^\\s]+'}</strong> - URL</li>
          <li><strong>{'#[0-9A-Fa-f]{6}'}</strong> - Hex renk kodu</li>
        </ul>
      </div>
    </div>
  )
}

export default RegexTester
