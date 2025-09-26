import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  CameraIcon,
  CloudIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import { AppContext } from '../context/AppContext'
import LanguageSelector from './ui/LanguageSelector'
import VoiceButton from './ui/VoiceButton'
import Button from './ui/Button'
import { voiceService } from '../services/voiceService'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { isLogedIn, setIsLoggedIn, userData } = useContext(AppContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const navigationItems = [
    { 
      name: t('nav.home'), 
      path: '/', 
      icon: HomeIcon,
      description: t('nav.home')
    },
    { 
      name: t('nav.aiAssistant'), 
      path: '/AI-Assistant', 
      icon: SparklesIcon,
      description: t('nav.aiAssistant')
    },
    { 
      name: t('nav.diseaseDetection'), 
      path: '/Disease-Detection', 
      icon: CameraIcon,
      description: t('nav.diseaseDetection')
    },
    { 
      name: t('nav.weather'), 
      path: '/updates', 
      icon: CloudIcon,
      description: t('nav.weather')
    },
    { 
      name: t('nav.auction'), 
      path: '/auction', 
      icon: ShoppingBagIcon,
      description: t('nav.auction')
    },
    { 
      name: t('nav.chat'), 
      path: '/chat', 
      icon: ChatBubbleLeftRightIcon,
      description: t('nav.chat')
    },
    { 
      name: t('nav.people'), 
      path: '/people', 
      icon: UserGroupIcon,
      description: t('nav.people')
    },
    { 
      name: 'Payments', 
      path: '/payments', 
      icon: CreditCardIcon,
      description: 'Secure payments and transactions'
    }
  ]

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
      setIsLoggedIn(false)
      navigate('/login')
      voiceService.autoSpeak(t('auth.logout'))
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleVoiceNavigation = (transcript) => {
    const command = transcript.toLowerCase()
    
    // Voice navigation commands
    const commands = {
      'home': () => navigate('/'),
      'assistant': () => navigate('/AI-Assistant'),
      'disease': () => navigate('/Disease-Detection'),
      'weather': () => navigate('/updates'),
      'auction': () => navigate('/auction'),
      'marketplace': () => navigate('/auction'),
      'chat': () => navigate('/chat'),
      'messages': () => navigate('/chat'),
      'people': () => navigate('/people'),
      'community': () => navigate('/people'),
      'profile': () => navigate('/profile'),
      'logout': handleLogout
    }

    for (const [key, action] of Object.entries(commands)) {
      if (command.includes(key)) {
        action()
        setMobileMenuOpen(false)
        break
      }
    }
  }

  const isActivePath = (path) => {
    return location.pathname === path || 
           (path === '/' && location.pathname === '/') ||
           (path !== '/' && location.pathname.startsWith(path))
  }

  if (!isLogedIn) {
    return (
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-bold text-green-700">Smart Farm</span>
            </motion.div>

            {/* Language & Login */}
            <div className="flex items-center space-x-4">
              <LanguageSelector compact />
              <Button onClick={() => navigate('/login')} variant="primary">
                {t('auth.login')}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
    )
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-green-700">Smart Farm</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActivePath(item.path)
              
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-green-100 text-green-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={item.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:block">{item.name}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Voice Commands */}
            <VoiceButton 
              mode="listen"
              onResult={handleVoiceNavigation}
              className="hidden sm:block"
              variant="ghost"
              size="sm"
            />

            {/* Language Selector */}
            <LanguageSelector compact className="hidden sm:block" />

            {/* Profile Menu */}
            <div className="relative">
          <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label={t('nav.profile')}
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userData?.name || userData?.username || 'User'}
                </span>
          </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
          <button
                      onClick={() => {
                        navigate('/profile')
                        setProfileMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      <span>{t('nav.profile')}</span>
          </button>
          <button
                      onClick={() => {
                        navigate('/settings')
                        setProfileMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      <span>{t('nav.settings')}</span>
          </button>
                    <hr className="my-1" />
          <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
          </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
          </div>
          
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePath(item.path)
                  
                  return (
          <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path)
                        setMobileMenuOpen(false)
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all
                        ${isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
          </button>
                  )
                })}
                
                {/* Mobile Language Selector */}
                <div className="pt-4 border-t border-gray-200">
                  <LanguageSelector />
                </div>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar