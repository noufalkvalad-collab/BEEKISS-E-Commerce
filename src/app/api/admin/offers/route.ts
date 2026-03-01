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

export async function GET() {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        // Fetch all offers, active ones ending soonest first, then inactive ones
        const offers = await Offer.find().sort({ isActive: -1, validUntil: 1 });

        return NextResponse.json(offers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const payload = await getAdminPayload();
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        const body = await req.json();

        // Validate required fields
        if (!body.title || !body.discountPercentage || !body.validUntil) {
            return NextResponse.json({ error: "Title, Discount Percentage, and Expiration Date are required" }, { status: 400 });
        }

        const newOffer = await Offer.create({
            title: body.title,
            description: body.description,
            discountPercentage: Number(body.discountPercentage),
            validUntil: new Date(body.validUntil),
            isActive: body.isActive ?? true,
        });

        return NextResponse.json(newOffer, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
    }
}
