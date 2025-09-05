import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ImageService } from './services/imageService.js';
// Load environment variables first
dotenv.config();

// Validate required environment variables
console.log('🔧 Environment validation...');
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET', 
    'JWT_REFRESH_SECRET',
    'SENDGRID_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars);
    console.error('❌ Please set the following environment variables:');
    missingEnvVars.forEach(envVar => {
        console.error(`   - ${envVar}`);
    });
    console.error('❌ Application will not function properly without these variables');
} else {
    console.log('✅ All required environment variables are set');
}

// Log environment status
console.log('📊 Environment status:', {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '5000',
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not set',
    SENDGRID_KEY: process.env.SENDGRID_KEY ? 'Set' : 'Not set',
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'Using default',
    FRONTEND_URL: process.env.FRONTEND_URL || 'Using default'
});

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
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());  // this is used to parse the request body as JSON

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
app.use('/api/content', contentRoutes);

// Environment check endpoint
app.get('/api/debug/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not set',
    SENDGRID_KEY: process.env.SENDGRID_KEY ? 'Set' : 'Not set',
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'Using default',
    FRONTEND_URL: process.env.FRONTEND_URL || 'Using default',
    timestamp: new Date().toISOString()
  });
});

// SendGrid test endpoint
app.get('/api/debug/sendgrid', async (req, res) => {
  try {
    const { EmailService } = await import('./services/emailService.js');
    const result = await EmailService.testSendGridConnection();
    res.json({ success: true, result });
  } catch (error) {
    console.error('SendGrid test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: {
        hasKey: !!process.env.SENDGRID_KEY,
        keyLength: process.env.SENDGRID_KEY?.length,
        startsWithSG: process.env.SENDGRID_KEY?.startsWith('SG.')
      }
    });
  }
});

// Add request logging middleware
app.use((req, res, next) => {
  const origin = req.get('Origin');
  const userAgent = req.get('User-Agent');
  
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`  Origin: ${origin || 'No Origin'}`);
  console.log(`  User-Agent: ${userAgent || 'No User-Agent'}`);
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
} else {
    console.log('Uploads directory already exists at', uploadsDir);
}

// Check directory permissions
try {
    const testFile = path.join(uploadsDir, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('Uploads directory is writable');
} catch (error) {
    console.error('Warning: Uploads directory is not writable:', error.message);
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

// Add file filter and size limits
const fileFilter = (req, file, cb) => {
  // Accept image files and PDF files
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image files and PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});

// File upload endpoint
app.post('/api/upload', (req, res, next) => {
  console.log('Upload request received:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    files: req.files
  });
  
  upload.single('file')(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      
      // Handle specific multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: 'File too large', 
          details: 'File size must be less than 5MB' 
        });
      }
      
      if (err.message === 'Only image files and PDF files are allowed') {
        return res.status(400).json({ 
          error: 'Invalid file type', 
          details: 'Only image files and PDF files are allowed' 
        });
      }
      
      return res.status(500).json({ 
        error: 'File upload failed', 
        details: err.message 
      });
    }
    
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        details: 'Please select an image file to upload'
      });
    }
    
    try {
      // Return full URL - use environment variable for production base URL
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://bps-backend-mq7g.onrender.com'
        : `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      console.log('File uploaded successfully:', {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        originalName: req.file.originalname
      });
      res.status(201).json({ 
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error('Error generating file URL:', error);
      res.status(500).json({ 
        error: 'Error processing uploaded file',
        details: error.message
      });
    }
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
