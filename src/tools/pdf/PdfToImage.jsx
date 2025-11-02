import { useState } from 'react'
import { Upload, Download, FileImage, Loader, Eye, Trash2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

const PdfToImage = () => {
  const [file, setFile] = useState(null)
  const [converting, setConverting] = useState(false)
  const [images, setImages] = useState([])
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(2)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      alert('Please select a valid PDF file')
      return
    }
    setFile(selectedFile)
    setImages([])
    setProgress(0)
  }

  const convertPdfToImages = async () => {
    if (!file) return

    setConverting(true)
    setImages([])
    setProgress(0)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      const convertedImages = []

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: quality })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        const imageData = canvas.toDataURL(`image/${format}`, 0.95)
        convertedImages.push({
          pageNum,
          data: imageData,
          width: viewport.width,
          height: viewport.height
        })

        setProgress(Math.round((pageNum / numPages) * 100))
      }

      setImages(convertedImages)
      alert(`✅ Successfully converted ${numPages} pages!`)
    } catch (err) {
      alert(`❌ Error: ${err.message}`)
      console.error(err)
    } finally {
      setConverting(false)
      setProgress(0)
    }
  }

  const downloadImage = (image) => {
    const a = document.createElement('a')
    a.href = image.data
    a.download = `page-${image.pageNum}.${format}`
    a.click()
  }

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 200)
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <FileImage className="w-8 h-8 text-purple-600" />
          PDF to Image Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Convert PDF pages to high-quality images</p>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Conversion Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="input-field"
            >
              <option value="png">PNG (Best Quality)</option>
              <option value="jpeg">JPEG (Smaller Size)</option>
              <option value="webp">WebP (Modern)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quality Scale: {quality}x
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1x (Fast)</span>
              <span>2x (Balanced)</span>
              <span>4x (Best)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <label className="cursor-pointer">
            <span className="btn-primary inline-block">Select PDF File</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {file ? `📄 ${file.name}` : 'or drag and drop here'}
          </p>
        </div>

        {file && !converting && images.length === 0 && (
          <button
            onClick={convertPdfToImages}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <FileImage className="w-5 h-5" />
            Convert to Images
          </button>
        )}

        {converting && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Converting kardeşim... {progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {images.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Converted Images ({images.length} pages)
            </h3>
            <button
              onClick={downloadAll}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.pageNum}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
              >
                <img
                  src={image.data}
                  alt={`Page ${image.pageNum}`}
                  className="w-full rounded border border-gray-200 dark:border-gray-600"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {image.pageNum}
                  </span>
                  <button
                    onClick={() => downloadImage(image)}
                    className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {image.width} × {image.height}px
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Pro Tips:</h4>
        <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1 ml-5 list-disc">
          <li>PNG format: Best for text and diagrams (lossless)</li>
          <li>JPEG format: Smaller files, good for photos</li>
          <li>Higher quality scale = better resolution but larger files</li>
          <li>All conversion happens in your browser - no uploads! 🔒</li>
        </ul>
      </div>
    </div>
  )
}

export default PdfToImage
