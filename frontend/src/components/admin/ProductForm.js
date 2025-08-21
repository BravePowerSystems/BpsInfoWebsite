import React, { useState, useEffect } from 'react';
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
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        try {
            const response = await privateClientMethods.post('/upload', formDataObj);
            if (response && response.url) {
                // The backend now returns full URLs, so use directly
                setFormData(prev => ({ ...prev, imageUrl: response.url }));
            } else {
                alert('Image upload failed');
            }
        } catch (err) {
            alert('Image upload error');
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
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="imageUpload">Product Image</label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {formData.imageUrl && (
                                    <div className="image-preview">
                                        <img src={formData.imageUrl} alt="Product Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {currentTab === 'specs' && (
                        <div className="form-section">
                            <h3>Product Specifications</h3>
                            <p className="help-text">Add technical specifications for this product.</p>
                            
                            {formData.specifications.map((spec, index) => (
                                <div key={index} className="spec-row">
                                    <div className="spec-inputs">
                                        <input 
                                            type="text" 
                                            value={spec.name} 
                                            onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                                            placeholder="Specification name"
                                        />
                                        <input 
                                            type="text" 
                                            value={spec.value} 
                                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                            placeholder="Specification value"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        className="remove-btn"
                                        onClick={() => removeSpecification(index)}
                                    >
                                        ×
                                    </button>
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



