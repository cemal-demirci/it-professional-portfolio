import React, { useState } from 'react'
import { Monitor, Shield, Zap, Globe, Lock, Users, ArrowRight, Check, Sparkles } from 'lucide-react'
import RemoteHost from '../components/RemoteHost'
import RemoteViewer from '../components/RemoteViewer'

const RemoteDesktop = () => {
  const [mode, setMode] = useState(null) // null, 'host', 'viewer'

  if (mode === 'host') {
    return <RemoteHost onBack={() => setMode(null)} />
  }

  if (mode === 'viewer') {
    return <RemoteViewer onBack={() => setMode(null)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white from-gray-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/from-blue-600/5 to-purple-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 from-blue-900/30 to-purple-900/30 text-blue-300 rounded-full mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">🚀 v2.0 • ⚡ Turbo Mode • 🏠 Local Support</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Remote Desktop
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                with Turbo Mode
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Connect to any computer from anywhere. Now with <strong className="text-purple-400">3 session modes</strong> optimized for your needs.
            </p>

            <div className="flex justify-center gap-3 flex-wrap mb-8">
              <div className="px-4 py-2 bg-blue-900/30 text-blue-300 rounded-lg font-semibold text-sm">
                🔒 Secure Mode
              </div>
              <div className="px-4 py-2 bg-green-900/30 text-green-300 rounded-lg font-semibold text-sm">
                🏠 Local Mode
              </div>
              <div className="px-4 py-2 bg-purple-900/30 text-purple-300 rounded-lg font-semibold text-sm">
                ⚡ Turbo Mode (60 FPS!)
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setMode('host')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 font-semibold text-lg"
              >
                <Monitor className="w-5 h-5" />
                <span>Share My Screen</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setMode('viewer')}
                className="px-8 py-4 bg-gray-800 text-white rounded-xl hover:hover:bg-gray-700 transition-all shadow-lg border border-gray-700 flex items-center space-x-2 font-semibold text-lg"
              >
                <Users className="w-5 h-5" />
                <span>Connect to Computer</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-gray-400">Browser-Based</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <div className="text-sm text-gray-400">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">P2P</div>
              <div className="text-sm text-gray-400">Direct Connection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Free</div>
              <div className="text-sm text-gray-400">Forever</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Our Solution?
          </h2>
          <p className="text-xl text-gray-400">
            Modern remote access without the traditional headaches
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Privacy First
            </h3>
            <p className="text-gray-400 mb-6">
              Direct peer-to-peer connection means your screen data never touches our servers. True end-to-end encryption.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                No data collection
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                End-to-end encrypted
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                Session-based access
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Instant Access
            </h3>
            <p className="text-gray-400 mb-6">
              No downloads, no installations, no accounts. Just open your browser and connect. Works on any device.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                Works in any browser
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                Cross-platform support
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                Mobile friendly
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Universal Access
            </h3>
            <p className="text-gray-400 mb-6">
              Connect from anywhere to anywhere. Perfect for remote work, tech support, or helping family and friends.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                Global connectivity
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                Low latency
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                NAT traversal
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Better Than Traditional Solutions
            </h2>
            <p className="text-xl text-gray-400">
              See how we compare to TeamViewer, AnyDesk & Chrome Remote Desktop
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Our Solution</th>
                    <th className="px-6 py-4 text-center font-semibold">TeamViewer</th>
                    <th className="px-6 py-4 text-center font-semibold">AnyDesk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-white font-medium">Installation Required</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                        ❌ No
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">✅ Yes</td>
                    <td className="px-6 py-4 text-center text-gray-400">✅ Yes</td>
                  </tr>
                  <tr className="bg-gray-50 bg-gray-700/50">
                    <td className="px-6 py-4 text-white font-medium">Free for Personal Use</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                        ✅ Yes
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">⚠️ Limited</td>
                    <td className="px-6 py-4 text-center text-gray-400">⚠️ Limited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-white font-medium">Privacy (P2P)</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                        ✅ Yes
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">❌ Server-based</td>
                    <td className="px-6 py-4 text-center text-gray-400">❌ Server-based</td>
                  </tr>
                  <tr className="bg-gray-50 bg-gray-700/50">
                    <td className="px-6 py-4 text-white font-medium">Cross-Platform</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                        ✅ Any Browser
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">✅ Desktop Only</td>
                    <td className="px-6 py-4 text-center text-gray-400">✅ Desktop Only</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-white font-medium">Account Required</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                        ❌ No
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400">✅ Yes</td>
                    <td className="px-6 py-4 text-center text-gray-400">✅ Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Perfect For
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">👨‍💻</div>
            <h3 className="text-lg font-bold text-white mb-2">Remote Work</h3>
            <p className="text-sm text-gray-400">
              Access your office computer from home
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-lg font-bold text-white mb-2">Tech Support</h3>
            <p className="text-sm text-gray-400">
              Help clients solve technical issues
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-bold text-white mb-2">Family Help</h3>
            <p className="text-sm text-gray-400">
              Assist parents and grandparents
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-lg font-bold text-white mb-2">Education</h3>
            <p className="text-sm text-gray-400">
              Remote teaching and tutoring
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            No credit card required. No account needed. Start connecting in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setMode('host')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all shadow-lg font-semibold text-lg"
            >
              Share My Screen Now
            </button>
            <button
              onClick={() => setMode('viewer')}
              className="px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all shadow-lg font-semibold text-lg border-2 border-white/20"
            >
              Connect to Computer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemoteDesktop
