import Content from '../models/Content.js';

export class ContentService {
    // Get all content with optional filtering
    static async getAllContent(filters = {}) {
        try {
            let query = {};
            
            if (filters.type) {
                query.type = filters.type;
            }
            
            if (filters.status) {
                query.status = filters.status;
            }
            
            if (filters.author) {
                query.author = filters.author;
            }
            
            const content = await Content.find(query)
                .sort({ createdAt: -1 })
                .populate('relatedContent', 'title type');
                
            return content;
        } catch (error) {
            throw new Error(`Failed to fetch content: ${error.message}`);
        }
    }

    // Get content by ID
    static async getContentById(id) {
        try {
            const content = await Content.findById(id)
                .populate('relatedContent', 'title type');
            return content;
        } catch (error) {
            throw new Error(`Failed to fetch content: ${error.message}`);
        }
    }

    // Get content by slug
    static async getContentBySlug(slug) {
        try {
            const content = await Content.findOne({ slug })
                .populate('relatedContent', 'title type');
            return content;
        } catch (error) {
            throw new Error(`Failed to fetch content: ${error.message}`);
        }
    }

    // Get content by type
    static async getContentByType(type, status = 'published') {
        try {
            const content = await Content.find({ 
                type, 
                status 
            }).sort({ publishDate: -1 });
            return content;
        } catch (error) {
            throw new Error(`Failed to fetch content by type: ${error.message}`);
        }
    }

    // Get featured content
    static async getFeaturedContent(limit = 5) {
        try {
            const content = await Content.find({ 
                isFeatured: true, 
                status: 'published' 
            })
            .sort({ publishDate: -1 })
            .limit(limit);
            return content;
        } catch (error) {
            throw new Error(`Failed to fetch featured content: ${error.message}`);
        }
    }

    // Create new content
    static async createContent(contentData) {
        try {
            // Generate slug if not provided
            if (!contentData.slug) {
                contentData.slug = this.generateSlug(contentData.title);
            }
            
            const newContent = new Content(contentData);
            const savedContent = await newContent.save();
            return savedContent;
        } catch (error) {
            throw new Error(`Failed to create content: ${error.message}`);
        }
    }

    // Update content
    static async updateContent(id, updateData) {
        try {
            // Generate new slug if title changed
            if (updateData.title && !updateData.slug) {
                updateData.slug = this.generateSlug(updateData.title);
            }
            
            const updatedContent = await Content.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            return updatedContent;
        } catch (error) {
            throw new Error(`Failed to update content: ${error.message}`);
        }
    }

    // Delete content
    static async deleteContent(id) {
        try {
            const deletedContent = await Content.findByIdAndDelete(id);
            return deletedContent;
        } catch (error) {
            throw new Error(`Failed to delete content: ${error.message}`);
        }
    }

    // Increment view count
    static async incrementViewCount(id) {
        try {
            await Content.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
        } catch (error) {
            console.error('Failed to increment view count:', error);
        }
    }

    // Search content
    static async searchContent(searchTerm, filters = {}) {
        try {
            let query = {
                $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { content: { $regex: searchTerm, $options: 'i' } }
                ]
            };
            
            // Apply additional filters
            if (filters.type) query.type = filters.type;
            if (filters.status) query.status = filters.status;
            
            const content = await Content.find(query)
                .sort({ createdAt: -1 })
                .populate('relatedContent', 'title type');
                
            return content;
        } catch (error) {
            throw new Error(`Failed to search content: ${error.message}`);
        }
    }



    // Get content types
    static async getContentTypes() {
        try {
            const types = await Content.distinct('type');
            return types;
        } catch (error) {
            throw new Error(`Failed to fetch content types: ${error.message}`);
        }
    }

    // Generate URL-friendly slug
    static generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    // Get content statistics
    static async getContentStats() {
        try {
            const stats = await Content.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 },
                        published: {
                            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
                        },
                        draft: {
                            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
                        },
                        archived: {
                            $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
                        }
                    }
                }
            ]);
            return stats;
        } catch (error) {
            throw new Error(`Failed to fetch content statistics: ${error.message}`);
        }
    }
}
