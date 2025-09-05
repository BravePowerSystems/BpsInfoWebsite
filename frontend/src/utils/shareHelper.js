// Share Helper Utilities
export const shareHelper = {
    /**
     * Generate a shareable URL for a product
     * @param {Object} product - Product object with category, slug, and title
     * @param {string} baseUrl - Base URL of the application (optional)
     * @returns {string} Shareable URL
     */
    generateProductUrl: (product, baseUrl = null) => {
        if (!product) return window.location.href;
        
        const origin = baseUrl || window.location.origin;
        const categoryName = product.category?.replace(/\s+/g, '-').toLowerCase() || 'products';
        const productName = product.slug || product.title?.replace(/\s+/g, '-').toLowerCase();
        
        return `${origin}/Products/${categoryName}/${productName}`;
    },

    /**
     * Generate share text for a product
     * @param {Object} product - Product object
     * @param {number} maxLength - Maximum length of description (default: 100)
     * @returns {string} Share text
     */
    generateShareText: (product, maxLength = 100) => {
        if (!product) return 'Check out this product!';
        
        const title = product.title || 'Product';
        const description = product.description?.substring(0, maxLength) || '';
        const suffix = product.description?.length > maxLength ? '...' : '';
        
        return `Check out ${title} - ${description}${suffix}`;
    },

    /**
     * Copy text to clipboard with fallback for older browsers
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    copyToClipboard: async (text) => {
        try {
            // Modern clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },

    /**
     * Generate social media share URLs
     * @param {string} platform - Social media platform
     * @param {string} url - URL to share
     * @param {string} text - Text to share
     * @returns {string} Social media share URL
     */
    generateSocialShareUrl: (platform, url, text) => {
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
            email: `mailto:?subject=${encodeURIComponent('Product Share')}&body=${encodedText}%0A%0A${encodedUrl}`
        };
        
        return shareUrls[platform] || '';
    },

    /**
     * Open social media share window
     * @param {string} platform - Social media platform
     * @param {string} url - URL to share
     * @param {string} text - Text to share
     * @param {Object} options - Window options
     */
    openSocialShare: (platform, url, text, options = {}) => {
        const shareUrl = shareHelper.generateSocialShareUrl(platform, url, text);
        
        if (!shareUrl) {
            console.error(`Unsupported platform: ${platform}`);
            return;
        }
        
        const defaultOptions = {
            width: 600,
            height: 400,
            scrollbars: 'yes',
            resizable: 'yes'
        };
        
        const windowOptions = { ...defaultOptions, ...options };
        const windowFeatures = Object.entries(windowOptions)
            .map(([key, value]) => `${key}=${value}`)
            .join(',');
        
        window.open(shareUrl, '_blank', windowFeatures);
    },

    /**
     * Share to native share API if available
     * @param {Object} shareData - Share data object
     * @returns {Promise<boolean>} Success status
     */
    shareNative: async (shareData) => {
        if (!navigator.share) {
            return false;
        }
        
        try {
            await navigator.share(shareData);
            return true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
            }
            return false;
        }
    },

    /**
     * Get share analytics data
     * @param {string} platform - Platform name
     * @param {string} productId - Product ID
     * @returns {Object} Analytics data
     */
    getShareAnalytics: (platform, productId) => {
        return {
            platform,
            productId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    },

    /**
     * Validate product data for sharing
     * @param {Object} product - Product object
     * @returns {boolean} Is valid for sharing
     */
    validateProductForSharing: (product) => {
        if (!product) return false;
        if (!product.title && !product.slug) return false;
        return true;
    },

    /**
     * Get platform display name
     * @param {string} platform - Platform key
     * @returns {string} Display name
     */
    getPlatformDisplayName: (platform) => {
        const displayNames = {
            facebook: 'Facebook',
            twitter: 'Twitter',
            linkedin: 'LinkedIn',
            whatsapp: 'WhatsApp',
            telegram: 'Telegram',
            reddit: 'Reddit',
            pinterest: 'Pinterest',
            email: 'Email',
            copy: 'Copy Link'
        };
        
        return displayNames[platform] || platform;
    },

    /**
     * Get platform icon (emoji)
     * @param {string} platform - Platform key
     * @returns {string} Icon emoji
     */
    getPlatformIcon: (platform) => {
        const icons = {
            facebook: '📘',
            twitter: '🐦',
            linkedin: '💼',
            whatsapp: '💬',
            telegram: '✈️',
            reddit: '🤖',
            pinterest: '📌',
            email: '📧',
            copy: '📋'
        };
        
        return icons[platform] || '🔗';
    }
};

export default shareHelper;
