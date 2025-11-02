import { useState } from 'react'
import { Upload, Trash2, Download } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'

const PdfMerger = () => {
  const [files, setFiles] = useState([])
  const [merging, setMerging] = useState(false)

  const handleFileSelect = (e) => {
    const newFiles = Array.from(e.target.files)
    setFiles([...files, ...newFiles])
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const mergePdfs = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files')
      return
    }

    setMerging(true)
    try {
      const mergedPdf = await PDFDocument.create()

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfFile = await mergedPdf.save()
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)

      alert('PDFs merged successfully!')
    } catch (error) {
      alert('Error merging PDFs: ' + error.message)
    } finally {
      setMerging(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">PDF Merger</h1>
        <p className="text-gray-600 dark:text-gray-400">Merge multiple PDF files into one</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <label className="cursor-pointer">
            <span className="btn-primary inline-block">Select PDF Files</span>
            <input type="file" multiple accept=".pdf" onChange={handleFileSelect} className="hidden" />
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or drag and drop here</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Selected Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={mergePdfs} disabled={merging} className="btn-primary w-full flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              {merging ? 'Merging...' : 'Merge PDFs and Download'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How to Use</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
          <li>Select two or more PDF files</li>
          <li>Files will be merged in the order you select them</li>
          <li>Click "Merge PDFs" to download the result</li>
          <li>All processing happens in your browser - no uploads</li>
        </ul>
      </div>
    </div>
  )
}

export default PdfMerger
