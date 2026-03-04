import mongoose, { Document, Model, Schema } from "mongoose";
import "./Category"; // Ensure Category schema is registered before Product population

export interface IProductVariant {
    weight: string; // e.g., "8g", "100g", "250g", "1Kg"
    price: number;
    stock: number;
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description?: string;
    category: mongoose.Types.ObjectId; // Reference to Category
    images: string[];
    badge?: string; // e.g., "Bestseller", "New"
    variants: IProductVariant[];
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
        variants: {
            type: [
                {
                    weight: { type: String, required: [true, "Variant weight is required"], trim: true },
                    price: { type: Number, required: [true, "Variant price is required"], min: [0, "Price cannot be negative"] },
                    stock: { type: Number, required: [true, "Variant stock is required"], min: [0, "Stock cannot be negative"], default: 0 }
                }
            ],
            validate: {
                validator: function (v: any[]) {
                    return v && v.length > 0;
                },
                message: "A product must have at least one variant."
            }
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

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
