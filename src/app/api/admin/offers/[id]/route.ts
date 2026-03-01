import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Offer from "@/lib/models/Offer";
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

        const updatedOffer = await Offer.findByIdAndUpdate(
            id,
            {
                title: body.title,
                description: body.description,
                discountPercentage: body.discountPercentage !== undefined ? Number(body.discountPercentage) : undefined,
                validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
                isActive: body.isActive,
            },
            { new: true, runValidators: true }
        );

        if (!updatedOffer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        return NextResponse.json(updatedOffer);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await dbConnect();

        const deletedOffer = await Offer.findByIdAndDelete(id);

        if (!deletedOffer) {
            return NextResponse.json({ error: "Offer not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Offer deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
    }
}
