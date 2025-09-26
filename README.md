# 🌾 Smart Farming Platform (SIH_INTERNAL)

A comprehensive agricultural technology platform that provides AI-powered farming assistance, disease detection, auction marketplace, and real-time weather monitoring for farmers.

## 🚀 Features

### Core Features
- **🤖 AI Agricultural Assistant**: Multilingual farming advice and guidance
- **🔍 Disease Detection**: Upload soil/crop images for instant AI analysis
- **🌤️ Weather Monitoring**: Real-time weather data and farming alerts
- **🛒 Auction Marketplace**: List produce & equipment, bid securely
- **💬 Direct Messages**: Connect with buyers and sellers
- **👥 Community**: Find and connect with other farmers

### Technical Features
- JWT-based authentication
- Real-time chat functionality
- Image processing for disease detection
- Responsive design with Tailwind CSS
- Multi-language support
- Voice interaction capabilities

## 🏗️ Architecture

The project consists of three main components:

### 1. Frontend (React + Vite)
- **Location**: `client/`
- **Framework**: React 19.1.1 with Vite
- **Styling**: Tailwind CSS 4.1.13
- **Routing**: React Router DOM 7.8.2
- **State Management**: React Context API

### 2. Backend API (Node.js + Express)
- **Location**: `server/`
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.16.3
- **Authentication**: JWT with bcryptjs
- **Email**: Nodemailer for verification

### 3. AI Server (Python + Flask)
- **Location**: `ai_server/`
- **Framework**: Flask 3.0.0
- **Image Processing**: OpenCV, PIL, NumPy
- **Database**: MongoDB with PyMongo

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SIH_INTERNAL
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 4. AI Server Setup
```bash
cd ai_server
pip install -r requirements.txt
# Configure environment variables
python app.py
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017/sih_internal
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SENDER_EMAIL=your_email@gmail.com
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_AI_URL=http://localhost:8000
```

### AI Server (.env)
```env
MONGODB_URL=mongodb://localhost:27017/sih_internal
CLIENT_ORIGIN=http://localhost:5173
AI_SERVER_PORT=8000
```

## 📱 Usage

### For Farmers
1. **Register/Login**: Create an account or sign in
2. **AI Assistant**: Get farming advice and crop guidance
3. **Disease Detection**: Upload images for instant analysis
4. **Marketplace**: Browse and bid on agricultural products
5. **Weather Updates**: Monitor real-time weather conditions

### For Developers
1. **API Endpoints**: RESTful API for all operations
2. **Real-time Features**: WebSocket support for chat
3. **Image Processing**: AI-powered disease detection
4. **Authentication**: Secure JWT-based auth system

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Secure cookie handling
- Email verification system

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# AI server tests
cd ai_server
python -m pytest
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### AI Endpoints
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/history/:sessionId` - Get chat history
- `POST /api/ai/soil` - Analyze soil health

### User Endpoints
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm start

# AI Server
cd ai_server
gunicorn app:app
```

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI models for disease detection
- [ ] Integration with IoT sensors
- [ ] Blockchain-based supply chain tracking
- [ ] Multi-language support expansion
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for the farming community** 
