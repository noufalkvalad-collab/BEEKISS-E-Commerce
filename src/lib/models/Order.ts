import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
}

export interface IOrder extends Document {
    userEmail: string;
    items: IOrderItem[];
    totalAmount: number;
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
