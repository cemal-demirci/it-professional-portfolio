import { useState } from 'react'
import { Calculator, Network } from 'lucide-react'

const SubnetCalculator = () => {
  const [mode, setMode] = useState('cidr') // 'cidr', 'subnets', 'hosts'
  const [ip, setIp] = useState('192.168.1.0')
  const [cidr, setCidr] = useState('24')
  const [subnetCount, setSubnetCount] = useState('4')
  const [hostCount, setHostCount] = useState('50')
  const [result, setResult] = useState(null)

  const toIP = (num) => [(num >>> 24) & 0xFF, (num >>> 16) & 0xFF, (num >>> 8) & 0xFF, num & 0xFF].join('.')

  const toBinary = (num) => {
    return num.toString(2).padStart(8, '0')
  }

  const calculate = () => {
    const ipParts = ip.split('.').map(Number)
    let maskBits

    if (mode === 'cidr') {
      maskBits = parseInt(cidr)
    } else if (mode === 'subnets') {
      // Calculate CIDR from subnet count
      const subnets = parseInt(subnetCount)
      const subnetBits = Math.ceil(Math.log2(subnets))
      maskBits = 24 + subnetBits // Assuming Class C
    } else if (mode === 'hosts') {
      // Calculate CIDR from host count
      const hosts = parseInt(hostCount)
      const hostBits = Math.ceil(Math.log2(hosts + 2)) // +2 for network and broadcast
      maskBits = 32 - hostBits
    }

    const mask = (0xFFFFFFFF << (32 - maskBits)) >>> 0
    const wildcardMask = (~mask) >>> 0
    const ipNum = (ipParts[0] << 24 | ipParts[1] << 16 | ipParts[2] << 8 | ipParts[3]) >>> 0
    const network = (ipNum & mask) >>> 0
    const broadcast = (network | ~mask) >>> 0
    const hostMin = network + 1
    const hostMax = broadcast - 1
    const hosts = Math.pow(2, 32 - maskBits) - 2

    const maskIP = toIP(mask)
    const maskParts = maskIP.split('.').map(Number)
    const networkParts = toIP(network).split('.').map(Number)

    // Calculate IP class
    const firstOctet = ipParts[0]
    let ipClass = 'Unknown'
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A'
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B'
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C'
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)'
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Reserved)'

    // Check if private IP
    const isPrivate =
      (firstOctet === 10) ||
      (firstOctet === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) ||
      (firstOctet === 192 && ipParts[1] === 168)

    // Calculate number of possible subnets
    const subnetBitsUsed = maskBits - (ipClass === 'A' ? 8 : ipClass === 'B' ? 16 : 24)
    const possibleSubnets = subnetBitsUsed > 0 ? Math.pow(2, subnetBitsUsed) : 1

    setResult({
      network: toIP(network),
      broadcast: toIP(broadcast),
      hostMin: toIP(hostMin),
      hostMax: toIP(hostMax),
      mask: maskIP,
      wildcardMask: toIP(wildcardMask),
      hosts: hosts > 0 ? hosts : 0,
      cidr: maskBits,
      ipClass: ipClass,
      isPrivate: isPrivate,
      possibleSubnets: possibleSubnets,
      binaryMask: maskParts.map(toBinary).join('.'),
      binaryNetwork: networkParts.map(toBinary).join('.'),
      totalIPs: Math.pow(2, 32 - maskBits)
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Advanced Subnet Calculator</h1>
        <p className="text-gray-400">Calculate IP subnets with multiple input methods</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        {/* Mode Selection */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setMode('cidr')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'cidr'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:hover:bg-gray-600'
            }`}
          >
            <Calculator className="w-4 h-4 inline mr-2" />
            CIDR Notation
          </button>
          <button
            onClick={() => setMode('subnets')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'subnets'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:hover:bg-gray-600'
            }`}
          >
            <Network className="w-4 h-4 inline mr-2" />
            From Subnet Count
          </button>
          <button
            onClick={() => setMode('hosts')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'hosts'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:hover:bg-gray-600'
            }`}
          >
            From Host Count
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">IP Address</label>
            <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.0" className="input-field bg-gray-700 border-gray-600 text-white" />
          </div>

          {mode === 'cidr' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">CIDR Notation (0-32)</label>
              <input type="number" min="0" max="32" value={cidr} onChange={(e) => setCidr(e.target.value)} className="input-field bg-gray-700 border-gray-600 text-white" />
            </div>
          )}

          {mode === 'subnets' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Number of Subnets Needed</label>
              <input type="number" min="1" value={subnetCount} onChange={(e) => setSubnetCount(e.target.value)} placeholder="4" className="input-field bg-gray-700 border-gray-600 text-white" />
              <p className="text-xs text-gray-400">Calculate mask based on subnet count</p>
            </div>
          )}

          {mode === 'hosts' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Number of Hosts Needed</label>
              <input type="number" min="1" value={hostCount} onChange={(e) => setHostCount(e.target.value)} placeholder="50" className="input-field bg-gray-700 border-gray-600 text-white" />
              <p className="text-xs text-gray-400">Calculate mask based on host count</p>
            </div>
          )}
        </div>

        <button onClick={calculate} className="btn-primary w-full">Calculate</button>

        {result && (
          <div className="space-y-6 pt-4">
            {/* Primary Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-primary-900/30 to-cyan-900/30 rounded-lg">
                <div className="text-sm text-primary-400 mb-1">Network Address</div>
                <div className="font-mono font-bold text-lg text-white">{result.network}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-lg">
                <div className="text-sm text-blue-400 mb-1">Subnet Mask</div>
                <div className="font-mono font-bold text-lg text-white">{result.mask}</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg">
                <div className="text-sm text-purple-400 mb-1">CIDR Notation</div>
                <div className="font-mono font-bold text-lg text-white">/{result.cidr}</div>
              </div>
            </div>

            {/* Secondary Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Broadcast Address', value: result.broadcast },
                { label: 'Wildcard Mask', value: result.wildcardMask },
                { label: 'First Usable IP', value: result.hostMin },
                { label: 'Last Usable IP', value: result.hostMax },
                { label: 'Usable Hosts', value: result.hosts.toLocaleString() },
                { label: 'Total IP Addresses', value: result.totalIPs.toLocaleString() },
                { label: 'IP Class', value: result.ipClass },
                { label: 'Type', value: result.isPrivate ? 'Private IP' : 'Public IP' },
                { label: 'Possible Subnets', value: result.possibleSubnets.toLocaleString() }
              ].map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 bg-gray-700/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                  <div className="font-mono font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Binary Representation */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white">Binary Representation</h3>
              <div className="p-4 bg-black rounded-lg space-y-2 font-mono text-sm">
                <div>
                  <span className="text-green-400">Network:    </span>
                  <span className="text-gray-300">{result.binaryNetwork}</span>
                </div>
                <div>
                  <span className="text-blue-400">Subnet Mask:</span>
                  <span className="text-gray-300">{result.binaryMask}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubnetCalculator
