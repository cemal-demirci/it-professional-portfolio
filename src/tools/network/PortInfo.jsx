import { useState } from 'react'
import { Server, Search } from 'lucide-react'

const PortInfo = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const portDatabase = [
    // Well-known ports (0-1023)
    { port: 20, service: 'FTP Data', protocol: 'TCP', category: 'file-transfer', description: 'File Transfer Protocol - Data Channel' },
    { port: 21, service: 'FTP Control', protocol: 'TCP', category: 'file-transfer', description: 'File Transfer Protocol - Control Channel' },
    { port: 22, service: 'SSH', protocol: 'TCP', category: 'remote-access', description: 'Secure Shell - Secure remote login' },
    { port: 23, service: 'Telnet', protocol: 'TCP', category: 'remote-access', description: 'Telnet - Unencrypted remote login (insecure)' },
    { port: 25, service: 'SMTP', protocol: 'TCP', category: 'email', description: 'Simple Mail Transfer Protocol' },
    { port: 53, service: 'DNS', protocol: 'TCP/UDP', category: 'dns', description: 'Domain Name System' },
    { port: 80, service: 'HTTP', protocol: 'TCP', category: 'web', description: 'Hypertext Transfer Protocol' },
    { port: 110, service: 'POP3', protocol: 'TCP', category: 'email', description: 'Post Office Protocol v3' },
    { port: 143, service: 'IMAP', protocol: 'TCP', category: 'email', description: 'Internet Message Access Protocol' },
    { port: 443, service: 'HTTPS', protocol: 'TCP', category: 'web', description: 'HTTP Secure (SSL/TLS)' },
    { port: 445, service: 'SMB', protocol: 'TCP', category: 'file-transfer', description: 'Server Message Block (Windows File Sharing)' },
    { port: 465, service: 'SMTPS', protocol: 'TCP', category: 'email', description: 'SMTP over SSL' },
    { port: 587, service: 'SMTP', protocol: 'TCP', category: 'email', description: 'SMTP - Mail submission' },
    { port: 993, service: 'IMAPS', protocol: 'TCP', category: 'email', description: 'IMAP over SSL' },
    { port: 995, service: 'POP3S', protocol: 'TCP', category: 'email', description: 'POP3 over SSL' },

    // Registered ports (1024-49151)
    { port: 1433, service: 'MSSQL', protocol: 'TCP', category: 'database', description: 'Microsoft SQL Server' },
    { port: 1521, service: 'Oracle DB', protocol: 'TCP', category: 'database', description: 'Oracle Database' },
    { port: 3306, service: 'MySQL', protocol: 'TCP', category: 'database', description: 'MySQL Database' },
    { port: 3389, service: 'RDP', protocol: 'TCP', category: 'remote-access', description: 'Remote Desktop Protocol' },
    { port: 5432, service: 'PostgreSQL', protocol: 'TCP', category: 'database', description: 'PostgreSQL Database' },
    { port: 5900, service: 'VNC', protocol: 'TCP', category: 'remote-access', description: 'Virtual Network Computing' },
    { port: 6379, service: 'Redis', protocol: 'TCP', category: 'database', description: 'Redis Database' },
    { port: 8080, service: 'HTTP-Alt', protocol: 'TCP', category: 'web', description: 'HTTP Alternate (proxy/development)' },
    { port: 8443, service: 'HTTPS-Alt', protocol: 'TCP', category: 'web', description: 'HTTPS Alternate' },
    { port: 27017, service: 'MongoDB', protocol: 'TCP', category: 'database', description: 'MongoDB Database' },

    // Additional common ports
    { port: 69, service: 'TFTP', protocol: 'UDP', category: 'file-transfer', description: 'Trivial File Transfer Protocol' },
    { port: 123, service: 'NTP', protocol: 'UDP', category: 'time', description: 'Network Time Protocol' },
    { port: 161, service: 'SNMP', protocol: 'UDP', category: 'monitoring', description: 'Simple Network Management Protocol' },
    { port: 162, service: 'SNMPTRAP', protocol: 'UDP', category: 'monitoring', description: 'SNMP Trap' },
    { port: 389, service: 'LDAP', protocol: 'TCP', category: 'directory', description: 'Lightweight Directory Access Protocol' },
    { port: 636, service: 'LDAPS', protocol: 'TCP', category: 'directory', description: 'LDAP over SSL' },
    { port: 1723, service: 'PPTP', protocol: 'TCP', category: 'vpn', description: 'Point-to-Point Tunneling Protocol' },
    { port: 5060, service: 'SIP', protocol: 'TCP/UDP', category: 'voip', description: 'Session Initiation Protocol (VoIP)' },
    { port: 5061, service: 'SIP-TLS', protocol: 'TCP', category: 'voip', description: 'SIP over TLS' },
  ]

  const categories = [
    { value: 'all', label: 'All Ports', color: 'gray' },
    { value: 'web', label: 'Web', color: 'blue' },
    { value: 'email', label: 'Email', color: 'green' },
    { value: 'database', label: 'Database', color: 'purple' },
    { value: 'remote-access', label: 'Remote Access', color: 'orange' },
    { value: 'file-transfer', label: 'File Transfer', color: 'cyan' },
    { value: 'dns', label: 'DNS', color: 'pink' },
  ]

  const filteredPorts = portDatabase
    .filter(p => {
      const matchesSearch = !searchTerm ||
        p.port.toString().includes(searchTerm) ||
        p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => a.port - b.port)

  const getCategoryColor = (category) => {
    const colors = {
      'web': 'bg-blue-900/30 text-blue-300',
      'email': 'bg-green-900/30 text-green-300',
      'database': 'bg-purple-900/30 text-purple-300',
      'remote-access': 'bg-orange-900/30 text-orange-300',
      'file-transfer': 'bg-cyan-900/30 text-cyan-300',
      'dns': 'bg-pink-900/30 text-pink-300',
      'time': 'bg-indigo-900/30 text-indigo-300',
      'monitoring': 'bg-yellow-900/30 text-yellow-300',
      'directory': 'bg-teal-900/30 text-teal-300',
      'vpn': 'bg-red-900/30 text-red-300',
      'voip': 'bg-violet-900/30 text-violet-300',
    }
    return colors[category] || 'bg-gray-700 text-gray-300'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Port Information Reference</h1>
        <p className="text-gray-400">Common network ports and their services</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Port or Service
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by port number or service name..."
                className="input-field pl-10 bg-gray-700 border-gray-600 text-white w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:hover:bg-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Server className="w-5 h-5" />
              {filteredPorts.length} Ports Found
            </h3>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredPorts.map((port, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 bg-gray-700/50 rounded-lg hover:hover:bg-gray-700 transition-colors"
              >
                <div className="w-20 flex-shrink-0">
                  <div className="text-2xl font-bold text-primary-400">
                    {port.port}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">
                      {port.service}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getCategoryColor(port.category)}`}>
                      {port.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {port.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <span className="text-xs font-mono bg-gray-600 px-2 py-1 rounded text-gray-300">
                    {port.protocol}
                  </span>
                </div>
              </div>
            ))}

            {filteredPorts.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No ports found matching your search criteria
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="font-semibold text-white mb-3">Port Ranges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="font-semibold text-white mb-2">Well-Known Ports</div>
            <div className="text-gray-400">0 - 1023</div>
            <p className="text-xs text-gray-500 mt-2">
              System ports assigned by IANA for common services
            </p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="font-semibold text-white mb-2">Registered Ports</div>
            <div className="text-gray-400">1024 - 49151</div>
            <p className="text-xs text-gray-500 mt-2">
              Registered with IANA for specific services
            </p>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="font-semibold text-white mb-2">Dynamic/Private Ports</div>
            <div className="text-gray-400">49152 - 65535</div>
            <p className="text-xs text-gray-500 mt-2">
              Available for dynamic allocation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortInfo
