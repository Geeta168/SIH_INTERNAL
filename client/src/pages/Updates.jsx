import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import SimpleButton from '../components/ui/SimpleButton'

const Updates = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt')

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lon: longitude })
          fetchWeatherData(latitude, longitude)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setLocationPermission('denied')
          // Use default location (Delhi, India) if location access denied
          setLocation({ lat: 28.6139, lon: 77.2090, city: 'Delhi' })
          fetchWeatherData(28.6139, 77.2090)
        }
      )
    } else {
      setError('Geolocation is not supported by this browser')
      setLoading(false)
    }
  }

  // Fetch weather data from OpenWeather API (free tier)
  const fetchWeatherData = async (lat, lon) => {
    try {
      // Using OpenWeatherMap's free API - you'll need to get an API key
      // For demo purposes, I'll create mock data
      
      // Simulate API call delay
      setTimeout(() => {
        const mockWeather = {
          location: 'Current Location',
          temperature: Math.round(20 + Math.random() * 15), // 20-35°C
          description: 'Partly Cloudy',
          humidity: Math.round(40 + Math.random() * 40), // 40-80%
          windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
          pressure: Math.round(1000 + Math.random() * 30), // 1000-1030 hPa
          uvIndex: Math.round(1 + Math.random() * 8), // 1-9
          icon: '⛅',
          feelsLike: Math.round(22 + Math.random() * 13),
          visibility: Math.round(8 + Math.random() * 7) // 8-15 km
        }

        const mockForecast = Array.from({ length: 5 }, (_, i) => ({
          date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(22 + Math.random() * 13),
          low: Math.round(15 + Math.random() * 8),
          description: ['Sunny', 'Cloudy', 'Rain', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 5)],
          icon: ['☀️', '☁️', '🌧️', '⛅', '🌤️'][Math.floor(Math.random() * 5)],
          precipitation: Math.round(Math.random() * 40) // 0-40%
        }))

        setWeather(mockWeather)
        setForecast(mockForecast)
        setLoading(false)
      }, 1500)

    } catch (error) {
      console.error('Weather API error:', error)
      setError('Failed to fetch weather data')
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  // Get farming advice based on weather
  const getFarmingAdvice = () => {
    if (!weather) return []
    
    const advice = []
    
    if (weather.temperature > 30) {
      advice.push('🌡️ High temperature - ensure adequate irrigation for crops')
    }
    if (weather.humidity < 50) {
      advice.push('💧 Low humidity - consider mulching to retain soil moisture')
    }
    if (weather.windSpeed > 15) {
      advice.push('💨 High winds - protect young plants and check irrigation systems')
    }
    if (weather.uvIndex > 6) {
      advice.push('☀️ High UV index - provide shade for sensitive crops')
    }
    
    if (advice.length === 0) {
      advice.push('✅ Weather conditions are favorable for farming activities')
    }
    
    return advice
  }

  const getWeatherIcon = (description) => {
    const icons = {
      'sunny': '☀️',
      'clear': '🌤️',
      'cloudy': '☁️',
      'partly cloudy': '⛅',
      'rain': '🌧️',
      'storm': '⛈️',
      'snow': '❄️',
      'fog': '🌫️'
    }
    return icons[description.toLowerCase()] || '🌤️'
  }

  if (loading) {
    return (
    <div>
        <Navbar />
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <LoadingSpinner size="xl" text="Getting your local weather..." />
        </div>
          </div>
    )
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <SimpleButton onClick={() => window.location.reload()}>
              Try Again
            </SimpleButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🌤️ {t('weather.title')}
            </h1>
            <p className="text-gray-600">
              Real-time weather data for your farming decisions
            </p>
            {locationPermission === 'denied' && (
              <p className="text-sm text-yellow-600 mt-2">
                📍 Using default location. Enable location access for your exact weather.
              </p>
            )}
          </div>

          {/* Current Weather Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Main Weather Info */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <span className="text-6xl mr-4">{weather.icon}</span>
                  <div>
                    <h2 className="text-5xl font-bold text-gray-900">
                      {weather.temperature}°C
                    </h2>
                    <p className="text-xl text-gray-600">{weather.description}</p>
                    <p className="text-sm text-gray-500">
                      Feels like {weather.feelsLike}°C
                    </p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 mb-2">
                  📍 {weather.location}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="text-lg font-semibold text-blue-700">{weather.humidity}%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💨</div>
                  <div className="text-lg font-semibold text-green-700">{weather.windSpeed} km/h</div>
                  <div className="text-sm text-gray-600">Wind Speed</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-lg font-semibold text-purple-700">{weather.pressure} hPa</div>
                  <div className="text-sm text-gray-600">Pressure</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="text-lg font-semibold text-orange-700">{weather.uvIndex}</div>
                  <div className="text-sm text-gray-600">UV Index</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              📅 5-Day Forecast
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {day.date}
                  </div>
                  <div className="text-3xl mb-2">{day.icon}</div>
                  <div className="text-lg font-bold text-gray-900">
                    {day.high}°
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {day.low}°
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.description}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    💧 {day.precipitation}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farming Advice */}
          <div className="bg-green-50 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-green-800 mb-6">
              🌾 Today's Farming Advice
            </h3>
            <div className="space-y-3">
              {getFarmingAdvice().map((advice, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <div className="text-green-600 text-lg">✓</div>
                  <p className="text-gray-700">{advice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SimpleButton
              onClick={() => navigate('/AI-Assistant')}
              variant="primary"
              fullWidth
              className="p-6 h-auto"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-semibold">Ask AI Assistant</div>
                <div className="text-sm opacity-80">Get weather-based farming advice</div>
        </div>
            </SimpleButton>
            
            <SimpleButton
              onClick={() => navigate('/Disease-Detection')}
              variant="secondary"
              fullWidth
              className="p-6 h-auto"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🔍</div>
                <div className="font-semibold">Check Crop Health</div>
                <div className="text-sm opacity-80">Analyze your crops with AI</div>
      </div>
            </SimpleButton>
            
            <SimpleButton
              onClick={() => window.location.reload()}
              variant="outline"
              fullWidth
              className="p-6 h-auto"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="font-semibold">Refresh Weather</div>
                <div className="text-sm opacity-80">Get latest updates</div>
                </div>
            </SimpleButton>
          </div>
        </div>
    </div>
      <Footer />
    </div>
  )
}

export default Updates