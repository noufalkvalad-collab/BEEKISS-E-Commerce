import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    try {
        await dbConnect();

        // Find product by slug
        const product = await Product.findOne({ slug: params.slug, isActive: true }).populate("category", "name slug");

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}
