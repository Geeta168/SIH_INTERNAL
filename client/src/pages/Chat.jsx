import React, { useEffect, useMemo, useState, useContext, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import SimpleButton from '../components/ui/SimpleButton'
import { AppContext } from '../context/AppContext'

const Chat = () => {
  const { t } = useTranslation()
  const { backend_url } = useContext(AppContext)
  const [conversations, setConversations] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingConvos, setLoadingConvos] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [otherUserId, setOtherUserId] = useState('')
  const [usernameQuery, setUsernameQuery] = useState('')
  const [userResults, setUserResults] = useState([])
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const messagesEndRef = useRef(null)

  const fetchConversations = async () => {
    try {
      setLoadingConvos(true)
      const res = await fetch(`${backend_url}/api/messages/conversations`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) setConversations(data.conversations || [])
    } catch (e) {
      // ignore
    } finally {
      setLoadingConvos(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return
    try {
      setLoadingMessages(true)
      const res = await fetch(`${backend_url}/api/messages/${conversationId}`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) setMessages(data.messages || [])
    } catch (e) {
      // ignore
    } finally {
      setLoadingMessages(false)
    }
  }

  const startConversation = async () => {
    if (!otherUserId) return
    try {
      const res = await fetch(`${backend_url}/api/messages/conversations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId })
      })
      const data = await res.json()
      if (data.success && data.conversation) {
        await fetchConversations()
        setSelectedConv(data.conversation)
        setOtherUserId('')
      }
    } catch (e) {
      // ignore
    }
  }

  const searchUsers = async () => {
    try {
      const base = import.meta.env.DEV ? '' : backend_url
      const res = await fetch(`${base}/api/users/search?username=${encodeURIComponent(usernameQuery)}`, {
        credentials: 'include'
      })
      const data = await res.json()
      if (data?.success) setUserResults(data.users || [])
    } catch (e) {}
  }

  const sendMessage = async () => {
    if (!selectedConv || !newMessage.trim()) return
    try {
      const res = await fetch(`${backend_url}/api/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConv._id, content: newMessage.trim() })
      })
      const data = await res.json()
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
        scrollToBottom()
      }
    } catch (e) {
      // ignore
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConv?._id) fetchMessages(selectedConv._id)
  }, [selectedConv?._id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            💬 Farmer Connect Chat
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Connect directly with farmers, buyers, and suppliers. Build relationships and grow your agricultural network.
          </p>
          
          <SimpleButton 
            onClick={() => setShowNewChatModal(true)}
            size="lg"
            className="px-8"
          >
            ➕ Start New Chat
          </SimpleButton>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            
            {/* Conversations Sidebar */}
            <div className={`border-r border-gray-200 ${isMobileView && selectedConv ? 'hidden lg:block' : 'block'}`}>
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">💬 Messages</h2>
                  <SimpleButton 
                    onClick={() => setShowNewChatModal(true)}
                    size="sm"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-blue-500"
                  >
                    ➕
                  </SimpleButton>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Conversations List */}
              <div className="overflow-y-auto h-full">
                {loadingConvos ? (
                  <div className="flex items-center justify-center p-8">
                    <LoadingSpinner text="Loading conversations..." />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center p-8">
                    <div className="text-4xl mb-4">💬</div>
                    <h3 className="font-semibold text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600 text-sm mb-4">Start chatting with farmers and buyers</p>
                    <SimpleButton 
                      onClick={() => setShowNewChatModal(true)}
                      size="sm"
                    >
                      Start First Chat
                    </SimpleButton>
                  </div>
                ) : (
                  <div className="p-4 space-y-2">
                    {conversations.map(conv => (
                      <ConversationItem 
                        key={conv._id}
                        conversation={conv}
                        isSelected={selectedConv?._id === conv._id}
                        onClick={() => {
                          setSelectedConv(conv)
                          setIsMobileView(true)
                        }}
                      />
                    ))}
                  </div>
                )}
          </div>
            </div>

            {/* Chat Area */}
            <div className={`lg:col-span-2 flex flex-col ${!selectedConv && isMobileView ? 'hidden lg:flex' : 'flex'}`}>
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isMobileView && (
              <button
                            onClick={() => {setSelectedConv(null); setIsMobileView(false)}}
                            className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                            ← Back
              </button>
                        )}
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          👤
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Farmer Chat</h3>
                          <p className="text-sm text-gray-600">Online • Active now</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full">
                          📞
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full">
                          📹
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full">
                          ⚙️
                        </button>
                      </div>
          </div>
        </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full">
                        <LoadingSpinner text="Loading messages..." />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center h-full flex items-center justify-center">
                        <div>
                          <div className="text-4xl mb-4">💬</div>
                          <h3 className="font-semibold text-gray-900 mb-2">Start the conversation</h3>
                          <p className="text-gray-600 text-sm">Send your first message to begin chatting</p>
                        </div>
              </div>
                    ) : (
                      <>
                        {messages.map(message => (
                          <MessageBubble key={message._id} message={message} />
            ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
          </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-4">
                      <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                        📎
                      </button>
                      <div className="flex-1 relative">
            <input
                          type="text"
              value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="w-full border border-gray-300 rounded-full px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          😊
                        </button>
                      </div>
                      <SimpleButton
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="rounded-full w-12 h-12 p-0 flex items-center justify-center"
                      >
                        ➤
                      </SimpleButton>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Press Enter to send • Shift+Enter for new line
                    </p>
                  </div>
                </>
              ) : (
                // No conversation selected
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-6xl mb-6">💬</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Welcome to Farmer Connect Chat
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Select a conversation from the sidebar or start a new chat to begin connecting with the farming community.
                    </p>
                    <SimpleButton 
                      onClick={() => setShowNewChatModal(true)}
                      size="lg"
                    >
                      🚀 Start Your First Chat
                    </SimpleButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal 
          usernameQuery={usernameQuery}
          setUsernameQuery={setUsernameQuery}
          userResults={userResults}
          searchUsers={searchUsers}
          startConversation={startConversation}
          setOtherUserId={setOtherUserId}
          setUserResults={setUserResults}
          onClose={() => setShowNewChatModal(false)}
        />
      )}
      
      <Footer />
    </div>
  )
}

