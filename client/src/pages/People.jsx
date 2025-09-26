import React, { useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import SimpleButton from '../components/ui/SimpleButton'
import { AppContext } from '../context/AppContext'

const People = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { backend_url } = useContext(AppContext)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filterType, setFilterType] = useState('all') // 'all', 'farmers', 'buyers', 'suppliers'
  const [sortBy, setSortBy] = useState('name') // 'name', 'recent', 'activity'

  const search = async (searchQuery = query) => {
    setLoading(true)
    setStatus('')
    try {
      const base = import.meta.env.DEV ? '' : backend_url
      const endpoint = searchQuery 
        ? `${base}/api/users/public/search?username=${encodeURIComponent(searchQuery)}`
        : `${base}/api/users/public/all`
      
      const res = await fetch(endpoint, { credentials: 'include' })
      const data = await res.json()
      
      if (data?.success) {
        let users = data.users || []
        
        // Apply filtering
        if (filterType !== 'all') {
          users = users.filter(user => user.type === filterType)
        }
        
        // Apply sorting
        users.sort((a, b) => {
          switch(sortBy) {
            case 'name':
              return (a.name || a.username).localeCompare(b.name || b.username)
            case 'recent':
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            case 'activity':
              return (b.lastLoginAt || 0) - (a.lastLoginAt || 0)
            default:
              return 0
          }
        })
        
        setResults(users)
        setStatus(searchQuery ? `Found ${users.length} users` : `Showing all ${users.length} users`)
      } else {
        setStatus(`Error: ${data?.message || 'Search failed'}`)
      }
    } catch (error) {
      console.error('Search error:', error)
      setStatus(`Error: ${error.message}`)
    }
    setLoading(false)
  }

  const loadAllUsers = () => {
    setQuery('')
    search('')
  }

  const startChat = async () => {
    if (!selected) return
    try {
      const res = await fetch(`${backend_url}/api/messages/conversations`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: selected._id })
      })
      const data = await res.json()
      if (data?.success) {
        setStatus('Conversation created! Go to Chat to continue.')
        navigate('/chat')
      }
    } catch { 
      setStatus('Failed to create conversation') 
    }
  }

  // Load all users on component mount
  useEffect(() => {
    loadAllUsers()
  }, [])

  // Re-search when filters change
  useEffect(() => {
    if (results.length > 0) {
      search(query)
    }
  }, [filterType, sortBy])

  const getUserTypeIcon = (type) => {
    const icons = {
      'farmer': '🌾',
      'buyer': '🛒',
      'supplier': '📦',
      'expert': '🎓'
    }
    return icons[type] || '👤'
  }

  const getUserTypeColor = (type) => {
    const colors = {
      'farmer': 'bg-green-100 text-green-800',
      'buyer': 'bg-blue-100 text-blue-800',
      'supplier': 'bg-orange-100 text-orange-800',
      'expert': 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            👥 Connect with Farmers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover and connect with farmers, buyers, suppliers, and agricultural experts in your network.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🌾</div>
              <div className="text-sm font-medium text-gray-800">Farmers</div>
              <div className="text-xs text-gray-600">{results.filter(u => u.type === 'farmer').length}+ Active</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🛒</div>
              <div className="text-sm font-medium text-gray-800">Buyers</div>
              <div className="text-xs text-gray-600">{results.filter(u => u.type === 'buyer').length}+ Active</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📦</div>
              <div className="text-sm font-medium text-gray-800">Suppliers</div>
              <div className="text-xs text-gray-600">{results.filter(u => u.type === 'supplier').length}+ Active</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🎓</div>
              <div className="text-sm font-medium text-gray-800">Experts</div>
              <div className="text-xs text-gray-600">{results.filter(u => u.type === 'expert').length}+ Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0">
              🔍 Find People ({results.length})
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ⚏ Grid
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ☰ List
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && search()}
                placeholder="Search by username..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">👥 All Users</option>
              <option value="farmer">🌾 Farmers</option>
              <option value="buyer">🛒 Buyers</option>
              <option value="supplier">📦 Suppliers</option>
              <option value="expert">🎓 Experts</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">📝 Sort by Name</option>
              <option value="recent">📅 Recently Joined</option>
              <option value="activity">⚡ Most Active</option>
            </select>
            
            <div className="flex space-x-2">
              <SimpleButton
                onClick={() => search()}
                disabled={loading}
                className="flex-1"
              >
                {loading ? <LoadingSpinner size="sm" /> : '🔍 Search'}
              </SimpleButton>
              <SimpleButton
                onClick={loadAllUsers}
                variant="outline"
              >
                👥 All
              </SimpleButton>
            </div>
          </div>

          {/* Status */}
          {status && (
            <div className={`text-sm p-3 rounded-lg mb-4 ${
              status.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {status}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="xl" text="Loading people..." />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No people found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or load all users.</p>
            <SimpleButton onClick={loadAllUsers}>
              Load All Users
            </SimpleButton>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {results.map(user => (
              <UserCard 
                key={user._id} 
                user={user} 
                isSelected={selected?._id === user._id}
                viewMode={viewMode}
                onSelect={() => setSelected(user)}
                onStartChat={() => {
                  setSelected(user)
                  startChat()
                }}
                getUserTypeIcon={getUserTypeIcon}
                getUserTypeColor={getUserTypeColor}
              />
            ))}
          </div>
        )}

        {/* Selected User Action */}
        {selected && (
          <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 max-w-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {selected.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900">@{selected.username}</div>
                <div className="text-sm text-gray-600">{selected.name || selected.email}</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <SimpleButton onClick={startChat} className="flex-1">
                💬 Start Chat
              </SimpleButton>
              <SimpleButton 
                onClick={() => setSelected(null)} 
                variant="outline"
              >
                ✕
              </SimpleButton>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

// UserCard Component
const UserCard = ({ 
  user, 
  isSelected, 
  viewMode, 
  onSelect, 
  onStartChat, 
  getUserTypeIcon, 
  getUserTypeColor 
}) => {
  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">@{user.username}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.type)}`}>
                  {getUserTypeIcon(user.type)} {user.type || 'User'}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{user.name || user.email}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📅 Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                {user.location && <span>📍 {user.location}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <SimpleButton
              onClick={onSelect}
              variant={isSelected ? 'primary' : 'outline'}
              size="sm"
            >
              {isSelected ? '✓ Selected' : '👁️ View'}
            </SimpleButton>
            <SimpleButton
              onClick={onStartChat}
              size="sm"
            >
              💬 Chat
            </SimpleButton>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group ${
      isSelected ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
    }`} onClick={onSelect}>
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
          {user.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex items-center justify-center space-x-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">@{user.username}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.type)}`}>
            {getUserTypeIcon(user.type)}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{user.name || user.email}</p>
        
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div>📅 Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
          {user.location && <div>📍 {user.location}</div>}
        </div>
        
        <div className="flex space-x-2">
          <SimpleButton
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            variant={isSelected ? 'primary' : 'outline'}
            size="sm"
            className="flex-1"
          >
            {isSelected ? '✓ Selected' : '👁️ Select'}
          </SimpleButton>
          <SimpleButton
            onClick={(e) => {
              e.stopPropagation()
              onStartChat()
            }}
            size="sm"
          >
            💬
          </SimpleButton>
        </div>
      </div>
    </div>
  )
}

export default People
