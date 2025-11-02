import { useState, useEffect } from 'react'

const WordCounter = () => {
  const [text, setText] = useState('')
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0
  })

  useEffect(() => {
    calculateStats(text)
  }, [text])

  const calculateStats = (content) => {
    const characters = content.length
    const charactersNoSpaces = content.replace(/\s/g, '').length
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const lines = content ? content.split('\n').length : 0
    const paragraphs = content.trim() ? content.split(/\n\n+/).filter(p => p.trim()).length : 0
    const sentences = content.trim() ? content.split(/[.!?]+/).filter(s => s.trim()).length : 0
    const readingTime = Math.ceil(words / 200) // 200 words per minute

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      readingTime
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Kelime Sayacı</h1>
        <p className="text-gray-600">Metin istatistiklerinizi anında görün</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Metninizi buraya yazın veya yapıştırın..."
          className="textarea-field min-h-[300px]"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Kelime', value: stats.words },
            { label: 'Karakter', value: stats.characters },
            { label: 'Karakter (boşluksuz)', value: stats.charactersNoSpaces },
            { label: 'Satır', value: stats.lines },
            { label: 'Paragraf', value: stats.paragraphs },
            { label: 'Cümle', value: stats.sentences },
            { label: 'Okuma Süresi', value: `${stats.readingTime} dk` },
            { label: 'Ortalama Kelime', value: stats.sentences > 0 ? Math.round(stats.words / stats.sentences) : 0 }
          ].map((stat, index) => (
            <div key={index} className="bg-primary-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary-700">{stat.value}</div>
              <div className="text-sm text-primary-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WordCounter
