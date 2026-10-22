import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  if (mode === 'production') {
    const apiUrl = env.VITE_API_BASE_URL
    if (!apiUrl) {
      throw new Error('VITE_API_BASE_URL must be set to the IPJBU Render API URL for production builds.')
    }

    let parsedApiUrl
    try {
      parsedApiUrl = new URL(apiUrl)
    } catch {
      throw new Error('VITE_API_BASE_URL must be a valid absolute HTTPS URL.')
    }
    if (parsedApiUrl.protocol !== 'https:') {
      throw new Error('VITE_API_BASE_URL must use HTTPS for production builds.')
    }
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy all /api/* and /uploads/* requests to the Express backend in dev
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})
