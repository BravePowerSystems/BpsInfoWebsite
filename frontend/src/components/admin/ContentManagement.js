import React, { useState, useEffect, useMemo } from "react";
import { useModal } from "../../context/ModalContext";
import "../../scss/components/admin/ContentManagement.scss";
import ContentCard from "./ContentCard";
import Notify from "simple-notify";
import Loading from "../Loading";
import { ContentService } from "../../services/contentService";

function ContentManagement({ onShowContentForm, refreshTrigger }) {
    const { openConfirmationModal, closeConfirmationModal } = useModal();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState("All");

    // Content types only (no status filtering)
    const contentTypes = ["All", "blog", "case-study"];



    useEffect(() => {
        fetchContent();
    }, []);

    // Refresh content when refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger > 0) {
            console.log('Refresh trigger activated:', refreshTrigger);
            fetchContent();
        }
    }, [refreshTrigger]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            // Fetch all content including drafts for admin dashboard
            console.log('Fetching content with status: all');
            const data = await ContentService.getAllContent({ status: 'all' });
            console.log('Fetched content:', data);
            setContent(data);
        } catch (error) {
            console.error('Error fetching content:', error);
            new Notify({
                status: "error",
                title: "Error",
                text: "Failed to fetch content",
                effect: "fade",
                speed: 300,
                autoclose: true,
                autotimeout: 3000,
                position: "right top",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddContent = () => {
        onShowContentForm(null, { types: contentTypes });
    };

    const handleEditContent = (contentItem) => {
        onShowContentForm(contentItem, { types: contentTypes });
    };



    const handleDeleteContent = async (contentId) => {
        openConfirmationModal(
            "Delete Content",
            "Are you sure you want to delete this content?",
            async () => {
                try {
                    await ContentService.deleteContent(contentId);
                    // Remove from local state
                    setContent(prev => prev.filter(item => item._id !== contentId));
                    closeConfirmationModal();
                    new Notify({
                        status: "success",
                        title: "Success",
                        text: "Content deleted successfully",
                        effect: "fade",
                        speed: 300,
                        autoclose: true,
                        autotimeout: 3000,
                        position: "right top",
                    });
                } catch (error) {
                    console.error('Failed to delete content:', error);
                    new Notify({
                        status: "error",
                        title: "Error",
                        text: "Failed to delete content",
                        effect: "fade",
                        speed: 300,
                        autoclose: true,
                        autotimeout: 3000,
                        position: "right top",
                    });
                }
            },
            () => {
                closeConfirmationModal();
            }
        );
    };

    // Filter content based on selected type only
    const filteredContent = useMemo(() => {
        return content.filter(item => {
            return selectedType === "All" || item.type === selectedType;
        });
    }, [content, selectedType]);

    return (
        <div className="content-management">
            <div className="content-management-header">
                <h2>Content Management</h2>
                <div className="content-controls">
                    <button 
                        id="add-content-button"
                        className="add-content-btn" 
                        onClick={handleAddContent}
                    >
                        Add New Content
                    </button>
                </div>
            </div>

            <div className="content-type-tabs">
                <button 
                    className={`content-type-tab ${selectedType === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedType('All')}
                >
                    All Content
                </button>
                {contentTypes.filter(type => type !== 'All').map(type => (
                    <button 
                        key={type}
                        className={`content-type-tab ${selectedType === type ? 'active' : ''}`}
                        onClick={() => setSelectedType(type)}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loading text="Loading content..." />
            ) : (
                <div className="content-grid">
                    {filteredContent.map((contentItem) => (
                        <ContentCard
                            key={contentItem._id}
                            content={contentItem}
                            onEdit={() => handleEditContent(contentItem)}
                            onDelete={() => handleDeleteContent(contentItem._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ContentManagement;
