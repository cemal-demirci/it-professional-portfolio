import { useState } from 'react'
import { Wifi, Search } from 'lucide-react'

const MacLookup = () => {
  const [mac, setMac] = useState('')
  const [result, setResult] = useState(null)

  // Sample OUI database (first 3 octets -> vendor mapping)
  const ouiDatabase = {
    '00:50:56': 'VMware, Inc.',
    '00:0C:29': 'VMware, Inc.',
    '00:05:69': 'VMware, Inc.',
    '08:00:27': 'Oracle VirtualBox',
    '52:54:00': 'QEMU Virtual Machine',
    '00:15:5D': 'Microsoft Hyper-V',
    '00:1B:21': 'Intel Corporation',
    '00:1C:42': 'Parallels, Inc.',
    '00:03:FF': 'Microsoft Corporation',
    '00:D0:EF': 'Intel Corporation',
    '3C:A9:F4': 'Cisco Systems',
    'F8:1A:67': 'Cisco Systems',
    '00:1A:A0': 'Dell Inc.',
    '00:14:22': 'Dell Inc.',
    'B8:27:EB': 'Raspberry Pi Foundation',
    'DC:A6:32': 'Raspberry Pi Trading Ltd',
    '00:25:90': 'Apple, Inc.',
    '00:26:B0': 'Apple, Inc.',
    '00:1F:5B': 'Apple, Inc.',
    '28:CF:E9': 'Apple, Inc.',
    '00:23:12': 'HP Inc.',
    '00:21:5A': 'Hewlett Packard',
    '00:1B:78': 'Cisco-Linksys',
    '00:18:F8': 'Cisco-Linksys',
    'D8:50:E6': 'ASUSTek Computer',
    '00:1F:C6': 'ASUSTek Computer',
    '00:50:F2': 'Microsoft Corporation',
    '00:00:5E': 'IANA (Reserved)',
    'FF:FF:FF': 'Broadcast Address'
  }

  const lookupMac = () => {
    if (!mac) return

    // Clean and format MAC address
    const cleanMac = mac.toUpperCase().replace(/[^A-F0-9]/g, '')

    if (cleanMac.length < 6) {
      setResult({ error: 'Invalid MAC address. Please enter at least 6 hex digits.' })
      return
    }

    // Format MAC address with colons
    const formattedMac = cleanMac.match(/.{1,2}/g)?.join(':') || ''
    const oui = formattedMac.substring(0, 8) // First 3 octets

    // Lookup vendor
    const vendor = ouiDatabase[oui] || 'Unknown Vendor (Not in database)'

    setResult({
      mac: formattedMac,
      oui: oui,
      vendor: vendor,
      type: cleanMac.length === 12 ? 'MAC-48' : 'Partial MAC',
      note: 'This tool uses a limited OUI database. For comprehensive lookups, use online OUI databases or API services.'
    })
  }

  const formatMacInput = (value) => {
    // Auto-format MAC address as user types
    const clean = value.toUpperCase().replace(/[^A-F0-9]/g, '')
    const formatted = clean.match(/.{1,2}/g)?.join(':') || clean
    return formatted
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">MAC Address Lookup</h1>
        <p className="text-gray-400">Identify network device manufacturer from MAC address</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">MAC Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={mac}
              onChange={(e) => setMac(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && lookupMac()}
              placeholder="00:1A:2B:3C:4D:5E or 001A2B3C4D5E"
              className="input-field flex-1 font-mono bg-gray-700 border-gray-600 text-white"
              maxLength="17"
            />
            <button
              onClick={lookupMac}
              disabled={!mac}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              Lookup
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Supports formats: 00:1A:2B:3C:4D:5E, 00-1A-2B-3C-4D-5E, or 001A2B3C4D5E
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['00:50:56:XX:XX:XX', '08:00:27:XX:XX:XX', 'B8:27:EB:XX:XX:XX', '00:1A:A0:XX:XX:XX'].map((example) => (
            <button
              key={example}
              onClick={() => setMac(example)}
              className="px-3 py-2 text-xs font-mono bg-gray-700 hover:hover:bg-gray-600 rounded transition-colors text-gray-300"
            >
              {example}
            </button>
          ))}
        </div>

        {result && (
          <div className="space-y-4 pt-4">
            {result.error ? (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
                {result.error}
              </div>
            ) : (
              <>
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-sm text-blue-300">
                  {result.note}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary-900/30 to-cyan-900/30 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">MAC Address</div>
                    <div className="font-mono font-bold text-lg text-white flex items-center gap-2">
                      <Wifi className="w-5 h-5" />
                      {result.mac}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">OUI (First 3 Octets)</div>
                    <div className="font-mono font-semibold text-white">{result.oui}</div>
                  </div>

                  <div className="p-4 bg-gray-50 bg-gray-700/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Type</div>
                    <div className="font-semibold text-white">{result.type}</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Vendor</div>
                    <div className="font-semibold text-white">{result.vendor}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold text-white mb-3">About MAC Addresses</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>
            <strong className="text-white">MAC Address (Media Access Control)</strong> is a unique identifier assigned to network interfaces.
          </p>
          <p>
            <strong className="text-white">OUI (Organizationally Unique Identifier)</strong> - The first 3 octets identify the manufacturer.
          </p>
          <p>
            Common formats: 00:1A:2B:3C:4D:5E (IEEE), 00-1A-2B-3C-4D-5E (Microsoft), 001A.2B3C.4D5E (Cisco)
          </p>
        </div>
      </div>
    </div>
  )
}

export default MacLookup
