import React, { useState } from 'react'
import aiService from '../services/aiService.js'

const ImageAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError('')
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await aiService.detectAIImage(selectedFile)
      setResult(response.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError('')
  }
  if (loading) {
    return(
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-600 font-medium">Analyzing image...</span>
      </div>
    )
    
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-6">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label 
            htmlFor="image-upload" 
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
          >
            {preview ? '📷 Change Image' : '📁 Select Image'}
          </label>
        </div>

        {preview && (
          <div className="mb-6">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !selectedFile}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Analyzing...
              </>
            ) : (
              '🔍 Analyze Image'
            )}
          </button>
          
          <button 
            onClick={handleClear} 
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div key={Date.now()} className="bg-white rounded-lg shadow-lg p-6">
          <div className={`p-6 rounded-lg ${result.isAI ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">
                {result.isAI ? '🤖 AI Generated' : '📸 Real Image'}
              </h3>
              <div className="text-right">
                <div className="text-lg font-semibold">Confidence: {result.confidence}%</div>
                {result.analysis?.method && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mt-1">
                    {result.analysis.method === 'hybrid' ? '🧠 AI+Pattern' : '📊 Pattern'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Width</div>
                <div className="text-lg font-bold">{result.analysis?.width}px</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Height</div>
                <div className="text-lg font-bold">{result.analysis?.height}px</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Format</div>
                <div className="text-lg font-bold">{result.analysis?.format?.toUpperCase()}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-gray-600">Methods</div>
                <div className="text-lg font-bold">{result.analysis?.detectionMethods}</div>
              </div>
            </div>

            {result.reasons && result.reasons.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-2">Detection Reasons:</h4>
                <ul className="space-y-1">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageAnalyzer