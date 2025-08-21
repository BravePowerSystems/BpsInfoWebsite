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

// Middleware
app.use(
    cors({
        origin: [
            'http://localhost:3000', // Development
            'https://bps-info-website.vercel.app' // Production
        ],
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
