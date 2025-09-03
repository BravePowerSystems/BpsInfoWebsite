import { ContentService } from '../services/contentService.js';

// Get all content with optional filtering
export const getAllContent = async (req, res) => {
    try {
        const filters = req.query;
        const content = await ContentService.getAllContent(filters);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Failed to fetch content' });
    }
};

// Get content by ID
export const getContentById = async (req, res) => {
    try {
        const content = await ContentService.getContentById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Failed to fetch content' });
    }
};

// Get content by slug
export const getContentBySlug = async (req, res) => {
    try {
        const content = await ContentService.getContentBySlug(req.params.slug);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        
        // Increment view count for published content
        if (content.status === 'published') {
            await ContentService.incrementViewCount(content._id);
        }
        
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content by slug:', error);
        res.status(500).json({ message: 'Failed to fetch content' });
    }
};

// Get content by type
export const getContentByType = async (req, res) => {
    try {
        const { type } = req.params;
        const { status } = req.query;
        const content = await ContentService.getContentByType(type, status);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content by type:', error);
        res.status(500).json({ message: 'Failed to fetch content by type' });
    }
};

// Get featured content
export const getFeaturedContent = async (req, res) => {
    try {
        const { limit } = req.query;
        const content = await ContentService.getFeaturedContent(parseInt(limit) || 5);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching featured content:', error);
        res.status(500).json({ message: 'Failed to fetch featured content' });
    }
};

// Search content
export const searchContent = async (req, res) => {
    try {
        const { q, type, status } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const filters = { type, status };
        const content = await ContentService.searchContent(q, filters);
        res.status(200).json(content);
    } catch (error) {
        console.error('Error searching content:', error);
        res.status(500).json({ message: 'Failed to search content' });
    }
};

// Create new content
export const createContent = async (req, res) => {
    try {
        const newContent = await ContentService.createContent(req.body);
        res.status(201).json(newContent);
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(400).json({ message: 'Failed to create content', error: error.message });
    }
};

// Update content
export const updateContent = async (req, res) => {
    try {
        const updatedContent = await ContentService.updateContent(req.params.id, req.body);
        
        if (!updatedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        
        res.status(200).json(updatedContent);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(400).json({ message: 'Failed to update content', error: error.message });
    }
};

// Delete content
export const deleteContent = async (req, res) => {
    try {
        const deletedContent = await ContentService.deleteContent(req.params.id);
        
        if (!deletedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        
        res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ message: 'Failed to delete content' });
    }
};


// Get content types
export const getContentTypes = async (req, res) => {
    try {
        const types = await ContentService.getContentTypes();
        res.status(200).json(types);
    } catch (error) {
        console.error('Error fetching content types:', error);
        res.status(500).json({ message: 'Failed to fetch content types' });
    }
};

// Get content statistics
export const getContentStats = async (req, res) => {
    try {
        const stats = await ContentService.getContentStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching content statistics:', error);
        res.status(500).json({ message: 'Failed to fetch content statistics' });
    }
};
