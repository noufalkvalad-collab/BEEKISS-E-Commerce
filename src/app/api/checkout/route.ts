import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Offer from "@/lib/models/Offer";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { items, address, paymentMethod, promoCode } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, error: "Invalid cart data" }, { status: 400 });
        }

        if (!address || !address.name || !address.houseName || !address.phone || !address.pincode || !address.district || !address.state) {
            return NextResponse.json({ success: false, error: "Missing required address fields" }, { status: 400 });
        }

        if (!paymentMethod || !['COD', 'ONLINE'].includes(paymentMethod)) {
            return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 });
        }

        await dbConnect();
        const dbProducts = await Product.find({ isActive: true }).lean() as any[];

        // 1. Recalculate total amount securely on the server
        let calculatedTotal = 0;
        const processedItems = items.map((item: any) => {
            if (!item.id || !item.quantity) throw new Error("Malformed item data");

            const product = dbProducts.find((p: any) => p._id.toString() === String(item.id));
            if (!product) throw new Error(`Product not found: ${item.id}`);

            let serverPrice = product.price || 0;

            if (product.variants && product.variants.length > 0 && item.size) {
                const variant = product.variants.find((v: any) => v.weight === item.size);
                if (variant) {
                    serverPrice = variant.price;
                }
            } else if (item.size && product.unitQuantity && item.size !== product.unitQuantity) {
                // If it doesn't have variants array but has a unitQuantity, it must match
                // (This is primarily to catch mismatched legacy items smoothly, but we won't throw here for simplicity, just use base price or variant price if found)
            }

            if (serverPrice === 0) throw new Error(`Invalid or missing price for product: ${item.id}`);

            const itemTotal = serverPrice * item.quantity;
            calculatedTotal += itemTotal;

            return {
                productId: String(item.id),
                name: item.name,
                price: serverPrice,
                quantity: item.quantity,
                size: item.size,
                image: product.images && product.images.length > 0 ? product.images[0] : ""
            };
        });

        // 2. Validate and apply promo code securely
        let totalDiscount = 0;
        let appliedPromoCode = "";

        if (promoCode) {
            const offer = await Offer.findOne({
                code: promoCode.toUpperCase(),
                isActive: true
            });

            if (offer && new Date(offer.validUntil) >= new Date()) {
                if (offer.usedBy && offer.usedBy.includes(session.user.email)) {
                    return NextResponse.json({ success: false, error: "You have already used this promo code" }, { status: 400 });
                }

                let applicableItemsFound = false;

                for (const item of processedItems) {
                    const product = dbProducts.find((p: any) => p._id.toString() === item.productId);
                    if (!product) continue;

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
                        totalDiscount += (item.price * item.quantity) * (offer.discountPercentage / 100);
                    }
                }

                if (applicableItemsFound) {
                    appliedPromoCode = offer.code;
                }
            }
        }

        const finalTotalAmount = Math.max(0, calculatedTotal - totalDiscount);

        // 3. Create the order in MongoDB
        const newOrder = await Order.create({
            userEmail: session.user.email,
            items: processedItems,
            totalAmount: finalTotalAmount,
            promoCode: appliedPromoCode || undefined,
            discountAmount: totalDiscount > 0 ? totalDiscount : undefined,
            address: {
                name: address.name,
                houseName: address.houseName,
                phone: address.phone,
                pincode: address.pincode,
                district: address.district,
                state: address.state,
                landmark: address.landmark || ""
            },
            paymentMethod: paymentMethod,
            status: "Pending"
        });

        // 4. Record promo code usage
        if (appliedPromoCode) {
            await Offer.findOneAndUpdate(
                { code: appliedPromoCode },
                { $push: { usedBy: session.user.email } }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 400 }
        );
    }
}
