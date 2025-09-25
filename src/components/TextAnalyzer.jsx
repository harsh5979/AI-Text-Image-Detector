import React, { useState, useCallback, useMemo } from 'react'
import aiService from '../services/aiService.js'

const TextAnalyzer = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await aiService.detectAIText(text)
      setResult(response.data.data)

    } catch (err) {
      setError(err.message || 'Failed to analyze text')
    } finally {
      setLoading(false)
    }
  }, [text])

  const handleClear = useCallback(() => {
    setText('')
    setResult(null)
    setError('')
  }, [])

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(word => word.length > 0).length, [text])

  if (loading) {
    return(
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-600 font-medium">Analyzing text...</span>
      </div>
    )
    
  }
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter text to analyze ({wordCount} words)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here to check if it's AI-generated or human-written..."
            className="w-full h-32 sm:h-40 lg:h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            rows={8}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="hidden sm:inline">Analyzing...</span>
                <span className="sm:hidden">Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Analyze Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className={`p-6 sm:p-8 ${result.isAI ? 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500'}`}>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl">
                    {result.isAI ? '🤖' : '👤'}
                  </span>
                  <span className={result.isAI ? 'text-red-700' : 'text-green-700'}>
                    {result.isAI ? 'AI Generated' : 'Human Written'}
                  </span>
                </h3>
                <p className="text-gray-600 mt-1">
                  Detection completed with advanced analysis
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {result.confidence}%
                </div>
                <div className="text-sm text-gray-600 mb-2">Confidence</div>
                {result.analysis?.method &&(
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full font-medium">
                    {result.analysis.method === 'ai-hybrid' ? '🧠 AI Model' :
                      result.analysis.method === 'hybrid' ? '🧠 AI+Pattern' : '📊 Pattern Analysis'}
                  </span>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {result.analysis?.wordCount ?? 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Words</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {result.analysis?.sentenceCount ?? 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Sentences</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
                  {result.analysis?.avgSentenceLength ?? 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mt-1">Avg Length</div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Confidence Level</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${result.confidence > 70 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      result.confidence > 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Detection Reasons */}
            {result.reasons && result.reasons.length > 0 && (
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🔍</span>
                  Detection Analysis
                </h4>
                <div className="space-y-3">
                  {result.reasons.map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-sm sm:text-base">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TextAnalyzer