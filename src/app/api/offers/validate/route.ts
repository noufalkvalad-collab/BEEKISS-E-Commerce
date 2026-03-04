import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Offer from "@/lib/models/Offer";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category"; // Ensure registered

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { code, items } = body;

        if (!code) {
            return NextResponse.json({ success: false, error: "Offer code is required" }, { status: 400 });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
        }

        // 1. Find the offer
        const offer = await Offer.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!offer) {
            return NextResponse.json({ success: false, error: "Invalid or inactive promo code" }, { status: 404 });
        }

        if (new Date(offer.validUntil) < new Date()) {
            return NextResponse.json({ success: false, error: "This promo code has expired" }, { status: 400 });
        }

        // 2. Fetch full product details for validation
        const productIds = items.map((i: any) => i.id);
        const dbProducts = await Product.find({ _id: { $in: productIds } }).lean() as any[];

        // 3. Calculate discount
        let totalDiscount = 0;
        let applicableItemsFound = false;

        for (const item of items) {
            const product = dbProducts.find((p: any) => p._id.toString() === String(item.id));
            if (!product) continue;

            // Determine item price based on variant
            let itemPrice = product.price || 0;
            if (product.variants && product.variants.length > 0 && item.size) {
                const variant = product.variants.find((v: any) => v.weight === item.size);
                if (variant) itemPrice = variant.price;
            }

            const lineTotal = itemPrice * item.quantity;
            let isApplicable = false;

            if (offer.type === 'GLOBAL') {
                isApplicable = true;
            } else if (offer.type === 'CATEGORY') {
                isApplicable = offer.applicableCategories?.some(
                    (catId: any) => catId.toString() === product.category?.toString()
                ) || false;
            } else if (offer.type === 'PRODUCT') {
                isApplicable = offer.applicableProducts?.some(
                    (prodId: any) => prodId.toString() === product._id.toString()
                ) || false;
            }

            if (isApplicable) {
                applicableItemsFound = true;
                totalDiscount += lineTotal * (offer.discountPercentage / 100);
            }
        }

        if (!applicableItemsFound) {
            return NextResponse.json({
                success: false,
                error: "This promo code is not applicable to any items in your cart."
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            discountAmount: totalDiscount,
            discountPercentage: offer.discountPercentage,
            offerTitle: offer.title,
            code: offer.code
        });

    } catch (error: any) {
        console.error("Promo validation error:", error);
        return NextResponse.json({ success: false, error: "Failed to validate promo code" }, { status: 500 });
    }
}
