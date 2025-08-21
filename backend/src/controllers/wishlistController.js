import WishlistItem from '../models/Wishlist.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Get all wishlist items for a user
export const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find all wishlist items for this user and populate product details
        const wishlistItems = await WishlistItem.find({ userId })
            .populate('productId')
            .sort({ addedAt: -1 });
            
        // Transform the data to match frontend expectations
        const formattedItems = wishlistItems.map(item => ({
            wishlistItemId: item._id,
            product: item.productId,
            addedAt: item.addedAt
        }));
        
        res.status(200).json(formattedItems);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist items' });
    }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        
        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        
        // Check if product exists
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Check if already in wishlist
        const existingItem = await WishlistItem.findOne({ userId, productId });
        if (existingItem) {
            return res.status(409).json({ message: 'Product already in wishlist' });
        }
        
        // Create new wishlist item
        const newWishlistItem = new WishlistItem({
            userId,
            productId
        });
        
        await newWishlistItem.save();
        
        // Return the newly created item with product details
        const populatedItem = await WishlistItem.findById(newWishlistItem._id)
            .populate('productId');
            
        res.status(201).json({
            wishlistItemId: populatedItem._id,
            product: populatedItem.productId,
            addedAt: populatedItem.addedAt
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Failed to add item to wishlist' });
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { wishlistItemId } = req.params;
        
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(wishlistItemId)) {
            return res.status(400).json({ message: 'Invalid wishlist item ID' });
        }
        
        // Find and delete the item
        const deletedItem = await WishlistItem.findOneAndDelete({
            _id: wishlistItemId,
            userId // Ensure the item belongs to this user
        });
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }
        
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Failed to remove item from wishlist' });
    }
};