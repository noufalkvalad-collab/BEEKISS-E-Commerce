import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import { applyActiveOffers } from "@/lib/utils/offerHelper";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        await dbConnect();

        // Find product by slug
        const dbProduct = await Product.findOne({ slug, isActive: true }).populate("category", "name slug").lean();

        if (!dbProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const product = await applyActiveOffers(dbProduct);

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}
