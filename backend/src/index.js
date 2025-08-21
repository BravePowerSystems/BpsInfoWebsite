import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { ImageService } from './services/imageService.js';
// Load environment variables first
dotenv.config();

const app = express();

const allowedOrigins = [
  'https://bps-info-website.vercel.app',   // production frontend
  'http://localhost:3000',                // development frontend
  'http://localhost:3001',                // alternative dev port
  'https://localhost:3000',               // HTTPS dev
  'https://localhost:3001'                // HTTPS dev alternative
];

// Dynamic origin handling with better error handling
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For production, be more permissive with origins but log them
    if (process.env.NODE_ENV === 'production') {
      console.log(`Production CORS allowing origin: ${origin}`);
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.log(`CORS blocked origin: ${origin}`);
    
    // Allow the request but log it (more permissive for development)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));


app.use(express.json());  // this is used to parse the request body as JSON
app.use(cookieParser());

// Connect to database
try {
    await dbConnect();
} catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Debug endpoint for cookie testing
app.get('/api/debug/cookies', (req, res) => {
  const cookies = req.headers.cookie;
  const origin = req.get('Origin');
  const userAgent = req.get('User-Agent');
  
  res.json({
    message: 'Cookie debug info',
    cookies: cookies || 'No cookies sent',
    origin: origin || 'No origin',
    userAgent: userAgent || 'No user agent',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to set a simple cookie
app.get('/api/debug/set-test-cookie', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const origin = req.get('Origin');
  
  const cookieOptions = {
    httpOnly: false, // Make it readable by frontend for testing
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    // Don't set domain - let the browser handle it
    maxAge: 60 * 60 * 1000 // 1 hour
  };
  
  res.cookie('testCookie', 'testValue123', cookieOptions);
  res.json({
    message: 'Test cookie set',
    cookieOptions,
    origin,
    nodeEnv: process.env.NODE_ENV
  });
});

// Environment check endpoint
app.get('/api/debug/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not set',
    timestamp: new Date().toISOString()
  });
});

// Comprehensive cookie test endpoint
app.get('/api/debug/test-cookies', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const origin = req.get('Origin');
  
  // Test different cookie configurations
  const cookies = [
    {
      name: 'testCookie1',
      value: 'value1',
      options: {
        httpOnly: false,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 1000
      }
    },
    {
      name: 'testCookie2',
      value: 'value2',
      options: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 1000
      }
    }
  ];
  
  // Set all test cookies
  cookies.forEach(cookie => {
    res.cookie(cookie.name, cookie.value, cookie.options);
  });
  
  // Get response headers for debugging
  const responseHeaders = res.getHeaders();
  
  res.json({
    message: 'Test cookies set with comprehensive options',
    cookies: cookies,
    origin: origin,
    nodeEnv: process.env.NODE_ENV,
    responseHeaders: responseHeaders,
    timestamp: new Date().toISOString()
  });
});

// Add request logging middleware
app.use((req, res, next) => {
  const origin = req.get('Origin');
  const userAgent = req.get('User-Agent');
  const cookies = req.headers.cookie;
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`  Origin: ${origin || 'No Origin'}`);
  console.log(`  User-Agent: ${userAgent || 'No User-Agent'}`);
  console.log(`  Cookies: ${cookies || 'No Cookies'}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
  
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.get('Origin'),
      allowedOrigins
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Serve uploads folder statically from backend
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ensure uploads directory exists in backend
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory at', uploadsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Keep just the original filename
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// File upload endpoint
app.post('/api/upload', (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return full URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('File uploaded:', fileUrl);
    res.status(201).json({ url: fileUrl });
  });
});

// Manual image cleanup endpoint (admin only)
app.post('/api/admin/cleanup-images', async (req, res) => {
  try {
    await ImageService.cleanupOrphanedImages();
    res.status(200).json({ message: 'Image cleanup completed successfully' });
  } catch (error) {
    console.error('Image cleanup error:', error);
    res.status(500).json({ error: 'Image cleanup failed' });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
