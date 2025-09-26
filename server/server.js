import express from "express";
import cors from "cors";
import helmet from "helmet";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import { sanitizeInput, rateLimit } from "./middleware/validation.js";
import { performanceMonitor, memoryMonitor } from "./middleware/performance.js";
import { cacheMiddleware } from "./middleware/cache.js";
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });


const MONGOURL=process.env.MONGODB_URL;

mongoose.connect(MONGOURL).then(async () => {
  console.log(" MongoDB connected");
  try {
    // Migration: Fix existing users with null usernames
    const usersWithNullUsername = await userModel.find({ username: null });
    if (usersWithNullUsername.length > 0) {
      console.log(`Found ${usersWithNullUsername.length} users with null usernames, fixing...`);
      for (const user of usersWithNullUsername) {
        const emailPrefix = user.email.split('@')[0].toLowerCase();
        let newUsername = emailPrefix;
        let counter = 1;
        
        // Ensure username is unique
        while (await userModel.findOne({ username: newUsername })) {
          newUsername = `${emailPrefix}${counter}`;
          counter++;
        }
        
        await userModel.updateOne({ _id: user._id }, { username: newUsername });
        console.log(`Updated user ${user.email} with username: ${newUsername}`);
      }
    }
    
    // Now sync indexes
    await userModel.syncIndexes();
    console.log("Indexes synced successfully");
  } catch (err) {
    console.error('Migration error:', err.message);
  }
}).catch((err) => {
  console.error("Connection error:", err.message);
});
import authRouter from './routes/authRoutes.js';
import userAuth from "./middleware/userAuth.js";
import usersRouter from "./routes/users.js";
import messagesRouter from "./routes/messages.js";
import debugRouter from "./routes/debug.js";

const app=express();
const port=3000;


const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL || 'http://localhost:5173'
];

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Performance monitoring
app.use(performanceMonitor);

// Input sanitization and rate limiting
app.use(sanitizeInput);
app.use(rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Secure CORS configuration
app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

//api end points
app.get('/', (req, res) => {
   console.log("GET / was hit");
  res.send('Hello! Server is working!');
});

app.use('/api/auth',authRouter)
app.use('/api/userauth',userAuth);
app.use('/api/users', userAuth, cacheMiddleware(300), usersRouter);
app.use('/api/users/public', cacheMiddleware(600), usersRouter); // Public search without auth, cached for 10 minutes
app.use('/api/messages', messagesRouter);
app.use('/api/debug', debugRouter);




// Start memory monitoring
memoryMonitor();

app.listen(port,()=>{
  console.log(`🚀 Server is running at port ${port}`);
  console.log(`📊 Performance monitoring enabled`);
  console.log(`🔒 Security middleware active`);
});
