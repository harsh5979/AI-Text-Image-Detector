import axios from 'axios'

const API_BASE_URL = '/api'

const aiService = {
  detectAIText: async (text) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/detect-text`, { text })
      return response
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to analyze text')
    }
  },

  detectAIImage: async (imageFile) => {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      
      const response = await axios.post(`${API_BASE_URL}/detect-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to analyze image')
    }
  }
}

export default aiService