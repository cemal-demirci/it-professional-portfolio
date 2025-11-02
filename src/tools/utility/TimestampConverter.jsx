import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

const TimestampConverter = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now())
  const [inputTimestamp, setInputTimestamp] = useState('')
  const [inputDate, setInputDate] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp))
    return {
      full: date.toString(),
      iso: date.toISOString(),
      local: date.toLocaleString('tr-TR'),
      utc: date.toUTCString(),
      date: date.toLocaleDateString('tr-TR'),
      time: date.toLocaleTimeString('tr-TR')
    }
  }

  const convertToTimestamp = () => {
    const date = new Date(inputDate)
    setInputTimestamp(date.getTime().toString())
  }

  const timestampData = inputTimestamp ? formatDate(inputTimestamp) : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Timestamp Converter</h1>
        <p className="text-gray-600">Unix timestamp ve tarih dönüşümü</p>
      </div>

      {/* Current Timestamp */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-xl p-6 text-white text-center">
        <div className="text-sm font-medium mb-2">Şu Anki Unix Timestamp</div>
        <div className="text-4xl font-bold mb-2">{currentTimestamp}</div>
        <div className="text-primary-100">{new Date(currentTimestamp).toLocaleString('tr-TR')}</div>
      </div>

      {/* Timestamp to Date */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Timestamp → Tarih</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Unix Timestamp</label>
          <input
            type="text"
            value={inputTimestamp}
            onChange={(e) => setInputTimestamp(e.target.value)}
            placeholder="örn: 1699999999999"
            className="input-field"
          />
        </div>

        {timestampData && (
          <div className="space-y-2 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'ISO 8601', value: timestampData.iso },
                { label: 'UTC', value: timestampData.utc },
                { label: 'Yerel Zaman', value: timestampData.local },
                { label: 'Tarih', value: timestampData.date },
                { label: 'Saat', value: timestampData.time }
              ].map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                  <div className="text-sm font-mono text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date to Timestamp */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Tarih → Timestamp</h2>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="input-field flex-1"
          />
          <button onClick={convertToTimestamp} className="btn-primary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Dönüştür
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Unix Timestamp Nedir?</h3>
        <p className="text-sm text-blue-800">
          Unix timestamp, 1 Ocak 1970 00:00:00 UTC'den bu yana geçen saniye (veya milisaniye) sayısıdır.
          Programlamada tarih ve saat verilerini saklamak için yaygın olarak kullanılır.
        </p>
      </div>
    </div>
  )
}

export default TimestampConverter
