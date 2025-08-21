import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';

export class ImageService {
    static async cleanupOrphanedImages() {
        try {
            const uploadsDir = path.join(process.cwd(), 'uploads');
            
            // Check if uploads directory exists
            if (!fs.existsSync(uploadsDir)) {
                console.log('Uploads directory does not exist, skipping cleanup');
                return;
            }
            
            const files = fs.readdirSync(uploadsDir);
            if (files.length === 0) {
                console.log('No files in uploads directory to clean');
                return;
            }
            
            // Get all image URLs currently in use from database
            const usedImages = await this.getUsedImageUrls();
            console.log(`Found ${usedImages.length} images in use in database`);
            
            let cleanedCount = 0;
            
            // Remove orphaned images
            for (const file of files) {
                // Skip if it's not an image file
                if (!this.isImageFile(file)) continue;
                
                // Check if this file is referenced in any product
                const isReferenced = usedImages.some(usedImage => 
                    usedImage.includes(file) || file.includes(usedImage.split('/').pop())
                );
                
                if (!isReferenced) {
                    const filePath = path.join(uploadsDir, file);
                    fs.unlinkSync(filePath);
                    cleanedCount++;
                    console.log(`Removed orphaned image: ${file}`);
                }
            }
            
            console.log(`Image cleanup completed. Removed ${cleanedCount} orphaned images.`);
        } catch (error) {
            console.error('Error during image cleanup:', error);
        }
    }
    
    static async getUsedImageUrls() {
        try {
            const products = await Product.find({}, 'imageUrl');
            return products
                .map(p => p.imageUrl)
                .filter(url => url && url.trim() !== '');
        } catch (error) {
            console.error('Error fetching used image URLs:', error);
            return [];
        }
    }
    
    static isImageFile(filename) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const ext = path.extname(filename).toLowerCase();
        return imageExtensions.includes(ext);
    }
    
    static async deleteProductImage(imageUrl) {
        try {
            if (!imageUrl) return;
            
            const uploadsDir = path.join(process.cwd(), 'uploads');
            const filename = imageUrl.split('/').pop();
            const filePath = path.join(uploadsDir, filename);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted product image: ${filename}`);
            }
        } catch (error) {
            console.error('Error deleting product image:', error);
        }
    }
}
