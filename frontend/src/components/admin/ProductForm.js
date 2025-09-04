import React, { useState, useEffect } from 'react';
import CustomDropdown from '../CustomDropdown';
import '../../scss/components/admin/ProductForm.scss';
import { motion } from 'framer-motion';
import { privateClientMethods } from '../../services/apiClient';

function ProductForm({ product, categories, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        modelNumber: '',
        category: '',
        description: '',
        specifications: [{ name: '', value: '' }],
        applications: [''],
        downloads: [{ name: '', type: 'PDF', url: '' }],
        imageUrl: ''
    });
    
    const [currentTab, setCurrentTab] = useState('basic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [descriptionError, setDescriptionError] = useState('');
    
    const MAX_DESCRIPTION_LENGTH = 60;
    

    
    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                specifications: product.specifications?.length ? product.specifications : [{ name: '', value: '' }],
                applications: product.applications?.length ? product.applications : [''],
                downloads: product.downloads?.length ? product.downloads : [{ name: '', type: 'PDF', url: '' }]
            });
        }
    }, [product]);
    
    // Focus trap for accessibility
    useEffect(() => {
        const modal = document.querySelector(".product-form-content");
        if (modal) modal.focus();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Handle description character limit
        if (name === 'description') {
            if (value.length > MAX_DESCRIPTION_LENGTH) {
                setDescriptionError(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`);
                return;
            } else {
                setDescriptionError('');
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSpecChange = (index, field, value) => {
        const updatedSpecs = [...formData.specifications];
        updatedSpecs[index] = {
            ...updatedSpecs[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            specifications: updatedSpecs
        }));
    };
    
    const addSpecification = () => {
        setFormData(prev => ({
            ...prev,
            specifications: [...prev.specifications, { name: '', value: '' }]
        }));
    };
    
    const removeSpecification = (index) => {
        if (formData.specifications.length > 1) {
            const updatedSpecs = [...formData.specifications];
            updatedSpecs.splice(index, 1);
            setFormData(prev => ({
                ...prev,
                specifications: updatedSpecs
            }));
        }
    };
    
    const handleAppChange = (index, value) => {
        const updatedApps = [...formData.applications];
        updatedApps[index] = value;
        setFormData(prev => ({
            ...prev,
            applications: updatedApps
        }));
    };
    
    const addApplication = () => {
        setFormData(prev => ({
            ...prev,
            applications: [...prev.applications, '']
        }));
    };
    
    const removeApplication = (index) => {
        if (formData.applications.length > 1) {
            const updatedApps = [...formData.applications];
            updatedApps.splice(index, 1);
            setFormData(prev => ({
                ...prev,
                applications: updatedApps
            }));
        }
    };
    
    const handleDownloadChange = (index, field, value) => {
        const updatedDownloads = [...formData.downloads];
        updatedDownloads[index] = {
            ...updatedDownloads[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            downloads: updatedDownloads
        }));
    };
    
    const addDownload = () => {
        setFormData(prev => ({
            ...prev,
            downloads: [...prev.downloads, { name: '', type: 'PDF', url: '' }]
        }));
    };
    
    const removeDownload = (index) => {
        if (formData.downloads.length > 1) {
            const updatedDownloads = [...formData.downloads];
            updatedDownloads.splice(index, 1);
            setFormData(prev => ({
                ...prev,
                downloads: updatedDownloads
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const cleanedData = {
                ...formData,
                specifications: formData.specifications.filter(spec => spec.name.trim() && spec.value.trim()),
                applications: formData.applications.filter(app => app.trim()),
                downloads: formData.downloads.filter(dl => dl.name.trim() && dl.url.trim())
            };
            
            await onSave(cleanedData);
        } catch (error) {
            console.error('Error saving product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Add this function for image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPEG, PNG, GIF, etc.)');
            return;
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        setIsImageUploading(true);
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        
        try {
            console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
            const response = await privateClientMethods.post('/upload', formDataObj);
            
            if (response && response.data && response.data.url) {
                // The backend now returns full URLs, so use directly
                setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
                console.log('Image uploaded successfully:', response.data.url);
            } else {
                console.error('Upload response missing URL:', response);
                alert('Image upload failed: Invalid response from server');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            
            // Provide more specific error messages
            if (err.response) {
                const errorData = err.response.data;
                if (errorData.error === 'File too large') {
                    alert(`Upload failed: ${errorData.details}`);
                } else if (errorData.error === 'Invalid file type') {
                    alert(`Upload failed: ${errorData.details}`);
                } else if (errorData.error === 'No file uploaded') {
                    alert(`Upload failed: ${errorData.details}`);
                } else {
                    alert(`Upload failed: ${errorData.error} - ${errorData.details || 'Unknown error'}`);
                }
            } else if (err.message) {
                alert(`Upload failed: ${err.message}`);
            } else {
                alert('Image upload failed: Unknown error occurred');
            }
        } finally {
            setIsImageUploading(false);
        }
    };

    
    return (
        <motion.div 
            className="product-form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onCancel}
        >
            <motion.div 
                className="product-form-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="product-form-header">
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>
                
                <div className="form-tabs">
                    <button 
                        className={currentTab === 'basic' ? 'active' : ''} 
                        onClick={() => setCurrentTab('basic')}
                    >
                        Basic Info
                    </button>
                    <button 
                        className={currentTab === 'specs' ? 'active' : ''} 
                        onClick={() => setCurrentTab('specs')}
                    >
                        Specifications
                    </button>
                    <button 
                        className={currentTab === 'apps' ? 'active' : ''} 
                        onClick={() => setCurrentTab('apps')}
                    >
                        Applications
                    </button>
                    <button 
                        className={currentTab === 'downloads' ? 'active' : ''} 
                        onClick={() => setCurrentTab('downloads')}
                    >
                        Downloads
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="product-form">
                    {currentTab === 'basic' && (
                        <div className="tab-content basic-info-tab">
                            <div className="form-group">
                                <label htmlFor="title">Product Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="modelNumber">Model Number</label>
                                <input
                                    type="text"
                                    id="modelNumber"
                                    name="modelNumber"
                                    value={formData.modelNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <CustomDropdown
                                    options={categories.map(cat => ({ value: cat, label: cat }))}
                                    value={formData.category}
                                    onChange={(category) => setFormData(prev => ({ ...prev, category }))}
                                    placeholder="Categories"
                                />
                            </div>
                            <div className="description-field">
                                <label htmlFor="description">Product Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter detailed product description..."
                                    rows="4"
                                    maxLength={MAX_DESCRIPTION_LENGTH}
                                    className={descriptionError ? 'error' : ''}
                                />
                                <div className="char-counter">
                                    <span className={formData.description.length > MAX_DESCRIPTION_LENGTH * 0.8 ? 'warning' : ''}>
                                        {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                                    </span>
                                </div>
                                {descriptionError && (
                                    <div className="error-message">{descriptionError}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="imageUpload">Product Image</label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isImageUploading}
                                />
                                {isImageUploading && (
                                    <div className="upload-status">
                                        <span>Uploading image...</span>
                                    </div>
                                )}
                                {formData.imageUrl && (
                                    <div className="image-preview">
                                        <img src={formData.imageUrl} alt="Product Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {currentTab === 'specs' && (
                        <div className="form-section specs-section">
                            <h3>Product Specifications</h3>
                            <p className="help-text">Add technical specifications for this product.</p>
                            
                            {formData.specifications.map((spec, index) => (
                                <div key={index} className="spec-row">
                                    <div className="spec-inputs">
                                        <button 
                                            type="button" 
                                            className="remove-btn"
                                            onClick={() => removeSpecification(index)}
                                        >
                                            <img src="/close.png" alt="Remove" />
                                        </button>
                                        <input 
                                            type="text" 
                                            value={spec.name} 
                                            onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                                            placeholder="Specification name (e.g., Power Rating)"
                                            className="spec-key-input"
                                        />
                                        <input 
                                            type="text" 
                                            value={spec.value} 
                                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                            placeholder="Specification value (e.g., 100W)"
                                            className="spec-value-input"
                                        />
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                type="button" 
                                className="add-btn"
                                onClick={addSpecification}
                            >
                                + Add Specification
                            </button>
                        </div>
                    )}
                    
                    {currentTab === 'apps' && (
                        <div className="form-section">
                            <h3>Product Applications</h3>
                            <p className="help-text">List the applications or use cases for this product.</p>
                            
                            {formData.applications.map((app, index) => (
                                <div key={index} className="app-row">
                                    <input 
                                        type="text" 
                                        value={app} 
                                        onChange={(e) => handleAppChange(index, e.target.value)}
                                        placeholder="Enter application"
                                    />
                                    <button 
                                        type="button" 
                                        className="remove-btn"
                                        onClick={() => removeApplication(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                type="button" 
                                className="add-btn"
                                onClick={addApplication}
                            >
                                + Add Application
                            </button>
                        </div>
                    )}
                    
                    {currentTab === 'downloads' && (
                        <div className="form-section">
                            <h3>Product Downloads</h3>
                            <p className="help-text">Add downloadable resources like manuals, datasheets, etc.</p>
                            
                            {formData.downloads.map((download, index) => (
                                <div key={index} className="download-row">
                                    <div className="download-inputs">
                                        <input 
                                            type="text" 
                                            value={download.name} 
                                            onChange={(e) => handleDownloadChange(index, 'name', e.target.value)}
                                            placeholder="Document name"
                                        />
                                        <select 
                                            value={download.type} 
                                            onChange={(e) => handleDownloadChange(index, 'type', e.target.value)}
                                        >
                                            <option value="PDF">PDF</option>
                                            <option value="DOC">DOC</option>
                                            <option value="XLS">XLS</option>
                                            <option value="ZIP">ZIP</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <input 
                                            type="text" 
                                            value={download.url} 
                                            onChange={(e) => handleDownloadChange(index, 'url', e.target.value)}
                                            placeholder="Document URL"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        className="remove-btn"
                                        onClick={() => removeDownload(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                type="button" 
                                className="add-btn"
                                onClick={addDownload}
                            >
                                + Add Download
                            </button>
                        </div>
                    )}
                    
                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="save-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default ProductForm;



