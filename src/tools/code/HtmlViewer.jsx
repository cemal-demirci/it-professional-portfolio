import { useState } from 'react'
import { Eye, Code, Copy, Check, Monitor, Smartphone, Tablet } from 'lucide-react'

const HtmlViewer = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Preview</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: white;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 30px;
      margin: 20px 0;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    h1 {
      color: #fff;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    button {
      background: white;
      color: #667eea;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Welcome to HTML Viewer! 🎨</h1>
    <p>This is a live HTML preview. Try editing the code!</p>
    <button onclick="alert('Hello from HTML!')">Click Me!</button>
  </div>
</body>
</html>`)
  const [viewMode, setViewMode] = useState('desktop') // desktop, tablet, mobile
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(htmlCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      default: return '100%'
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Eye className="w-8 h-8 text-orange-600" />
          HTML Live Viewer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Write HTML/CSS/JS and see live preview with responsive modes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HTML Editor */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">HTML Code</h3>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full h-[calc(100vh-24rem)] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-0 focus:ring-0 resize-none"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Live Preview</h3>
              </div>

              {/* View Mode Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'desktop'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'tablet'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'mobile'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-24rem)] flex items-start justify-center overflow-auto">
              <div
                style={{
                  width: getPreviewWidth(),
                  maxWidth: '100%',
                  transition: 'width 0.3s ease',
                  border: viewMode !== 'desktop' ? '1px solid #ccc' : 'none',
                  borderRadius: viewMode !== 'desktop' ? '8px' : '0',
                  overflow: 'hidden',
                  boxShadow: viewMode !== 'desktop' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <iframe
                  srcDoc={htmlCode}
                  className="w-full h-[calc(100vh-28rem)] border-0"
                  sandbox="allow-scripts"
                  title="HTML Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
        <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Features:</h4>
        <ul className="text-sm text-orange-800 dark:text-orange-300 space-y-1 ml-5 list-disc">
          <li>✅ Full HTML5, CSS3, and JavaScript support</li>
          <li>📱 Responsive preview modes (Desktop, Tablet, Mobile)</li>
          <li>⚡ Live preview as you type</li>
          <li>🎨 Include inline CSS in <code>&lt;style&gt;</code> tags</li>
          <li>🚀 Test JavaScript with <code>&lt;script&gt;</code> tags or inline handlers</li>
          <li>💡 Perfect for prototyping and learning web development</li>
        </ul>
      </div>
    </div>
  )
}

export default HtmlViewer
