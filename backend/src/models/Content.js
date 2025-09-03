import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        type: { 
            type: String, 
            required: true,
            enum: ['blog', 'case-study']
        },
        content: { type: String, required: true },
        excerpt: { type: String, required: true },
        author: { type: String, required: true },
        status: { 
            type: String, 
            required: true,
            enum: ['draft', 'published', 'archived'],
            default: 'draft'
        },
        featuredImage: { type: String },
        publishDate: { type: Date, default: Date.now },
        metaDescription: { type: String },
        slug: { type: String, required: true, unique: true },
        seoTitle: { type: String },
        viewCount: { type: Number, default: 0 },
        sections: [
            {
                title: { type: String, required: true },
                content: { type: String, required: true },
                type: { type: String, default: 'text' }
            }
        ],
        relatedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }]
    },
    {
        timestamps: true,
    }
);

// Create index for better search performance
contentSchema.index({ title: 'text', content: 'text', tags: 'text' });
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ slug: 1 });

export default mongoose.model("Content", contentSchema);