// Helper Components
const ConversationItem = ({ conversation, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-50 border-2 border-blue-200' 
          : 'hover:bg-gray-50 border-2 border-transparent'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          👤
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-gray-900 truncate">Farmer Chat</p>
            <span className="text-xs text-gray-500">2m ago</span>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage || 'No messages yet'}
          </p>
        </div>
      </div>
    </button>
  )
}

const MessageBubble = ({ message }) => {
  const isOwn = message.sender === 'me' // This would need to be determined based on actual user ID
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-[70%] ${
        isOwn ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        {!isOwn && (
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            👤
          </div>
        )}
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-white text-gray-900 border rounded-bl-sm'
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className={`text-xs mt-2 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  )
}

const NewChatModal = ({ 
  usernameQuery, 
  setUsernameQuery, 
  userResults, 
  searchUsers, 
  startConversation, 
  setOtherUserId, 
  setUserResults, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Start New Chat</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">Search for farmers and start chatting</p>
        </div>

        {/* Search */}
        <div className="p-6">
          <div className="flex space-x-3 mb-4">
            <input
              type="text"
              value={usernameQuery}
              onChange={(e) => setUsernameQuery(e.target.value)}
              placeholder="Search by username..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <SimpleButton onClick={searchUsers}>
              🔍 Search
            </SimpleButton>
          </div>

          {/* Search Results */}
          {userResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {userResults.map(user => (
                <button
                  key={user._id}
                  onClick={() => {
                    setOtherUserId(user._id)
                    setUsernameQuery(user.username)
                    setUserResults([])
                  }}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      👤
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">@{user.username}</p>
                      <p className="text-sm text-gray-600">{user.name || user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Start Chat Button */}
          <div className="mt-6 flex space-x-3">
            <SimpleButton
              onClick={() => {
                startConversation()
                onClose()
              }}
              disabled={!usernameQuery}
              fullWidth
            >
              💬 Start Chat
            </SimpleButton>
            <SimpleButton
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </SimpleButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
