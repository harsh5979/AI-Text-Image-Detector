import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

// Lazy load components for better performance
const TextAnalyzer = lazy(() => import('./components/TextAnalyzer.jsx'))
const ImageAnalyzer = lazy(() => import('./components/ImageAnalyzer.jsx'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navbar />
        
        <main className="pb-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <>
                  <header className="text-center py-8 sm:py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        🤖 AI Text Identifier
                      </h1>
                      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Advanced AI detection using multiple analysis methods to identify AI-generated content
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Pattern Analysis
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Statistical Detection
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Language Models
                        </span>
                      </div>
                    </div>
                  </header>
                  <TextAnalyzer />
                </>
              } />
              <Route path="/image" element={
                <>
                  <header className="text-center py-8 sm:py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        🖼️ AI Image Detector
                      </h1>
                      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Sophisticated image analysis to detect AI-generated images using advanced algorithms
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Metadata Analysis
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Pattern Detection
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Frequency Analysis
                        </span>
                      </div>
                    </div>
                  </header>
                  <ImageAnalyzer />
                </>
              } />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-600 text-sm">
              <p>© 2024 AI Detector. Advanced AI content detection technology.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App