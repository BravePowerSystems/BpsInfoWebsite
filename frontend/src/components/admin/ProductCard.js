import React from 'react';
import '../../scss/components/admin/ProductCard.scss';

function ProductCard({ product, onEdit, onDelete }) {
    return (
        <div className="admin-product-card">
            <div className="product-image">
                <img src={product.imageUrl || "/placeholder-product.png"} alt={product.title} />
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-model">Model: {product.modelNumber}</p>
                <p className="product-category">Category: {product.category}</p>
                <div className="product-description-preview">
                    {product.description.substring(0, 100)}...
                </div>
                <div className="product-specs-preview">
                    <strong>Specifications:</strong> {product.specifications.length} items
                </div>
                <div className="product-apps-preview">
                    <strong>Applications:</strong> {product.applications.length} items
                </div>
            </div>
            <div className="product-actions">
                <button className="edit-btn" onClick={onEdit}>
                    Edit Product
                </button>
                <button className="delete-btn" onClick={onDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ProductCard;