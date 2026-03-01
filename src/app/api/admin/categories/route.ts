import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/models/Category";
import { verifyAdminToken } from "@/lib/auth/adminJwt";
import { cookies } from "next/headers";

// Authentication check wrapper
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

        // Fetch all categories, sorted by newest first
        const categories = await Category.find().sort({ createdAt: -1 });

        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        const body = await req.json();

        // Basic validation
        if (!body.name || !body.slug) {
            return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
        }

        const newCategory = await Category.create({
            name: body.name,
            slug: body.slug,
            description: body.description,
            isActive: body.isActive ?? true,
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
