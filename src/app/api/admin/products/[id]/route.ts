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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        const body = await req.json();

        // If updating category, verify new category exists
        if (body.category) {
            const categoryExists = await Category.findById(body.category);
            if (!categoryExists) {
                return NextResponse.json({ error: "Selected category does not exist" }, { status: 400 });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price !== undefined ? Number(body.price) : undefined,
                compareAtPrice: body.compareAtPrice !== undefined ? Number(body.compareAtPrice) : undefined,
                category: body.category,
                images: body.images,
                badge: body.badge,
                stock: body.stock !== undefined ? Number(body.stock) : undefined,
                isActive: body.isActive,
            },
            { new: true, runValidators: true }
        ).populate("category", "name slug");

        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "A product with this slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
