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
// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(
    cors({
        origin: 'http://localhost:3000', // Set to frontend origin for credentials
        credentials: true,
    })
);
  

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

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory at', uploadsDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
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

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
