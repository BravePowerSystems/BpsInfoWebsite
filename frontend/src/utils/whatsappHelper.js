// WhatsApp Helper Utility
// Provides WhatsApp integration for enquiries and contact

// Configuration - Replace with your actual WhatsApp business number
export const BUSINESS_WHATSAPP_NUMBER = '919441734282'; // With country code, no + sign

/**
 * Opens WhatsApp with a custom message
 * @param {string} message - The message to send
 * @param {string} phoneNumber - Phone number (optional, defaults to business number)
 */
export const openWhatsApp = (message = '', phoneNumber = BUSINESS_WHATSAPP_NUMBER) => {
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Use the same reliable method as share functionality
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank', 'width=600,height=400');
};

/**
 * Opens WhatsApp with a product enquiry message (with rich preview)
 * @param {string} productName - Name of the product
 * @param {string} sku - Product SKU/model number
 * @param {string} price - Product price
 * @param {string} productLink - Link to the product page
 * @param {string} phoneNumber - Phone number (optional, defaults to business number)
 */
export const openWhatsAppProductEnquiry = (productName, sku = '', price = '', productLink = '', phoneNumber = BUSINESS_WHATSAPP_NUMBER) => {
    // Create enquiry text
    const enquiryText = `Hi! I'm interested in the ${productName}${sku ? ` (SKU: ${sku})` : ''}${price ? ` priced at ${price}` : ''}. Can you provide more details?`;
    
    if (productLink) {
        // Use rich preview format like share functionality
        const previewUrl = productLink.includes('bps-info-website.vercel.app') 
            ? productLink 
            : `https://bps-info-website.vercel.app${productLink.replace(window.location.origin, '')}`;
        
        const encodedPreviewUrl = encodeURIComponent(previewUrl);
        const encodedText = encodeURIComponent(enquiryText);
        
        // Use WhatsApp format that creates rich previews
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedText}%20${encodedPreviewUrl}`;
        window.open(whatsappURL, '_blank', 'width=600,height=400');
    } else {
        // Fallback to simple text message
        openWhatsApp(enquiryText, phoneNumber);
    }
};

/**
 * Opens WhatsApp with a general enquiry message
 * @param {string} enquiryType - Type of enquiry (optional)
 * @param {string} phoneNumber - Phone number (optional, defaults to business number)
 */
export const openWhatsAppGeneralEnquiry = (enquiryType = '', phoneNumber = BUSINESS_WHATSAPP_NUMBER) => {
    const message = `Hi! I have a ${enquiryType ? `${enquiryType} ` : ''}enquiry. Can you help me?`;
    openWhatsApp(message, phoneNumber);
};

