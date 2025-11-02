import { useState } from 'react'

const CaseConverter = () => {
  const [text, setText] = useState('')

  const convert = (type) => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase())
        break
      case 'lower':
        setText(text.toLowerCase())
        break
      case 'title':
        setText(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
        break
      case 'sentence':
        setText(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
        break
      case 'capitalize':
        setText(text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
        break
      case 'inverse':
        setText(text.split('').map(char =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        ).join(''))
        break
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Case Converter</h1>
        <p className="text-gray-600">Metin formatını dönüştürün</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Metninizi buraya girin..."
          className="textarea-field"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button onClick={() => convert('upper')} className="btn-secondary">
            BÜYÜK HARF
          </button>
          <button onClick={() => convert('lower')} className="btn-secondary">
            küçük harf
          </button>
          <button onClick={() => convert('title')} className="btn-secondary">
            Title Case
          </button>
          <button onClick={() => convert('sentence')} className="btn-secondary">
            Sentence case
          </button>
          <button onClick={() => convert('capitalize')} className="btn-secondary">
            Capitalize Words
          </button>
          <button onClick={() => convert('inverse')} className="btn-secondary">
            iNVERSE cASE
          </button>
        </div>
      </div>
    </div>
  )
}

export default CaseConverter
