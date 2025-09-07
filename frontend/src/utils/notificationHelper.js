import Notify from 'simple-notify';
import '../../node_modules/simple-notify/dist/simple-notify.css';

const defaultOptions = {
    effect: 'slide',
    position: 'right top',
    autoclose: true,
    autotimeout: 3000,
    gap: 20,
    distance: 20,
    type: 'filled'
};

// Authentication notifications (existing)
export const authNotifications = {
    loginSuccess: (username) => {
        new Notify({
            ...defaultOptions,
            status: 'success',
            title: 'Welcome Back!',
            text: `Successfully logged in as ${username}`,
            customIcon: '👋'
        });
    },

    registerSuccess: (username) => {
        new Notify({
            ...defaultOptions,
            status: 'success',
            title: 'Welcome!',
            text: `Account created successfully for ${username}`,
            customIcon: '🎉'
        });
    },

    loginError: (message) => {
        new Notify({
            ...defaultOptions,
            status: 'error',
            title: 'Login Failed',
            text: message || 'Please check your credentials and try again',
            autotimeout: 4000,
            customIcon: '⚠️'
        });
    },

    logoutSuccess: () => {
        new Notify({
            ...defaultOptions,
            status: 'info',
            title: 'Goodbye!',
            text: 'You have been successfully logged out',
            customIcon: '👋'
        });
    },

    sessionExpired: () => {
        new Notify({
            ...defaultOptions,
            status: 'warning',
            title: 'Session Expired',
            text: 'Please login again to continue',
            autotimeout: 4000,
            customIcon: '⏰'
        });
    }
};

// Product related notifications
export const productNotifications = {
    enquirySent: () => {
        new Notify({
            ...defaultOptions,
            status: 'success',
            title: 'Enquiry Sent!',
            text: 'We will get back to you within 24 hours',
            customIcon: '📨'
        });
    },

    addedToWishlist: (productName) => {
        new Notify({
            ...defaultOptions,
            status: 'success',
            title: 'Added to Wishlist',
            text: `${productName} has been added to your wishlist`,
            customIcon: '❤️'
        });
    },

    removedFromWishlist: (productName) => {
        new Notify({
            ...defaultOptions,
            status: 'info',
            title: 'Removed from Wishlist',
            text: `${productName} has been removed from your wishlist`,
            customIcon: '💔'
        });
    },
    
    alreadyInWishlist: () => {
        new Notify({
            ...defaultOptions,
            status: 'info',
            title: 'Already in Wishlist',
            text: 'This product is already in your wishlist',
            customIcon: '❤️'
        });
    },
    
    wishlistError: () => {
        new Notify({
            ...defaultOptions,
            status: 'error',
            title: 'Wishlist Error',
            text: 'There was a problem updating your wishlist',
            customIcon: '⚠️'
        });
    }
};

// Admin notifications
export const adminNotifications = {
    newEnquiry: (productName) => {
        new Notify({
            ...defaultOptions,
            status: 'info',
            title: 'New Product Enquiry',
            text: `New enquiry received for ${productName}`,
            customIcon: '📬',
            autotimeout: 5000
        });
    },

    newUserRegistered: (username) => {
        new Notify({
            ...defaultOptions,
            status: 'info',
            title: 'New User Registered',
            text: `${username} has joined the platform`,
            customIcon: '👤'
        });
    }
};

// System notifications
export const systemNotifications = {
    success: (message) => {
        new Notify({
            ...defaultOptions,
            status: 'success',
            title: 'Success',
            text: message,
            customIcon: '✅',
            autotimeout: 4000
        });
    },

    error: (message) => {
        new Notify({
            ...defaultOptions,
            status: 'error',
            title: 'Error',
            text: message,
            customIcon: '❌',
            autotimeout: 4000
        });
    },

    networkError: () => {
        new Notify({
            ...defaultOptions,
            status: 'error',
            title: 'Network Error',
            text: 'Please check your internet connection',
            customIcon: '🌐',
            autotimeout: 4000
        });
    },

    maintenanceWarning: () => {
        new Notify({
            ...defaultOptions,
            status: 'warning',
            title: 'Scheduled Maintenance',
            text: 'System maintenance in 15 minutes. Please save your work.',
            customIcon: '🔧',
            autotimeout: 6000
        });
    }
};

// Form notifications
export const formNotifications = {
    submitSuccess: (formName) => {
        new Notify({
            ...defaultOptions,
            status: 'success',
            title: 'Form Submitted',
            text: `Your ${formName} has been submitted successfully`,
            customIcon: '✅'
        });
    },

    submitError: (formName) => {
        new Notify({
            ...defaultOptions,
            status: 'error',
            title: 'Submission Failed',
            text: `Failed to submit ${formName}. Please try again.`,
            customIcon: '❌',
            autotimeout: 4000
        });
    },

    validationError: () => {
        new Notify({
            ...defaultOptions,
            status: 'warning',
            title: 'Validation Error',
            text: 'Please check the form for errors',
            customIcon: '⚠️'
        });
    }
};

