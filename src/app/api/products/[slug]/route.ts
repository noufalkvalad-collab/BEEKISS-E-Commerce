import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        await dbConnect();

        // Find product by slug
        const product = await Product.findOne({ slug, isActive: true }).populate("category", "name slug");

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}
