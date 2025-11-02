import { useState, useEffect, useRef } from 'react'
import { Download } from 'lucide-react'
import QRCode from 'qrcode'

const QrGenerator = () => {
  const [text, setText] = useState('')
  const [qrCode, setQrCode] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    if (text) {
      generateQR()
    }
  }, [text])

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCode(url)
    } catch (err) {
      console.error(err)
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrCode
    link.click()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
        <p className="text-gray-600">Metin veya URL için QR kod oluşturun</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Metin veya URL</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="QR koda dönüştürülecek metni veya URL'yi girin..."
            className="input-field h-24"
          />
        </div>

        {qrCode && (
          <div className="space-y-4">
            <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
              <img src={qrCode} alt="QR Code" className="max-w-full" />
            </div>

            <button
              onClick={downloadQR}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              QR Kodu İndir
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Kullanım Alanları</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Website URL'leri</li>
          <li>WiFi şifreleri</li>
          <li>İletişim bilgileri (vCard)</li>
          <li>Ödeme bilgileri</li>
          <li>Metin mesajlar</li>
        </ul>
      </div>
    </div>
  )
}

export default QrGenerator
