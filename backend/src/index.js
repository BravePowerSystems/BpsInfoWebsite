import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './config/dbConnect.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables first
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000'], // Add your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable credentials (cookies, authorization headers, etc)
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

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

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
