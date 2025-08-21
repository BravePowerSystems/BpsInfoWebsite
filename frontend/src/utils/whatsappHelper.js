// WhatsApp Helper Utility
// Provides smart WhatsApp integration with device detection and fallback support

// Configuration - Replace with your actual WhatsApp business number
export const BUSINESS_WHATSAPP_NUMBER = '917942701967'; // With country code, no + sign

/**
 * Detects if the current device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Detects if the current device is iOS
 * @returns {boolean} True if iOS device
 */
export const isIOSDevice = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Detects if the current device is Android
 * @returns {boolean} True if Android device
 */
export const isAndroidDevice = () => {
    return /Android/.test(navigator.userAgent);
};

/**
 * Opens WhatsApp with a custom message
 * @param {string} message - The message to send
 * @param {string} phoneNumber - Phone number (optional, defaults to business number)
 */
export const openWhatsApp = (message = '', phoneNumber = BUSINESS_WHATSAPP_NUMBER) => {
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Detect device type
    const isMobile = isMobileDevice();
    const isIOS = isIOSDevice();
    const isAndroid = isAndroidDevice();
    
    let whatsappURL;
    
    if (isMobile) {
        // For mobile devices - try to open WhatsApp app first
        if (isIOS) {
            whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
        } else if (isAndroid) {
            whatsappURL = `intent://send?phone=${phoneNumber}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
        } else {
            whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
        }
        
        // Try to open app first
        const appOpened = window.open(whatsappURL, '_self');
        
        // Fallback to web version after a short delay if app doesn't open
        setTimeout(() => {
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        }, 1500);
        
    } else {
        // For desktop - open WhatsApp Web directly
        whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
    }
};

/**
 * Opens WhatsApp with a product enquiry message
 * @param {string} productName - Name of the product
 * @param {string} sku - Product SKU/model number
 * @param {string} price - Product price
 * @param {string} phoneNumber - Phone number (optional, defaults to business number)
 */
export const openWhatsAppProductEnquiry = (productName, sku = '', price = '', phoneNumber = BUSINESS_WHATSAPP_NUMBER) => {
    const message = `Hi! I'm interested in the ${productName}${sku ? ` (SKU: ${sku})` : ''}${price ? ` priced at ${price}` : ''}. Can you provide more details?`;
    openWhatsApp(message, phoneNumber);
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

/**
 * Opens WhatsApp with a contact message
 * @param {string} phoneNumber - Phone number (optional, defaults to business number)
 */
export const openWhatsAppContact = (phoneNumber = BUSINESS_WHATSAPP_NUMBER) => {
    const message = 'Hi! I would like to get in touch with your team.';
    openWhatsApp(message, phoneNumber);
};
