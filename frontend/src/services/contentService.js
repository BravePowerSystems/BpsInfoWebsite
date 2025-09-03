import { privateClientMethods, publicClientMethods } from './apiClient';

export class ContentService {
    // Get all content with optional filtering
    static async getAllContent(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'All') {
                    queryParams.append(key, value);
                }
            });

            const response = await publicClientMethods.get(`/content?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching content:', error);
            throw error;
        }
    }

    // Get content by ID
    static async getContentById(id) {
        try {
            const response = await publicClientMethods.get(`/content/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching content by ID:', error);
            throw error;
        }
    }

    // Get content by slug
    static async getContentBySlug(slug) {
        try {
            const response = await publicClientMethods.get(`/content/slug/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching content by slug:', error);
            throw error;
        }
    }

    // Get content by type
    static async getContentByType(type, status = 'published') {
        try {
            const response = await publicClientMethods.get(`/content/type/${type}?status=${status}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching content by type:', error);
            throw error;
        }
    }

    // Get featured content
    static async getFeaturedContent(limit = 5) {
        try {
            const response = await publicClientMethods.get(`/content/featured?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching featured content:', error);
            throw error;
        }
    }

    // Search content
    static async searchContent(searchTerm, filters = {}) {
        try {
            const queryParams = new URLSearchParams({ q: searchTerm });
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'All') {
                    queryParams.append(key, value);
                }
            });

            const response = await publicClientMethods.get(`/content/search?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error searching content:', error);
            throw error;
        }
    }

    // Create new content
    static async createContent(contentData) {
        try {
            const response = await privateClientMethods.post('/content', contentData);
            return response.data;
        } catch (error) {
            console.error('Error creating content:', error);
            throw error;
        }
    }

    // Update content
    static async updateContent(id, contentData) {
        try {
            const response = await privateClientMethods.put(`/content/${id}`, contentData);
            return response.data;
        } catch (error) {
            console.error('Error updating content:', error);
            throw error;
        }
    }

    // Delete content
    static async deleteContent(id) {
        try {
            const response = await privateClientMethods.delete(`/content/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting content:', error);
            throw error;
        }
    }



    // Get content types
    static async getContentTypes() {
        try {
            const response = await publicClientMethods.get('/content/types');
            return response.data;
        } catch (error) {
            console.error('Error fetching content types:', error);
            throw error;
        }
    }

    // Get content statistics
    static async getContentStats() {
        try {
            const response = await privateClientMethods.get('/content/stats/overview');
            return response.data;
        } catch (error) {
            console.error('Error fetching content statistics:', error);
            throw error;
        }
    }

    // Generate slug from title
    static generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    // Validate content data
    static validateContent(contentData) {
        const errors = [];

        if (!contentData.title || contentData.title.trim().length === 0) {
            errors.push('Title is required');
        }

        if (!contentData.type || !['blog', 'case-study'].includes(contentData.type)) {
            errors.push('Valid content type is required');
        }



        if (!contentData.content || contentData.content.trim().length === 0) {
            errors.push('Content is required');
        }

        if (!contentData.excerpt || contentData.excerpt.trim().length === 0) {
            errors.push('Excerpt is required');
        }

        if (!contentData.author || contentData.author.trim().length === 0) {
            errors.push('Author is required');
        }

        if (!contentData.slug || contentData.slug.trim().length === 0) {
            errors.push('Slug is required');
        }

        return errors;
    }

    // Format content for display
    static formatContentForDisplay(content) {
        return {
            ...content,
            formattedDate: content.publishDate ? new Date(content.publishDate).toLocaleDateString() : 'Not published',
            formattedCreatedDate: new Date(content.createdAt).toLocaleDateString(),
            statusColor: this.getStatusColor(content.status),
            typeIcon: this.getTypeIcon(content.type),
            excerptPreview: content.excerpt.length > 100 ? content.excerpt.substring(0, 100) + '...' : content.excerpt
        };
    }

    // Get status color for UI
    static getStatusColor(status) {
        switch (status) {
            case 'published':
                return '#28a745';
            case 'draft':
                return '#ffc107';
            case 'archived':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    }

    // Get type icon for UI
    static getTypeIcon(type) {
        switch (type) {
            case 'blog':
                return '📝';
            case 'case-study':
                return '📊';
            default:
                return '📄';
        }
    }
}
