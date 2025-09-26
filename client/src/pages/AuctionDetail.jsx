import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import SimpleButton from '../components/ui/SimpleButton'
import { auctions, generateMockBid } from './AuctionData'

const AuctionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const [auction, setAuction] = useState(null)
  const [bidAmount, setBidAmount] = useState('')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [loading, setLoading] = useState(true)
  const [bidding, setBidding] = useState(false)
  const [userBids, setUserBids] = useState([])
  const [showBidModal, setShowBidModal] = useState(false)

  // Find the auction by ID
  useEffect(() => {
    const foundAuction = auctions.find(a => a.id === id)
    if (foundAuction) {
      setAuction(foundAuction)
      setBidAmount(String(foundAuction.currentBid + 100))
    }
    setLoading(false)
  }, [id])

  // Update countdown timer
  useEffect(() => {
    if (!auction) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const endTime = new Date(auction.endsAt).getTime()
      const distance = endTime - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [auction])

  // Simulate competitive bidding for demo auction
  useEffect(() => {
    if (!auction?.isDemoAuction) return

    const simulateBidding = () => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const competitorNames = ['AutoBidder1', 'QuickBuyer', 'FarmCooperative', 'ExportDealer']
        const randomBidder = competitorNames[Math.floor(Math.random() * competitorNames.length)]
        
        setAuction(prev => {
          const newBid = generateMockBid(prev.currentBid, randomBidder)
          return {
            ...prev,
            currentBid: newBid.amount,
            bids: [newBid, ...prev.bids]
          }
        })
      }
    }

    const interval = setInterval(simulateBidding, 10000) // Every 10 seconds
    return () => clearInterval(interval)
  }, [auction?.isDemoAuction])

  const handlePlaceBid = () => {
    if (!bidAmount || parseInt(bidAmount) <= auction.currentBid) {
      alert('Bid amount must be higher than current bid')
      return
    }

    setBidding(true)
    
    // Simulate bid placement
    setTimeout(() => {
      const newBid = {
        bidder: 'You',
        amount: parseInt(bidAmount),
        time: 'just now'
      }

      setAuction(prev => ({
        ...prev,
        currentBid: parseInt(bidAmount),
        bids: [newBid, ...prev.bids]
      }))

      setUserBids(prev => [...prev, newBid])
      setBidAmount(String(parseInt(bidAmount) + 100))
      setBidding(false)
      setShowBidModal(false)

      if (auction.isDemoAuction) {
        alert('🎉 Bid placed successfully! This is just a demo - no real money involved.')
      } else {
        alert('Bid placed successfully!')
      }
    }, 1500)
  }

  const isAuctionEnded = () => {
    return timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0
  }

  const getHighestBidder = () => {
    return auction?.bids?.[0]?.bidder || 'No bids yet'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center h-96">
          <LoadingSpinner size="xl" text="Loading auction details..." />
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Auction Not Found</h1>
          <SimpleButton onClick={() => navigate('/auction')}>
            ← Back to Auctions
          </SimpleButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navbar />
      
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Demo Banner */}
          {auction.isDemoAuction && (
            <div className="bg-orange-100 border-l-4 border-orange-500 p-6 mb-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-3">🎯</div>
                <h2 className="text-xl font-bold text-orange-800">Demo Auction - Practice Mode</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
                  <h3 className="font-semibold text-orange-800 mb-2">How to use this demo:</h3>
                  <ul className="space-y-1 text-sm text-orange-700">
                    {auction.demoInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⏰</div>
                  <p className="text-orange-800 font-semibold">Demo Timer</p>
                  <p className="text-sm text-orange-700">This auction ends in 2 minutes for practice</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Auction Info */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Product Images and Basic Info */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative">
                  <img 
                    src={auction.image} 
                    alt={auction.title}
                    className="w-full h-80 object-cover"
                  />
                  {auction.isDemoAuction && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      🎯 DEMO
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {auction.category}
                  </div>
                </div>
                
                <div className="p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>
                  <p className="text-gray-700 text-lg mb-6">{auction.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">₹{auction.currentBid.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Current Highest Bid</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{auction.bids.length}</div>
                      <div className="text-sm text-gray-600">Total Bids</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
                      <span>Seller: {auction.seller}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>{auction.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Product Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(auction.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bidding History */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Bidding History</h2>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {auction.bids.map((bid, index) => (
                    <div key={index} className={`flex justify-between items-center p-4 rounded-lg ${
                      bid.bidder === 'You' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          bid.bidder === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                        }`}>
                          {bid.bidder === 'You' ? '👤' : bid.bidder.charAt(0)}
                        </div>
                        <span className="font-medium">{bid.bidder}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">₹{bid.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{bid.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bidding Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
                
                {/* Timer */}
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Time Remaining</h3>
                  {isAuctionEnded() ? (
                    <div className="text-red-600 font-bold text-xl">Auction Ended</div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{timeLeft.days}</div>
                        <div className="text-xs text-red-700">Days</div>
                      </div>
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{timeLeft.hours}</div>
                        <div className="text-xs text-orange-700">Hours</div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{timeLeft.minutes}</div>
                        <div className="text-xs text-yellow-700">Minutes</div>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{timeLeft.seconds}</div>
                        <div className="text-xs text-green-700">Seconds</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Status */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">Current Highest Bidder</div>
                    <div className="text-lg font-bold text-blue-600">{getHighestBidder()}</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      ₹{auction.currentBid.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Bidding Form */}
                {!isAuctionEnded() && (
                  <div className="space-y-4">
          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bid Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={auction.currentBid + 1}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your bid"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum bid: ₹{(auction.currentBid + 1).toLocaleString()}
                      </p>
                    </div>

                    <SimpleButton
                      onClick={() => setShowBidModal(true)}
                      disabled={!bidAmount || parseInt(bidAmount) <= auction.currentBid}
                      fullWidth
                      className="py-4 text-lg"
                    >
                      🔨 Place Bid
                    </SimpleButton>

                    {userBids.length > 0 && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Your Bids ({userBids.length})</h4>
                        <div className="space-y-2">
                          {userBids.slice(0, 3).map((bid, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>₹{bid.amount.toLocaleString()}</span>
                              <span className="text-blue-600">{bid.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isAuctionEnded() && (
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <div className="text-2xl mb-4">🔒</div>
                    <h3 className="font-bold text-red-800 mb-2">Auction Ended</h3>
                    <p className="text-red-600">Winner: {getHighestBidder()}</p>
                    <p className="text-red-600 font-bold">₹{auction.currentBid.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Confirmation Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              🔨 Confirm Your Bid
            </h2>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                ₹{parseInt(bidAmount).toLocaleString()}
              </div>
              <p className="text-gray-600">for {auction.title}</p>
            </div>

            {auction.isDemoAuction && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-green-800 text-sm text-center">
                  🎯 This is a demo auction. No real money will be charged.
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <SimpleButton
                onClick={() => setShowBidModal(false)}
                variant="outline"
                fullWidth
              >
                Cancel
              </SimpleButton>
              <SimpleButton
                onClick={handlePlaceBid}
                disabled={bidding}
                fullWidth
              >
                {bidding ? <LoadingSpinner size="sm" /> : 'Confirm Bid'}
              </SimpleButton>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}

export default AuctionDetail