import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Offer from "@/lib/models/Offer";
import Category from "@/lib/models/Category"; // Ensure registered for populate
import Product from "@/lib/models/Product"; // Ensure registered for populate
import { verifyAdminToken } from "@/lib/auth/adminJwt";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

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
        const offers = await Offer.find()
            .populate('applicableCategories', 'name')
            .populate('applicableProducts', 'name')
            .sort({ isActive: -1, validUntil: 1 });

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
        if (!body.title || !body.discountPercentage || !body.validUntil || !body.code || !body.type) {
            return NextResponse.json({ error: "Title, Code, Type, Discount Percentage, and Expiration Date are required" }, { status: 400 });
        }

        const newOffer = await Offer.create({
            title: body.title,
            description: body.description,
            code: body.code.toUpperCase(),
            type: body.type,
            discountPercentage: Number(body.discountPercentage),
            applicableCategories: body.applicableCategories || [],
            applicableProducts: body.applicableProducts || [],
            validUntil: new Date(body.validUntil),
            isActive: body.isActive ?? true,
        });

        // Auto-disable lesser global offers if a new active global offer is created
        if (newOffer.type === 'GLOBAL' && newOffer.isActive) {
            await Offer.updateMany(
                {
                    _id: { $ne: newOffer._id },
                    type: 'GLOBAL',
                    isActive: true,
                    discountPercentage: { $lt: newOffer.discountPercentage }
                },
                { $set: { isActive: false } }
            );
        }

        return NextResponse.json(newOffer, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "An offer with this code already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
    }
}
