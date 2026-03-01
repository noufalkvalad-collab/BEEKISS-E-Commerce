import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { verifyAdminToken } from "@/lib/auth/adminJwt";
import { cookies } from "next/headers";

async function getAdminPayload() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
}

export async function GET() {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        // Fetch all products and populate the category name
        const products = await Product.find().populate("category", "name slug").sort({ createdAt: -1 });

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.slug || !body.price || !body.category) {
            return NextResponse.json({ error: "Name, Slug, Price, and Category are required" }, { status: 400 });
        }

        // Ensure category exists
        const categoryExists = await Category.findById(body.category);
        if (!categoryExists) {
            return NextResponse.json({ error: "Selected category does not exist" }, { status: 400 });
        }

        const newProduct = await Product.create({
            name: body.name,
            slug: body.slug,
            description: body.description,
            price: Number(body.price),
            compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
            category: body.category,
            images: body.images || [],
            badge: body.badge,
            stock: Number(body.stock || 0),
            isActive: body.isActive ?? true,
        });

        // Populate category before returning to match GET signature nicely
        await newProduct.populate("category", "name slug");

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
