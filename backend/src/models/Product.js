import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        modelNumber: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        specifications: [
            {
                name: { type: String, required: true },
                value: { type: String, required: true },
            },
        ],
        applications: [String],
        downloads: [
            {
                name: { type: String, required: true },
                type: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
        imageUrl: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Product", productSchema);
