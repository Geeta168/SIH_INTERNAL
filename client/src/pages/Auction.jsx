import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SimpleButton from '../components/ui/SimpleButton'
import { auctions as mockAuctions } from './AuctionData'

const Auction = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🛒 Agricultural Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Buy and sell agricultural products, equipment, and services. Connect directly with farmers and suppliers.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{mockAuctions.length}+</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Verified Sellers</div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600">₹2L+</div>
                <div className="text-sm text-gray-600">Daily Trade Volume</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <SimpleButton 
                onClick={() => setShowCreateModal(true)}
                size="lg"
                className="px-8"
              >
                📝 List Your Product
              </SimpleButton>
              <SimpleButton 
                variant="outline"
                size="lg"
                className="px-8"
              >
                📊 Market Trends
              </SimpleButton>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🎯 Try Our Demo Auction!</h2>
              <p className="text-orange-100 mb-4">
                New to auctions? Practice with our interactive demo to learn how bidding works.
              </p>
              <SimpleButton
                onClick={() => navigate('/auction/demo')}
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                🚀 Start Demo Auction
              </SimpleButton>
            </div>
            <div className="text-6xl opacity-80">
              🏆
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AuctionList viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      
      <Footer />
    </div>
  )
}

export default Auction

const AuctionList = ({ viewMode, setViewMode }) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All')
  const [maxMinBid, setMaxMinBid] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const categories = useMemo(()=>['All', ...Array.from(new Set(mockAuctions.map(a=>a.category)))],[])
  const locations = useMemo(()=>['All', ...Array.from(new Set(mockAuctions.map(a=>a.location)))],[])

  const filtered = useMemo(()=>{
    let results = mockAuctions.filter(a=>{
      const byQuery = !query || a.title.toLowerCase().includes(query.toLowerCase())
      const byCat = category==='All' || a.category===category
      const byLoc = location==='All' || a.location===location
      const byBid = !maxMinBid || a.minBid <= Number(maxMinBid)
      return byQuery && byCat && byLoc && byBid
    })
    
    // Sort results
    switch(sortBy) {
      case 'price-low':
        results.sort((a, b) => a.minBid - b.minBid)
        break
      case 'price-high':
        results.sort((a, b) => b.minBid - a.minBid)
        break
      case 'ending-soon':
        results.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt))
        break
      default: // newest
        results.sort((a, b) => b.id.localeCompare(a.id))
    }
    
    return results
  },[query, category, location, maxMinBid, sortBy])

  return (
    <div>
      {/* Filters and Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0">
            🔍 Browse Listings ({filtered.length})
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ⚏ Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${
                  viewMode === 'list' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          
          <select 
            value={category} 
            onChange={(e)=>setCategory(e.target.value)} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {categories.map(c=> (<option key={c} value={c}>{c === 'All' ? '📦 All Categories' : `${getCategoryIcon(c)} ${c}`}</option>))}
        </select>
          
          <select 
            value={location} 
            onChange={(e)=>setLocation(e.target.value)} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {locations.map(l=> (<option key={l} value={l}>{l === 'All' ? '📍 All Locations' : `📍 ${l}`}</option>))}
        </select>
          
        <input
          value={maxMinBid}
          onChange={(e)=>setMaxMinBid(e.target.value)}
          type="number"
            placeholder="💰 Max price (₹)"
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          
          <select 
            value={sortBy} 
            onChange={(e)=>setSortBy(e.target.value)} 
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="newest">📅 Newest First</option>
            <option value="price-low">💰 Price: Low to High</option>
            <option value="price-high">💰 Price: High to Low</option>
            <option value="ending-soon">⏰ Ending Soon</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
        {filtered.map(item => (
            <AuctionCard key={item.id} item={item} viewMode={viewMode} />
        ))}
      </div>
      )}
    </div>
  )
}

// Helper function for category icons
const getCategoryIcon = (category) => {
  const icons = {
    'Grains': '🌾',
    'Vegetables': '🥕',
    'Equipment': '🚜',
    'Fruits': '🍎',
    'Seeds': '🌱',
    'Fertilizers': '🧪'
  }
  return icons[category] || '📦'
}

const AuctionCard = ({ item, viewMode }) => {
  const timeLeft = getTimeRemaining(item.endsAt)
  const isEndingSoon = timeLeft.days < 1
  
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-48 h-32 md:h-auto relative">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2">
              <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
                {getCategoryIcon(item.category)} {item.category}
              </span>
            </div>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    📍 {item.location}
                  </span>
                  <span className={`flex items-center ${isEndingSoon ? 'text-red-600' : 'text-gray-600'}`}>
                    ⏰ {isEndingSoon ? 'Ending Soon!' : `${timeLeft.days}d ${timeLeft.hours}h left`}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{item.description}</p>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ₹{item.minBid.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mb-4">Starting bid</div>
                <div className="flex space-x-2">
                  <SimpleButton 
                    size="sm" 
                    variant="outline"
                    onClick={() => {/* Contact seller functionality */}}
                  >
                    💬 Contact Seller
                  </SimpleButton>
                  <SimpleButton 
                    size="sm"
                    onClick={() => navigate(`/auction/${item.id}`)}
                  >
                    👁️ View Details
                  </SimpleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 ${
      item.isDemoAuction ? 'bg-gradient-to-br from-orange-50 to-yellow-50 ring-2 ring-orange-300' : 'bg-white'
    }`}>
      <div className="relative">
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
        
        {/* Demo badge */}
        {item.isDemoAuction && (
          <div className="absolute top-3 left-3">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              🎯 DEMO
            </span>
          </div>
        )}
        
        {/* Category badge */}
        <div className={`absolute top-3 ${item.isDemoAuction ? 'right-3' : 'left-3'}`}>
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
            {getCategoryIcon(item.category)} {item.category}
          </span>
        </div>
        
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isEndingSoon 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isEndingSoon ? '🔥 Ending Soon' : `⏰ ${timeLeft.days}d left`}
          </span>
        </div>

        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <SimpleButton 
            size="sm" 
            className="mx-2"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/auction/${item.id}`)
            }}
          >
            👁️ View Details
          </SimpleButton>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="flex items-center mr-4">
            📍 {item.location}
          </span>
        </div>
        
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-600">
              ₹{item.minBid.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Starting bid</div>
          </div>
          
          <div className="flex space-x-2">
            <SimpleButton 
              size="xs" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                /* Contact seller functionality */
              }}
            >
              💬
            </SimpleButton>
            <SimpleButton 
              size="xs"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/auction/${item.id}`)
              }}
            >
              👁️ View
            </SimpleButton>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate time remaining
const getTimeRemaining = (endDate) => {
  const total = Date.parse(endDate) - Date.parse(new Date())
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  return {
    total,
    days: Math.max(0, days),
    hours: Math.max(0, hours)
  }
}
