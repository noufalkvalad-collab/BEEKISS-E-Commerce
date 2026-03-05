import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    image?: string;
}

export interface IOrder extends Document {
    userEmail: string;
    items: IOrderItem[];
    totalAmount: number;
    promoCode?: string;
    discountAmount?: number;
    cancellationReason?: string;
    address: {
        name: string;
        houseName: string;
        phone: string;
        pincode: string;
        district: string;
        state: string;
        landmark?: string;
    };
    paymentMethod: "COD" | "ONLINE";
    status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
    image: { type: String },
});

const OrderSchema = new Schema<IOrder>(
    {
        userEmail: {
            type: String,
            required: true,
            index: true,
        },
        items: [OrderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        promoCode: {
            type: String,
        },
        discountAmount: {
            type: Number,
            min: 0,
        },
        cancellationReason: {
            type: String,
        },
        address: {
            name: { type: String, required: true },
            houseName: { type: String, required: true },
            phone: { type: String, required: true },
            pincode: { type: String, required: true },
            district: { type: String, required: true },
            state: { type: String, required: true },
            landmark: { type: String },
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
