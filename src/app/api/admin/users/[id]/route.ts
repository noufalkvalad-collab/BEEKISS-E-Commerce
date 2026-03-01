import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { verifyAdminToken } from "@/lib/auth/adminJwt";
import { cookies } from "next/headers";

async function getAdminPayload() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_access_token")?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        // Ensure they aren't deleting an admin
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (userToDelete.role === "admin") {
            return NextResponse.json({ error: "Cannot delete admin accounts" }, { status: 403 });
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
