import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    slug: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    category: mongoose.Types.ObjectId; // Reference to Category
    images: string[];
    badge?: string; // e.g., "Bestseller", "New"
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Product slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        compareAtPrice: {
            type: Number,
            min: [0, "Compare at price cannot be negative"],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product must belong to a category"],
        },
        images: {
            type: [String], // Array of image URLs
            default: [],
        },
        badge: {
            type: String,
            trim: true,
        },
        stock: {
            type: Number,
            required: [true, "Product stock level is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
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

// Optimize query routing
ProductSchema.index({ category: 1 });
ProductSchema.index({ slug: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
