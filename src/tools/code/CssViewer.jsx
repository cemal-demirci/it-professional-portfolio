import { useState } from 'react'
import { Eye, Code, Copy, Check } from 'lucide-react'

const CssViewer = () => {
  const [cssCode, setCssCode] = useState(`/* Try your CSS here */
.box {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}`)
  const [htmlCode, setHtmlCode] = useState('<div class="box">Hello CSS!</div>')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Eye className="w-8 h-8 text-blue-600" />
          CSS Live Viewer
        </h1>
        <p className="text-gray-400">
          Write CSS and see live preview instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSS Editor */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-white">CSS Code</h3>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 text-gray-300 rounded-lg hover:hover:bg-gray-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              value={cssCode}
              onChange={(e) => setCssCode(e.target.value)}
              className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 focus:ring-0 resize-none"
              spellCheck="false"
            />
          </div>

          {/* HTML Editor */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-white">HTML Code</h3>
              </div>
            </div>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full h-32 p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 focus:ring-0 resize-none"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="border-b border-gray-700 p-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-white">Live Preview</h3>
              </div>
            </div>
            <div className="p-8 bg-gray-900 min-h-[32rem] flex items-center justify-center">
              <div>
                <style>{cssCode}</style>
                <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">Pro Tips:</h4>
        <ul className="text-sm text-blue-300 space-y-1 ml-5 list-disc">
          <li>Use modern CSS properties like <code>grid</code>, <code>flexbox</code>, <code>animations</code></li>
          <li>Try responsive units: <code>rem</code>, <code>em</code>, <code>vh</code>, <code>vw</code></li>
          <li>Experiment with CSS variables: <code>--color-primary: #667eea;</code></li>
          <li>Test animations and transitions in real-time</li>
          <li>Perfect for learning and prototyping CSS designs</li>
        </ul>
      </div>
    </div>
  )
}

export default CssViewer
