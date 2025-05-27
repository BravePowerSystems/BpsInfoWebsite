import { ProductService } from '../services/productService.js';

export const getProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

export const getProductByDetails = async (req, res) => {
    try {
        const { category, productName } = req.params;
        console.log('Fetching product with:', { category, productName }); // Debug log

        const product = await ProductService.getProductByDetails(category, productName);
        console.log('Found product:', product); // Debug log
        
        if (!product) {
            console.log('No product found'); // Debug log
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};
