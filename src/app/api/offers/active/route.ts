import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Offer from "@/lib/models/Offer";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // Find the best active global offer (highest discount percentage)
        // that hasn't expired yet
        const bestOffer = await Offer.findOne({
            type: 'GLOBAL',
            isActive: true,
            validUntil: { $gte: new Date() }
        }).sort({ discountPercentage: -1 });

        if (!bestOffer) {
            return NextResponse.json({ success: true, offer: null });
        }

        return NextResponse.json({
            success: true,
            offer: {
                title: bestOffer.title,
                code: bestOffer.code,
                discountPercentage: bestOffer.discountPercentage,
                validUntil: bestOffer.validUntil
            }
        });
    } catch (error) {
        console.error("Failed to fetch active global offer:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch offers" }, { status: 500 });
    }
}
