import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../scss/pages/UserProfile.scss';
import { systemNotifications, formNotifications } from '../utils/notificationHelper';
import { authService } from '../services/authService';
import Loading from '../components/Loading';
import { validateIndianPhone, formatIndianPhoneInput } from '../utils/phoneValidation';

const UserProfile = () => {
    const { user, loading, setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                const profileData = {
                    username: response.data.username || '',
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    phone: response.data.phone || ''
                };
                setFormData(profileData);
                
                // Also update the user in AuthContext to keep it in sync
                if (setUser) {
                    setUser(response.data);
                }
            } catch (error) {
                systemNotifications.error('Failed to load profile');
                // Fallback to user context data if fetch fails
                if (user) {
                    setFormData({
                        username: user.username || '',
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        phone: user.phone || ''
                    });
                }
            }
        };
        fetchProfile();
    }, []);

    // Remove the useEffect that was overriding fresh data with potentially incomplete context data
    
    const validatePhone = (phone) => {
        // Use Indian phone validation utility
        const validation = validateIndianPhone(phone);
        return validation.isValid;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (formData.phone && !validatePhone(formData.phone)) {
            const validation = validateIndianPhone(formData.phone);
            newErrors.phone = validation.error;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            // Ensure username is included in the update data
            const updateData = {
                ...formData,
                username: user?.username || formData.username
            };
            
            await authService.updateProfile(updateData);
            
            // Update user in AuthContext after profile update
            if (setUser) {
                const profile = await authService.getProfile();
                setUser(profile.data);
                // Also update the form data to reflect the changes
                setFormData({
                    username: profile.data.username || '',
                    firstName: profile.data.firstName || '',
                    lastName: profile.data.lastName || '',
                    phone: profile.data.phone || ''
                });
            }
            
            // Show success notification and close editing mode
            setIsEditing(false);
            // Small delay to ensure state updates are processed
            setTimeout(() => {
                formNotifications.submitSuccess('profile');
            }, 100);
        } catch (error) {
            systemNotifications.error('Failed to update profile');
            console.error('Error updating profile:', error);
        }
    };
    
    if (loading) {
        return <Loading text="Loading profile..." />;
    }
    
    return (
        <div className="user-profile-page">
            <motion.div 
                className="profile-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1>My Profile</h1>
                <p className="subtitle">Manage your account information</p>
            </motion.div>
            
            <div className="profile-content">
                <motion.div 
                    className="profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="profile-header-section">
                        <div className="profile-avatar">
                            {formData.firstName?.charAt(0) || formData.username?.charAt(0) || 'U'}
                        </div>
                        <div className="profile-info">
                            <h2>{formData.firstName} {formData.lastName || formData.username}</h2>
                            <p className="user-email">{user?.email}</p>
                            <p className="user-role">Account type: {user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                        </div>
                        {!isEditing && (
                            <button 
                                className="edit-profile-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <div className={`phone-input-container ${errors.phone ? "error" : ""}`}>
                                    <span className="phone-prefix">+91</span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone.replace('+91', '')}
                                        onChange={(e) => {
                                            const { name, value } = e.target;
                                            const formattedPhone = formatIndianPhoneInput(value);
                                            setFormData(prev => ({
                                                ...prev,
                                                [name]: formattedPhone
                                            }));
                                            
                                            // Clear error when user starts typing
                                            if (errors[name]) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    [name]: ''
                                                }));
                                            }
                                        }}
                                        placeholder="Enter 10 digit mobile number"
                                        maxLength="10"
                                    />
                                </div>
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setErrors({});
                                        // Reset form data to current form data (which should be fresh from DB)
                                        setFormData({
                                            username: formData.username || '',
                                            firstName: formData.firstName || '',
                                            lastName: formData.lastName || '',
                                            phone: formData.phone || ''
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-details">
                            <div className="detail-section">
                                <h3>Personal Information</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Username:</span>
                                    <span className="detail-value">{formData.username}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value">{user?.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">First Name:</span>
                                    <span className="detail-value">{formData.firstName || 'Not provided'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Last Name:</span>
                                    <span className="detail-value">{formData.lastName || 'Not provided'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{formData.phone || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;