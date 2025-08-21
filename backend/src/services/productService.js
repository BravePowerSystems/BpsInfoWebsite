import Product from '../models/Product.js';

export class ProductService {
    static async getAllProducts() {
        const products = await Product.find({});
        
        // Transform the data to match the frontend structure
        return products.reduce((acc, product) => {
            const category = product.category;
            
            // Find or create the category object
            const categoryObj = acc.find(item => Object.keys(item)[0] === category);
            if (categoryObj) {
                categoryObj[category].push(this.transformProductData(product));
            } else {
                acc.push({
                    [category]: [this.transformProductData(product)]
                });
            }
            return acc;
        }, []);
    }

    static async getProductByDetails(category, productName) {
        return await Product.findOne({
            category: category,
            title: productName.replace(/-/g, ' ')
        });
    }

    static transformProductData(product) {
        return {
            _id: product._id,
            title: product.title,
            img: product.imageUrl,
            description: product.description,
            link: `/Products/${product.category}/${product.title.replace(/\s+/g, '-')}`,
            specifications: product.specifications,
            applications: product.applications,
            downloads: product.downloads,
            modelNumber: product.modelNumber,
            category: product.category
        };
    }
}