import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import SimpleButton from '../components/ui/SimpleButton'

const Payments = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'send', 'request', 'history'
  const [transactions, setTransactions] = useState([])
  const [wallet, setWallet] = useState({ balance: 0, currency: 'INR' })
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading wallet and transaction data
    setWallet({ balance: 25450.75, currency: 'INR' })
    setTransactions([
      {
        id: '1',
        type: 'received',
        amount: 15000,
        currency: 'INR',
        from: 'Wheat Sale - Punjab Buyer',
        date: new Date('2024-01-15'),
        status: 'completed',
        description: 'Payment for 500kg Premium Wheat'
      },
      {
        id: '2',
        type: 'sent',
        amount: 3200,
        currency: 'INR',
        to: 'Equipment Rental',
        date: new Date('2024-01-12'),
        status: 'completed',
        description: 'Tractor rental for 2 days'
      },
      {
        id: '3',
        type: 'received',
        amount: 8500,
        currency: 'INR',
        from: 'Tomato Sale - Local Market',
        date: new Date('2024-01-10'),
        status: 'completed',
        description: 'Payment for 200kg Organic Tomatoes'
      },
      {
        id: '4',
        type: 'sent',
        amount: 2800,
        currency: 'INR',
        to: 'Seeds & Fertilizer Store',
        date: new Date('2024-01-08'),
        status: 'pending',
        description: 'Fertilizer and seed purchase'
      }
    ])
  }, [])

  const getTransactionIcon = (type) => {
    return type === 'received' ? '⬇️' : '⬆️'
  }

  const getTransactionColor = (type, status) => {
    if (status === 'pending') return 'text-yellow-600'
    return type === 'received' ? 'text-green-600' : 'text-red-600'
  }

  const getStatusBadge = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            💳 AgriSmart Payments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Secure and fast payments for all your agricultural transactions. Send money, receive payments, and track your financial activity.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                { id: 'send', label: '💸 Send Money', icon: '💸' },
                { id: 'request', label: '💰 Request Payment', icon: '💰' },
                { id: 'history', label: '📋 Transaction History', icon: '📋' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label.split(' ').slice(1).join(' ')}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* Wallet Balance */}
                <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">💰 Wallet Balance</h2>
                      <div className="text-4xl font-bold">
                        ₹{wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <p className="text-green-100 mt-2">Available for transactions</p>
                    </div>
                    <div className="text-right">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                        🏦
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <QuickActionCard
                    icon="💸"
                    title="Send Money"
                    description="Transfer funds to farmers or buyers"
                    onClick={() => setActiveTab('send')}
                  />
                  <QuickActionCard
                    icon="💰"
                    title="Request Payment"
                    description="Request payment for your products"
                    onClick={() => setActiveTab('request')}
                  />
                  <QuickActionCard
                    icon="🏪"
                    title="Add Money"
                    description="Add funds to your wallet"
                    onClick={() => {/* Add money functionality */}}
                  />
                  <QuickActionCard
                    icon="📊"
                    title="Analytics"
                    description="View your financial insights"
                    onClick={() => {/* Analytics functionality */}}
                  />
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">📋 Recent Transactions</h3>
                    <SimpleButton
                      onClick={() => setActiveTab('history')}
                      variant="outline"
                      size="sm"
                    >
                      View All
                    </SimpleButton>
                  </div>
                  
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map(transaction => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Send Money Tab */}
            {activeTab === 'send' && (
              <SendMoneyForm />
            )}

            {/* Request Payment Tab */}
            {activeTab === 'request' && (
              <RequestPaymentForm />
            )}

            {/* Transaction History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">📋 All Transactions</h3>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>All Types</option>
                      <option>Received</option>
                      <option>Sent</option>
                    </select>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Last 30 days</option>
                      <option>Last 7 days</option>
                      <option>Last 90 days</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {transactions.map(transaction => (
                    <TransactionItem key={transaction.id} transaction={transaction} detailed />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

// Helper Components
const QuickActionCard = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg transition-all duration-300 hover:scale-105"
  >
    <div className="text-3xl mb-3">{icon}</div>
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
)

const TransactionItem = ({ transaction, detailed = false }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-center space-x-4">
      <div className={`text-2xl ${getTransactionColor(transaction.type, transaction.status)}`}>
        {getTransactionIcon(transaction.type)}
      </div>
      <div>
        <div className="font-semibold text-gray-900">
          {transaction.from || transaction.to}
        </div>
        <div className="text-sm text-gray-600">{transaction.description}</div>
        {detailed && (
          <div className="text-xs text-gray-500 mt-1">
            ID: {transaction.id} • {transaction.date.toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
    
    <div className="text-right">
      <div className={`font-bold ${getTransactionColor(transaction.type, transaction.status)}`}>
        {transaction.type === 'received' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
      </div>
      <div className="flex items-center justify-end space-x-2 mt-1">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
          {transaction.status}
        </span>
        {!detailed && (
          <span className="text-xs text-gray-500">
            {transaction.date.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  </div>
)

const SendMoneyForm = () => {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      alert(`Money sent successfully!\n₹${amount} to ${recipient}`)
      setRecipient('')
      setAmount('')
      setDescription('')
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">💸 Send Money</h3>
      
      <form onSubmit={handleSend} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Username or Email
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter username or email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for..."
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <SimpleButton
          type="submit"
          disabled={loading || !recipient || !amount}
          fullWidth
          className="py-4"
        >
          {loading ? <LoadingSpinner size="sm" /> : '💸 Send Money'}
        </SimpleButton>
      </form>
    </div>
  )
}

const RequestPaymentForm = () => {
  const [payer, setPayer] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      alert(`Payment request sent!\n₹${amount} requested from ${payer}`)
      setPayer('')
      setAmount('')
      setDescription('')
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">💰 Request Payment</h3>
      
      <form onSubmit={handleRequest} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From (Username or Email)
          </label>
          <input
            type="text"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            placeholder="Who should pay you?"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for crops, services, etc."
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <SimpleButton
          type="submit"
          disabled={loading || !payer || !amount || !description}
          fullWidth
          className="py-4"
        >
          {loading ? <LoadingSpinner size="sm" /> : '💰 Request Payment'}
        </SimpleButton>
      </form>
    </div>
  )
}

// Helper functions (moved outside component to avoid recreation)
const getTransactionIcon = (type) => {
  return type === 'received' ? '⬇️' : '⬆️'
}

const getTransactionColor = (type, status) => {
  if (status === 'pending') return 'text-yellow-600'
  return type === 'received' ? 'text-green-600' : 'text-red-600'
}

const getStatusBadge = (status) => {
  const colors = {
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'failed': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export default Payments

