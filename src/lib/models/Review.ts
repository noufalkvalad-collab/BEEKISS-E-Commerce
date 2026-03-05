import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    userEmail: string;
    userName: string;
    rating: number; // 1 to 5
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Review must belong to a product"],
            index: true
        },
        userEmail: {
            type: String,
            required: [true, "User email is required"],
            index: true
        },
        userName: {
            type: String,
            required: [true, "User name is required"]
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"]
        },
        comment: {
            type: String,
            required: [true, "Comment is required"],
            trim: true,
            minlength: [2, "Comment must be at least 2 characters long"],
            maxlength: [1000, "Comment cannot exceed 1000 characters"]
        }
    },
    {
        timestamps: true,
    }
);

// Optimize query routing: looking up a product's reviews quickly
ReviewSchema.index({ product: 1, createdAt: -1 });

// Ensure a user can only review a specific product once
ReviewSchema.index({ product: 1, userEmail: 1 }, { unique: true });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
