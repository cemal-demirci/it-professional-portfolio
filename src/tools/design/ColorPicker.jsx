import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const ColorPicker = () => {
  const [color, setColor] = useState('#3b82f6')
  const [copied, setCopied] = useState('')

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const rgb = hexToRgb(color)
  const hsl = hexToHsl(color)

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const formats = [
    { name: 'HEX', value: color },
    { name: 'RGB', value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '' },
    { name: 'HSL', value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Color Picker</h1>
        <p className="text-gray-600">Renk seçin ve kod formatlarını alın</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
        {/* Color Preview */}
        <div
          className="w-full h-48 rounded-lg border-2 border-gray-200"
          style={{ backgroundColor: color }}
        />

        {/* Color Picker */}
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="input-field flex-1"
          />
        </div>

        {/* Color Formats */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Renk Kodları</h3>
          {formats.map((format) => (
            <div key={format.name} className="flex items-center gap-2">
              <div className="w-16 text-sm font-medium text-gray-700">{format.name}</div>
              <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <code className="flex-1 text-sm font-mono text-gray-900">{format.value}</code>
                <button
                  onClick={() => copyToClipboard(format.value, format.name)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  {copied === format.name ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ColorPicker
