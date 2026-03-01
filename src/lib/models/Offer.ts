import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOffer extends Document {
    title: string;
    description?: string;
    discountPercentage: number;
    validUntil: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
    {
        title: {
            type: String,
            required: [true, "Offer title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        discountPercentage: {
            type: Number,
            required: [true, "Discount percentage is required"],
            min: [1, "Discount must be at least 1%"],
            max: [100, "Discount cannot exceed 100%"],
        },
        validUntil: {
            type: Date,
            required: [true, "Expiration date is required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Automatically sort offers to quickly query active ongoing deals
OfferSchema.index({ validUntil: 1, isActive: 1 });

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
