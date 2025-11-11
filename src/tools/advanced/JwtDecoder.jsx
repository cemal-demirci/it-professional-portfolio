import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const JwtDecoder = () => {
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState(null)
  const [error, setError] = useState('')

  const decodeToken = () => {
    try {
      const dec = jwtDecode(token)
      const [header, payload, signature] = token.split('.')
      setDecoded({
        header: JSON.parse(atob(header)),
        payload: dec,
        signature: signature
      })
      setError('')
    } catch (err) {
      setError('Invalid JWT token')
      setDecoded(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">JWT Decoder</h1>
        <p className="text-gray-400">Decode JSON Web Tokens</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">JWT Token</label>
          <textarea value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste your JWT token here..." className="textarea-field bg-gray-700 border-gray-600 text-white" />
        </div>

        <button onClick={decodeToken} className="btn-primary w-full">Decode JWT</button>

        {error && <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-400">{error}</div>}

        {decoded && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Header</h3>
              <pre className="p-4 bg-black rounded-lg overflow-x-auto text-sm text-green-400">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Payload</h3>
              <pre className="p-4 bg-black rounded-lg overflow-x-auto text-sm text-green-400">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Signature</h3>
              <code className="block p-4 bg-black rounded-lg overflow-x-auto text-sm text-yellow-400">{decoded.signature}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JwtDecoder
