import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Tv, Monitor, Cpu, Activity, AlertTriangle, CheckCircle,
  Clock, Server, Database, Zap, Info, Cog
} from 'lucide-react'

const ZeroDensity = () => {
  const [selectedSystem, setSelectedSystem] = useState('all')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const systems = {
    all: 'All Systems',
    evo2: 'Evo II',
    evo3: 'Evo III',
    evo3pro: 'Evo III Pro',
    amper: 'Ampere'
  }

  const systemSpecs = {
    evo2: {
      gpu: 'NVIDIA RTX 4090',
      features: 'Ray Tracing, DLSS 3, UE5 Lumen, Nanite',
      memory: '48GB GDDR6X',
      cpu: 'AMD Ryzen 9 7950X',
      ram: '64GB DDR5',
      storage: '1TB NVMe SSD',
      color: 'from-red-600 to-orange-600',
      status: '✓ Currently Available',
      useCase: 'Broadcast & Live Production'
    },
    evo3: {
      gpu: 'NVIDIA RTX 5090',
      features: 'Advanced Ray Tracing, DLSS 3.5, Full UE5 Support',
      memory: '32GB GDDR7',
      cpu: 'AMD Ryzen 9 7950X3D',
      ram: '64GB DDR5',
      storage: '1TB NVMe SSD',
      color: 'from-orange-600 to-yellow-600',
      status: '✓ Available',
      useCase: 'Broadcast & Live Production'
    },
    evo3pro: {
      gpu: 'NVIDIA RTX 6000 Pro',
      features: 'Professional Ray Tracing, DLSS 3.5, Enterprise UE5',
      memory: '96GB GDDR6X',
      cpu: 'AMD Ryzen 9 7950X3D',
      ram: '128GB DDR5 ECC',
      storage: '2TB NVMe SSD',
      color: 'from-yellow-600 to-amber-600',
      status: '✓ Enterprise Edition',
      useCase: 'Broadcast & Live Production'
    },
    amper: {
      gpu: 'NVIDIA RTX A6000',
      features: 'Limited Ray Tracing (Older Gen), Lino Support',
      memory: '48GB GDDR6',
      cpu: 'AMD Threadripper',
      ram: '64GB DDR4 ECC',
      storage: '1TB NVMe SSD',
      color: 'from-yellow-600 to-amber-600',
      status: '⚠️ Legacy System',
      useCase: 'Legacy Projects (Pre-UE5)',
      limitations: ['⚠️ No UE5 Lumen support', '⚠️ No DLSS 3', '⚠️ Limited Nanite performance', '✓ Lino Supported']
    }
  }

  const internalTools = [
    {
      category: 'Reality Event Analyzer',
      icon: Database,
      color: 'from-red-600 to-orange-600',
      tools: [
        {
          name: 'Evo II Event Analyzer',
          path: '/0d/evo2-events',
          icon: Monitor,
          description: 'AI-powered analysis for Evo II system logs',
          status: 'active',
          system: 'evo2',
          gpu: systemSpecs.evo2.gpu
        },
        {
          name: 'Evo III Event Analyzer',
          path: '/0d/evo3-events',
          icon: Monitor,
          description: 'AI-powered analysis for Evo III system logs',
          status: 'active',
          system: 'evo3',
          gpu: systemSpecs.evo3.gpu
        },
        {
          name: 'Evo III Pro Event Analyzer',
          path: '/0d/evo3-events',
          icon: Monitor,
          description: 'AI-powered analysis for Evo III Pro system logs',
          status: 'active',
          system: 'evo3pro',
          gpu: systemSpecs.evo3pro.gpu
        },
        {
          name: 'Ampere Event Analyzer',
          path: '/0d/amper-events',
          icon: Cpu,
          description: 'AI-powered analysis for Ampere system logs',
          status: 'active',
          system: 'amper',
          gpu: systemSpecs.amper.gpu
        },
      ]
    },
    {
      category: 'Hardware Support',
      icon: Cog,
      color: 'from-blue-600 to-cyan-600',
      tools: [
        {
          name: 'Hardware Guide 🎯',
          path: '/0d/hardware-support',
          icon: Cog,
          description: 'Expert troubleshooting for all systems (English/Turkish, docs.zerodensity.io verified)',
          status: 'active',
          system: 'all',
          gpu: 'All Systems'
        },
      ]
    }
  ]

  const stats = [
    { label: 'Uptime', value: '99.8%', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Avg Response', value: '12ms', icon: Clock, color: 'text-purple-600' },
    { label: 'Events/Day', value: '920K', icon: Activity, color: 'text-orange-600' },
  ]

  const filteredTools = selectedSystem === 'all'
    ? internalTools
    : internalTools.map(category => ({
        ...category,
        tools: category.tools.filter(tool => !tool.system || tool.system === selectedSystem)
      })).filter(category => category.tools.length > 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl p-8 text-white transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Tv className="w-10 h-10 animate-pulse-slow" />
              Zero Density Internal Tools
            </h1>
            <p className="text-xl text-white/90">IT & Broadcast Engineering</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Authorized Access Only</div>
            <div className="text-xs text-white/60 mt-1">Cemal Demirci - IT & Security Admin</div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className={`bg-yellow-900/20 border-l-4 border-yellow-600 p-4 rounded-lg transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-300">
            <strong>Internal Use Only:</strong> Bu araçlar Zero Density şirket içi kullanım içindir.
            Evo II, Evo III, Evo III Pro ve Ampere sistemleri için özelleştirilmiştir.
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div
              key={idx}
              className={`bg-gray-800 rounded-xl p-6 border border-gray-700 transition-all duration-700 hover:shadow-xl hover:scale-105 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* System Filter */}
      <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
        <label className="block text-sm font-medium text-gray-300 mb-3">Filter by System</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(systems).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedSystem(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                selectedSystem === key
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* System Specifications */}
      {selectedSystem !== 'all' && systemSpecs[selectedSystem] && (
        <div className={`bg-gradient-to-br ${systemSpecs[selectedSystem].color} rounded-xl p-6 text-white transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '700ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 animate-pulse-slow" />
              {systems[selectedSystem]} Specifications
            </h3>
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm">
              {systemSpecs[selectedSystem].status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">GPU</div>
              <div className="font-semibold">{systemSpecs[selectedSystem].gpu}</div>
              <div className="text-xs text-white/60 mt-1">{systemSpecs[selectedSystem].memory}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">CPU</div>
              <div className="font-semibold text-sm">{systemSpecs[selectedSystem].cpu}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">Memory</div>
              <div className="font-semibold">{systemSpecs[selectedSystem].ram}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">Storage</div>
              <div className="font-semibold">{systemSpecs[selectedSystem].storage}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm text-white/70 mb-1">Features</div>
              <div className="font-semibold text-sm">{systemSpecs[selectedSystem].features}</div>
            </div>
          </div>

          {/* Hardware Limitations for Ampere */}
          {systemSpecs[selectedSystem].limitations && (
            <div className="mt-4 bg-red-500/30 border border-red-400/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Hardware Limitations
              </h4>
              <ul className="space-y-1 text-sm">
                {systemSpecs[selectedSystem].limitations.map((limitation, idx) => (
                  <li key={idx}>{limitation}</li>
                ))}
              </ul>
              <div className="mt-2 text-xs bg-red-600/20 p-2 rounded">
                💡 <strong>Quick Fix:</strong> If experiencing crashes with UE5, disable Lumen and Nanite in Project Settings → Engine → Rendering
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tools Grid */}
      {filteredTools.map((category, catIdx) => {
        const CategoryIcon = category.icon
        return (
          <div key={catIdx} className={`space-y-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${800 + catIdx * 100}ms` }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center animate-gradient-rotate`}>
                <CategoryIcon className="w-6 h-6 text-white animate-pulse-slow" />
              </div>
              <h2 className="text-2xl font-bold text-white">{category.category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.tools.map((tool, toolIdx) => {
                const ToolIcon = tool.icon
                return (
                  <Link
                    key={toolIdx}
                    to={tool.path}
                    className="group bg-gray-800 rounded-xl p-6 border border-gray-700 hover:hover:border-orange-500 transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <ToolIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tool.status === 'active'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {tool.status === 'active' ? '✓ Active' : '⚡ Beta'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-2 group-hover:group-hover:text-orange-400">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {tool.description}
                    </p>
                    {tool.gpu && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {tool.gpu}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* System Comparison Table */}
      <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 transition-all duration-700 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1000ms' }}>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-600" />
          Systems Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 bg-gray-700">
              <tr>
                <th className="p-3 text-left font-semibold text-white">Feature</th>
                <th className="p-3 text-left font-semibold text-red-400">Evo II</th>
                <th className="p-3 text-left font-semibold text-orange-400">Evo III</th>
                <th className="p-3 text-left font-semibold text-yellow-400">Evo III Pro</th>
                <th className="p-3 text-left font-semibold text-amber-400">Ampere</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="p-3 font-medium text-white">GPU</td>
                <td className="p-3 text-gray-400">RTX 4090</td>
                <td className="p-3 text-gray-400">RTX 5090</td>
                <td className="p-3 text-gray-400">RTX 6000 Pro</td>
                <td className="p-3 text-gray-400">RTX A6000</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">VRAM</td>
                <td className="p-3 text-gray-400">48GB</td>
                <td className="p-3 text-gray-400">32GB</td>
                <td className="p-3 text-gray-400">96GB</td>
                <td className="p-3 text-gray-400">48GB</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">RAM</td>
                <td className="p-3 text-gray-400">64GB DDR5</td>
                <td className="p-3 text-gray-400">64GB DDR5</td>
                <td className="p-3 text-gray-400">128GB DDR5 ECC</td>
                <td className="p-3 text-gray-400">64GB DDR4 ECC</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">UE5 Lumen</td>
                <td className="p-3 text-green-600">✓ Full Support</td>
                <td className="p-3 text-green-600">✓ Full Support</td>
                <td className="p-3 text-green-600">✓ Full Support</td>
                <td className="p-3 text-red-600">✗ Not Supported</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Nanite</td>
                <td className="p-3 text-green-600">✓ Full Support</td>
                <td className="p-3 text-green-600">✓ Full Support</td>
                <td className="p-3 text-green-600">✓ Full Support</td>
                <td className="p-3 text-yellow-600">⚠ Limited</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">DLSS</td>
                <td className="p-3 text-gray-400">DLSS 3</td>
                <td className="p-3 text-gray-400">DLSS 3.5</td>
                <td className="p-3 text-gray-400">DLSS 3.5</td>
                <td className="p-3 text-gray-400">DLSS 2.0</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-white">Use Case</td>
                <td className="p-3 text-gray-400">Broadcast</td>
                <td className="p-3 text-gray-400">Professional</td>
                <td className="p-3 text-gray-400">Enterprise</td>
                <td className="p-3 text-gray-400">Legacy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Issues Guide */}
      <div className={`bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-6 border border-red-800 transition-all duration-700 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1100ms' }}>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Common System Issues by Hardware
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ampere Issues */}
          <div className="bg-gray-800 rounded-lg p-4 border border-red-700 transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-lg">
            <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Ampere (A6000)
            </h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Lumen crashes:</strong> Disable in UE5 settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span><strong>Nanite:</strong> Use traditional LODs</span>
              </li>
            </ul>
          </div>

          {/* Evo II */}
          <div className="bg-gray-800 rounded-lg p-4 border border-orange-700 transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-lg">
            <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Evo II (4090)
            </h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Full Lumen & Nanite</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                <span>Watch GPU temps &lt;80°C</span>
              </li>
            </ul>
          </div>

          {/* Evo III */}
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-700 transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-lg">
            <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Evo III (5090)
            </h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Latest UE5 features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>DLSS 3.5 Ray Reconstruction</span>
              </li>
            </ul>
          </div>

          {/* Evo III Pro */}
          <div className="bg-gray-800 rounded-lg p-4 border border-amber-700 transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-lg">
            <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Evo III Pro (6000 Pro)
            </h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>96GB VRAM for 8K+</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>ECC memory for stability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZeroDensity
