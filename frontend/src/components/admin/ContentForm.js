import React, { useState, useEffect } from 'react';
import CustomDropdown from '../CustomDropdown';
import '../../scss/components/admin/ContentForm.scss';
import { motion } from 'framer-motion';
import { privateClientMethods } from '../../services/apiClient';
import { ContentService } from '../../services/contentService';

function ContentForm({ content, options, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        type: 'blog',
        excerpt: '',
        author: '',
        status: 'draft',
        featuredImage: '',
        publishDate: '',
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
                title: content.title || '',
                type: content.type || 'blog',
                excerpt: content.excerpt || '',
                author: content.author || '',
                status: content.status || 'draft',
                featuredImage: content.featuredImage || '',
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
        
        // Auto-generate slug when title changes
        if (name === 'title') {
            const slug = ContentService.generateSlug(value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                slug: slug
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
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
            // Debug: Log form data to see what's being submitted
            console.log('Form data before validation:', formData);
            console.log('Title:', formData.title, 'Length:', formData.title?.length);
            console.log('Content:', formData.content, 'Length:', formData.content?.length);
            console.log('Excerpt:', formData.excerpt, 'Length:', formData.excerpt?.length);
            console.log('Author:', formData.author, 'Length:', formData.author?.length);
            
            // Basic validation
            if (!formData.title || !formData.title.trim()) {
                alert('Please enter a title');
                setIsSubmitting(false);
                return;
            }
            
            // Validate that we have at least one section with content
            const validSections = formData.sections.filter(section => 
                section.title && section.title.trim() && section.content && section.content.trim()
            );
            
            if (validSections.length === 0) {
                alert('Please add at least one content section with both title and content');
                setIsSubmitting(false);
                return;
            }
            
            if (!formData.excerpt || !formData.excerpt.trim()) {
                alert('Please enter an excerpt');
                setIsSubmitting(false);
                return;
            }
            
            if (!formData.author || !formData.author.trim()) {
                alert('Please enter an author');
                setIsSubmitting(false);
                return;
            }
            
            // Ensure slug is generated from title
            const slug = ContentService.generateSlug(formData.title);
            
            // Clean sections to ensure they have required fields
            const cleanedSections = formData.sections.filter(section => 
                section.title && section.title.trim() && section.content && section.content.trim()
            ).map(section => ({
                title: section.title.trim(),
                content: section.content.trim(),
                type: section.type || 'text',
                image: section.image || ''
            }));
            
            // Generate main content from sections
            const mainContent = cleanedSections.map(section => 
                `## ${section.title}\n\n${section.content}`
            ).join('\n\n');

            const cleanedData = {
                title: formData.title.trim(),
                type: formData.type,
                content: mainContent, // Generated from sections
                excerpt: formData.excerpt.trim(),
                author: formData.author.trim(),
                status: formData.status || 'draft',
                featuredImage: formData.featuredImage || '',
                publishDate: formData.publishDate || new Date().toISOString(),
                slug: slug,
                // Add required fields that might be missing
                metaDescription: formData.excerpt.trim() || '', // Use excerpt as meta description
                seoTitle: formData.title.trim() || '', // Use title as SEO title
                sections: cleanedSections
            };
            
            console.log('Submitting content data:', cleanedData);
            console.log('Sections count:', cleanedSections.length);
            console.log('Sections data:', cleanedSections);
            
            // Validate required fields one more time
            if (!cleanedData.title) {
                throw new Error('Title is required');
            }
            if (!cleanedData.type) {
                throw new Error('Content type is required');
            }
            if (!mainContent || mainContent.trim().length === 0) {
                throw new Error('Content is required');
            }
            if (!cleanedData.excerpt) {
                throw new Error('Excerpt is required');
            }
            if (!cleanedData.author) {
                throw new Error('Author is required');
            }
            if (!cleanedData.slug) {
                throw new Error('Slug is required');
            }
            
            await onSave(cleanedData);
        } catch (error) {
            console.error('Error saving content:', error);
            
            // Show more specific error messages
            let errorMessage = 'Unknown error occurred';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response && error.response.data) {
                errorMessage = error.response.data.message || error.response.data.error || 'Server error';
            }
            
            alert('Error saving content: ' + errorMessage);
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
            console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
            const response = await privateClientMethods.post('/upload', formDataObj);
            
            if (response && response.data && response.data.url) {
                // The backend now returns full URLs, so use directly
                setFormData(prev => ({ ...prev, featuredImage: response.data.url }));
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
        
        setIsImageUploading(true);
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        
        try {
            console.log('Uploading section image:', file.name, 'Size:', file.size, 'Type:', file.type);
            const response = await privateClientMethods.post('/upload', formDataObj);
            
            if (response && response.data && response.data.url) {
                // The backend now returns full URLs, so use directly
                handleSectionChange(sectionIndex, 'image', response.data.url);
                console.log('Section image uploaded successfully:', response.data.url);
            } else {
                console.error('Upload response missing URL:', response);
                alert('Image upload failed: Invalid response from server');
            }
        } catch (err) {
            console.error('Section image upload error:', err);
            
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
                                {formData.title && (
                                    <div className="slug-preview">
                                        <small>URL will be: <code>/{formData.type === 'case-study' ? 'case-studies' : 'blog'}/{ContentService.generateSlug(formData.title)}</code></small>
                                    </div>
                                )}
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
                                <label htmlFor="status">Status *</label>
                                <CustomDropdown
                                    options={[
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'published', label: 'Published' },
                                        { value: 'archived', label: 'Archived' }
                                    ]}
                                    value={formData.status}
                                    onChange={(status) => setFormData(prev => ({ ...prev, status }))}
                                    placeholder="Select status..."
                                />
                                <small className="help-text">
                                    <strong>Draft:</strong> Only visible in admin dashboard<br/>
                                    <strong>Published:</strong> Visible on public website<br/>
                                    <strong>Archived:</strong> Hidden from public view
                                </small>
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
