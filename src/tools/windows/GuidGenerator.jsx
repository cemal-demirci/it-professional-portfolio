import { useState } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

const GuidGenerator = () => {
  const [guids, setGuids] = useState([])
  const [count, setCount] = useState(1)
  const [format, setFormat] = useState('braces')
  const [copied, setCopied] = useState(-1)

  const generateGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16).toUpperCase()
    })
  }

  const formatGUID = (guid) => {
    switch(format) {
      case 'braces':
        return `{${guid}}`
      case 'brackets':
        return `[${guid}]`
      case 'parens':
        return `(${guid})`
      case 'plain':
        return guid
      case 'define':
        return `DEFINE_GUID(<<name>>, 0x${guid.substr(0,8)}, 0x${guid.substr(9,4)}, 0x${guid.substr(14,4)}, ${guid.substr(19,2).match(/../g).map(x => '0x'+x).join(', ')}, ${guid.substr(21).match(/../g).map(x => '0x'+x).join(', ')});`
      case 'struct':
        return `static const GUID <<name>> = {0x${guid.substr(0,8)}, 0x${guid.substr(9,4)}, 0x${guid.substr(14,4)}, {${guid.substr(19,2).match(/../g).map(x => '0x'+x).join(', ')}, ${guid.substr(21).match(/../g).map(x => '0x'+x).join(', ')}}};`
      default:
        return guid
    }
  }

  const generateGUIDs = () => {
    const newGuids = []
    for (let i = 0; i < count; i++) {
      newGuids.push(generateGUID())
    }
    setGuids(newGuids)
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(-1), 2000)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(guids.map(g => formatGUID(g)).join('\n'))
    setCopied(-2)
    setTimeout(() => setCopied(-1), 2000)
  }

  const formats = [
    { value: 'braces', label: 'Registry (with braces)', example: '{XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX}' },
    { value: 'plain', label: 'Plain', example: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX' },
    { value: 'brackets', label: 'Brackets', example: '[XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX]' },
    { value: 'parens', label: 'Parentheses', example: '(XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX)' },
    { value: 'define', label: 'C++ DEFINE_GUID', example: 'DEFINE_GUID(<<name>>, ...)' },
    { value: 'struct', label: 'C++ struct', example: 'static const GUID <<name>> = {...}' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Windows GUID Generator</h1>
        <p className="text-gray-400">Generate Windows Global Unique Identifiers (GUIDs)</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="input-field bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="input-field bg-gray-700 border-gray-600 text-white"
            >
              {formats.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={generateGUIDs} className="btn-primary w-full flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Generate {count} GUID{count > 1 ? 's' : ''}
        </button>

        {/* Results */}
        {guids.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white">Generated GUIDs</h3>
              {guids.length > 1 && (
                <button
                  onClick={copyAll}
                  className="text-sm text-primary-400 hover:text-primary-700 flex items-center gap-1"
                >
                  {copied === -2 ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied All
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy All
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {guids.map((guid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 bg-gray-700 rounded-lg border border-gray-200 border-gray-600"
                >
                  <code className="flex-1 text-sm font-mono text-gray-100 break-all">{formatGUID(guid)}</code>
                  <button
                    onClick={() => copyToClipboard(formatGUID(guid), index)}
                    className="ml-3 p-2 text-primary-400 hover:hover:bg-primary-900/30 rounded-lg transition-colors"
                  >
                    {copied === index ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-300 mb-2">About GUIDs</h3>
        <ul className="text-sm text-blue-400 space-y-1 list-disc list-inside">
          <li>128-bit unique identifier used in Windows software development</li>
          <li>Format: 8-4-4-4-12 hexadecimal digits</li>
          <li>Used for COM interfaces, registry keys, and more</li>
          <li>Version 4 (random) GUIDs generated here</li>
          <li>Multiple output formats for different use cases</li>
        </ul>
      </div>
    </div>
  )
}

export default GuidGenerator
