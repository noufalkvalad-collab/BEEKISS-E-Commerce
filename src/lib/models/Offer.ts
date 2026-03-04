import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOffer extends Document {
    title: string;
    description?: string;
    code: string;
    type: 'GLOBAL' | 'CATEGORY' | 'PRODUCT';
    discountPercentage: number;
    applicableCategories?: mongoose.Types.ObjectId[];
    applicableProducts?: mongoose.Types.ObjectId[];
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
        code: {
            type: String,
            required: [true, "Offer code is required"],
            trim: true,
            unique: true,
            uppercase: true,
        },
        type: {
            type: String,
            enum: ['GLOBAL', 'CATEGORY', 'PRODUCT'],
            required: [true, "Offer type is required"],
            default: 'GLOBAL'
        },
        discountPercentage: {
            type: Number,
            required: [true, "Discount percentage is required"],
            min: [1, "Discount must be at least 1%"],
            max: [100, "Discount cannot exceed 100%"],
        },
        applicableCategories: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }],
        applicableProducts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
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
OfferSchema.index({ code: 1, validUntil: 1, isActive: 1 });

if (mongoose.models.Offer) {
    delete mongoose.models.Offer;
}

const Offer: Model<IOffer> = mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
