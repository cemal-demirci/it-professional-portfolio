import { useState } from 'react'

const BinaryConverter = () => {
  const [values, setValues] = useState({ decimal: '', binary: '', hex: '', octal: '' })

  const convert = (type, val) => {
    const num = type === 'decimal' ? parseInt(val) : type === 'binary' ? parseInt(val, 2) : type === 'hex' ? parseInt(val, 16) : parseInt(val, 8)
    if (isNaN(num)) return
    setValues({
      decimal: num.toString(),
      binary: num.toString(2),
      hex: num.toString(16).toUpperCase(),
      octal: num.toString(8)
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Number Base Converter</h1>
        <p className="text-gray-400">Convert between Binary, Decimal, Hex, and Octal</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        {[
          { label: 'Decimal', key: 'decimal', placeholder: '255' },
          { label: 'Binary', key: 'binary', placeholder: '11111111' },
          { label: 'Hexadecimal', key: 'hex', placeholder: 'FF' },
          { label: 'Octal', key: 'octal', placeholder: '377' }
        ].map((item) => (
          <div key={item.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{item.label}</label>
            <input type="text" value={values[item.key]} onChange={(e) => convert(item.key, e.target.value)} placeholder={item.placeholder} className="input-field bg-gray-700 border-gray-600 text-white font-mono" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BinaryConverter
