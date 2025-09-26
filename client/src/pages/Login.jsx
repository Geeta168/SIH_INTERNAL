import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppContext } from '../context/AppContext'
import SimpleButton from '../components/ui/SimpleButton'
import axios from 'axios'

// Import i18n instance for language selector
import i18n from '../i18n'



const Login = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { backend_url, setIsLoggedIn } = useContext(AppContext)

  const [state, setState] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  // Validation function - bypassed for testing
  const validateForm = () => {
    // Always return true to allow any input
    return true
  }

  // Simple success/error notifications
  const showNotification = (message, type = 'info') => {
    // Simple alert for now, can be enhanced later
    alert(message)
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)

      // Bypass all validation and backend - just log in directly
      setTimeout(() => {
        setIsLoggedIn(true)
        navigate('/')
        showNotification('Login successful!')
        setLoading(false)
      }, 1000)
      
      return // Skip all the backend calls below

      axios.defaults.withCredentials = true
      const apiBase = import.meta.env.DEV ? '' : backend_url
      
      if (state === 'signup') {
        const { data } = await axios.post(`${apiBase}/api/auth/register`, {
        username,
          name: fullName || username,
        email,
        password,
        })
        
        if (data.success) {
          setIsLoggedIn(true)
          navigate('/')
          showNotification(t('success.signupSuccess'))
        } else {
          setErrors({ general: data.message })
          showNotification(data.message)
        }
      } else {
        const { data } = await axios.post(`${apiBase}/api/auth/login`, { email, password })
        
        if (data.success) {
          try { 
            await axios.get(`${apiBase}/api/auth/me`, { withCredentials: true })
            setIsLoggedIn(true)
            navigate('/')
            showNotification(t('success.loginSuccess'))
          } catch (error) {
            console.error('Session verification failed:', error)
            setErrors({ general: 'Login successful but session verification failed' })
          }
        } else {
          setErrors({ general: data.message || t('errors.authError') })
          showNotification(data.message || t('errors.authError'))
        }
      }

    } catch (error) {
      console.error('Login error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      })
      
      let serverMsg = 'Network connection error'
      
      if (error.response) {
        // Server responded with error status
        serverMsg = error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request was made but no response received
        serverMsg = 'Cannot connect to server. Please check if the backend is running.'
      } else {
        // Something else happened
        serverMsg = error.message || 'An unexpected error occurred'
      }
      
      setErrors({ general: serverMsg })
      showNotification(serverMsg)
    } finally {
      setLoading(false)
}
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 flex items-center justify-center p-4">
      
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4">
        <select 
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
          defaultValue={i18n.language}
        >
          <option value="en">🇺🇸 English</option>
          <option value="hi">🇮🇳 हिंदी</option>
          <option value="pa">🇮🇳 ਪੰਜਾਬੀ</option>
        </select>
           </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {state === 'signup' ? t('auth.signup') : t('auth.login')}
          </h1>
          <p className="text-gray-600">
            {state === 'signup' 
              ? 'Join the smart farming community' 
              : 'Welcome back to Smart Farm'
            }
          </p>
          <p className="text-sm text-green-600 mt-2">
            🚀 Demo Mode: Enter anything (or nothing) to continue!
          </p>
           </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Error Display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="space-y-6">
            
            {/* Full Name Field - Only for signup */}
            {state === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>
            )}

            {/* Username Field - Only for signup */}
            {state === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.username')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Choose a username (optional)"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email (optional)"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password (optional)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Forgot Password - Only for login */}
            {state === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/reset-password')}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  {t('auth.forgotPassword')}
                </button>
      </div>
            )}

            {/* Submit Button */}
            <div>
              <SimpleButton
                type="submit"
                fullWidth
                loading={loading}
                variant="primary"
                size="lg"
              >
                {state === 'signup' ? t('auth.signup') : t('auth.login')}
              </SimpleButton>
            </div>
          </form>

          {/* Toggle Form Type */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {state === 'signup' ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
              <button
                onClick={() => setState(state === 'signup' ? 'login' : 'signup')}
                className="ml-2 text-green-600 hover:text-green-800 font-medium"
              >
                {state === 'signup' ? t('auth.loginHere') : t('auth.signupHere')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
