import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
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

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                name: body.name,
                slug: body.slug,
                description: body.description,
                isActive: body.isActive,
            },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCategory);
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
