import { useState } from 'react'
import { Upload, Trash2, Download } from 'lucide-react'
import { jsPDF } from 'jspdf'

const ImageToPdf = () => {
  const [images, setImages] = useState([])

  const handleFileSelect = async (e) => {
    const newFiles = Array.from(e.target.files)
    const imagePromises = newFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve({ file, url: e.target.result })
        reader.readAsDataURL(file)
      })
    })
    const loadedImages = await Promise.all(imagePromises)
    setImages([...images, ...loadedImages])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const generatePdf = () => {
    if (images.length === 0) {
      alert('Please select at least one image')
      return
    }

    const pdf = new jsPDF()
    images.forEach((image, index) => {
      const img = new Image()
      img.src = image.url

      if (index > 0) pdf.addPage()

      const imgWidth = pdf.internal.pageSize.getWidth() - 20
      const imgHeight = (img.height * imgWidth) / img.width
      pdf.addImage(image.url, 'JPEG', 10, 10, imgWidth, imgHeight)
    })

    pdf.save('images.pdf')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Image to PDF</h1>
        <p className="text-gray-400">Convert images to PDF</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <label className="cursor-pointer">
            <span className="btn-primary inline-block">Select Images</span>
            <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>

        {images.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-white">Selected Images ({images.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image.url} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={generatePdf} className="btn-primary w-full flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Generate PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageToPdf
