import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../scss/components/ShareButton.scss';

const ShareButton = ({ 
    product, 
    variant = 'default', 
    size = 'medium',
    showText = true,
    className = '',
    onShare = null 
}) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Generate shareable URL
    const generateShareUrl = () => {
        if (!product) return window.location.href;
        
        const baseUrl = window.location.origin;
        const categoryName = product.category?.replace(/\s+/g, '-').toLowerCase() || 'products';
        const productName = product.slug || product.title?.replace(/\s+/g, '-').toLowerCase();
        
        return `${baseUrl}/Products/${categoryName}/${productName}`;
    };

    // Generate absolute image URL for sharing
    const generateImageUrl = () => {
        if (!product || !product.imageUrl) {
            console.log('No product or imageUrl:', { product, imageUrl: product?.imageUrl });
            return null;
        }
        
        // If imageUrl is already absolute, return as is
        if (product.imageUrl.startsWith('http')) {
            console.log('Absolute imageUrl:', product.imageUrl);
            return product.imageUrl;
        }
        
        // If imageUrl is relative, make it absolute
        const baseUrl = window.location.origin;
        const absoluteUrl = product.imageUrl.startsWith('/') 
            ? `${baseUrl}${product.imageUrl}`
            : `${baseUrl}/${product.imageUrl}`;
        
        console.log('Generated absolute imageUrl:', absoluteUrl);
        return absoluteUrl;
    };

    // Generate share text
    const generateShareText = () => {
        if (!product) return 'Check out this product!';
        return `Check out ${product.title} - ${product.description?.substring(0, 100)}...`;
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            const url = generateShareUrl();
            await navigator.clipboard.writeText(url);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
            
            if (onShare) onShare('copy', url);
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = generateShareUrl();
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    // WhatsApp sharing
    const shareToWhatsApp = () => {
        const url = generateShareUrl();
        const text = generateShareText();
        
        // Use preview URL for WhatsApp to show rich previews
        const previewUrl = `https://bps-info-website.vercel.app${url.replace(window.location.origin, '')}`;
        const encodedPreviewUrl = encodeURIComponent(previewUrl);
        const encodedText = encodeURIComponent(text);
        
        // Debug logging
        console.log('WhatsApp Share Debug:');
        console.log('Original URL:', url);
        console.log('Preview URL:', previewUrl);
        console.log('Product Image:', product?.imageUrl);
        console.log('Product Title:', product?.title);
        console.log('Product Description:', product?.description);
        
        const shareUrl = `https://wa.me/?text=${encodedText}%20${encodedPreviewUrl}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
        
        if (onShare) onShare('whatsapp', url);
        setShowShareModal(false);
    };

    // Handle share button click (open modal)
    const handleShareClick = () => {
        setShowShareModal(true);
    };

    const buttonClass = `share-button share-button--${variant} share-button--${size} ${className}`;

    return (
        <>
            <button
                className={buttonClass}
                onClick={handleShareClick}
                title="Share product"
            >
                <svg 
                    className="share-icon" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16,6 12,2 8,6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {showText && <span>Share</span>}
            </button>

            <AnimatePresence>
                {showShareModal && (
                                <ShareModal
                product={product}
                imageUrl={generateImageUrl()}
                onClose={() => setShowShareModal(false)}
                onCopy={copyToClipboard}
                onWhatsApp={shareToWhatsApp}
                copySuccess={copySuccess}
            />
                )}
            </AnimatePresence>
        </>
    );
};

// Share Modal Component
const ShareModal = ({ product, imageUrl, onClose, onCopy, onWhatsApp, copySuccess }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="share-modal-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                className="share-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="share-modal-header">
                    <h3>Share Product</h3>
                    <button
                        className="share-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <img src="/close.png" alt="Close" />
                    </button>
                </div>

                <div className="share-modal-content">
                    {product && (
                        <div className="share-product-preview">
                            <img
                                src={imageUrl || '/placeholder-product.png'}
                                alt={product.title}
                                className="share-product-image"
                                onError={(e) => {
                                    e.target.src = '/placeholder-product.png';
                                }}
                            />
                            <div className="share-product-info">
                                <h4>{product.title}</h4>
                                <p>{product.description?.substring(0, 100)}...</p>
                            </div>
                        </div>
                    )}

                    <div className="share-actions">
                        <button
                            className={`share-action-btn copy-btn ${copySuccess ? 'success' : ''}`}
                            onClick={onCopy}
                        >
                            <div className="share-action-icon">
                                <img src="/arrow_right.svg" alt="Copy Link" />
                            </div>
                            <span className="share-action-label">
                                {copySuccess ? 'Copied!' : 'Copy Link'}
                            </span>
                        </button>
                        
                        <button
                            className="share-action-btn whatsapp-btn"
                            onClick={onWhatsApp}
                        >
                            <div className="share-action-icon">
                                <img src="/whatsapp.png" alt="WhatsApp" />
                            </div>
                            <span className="share-action-label">Share on WhatsApp</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ShareButton;
