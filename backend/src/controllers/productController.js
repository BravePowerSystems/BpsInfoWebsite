import Product from '../models/Product.js';
import { ImageService } from '../services/imageService.js';
import { ProductService } from '../services/productService.js';

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// Get product by category and name
export const getProductByDetails = async (req, res) => {
    try {
        const { category, productName } = req.params;
        // Convert dashes to spaces and use case-insensitive regex for matching
        const categoryRegex = new RegExp('^' + category.replace(/-/g, ' ') + '$', 'i');
        const titleRegex = new RegExp('^' + productName.replace(/-/g, ' ') + '$', 'i');
        const product = await Product.findOne({
            category: categoryRegex,
            title: titleRegex
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

// Create new product
export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: 'Failed to create product', error: error.message });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({ message: 'Failed to update product', error: error.message });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Clean up the product's image file
        if (deletedProduct.imageUrl) {
            await ImageService.deleteProductImage(deletedProduct.imageUrl);
        }
        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};



