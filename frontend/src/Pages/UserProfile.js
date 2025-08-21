import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import '../scss/pages/UserProfile.scss';
import { systemNotifications, formNotifications } from '../utils/notificationHelper';
import { authService } from '../services/authService';

const UserProfile = () => {
    const { user, loading, setUser } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        address: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                setFormData({
                    username: response.data.username || '',
                    email: response.data.email || '',
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    company: response.data.company || '',
                    phone: response.data.phone || '',
                    address: response.data.address || ''
                });
            } catch (error) {
                systemNotifications.error('Failed to load profile');
            }
        };
        fetchProfile();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.updateProfile(formData);
            formNotifications.submitSuccess('profile');
            setIsEditing(false);
            // Update user in AuthContext after profile update
            if (setUser) {
                const profile = await authService.getProfile();
                setUser(profile.data);
            }
        } catch (error) {
            systemNotifications.error('Failed to update profile');
            console.error('Error updating profile:', error);
        }
    };
    
    if (loading) {
        return <div className="loading">Loading profile...</div>;
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
                            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="profile-info">
                            <h2>{user?.firstName} {user?.lastName || user?.username}</h2>
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
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="company">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => setIsEditing(false)}
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
                                    <span className="detail-value">{user?.username}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value">{user?.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{user?.phone || 'Not provided'}</span>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h3>Company Information</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Company:</span>
                                    <span className="detail-value">{user?.company || 'Not provided'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Address:</span>
                                    <span className="detail-value">{user?.address || 'Not provided'}</span>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h3>Account Settings</h3>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;