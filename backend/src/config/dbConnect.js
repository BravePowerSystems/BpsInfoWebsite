import mongoose from 'mongoose';

export default async function dbConnect() {   
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error; // Let the calling code decide how to handle the error
    }
}


    
