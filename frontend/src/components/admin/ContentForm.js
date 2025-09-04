import React, { useState, useEffect } from 'react';
import CustomDropdown from '../CustomDropdown';
import '../../scss/components/admin/ContentForm.scss';
import { motion } from 'framer-motion';
import { ContentService } from '../../services/contentService';

function ContentForm({ content, options, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'blog',
        content: '',
        excerpt: '',
        author: '',
        status: 'draft',
        featuredImage: '',
        publishDate: '',
        metaDescription: '',
        slug: '',
        seoTitle: '',
        sections: []
    });
    
    const [currentTab, setCurrentTab] = useState('basic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const { types = [] } = options || {};
    
    // Define section templates for different content types
    const getSectionTemplate = (type) => {
        switch (type) {
            case 'blog':
                return [
                    { type: 'text', title: 'Introduction', content: '', image: '' },
                    { type: 'text', title: 'Main Content', content: '', image: '' },
                    { type: 'text', title: 'Conclusion', content: '', image: '' }
                ];
            case 'case-study':
                return [
                    { type: 'text', title: 'Background', content: '', image: '' },
                    { type: 'text', title: 'Challenge', content: '', image: '' },
                    { type: 'text', title: 'Solution', content: '', image: '' },
                    { type: 'text', title: 'Results', content: '', image: '' },
                    { type: 'text', title: 'Lessons Learned', content: '', image: '' }
                ];
            default:
                return [];
        }
    };
    
    useEffect(() => {
        if (content) {
            setFormData({
                ...content,
                publishDate: content.publishDate ? new Date(content.publishDate).toISOString().split('T')[0] : '',
                sections: content.sections?.length ? content.sections : getSectionTemplate(content.type)
            });
        } else {
            // Initialize with default sections for the selected type
            setFormData(prev => ({
                ...prev,
                sections: getSectionTemplate(prev.type)
            }));
        }
    }, [content]);
    
    // Focus trap for accessibility
    useEffect(() => {
        const modal = document.querySelector(".content-form-content");
        if (modal) modal.focus();
    }, []);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...formData.sections];
        updatedSections[index] = {
            ...updatedSections[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            sections: updatedSections
        }));
    };
    
    const handleTypeChange = (newType) => {
        setFormData(prev => ({
            ...prev,
            type: newType,
            sections: getSectionTemplate(newType)
        }));
    };
    
    // Add new section
    const addSection = () => {
        const newSection = {
            type: 'text',
            title: `Section ${formData.sections.length + 1}`,
            content: '',
            image: ''
        };
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
    };
    
    // Add section at specific position
    const addSectionAt = (index) => {
        const newSection = {
            type: 'text',
            title: `Section ${formData.sections.length + 1}`,
            content: '',
            image: ''
        };
        const updatedSections = [...formData.sections];
        updatedSections.splice(index + 1, 0, newSection);
        setFormData(prev => ({
            ...prev,
            sections: updatedSections
        }));
    };
    
    // Remove section
    const removeSection = (index) => {
        if (formData.sections.length > 1) { // Keep at least one section
            const updatedSections = formData.sections.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                sections: updatedSections
            }));
        }
    };
    
    // Move section up
    const moveSectionUp = (index) => {
        if (index > 0) {
            const updatedSections = [...formData.sections];
            [updatedSections[index], updatedSections[index - 1]] = [updatedSections[index - 1], updatedSections[index]];
            setFormData(prev => ({
                ...prev,
                sections: updatedSections
            }));
        }
    };
    
    // Move section down
    const moveSectionDown = (index) => {
        if (index < formData.sections.length - 1) {
            const updatedSections = [...formData.sections];
            [updatedSections[index], updatedSections[index + 1]] = [updatedSections[index + 1], updatedSections[index]];
            setFormData(prev => ({
                ...prev,
                sections: updatedSections
            }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const cleanedData = {
                ...formData,
                publishDate: formData.publishDate || new Date().toISOString()
            };
            
            await onSave(cleanedData);
        } catch (error) {
            console.error('Error saving content:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
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
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataObj
            });
            
            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, featuredImage: data.url }));
            } else {
                throw new Error('Image upload failed');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            alert('Image upload failed. Please try again.');
        } finally {
            setIsImageUploading(false);
        }
    };
    
    const generateSlug = () => {
        if (formData.title.trim()) {
            const slug = ContentService.generateSlug(formData.title);
            setFormData(prev => ({ ...prev, slug }));
        }
    };
    
    // Handle section image upload
    const handleSectionImageUpload = async (e, sectionIndex) => {
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
        
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataObj
            });
            
            if (response.ok) {
                const data = await response.json();
                handleSectionChange(sectionIndex, 'image', data.url);
            } else {
                throw new Error('Image upload failed');
            }
        } catch (err) {
            console.error('Section image upload error:', err);
            alert('Image upload failed. Please try again.');
        }
    };
    
    return (
        <motion.div 
            className="content-form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onCancel}
        >
            <motion.div 
                className="content-form-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <div className="content-form-header">
                    <h2>{content ? 'Edit Content' : 'Add New Content'}</h2>
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
                        className={currentTab === 'content' ? 'active' : ''} 
                        onClick={() => setCurrentTab('content')}
                    >
                        Content
                    </button>
                    <button 
                        className={currentTab === 'seo' ? 'active' : ''} 
                        onClick={() => setCurrentTab('seo')}
                    >
                        SEO & Settings
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="content-form">
                    {currentTab === 'basic' && (
                        <div className="tab-content basic-info-tab">
                            <div className="form-group">
                                <label htmlFor="title">Content Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter content title..."
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="type">Content Type *</label>
                                <CustomDropdown
                                    options={types.filter(t => t !== 'All').map(type => ({ value: type, label: type }))}
                                    value={formData.type}
                                    onChange={handleTypeChange}
                                    placeholder="Select content type..."
                                />
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="author">Author *</label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter author name..."
                                    />
                                </div>
                                
                            
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="excerpt">Excerpt *</label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="Enter a brief excerpt..."
                                    rows="3"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="featuredImage">Featured Image</label>
                                <input
                                    type="file"
                                    id="featuredImage"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isImageUploading}
                                />
                                {isImageUploading && (
                                    <div className="upload-status">
                                        <span>Uploading image...</span>
                                    </div>
                                )}
                                {formData.featuredImage && (
                                    <div className="image-preview">
                                        <img src={formData.featuredImage} alt="Featured Image Preview" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="publishDate">Publish Date</label>
                                <input
                                    type="date"
                                    id="publishDate"
                                    name="publishDate"
                                    value={formData.publishDate}
                                    onChange={handleChange}
                                />
                            </div>
                            

                        </div>
                    )}
                    
                    {currentTab === 'content' && (
                        <div className="tab-content content-tab">

                            <div className="form-group">
                                <label>Content Sections ({formData.sections.length})</label>
                                <div className="sections-container">
                                    {formData.sections.map((section, index) => (
                                        <div key={index} className="section-item">
                                            <div className="section-header">
                                                <input
                                                    type="text"
                                                    value={section.title}
                                                    onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                                    placeholder="Section title..."
                                                    className="section-title-input"
                                                />
                                                <div className="section-actions">
                                                    <button 
                                                        type="button" 
                                                        className="add-after-btn"
                                                        onClick={() => addSectionAt(index)}
                                                        title="Add Section After"
                                                    >
                                                        +
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="move-up-btn"
                                                        onClick={() => moveSectionUp(index)}
                                                        disabled={index === 0}
                                                        title="Move Up"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="move-down-btn"
                                                        onClick={() => moveSectionDown(index)}
                                                        disabled={index === formData.sections.length - 1}
                                                        title="Move Down"
                                                    >
                                                        ↓
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="remove-section-btn"
                                                        onClick={() => removeSection(index)}
                                                        disabled={formData.sections.length === 1}
                                                        title="Remove Section"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                                                                         <textarea
                                                 value={section.content}
                                                 onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                                 placeholder={`Enter ${section.title.toLowerCase()} content...`}
                                                 rows="6"
                                                 className="section-content-input"
                                                 maxLength={450}
                                             />
                                             <div className="char-counter">
                                                 <span className={
                                                     section.content.length >= 450 ? 'danger' : 
                                                     section.content.length > 400 ? 'warning' : 
                                                     section.content.length > 350 ? 'info' : ''
                                                 }>
                                                     {section.content.length}/450 characters
                                                 </span>
                                             </div>
                                             
                                             <div className="section-image-section">
                                                 <label className="section-image-label">Section Image</label>
                                                 <div className="section-image-input-group">
                                                     <input
                                                         type="file"
                                                         accept="image/*"
                                                         onChange={(e) => handleSectionImageUpload(e, index)}
                                                         className="section-image-input"
                                                         id={`section-image-${index}`}
                                                     />
                                                     <label 
                                                         htmlFor={`section-image-${index}`} 
                                                         className="section-image-upload-btn"
                                                     >
                                                         {section.image ? 'Change Image' : 'Upload Image'}
                                                     </label>
                                                     {section.image && (
                                                         <button
                                                             type="button"
                                                             className="remove-section-image-btn"
                                                             onClick={() => handleSectionChange(index, 'image', '')}
                                                             title="Remove Image"
                                                         >
                                                             ×
                                                         </button>
                                                     )}
                                                 </div>
                                                 {section.image && (
                                                     <div className="section-image-preview">
                                                         <img src={section.image} alt={`${section.title} image`} />
                                                     </div>
                                                 )}
                                             </div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    type="button" 
                                    className="add-section-btn"
                                    onClick={addSection}
                                >
                                    + Add New Section
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {currentTab === 'seo' && (
                        <div className="tab-content seo-tab">
                            <div className="form-group">
                                <label htmlFor="slug">URL Slug *</label>
                                <div className="slug-input-group">
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="Enter URL slug..."
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="generate-slug-btn"
                                        onClick={generateSlug}
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="seoTitle">SEO Title</label>
                                <input
                                    type="text"
                                    id="seoTitle"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleChange}
                                    placeholder="Enter SEO title..."
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="metaDescription">Meta Description</label>
                                <textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    placeholder="Enter meta description..."
                                    rows="3"
                                />
                            </div>
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
                            {isSubmitting ? 'Saving...' : (content ? 'Update Content' : 'Create Content')}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default ContentForm;
