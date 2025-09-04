import React from 'react';
import '../../scss/components/admin/ContentCard.scss';

function ContentCard({ content, onEdit, onDelete }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'status-published';
            case 'draft':
                return 'status-draft';
            case 'archived':
                return 'status-archived';
            default:
                return 'status-default';
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 50) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="admin-content-card">
            <div className="content-header">
               
                <div className="content-status">
                    <span className={`status-badge ${getStatusColor(content.status)}`}>
                        {content.status}
                    </span>
                </div>
            </div>
            
            <div className="content-image">
                {content.featuredImage ? (
                    <img src={content.featuredImage} alt={content.title} />
                ) : (
                    <div className="no-image-placeholder">
                        <span>📷</span>
                        <p>No Image</p>
                    </div>
                )}
            </div>
            
            <div className="content-info">
                <h3 className="content-title">{content.title}</h3>
                
                <div className="content-meta">
                    <p className="content-type">
                        <strong>Type:</strong> {content.type.replace('-', ' ')}
                    </p>
                    <p className="content-author">
                        <strong>Author:</strong> {content.author}
                    </p>
                    <p className="content-date">
                        <strong>Created:</strong> {formatDate(content.createdAt)}
                    </p>
                    {content.publishDate && (
                        <p className="content-publish-date">
                            <strong>Published:</strong> {formatDate(content.publishDate)}
                        </p>
                    )}
                </div>
                
                <div className="content-excerpt">
                    <strong>Excerpt:</strong> {truncateText(content.excerpt, 50)}
                </div>
                
            </div>
            
            <div className="content-actions">
                <button className="edit-btn" onClick={onEdit}>
                    Edit Content
                </button>
                <button className="delete-btn" onClick={onDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ContentCard;
