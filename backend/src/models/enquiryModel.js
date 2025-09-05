import mongoose from "mongoose";
const enquirySchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        company: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        enquiryType: {
            type: String,
            required: true,
            enum: ["general", "technical", "quote", "custom"],
        },
        productName: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["new", "in-progress", "completed"],
            default: "new",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Only required if user is logged in
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        responseMessage: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Enquiry", enquirySchema);
