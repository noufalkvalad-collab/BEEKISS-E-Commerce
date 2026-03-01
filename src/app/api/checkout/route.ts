import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { products } from "@/lib/data/products";

// A secure server-side price lookup
function getProductPrice(productId: string | number): number {
    const product = products.find((p: any) => String(p.id) === String(productId));
    return product ? product.price : 0;
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, error: "Invalid cart data" }, { status: 400 });
        }

        await dbConnect();

        // 1. Recalculate total amount securely on the server
        let calculatedTotal = 0;
        const processedItems = items.map((item: any) => {
            if (!item.id || !item.quantity) throw new Error("Malformed item data");

            const serverPrice = getProductPrice(item.id);
            if (serverPrice === 0) throw new Error(`Product not found: ${item.id}`);

            const itemTotal = serverPrice * item.quantity;
            calculatedTotal += itemTotal;

            return {
                productId: String(item.id),
                name: item.name,
                price: serverPrice,
                quantity: item.quantity,
                size: item.size
            };
        });

        // 2. Create the order in MongoDB
        const newOrder = await Order.create({
            userEmail: session.user.email,
            items: processedItems,
            totalAmount: calculatedTotal,
            status: "Pending"
        });

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 400 }
        );
    }
}
