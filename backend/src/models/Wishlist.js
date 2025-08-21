import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    addedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Compound index to ensure a user can't add the same product twice
wishlistItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('WishlistItem', wishlistItemSchema);