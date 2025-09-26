import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import SimpleButton from '../components/ui/SimpleButton'

const DiseaseDetection = () => {
  const { t } = useTranslation()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [analysisHistory, setAnalysisHistory] = useState([])
  const aiUrl = import.meta.env.VITE_AI_URL || 'http://localhost:8000'
  const inputRef = useRef(null)

  const onChoose = () => inputRef.current?.click()
  
  const handleFile = (selectedFile) => {
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)')
        return
      }
      
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
    
    setFile(selectedFile)
    setResult(null)
  }
  
  const onChange = (e) => {
    const selectedFile = e.target.files?.[0] || null
    handleFile(selectedFile)
  }

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }
  const onUpload = async () => {
    if (!file) return
    const form = new FormData()
    form.append('image', file)
    setLoading(true)
    setResult(null)
    
    try {
      const res = await fetch(`${aiUrl}/api/ai/soil`, { method: 'POST', body: form })
      const data = await res.json()
      
      if (data?.success) {
        const newResult = {
          ...data.result,
          timestamp: new Date(),
          fileName: file.name,
          imagePreview: preview
        }
        setResult(newResult)
        
        // Add to history
        setAnalysisHistory(prev => [newResult, ...prev.slice(0, 4)])
      } else {
        setResult({ 
          status: 'error', 
          advice: data?.message || 'Failed to analyze',
          timestamp: new Date(),
          fileName: file.name
        })
      }
    } catch (e) {
      setResult({ 
        status: 'error', 
        advice: 'Service unavailable. Please check your connection.',
        timestamp: new Date(),
        fileName: file.name
      })
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🔬 AI Crop & Soil Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Upload clear images of your crops or soil for instant AI-powered health analysis and expert recommendations.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/70 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🌱</div>
              <div className="text-sm font-medium text-gray-800">Disease Detection</div>
              <div className="text-xs text-gray-600">Identify crop diseases early</div>
            </div>
            <div className="bg-white/70 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🌾</div>
              <div className="text-sm font-medium text-gray-800">Soil Health</div>
              <div className="text-xs text-gray-600">Assess soil conditions</div>
            </div>
            <div className="bg-white/70 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💡</div>
              <div className="text-sm font-medium text-gray-800">Expert Advice</div>
              <div className="text-xs text-gray-600">Get treatment recommendations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              
              {/* Upload Header */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold">Upload Image for Analysis</h2>
                <p className="text-green-100 text-sm mt-1">
                  Drag and drop or click to select an image of your crop or soil
                </p>
              </div>

              {/* Upload Area */}
              <div className="p-6">
                <input 
                  ref={inputRef} 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={onChange}
                />
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-green-400 bg-green-50' 
                      : preview 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-48 h-32 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <SimpleButton onClick={onChoose} variant="outline" size="sm">
                          📷 Change Image
                        </SimpleButton>
                        <SimpleButton onClick={clearResults} variant="outline" size="sm">
                          🗑️ Clear
                        </SimpleButton>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-1">
                          Drag & drop your image here
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          or click to browse files
                        </p>
                        <p className="text-xs text-gray-400">
                          Supports: PNG, JPG, WebP • Max size: 10MB
                        </p>
                      </div>
                      <SimpleButton onClick={onChoose} variant="primary">
                        📁 Select Image
                      </SimpleButton>
                    </div>
                  )}
                </div>

                {/* Analysis Button */}
                <div className="mt-6">
                  <SimpleButton 
                    onClick={onUpload} 
                    disabled={!file || loading} 
                    fullWidth
                    className="py-4 text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <LoadingSpinner size="sm" />
                        <span>🔬 Analyzing Image...</span>
                      </div>
                    ) : (
                      '🚀 Start AI Analysis'
                    )}
                  </SimpleButton>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                  <h3 className="text-2xl font-bold">📊 Analysis Results</h3>
                  <p className="text-blue-100 text-sm">
                    {new Date(result.timestamp).toLocaleDateString()} • {result.fileName}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Status Card */}
                    <div className={`rounded-xl p-6 ${
                      result.status === 'healthy' ? 'bg-green-50 border-2 border-green-200' :
                      result.status === 'dry' ? 'bg-yellow-50 border-2 border-yellow-200' : 
                      result.status === 'error' ? 'bg-red-50 border-2 border-red-200' :
                      'bg-orange-50 border-2 border-orange-200'
                    }`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full ${
                          result.status === 'healthy' ? 'bg-green-500' :
                          result.status === 'dry' ? 'bg-yellow-500' : 
                          result.status === 'error' ? 'bg-red-500' :
                          'bg-orange-500'
                        }`}></div>
                        <span className={`font-bold text-lg capitalize ${
                          result.status === 'healthy' ? 'text-green-800' :
                          result.status === 'dry' ? 'text-yellow-800' : 
                          result.status === 'error' ? 'text-red-800' :
                          'text-orange-800'
                        }`}>
                          {result.status === 'error' ? 'Analysis Error' : result.status}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${
                        result.status === 'healthy' ? 'text-green-700' :
                        result.status === 'dry' ? 'text-yellow-700' : 
                        result.status === 'error' ? 'text-red-700' :
                        'text-orange-700'
                      }`}>
                        {result.advice}
                      </p>
                    </div>

                    {/* Technical Details */}
                    {result.metrics && (
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          🔬 Technical Analysis
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Brightness</span>
                            <span className="font-medium text-gray-900">{result.metrics.brightness}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Variance</span>
                            <span className="font-medium text-gray-900">{result.metrics.variance}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">White Ratio</span>
                            <span className="font-medium text-gray-900">{result.metrics.nearWhiteRatio}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                💡 Photography Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Take photos in natural daylight</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Ensure the image is clear and focused</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Include close-up details of affected areas</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Avoid shadows covering the subject</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span>Capture multiple angles if needed</span>
                </div>
              </div>
            </div>

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  📋 Recent Analysis
                </h3>
                <div className="space-y-3">
                  {analysisHistory.slice(0, 3).map((analysis, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          analysis.status === 'healthy' ? 'bg-green-100 text-green-800' :
                          analysis.status === 'dry' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {analysis.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(analysis.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {analysis.fileName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default DiseaseDetection
