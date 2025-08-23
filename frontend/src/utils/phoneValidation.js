/**
 * Phone Validation Utility for Indian Phone Numbers
 * Validates Indian mobile numbers with +91 country code
 */

/**
 * Validates Indian phone number format
 * @param {string} phone - Phone number to validate
 * @returns {object} - Validation result with isValid boolean and error message
 */
export const validateIndianPhone = (phone) => {
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Check if phone starts with +91
    if (!cleanPhone.startsWith('+91')) {
        return {
            isValid: false,
            error: 'Phone number must start with +91 (India country code)'
        };
    }
    
    // Remove +91 prefix and check remaining digits
    const digitsOnly = cleanPhone.substring(3);
    
    // Check if exactly 10 digits after +91
    if (digitsOnly.length !== 10) {
        return {
            isValid: false,
            error: 'Phone number must be exactly 10 digits after +91'
        };
    }
    
    // Check if all characters are digits
    if (!/^\d+$/.test(digitsOnly)) {
        return {
            isValid: false,
            error: 'Phone number must contain only digits after +91'
        };
    }
    
    // Check if first digit is 6, 7, 8, or 9 (valid Indian mobile prefixes)
    const firstDigit = parseInt(digitsOnly.charAt(0));
    if (![6, 7, 8, 9].includes(firstDigit)) {
        return {
            isValid: false,
            error: 'Invalid mobile number prefix. Must start with 6, 7, 8, or 9'
        };
    }
    
    return {
        isValid: true,
        error: '',
        formattedPhone: `+91${digitsOnly}`
    };
};

/**
 * Formats phone number input to show +91 prefix
 * @param {string} input - User input
 * @returns {string} - Formatted phone number with +91 prefix
 */
export const formatIndianPhoneInput = (input) => {
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limitedDigits = digitsOnly.substring(0, 10);
    
    // Return formatted with +91 prefix
    return `+91${limitedDigits}`;
};

/**
 * Checks if a phone number is empty or valid
 * @param {string} phone - Phone number to check
 * @returns {boolean} - True if empty or valid Indian phone number
 */
export const isPhoneValidOrEmpty = (phone) => {
    if (!phone || phone.trim() === '') {
        return true; // Empty is considered valid (optional field)
    }
    
    const validation = validateIndianPhone(phone);
    return validation.isValid;
};
