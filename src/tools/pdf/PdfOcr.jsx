import { useState, useRef } from 'react'
import { Upload, FileText, Loader, Copy, Download, Eye } from 'lucide-react'
import Tesseract from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

const PdfOcr = () => {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [progress, setProgress] = useState(0)
  const [language, setLanguage] = useState('eng')
  const [preview, setPreview] = useState(null)
  const canvasRef = useRef(null)

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'tur', name: 'Turkish (Türkçe)' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'rus', name: 'Russian' },
    { code: 'ara', name: 'Arabic' },
    { code: 'chi_sim', name: 'Chinese Simplified' },
  ]

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const fileType = selectedFile.type
    if (!fileType.includes('pdf') && !fileType.includes('image')) {
      alert('Please select a PDF or image file')
      return
    }

    setFile(selectedFile)
    setExtractedText('')
    setProgress(0)

    // Create preview for images
    if (fileType.includes('image')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  const extractTextFromPdf = async () => {
    if (!file) return

    setProcessing(true)
    setExtractedText('')
    setProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()

      if (file.type.includes('pdf')) {
        // PDF OCR
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const numPages = pdf.numPages
        let fullText = ''

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum)
          const viewport = page.getViewport({ scale: 2 })

          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise

          const imageData = canvas.toDataURL('image/png')

          // OCR on canvas
          const result = await Tesseract.recognize(imageData, language, {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                const pageProgress = ((pageNum - 1) / numPages + m.progress / numPages) * 100
                setProgress(Math.round(pageProgress))
              }
            }
          })

          fullText += `\n\n--- Page ${pageNum} ---\n\n${result.data.text}`
        }

        setExtractedText(fullText.trim())
        alert(`✅ Extracted text from ${numPages} pages!`)
      } else {
        // Image OCR
        const result = await Tesseract.recognize(file, language, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100))
            }
          }
        })

        setExtractedText(result.data.text)
        alert('✅ Text extraction complete!')
      }
    } catch (err) {
      alert(`❌ Error yapıyor: ${err.message}`)
      console.error(err)
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
    alert('📋 Copied to clipboard!')
  }

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `extracted-text-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          PDF & Image OCR
        </h1>
        <p className="text-gray-400">
          Extract text from PDFs and images using AI
        </p>
      </div>

      {/* Settings */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <h3 className="font-semibold text-white">OCR Settings</h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recognition Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
            disabled={processing}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <label className="cursor-pointer">
            <span className="btn-primary inline-block">Select File</span>
            <input
              type="file"
              accept=".pdf,application/pdf,image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={processing}
            />
          </label>
          <p className="text-sm text-gray-400 mt-2">
            {file ? `📄 ${file.name}` : 'PDF or Image (JPG, PNG, etc.)'}
          </p>
        </div>

        {preview && (
          <div className="flex justify-center">
            <img src={preview} alt="Preview" className="max-h-64 rounded-lg border border-gray-200 border-gray-600" />
          </div>
        )}

        {file && !processing && !extractedText && (
          <button
            onClick={extractTextFromPdf}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Extract Text with OCR
          </button>
        )}

        {processing && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span>OCR yapıyor... {progress}%</span>
            </div>
            <div className="w-full bg-gray-200 bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-500">
              This might take a while for large files...
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {extractedText && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Extracted Text ({extractedText.length} characters)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={downloadText}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="textarea-field min-h-[400px] font-mono text-sm"
            placeholder="Extracted text will appear here..."
          />
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-300 mb-2">OCR Tips:</h4>
        <ul className="text-sm text-blue-300 space-y-1 ml-5 list-disc">
          <li>Higher quality images = better OCR accuracy</li>
          <li>Select the correct language for best results</li>
          <li>Works with scanned documents, screenshots, photos</li>
          <li>All processing happens locally - no uploads! 🔒</li>
          <li>Large PDFs may take several minutes to process</li>
        </ul>
      </div>
    </div>
  )
}

export default PdfOcr
