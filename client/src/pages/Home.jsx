import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <Navbar/>
      <main className="pt-24 max-w-7xl mx-auto px-6">
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-green-800">🌾 Smart Farming Dashboard</h1>
          <p className="text-xl text-green-600 max-w-3xl mx-auto mb-8">Transform your agricultural practices with AI-powered assistance: crop disease detection, auctions, weather monitoring, market insights, and more.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={()=>navigate('/AI-Assistant')} className="px-8 py-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl">
              🤖 Start with AI Assistant
            </button>
            <button onClick={()=>navigate('/auction')} className="px-8 py-4 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition shadow-lg hover:shadow-xl">
              🛒 Browse Auctions
            </button>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <FeatureCard 
            title="🤖 AI Agricultural Assistant" 
            desc="Get expert farming advice in multiple languages" 
            to="/AI-Assistant" 
            points={["Multilingual support","Crop-specific guidance","24/7 availability","Voice interaction"]} 
          />
          <FeatureCard 
            title="🔍 Disease Detection" 
            desc="Upload soil/crop images for instant analysis" 
            to="/Disease-Detection" 
            points={["Instant image analysis","Treatment suggestions","Confidence scoring","Soil health check"]} 
          />
          <FeatureCard 
            title="🌤️ Weather Monitoring" 
            desc="Real-time weather data and farming alerts" 
            to="/updates" 
            points={["5-day forecasts","Farming alerts","Location-based data","Crop protection tips"]} 
          />
          <FeatureCard 
            title="🛒 Auction Marketplace" 
            desc="List produce & equipment, bid securely" 
            to="/auction" 
            points={["List items","Secure bidding","Seller chat","Market prices"]} 
          />
          <FeatureCard 
            title="💬 Direct Messages" 
            desc="Connect with buyers and sellers" 
            to="/chat" 
            points={["Buyer-Seller chats","Conversation history","Secure messaging","Real-time updates"]} 
          />
          <FeatureCard 
            title="👥 Find People" 
            desc="Discover and connect with other farmers" 
            to="/people" 
            points={["Search by username","Browse all users","Start conversations","Build network"]} 
          />
          <FeatureCard 
            title="💳 Secure Payments" 
            desc="Send and receive payments securely" 
            to="/payments" 
            points={["Digital wallet","Send money","Request payments","Transaction history"]} 
          />
        </section>

        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-6">📊 Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-green-800 font-semibold">Active Farmers</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-blue-800 font-semibold">Successful Auctions</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="text-4xl font-bold text-orange-600 mb-2">1000+</div>
              <div className="text-orange-800 font-semibold">AI Consultations</div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

export default Home

const FeatureCard = ({ title, desc, to, points }) => {
  const navigate = useNavigate()
  return (
    <button onClick={()=>navigate(to)} className="text-left bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100">
      <h3 className="text-xl font-bold mb-3 text-green-800">{title}</h3>
      <p className="text-green-600 mb-4">{desc}</p>
      <ul className="space-y-1">
        {points.map((p,i)=> (
          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {p}
          </li>
        ))}
      </ul>
    </button>
  )
}
