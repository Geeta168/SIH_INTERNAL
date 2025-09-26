import '@testing-library/jest-dom'

// Mock environment variables
global.import = {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://localhost:3000',
      VITE_AI_URL: 'http://localhost:8000',
      DEV: true
    }
  }
}

// Mock fetch for testing
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock window.alert
global.alert = vi.fn()
