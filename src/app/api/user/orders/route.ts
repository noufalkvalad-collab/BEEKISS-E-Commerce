import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch descending by default so newest are at the top
        const orders = await Order.find({ userEmail: session.user.email }).sort({ createdAt: -1 }).lean();

        // Legacy compat: populate any potentially missing images using our standard Product logic
        const needsPopulation = orders.some((ord: any) => ord.items.some((item: any) => !item.image));

        if (needsPopulation) {
            const productIds = new Set();
            orders.forEach((ord: any) => ord.items.forEach((item: any) => {
                if (!item.image) productIds.add(item.productId);
            }));

            if (productIds.size > 0) {
                const products = await Product.find({ _id: { $in: Array.from(productIds) as string[] } }).select("_id images").lean();

                orders.forEach((ord: any) => {
                    ord.items = ord.items.map((item: any) => {
                        if (!item.image) {
                            const pMatch = (products as any[]).find((p: any) => p._id.toString() === item.productId);
                            item.image = pMatch?.images?.[0] || "/honey.jpg";
                        }
                        return item;
                    });
                });
            }
        }

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        console.error("User orders fetch error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
