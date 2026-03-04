import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category"; // Ensure schema registration
import { applyActiveOffers } from "@/lib/utils/offerHelper";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const exclude = url.searchParams.get("exclude");

        const query: any = { isActive: true };
        if (exclude) {
            query.slug = { $ne: exclude };
        }

        // Fetch up to 4 recommended products
        const dbProductsBase = await Product.find(query).populate("category", "name slug").limit(4).lean();
        const dbProducts = await applyActiveOffers(dbProductsBase);

        const formattedProducts = dbProducts.map((p: any) => {
            let minPrice = p.price || 0;
            if (p.variants && p.variants.length > 0) {
                minPrice = Math.min(...p.variants.map((v: any) => v.price));
            }

            return {
                id: p._id.toString(),
                name: p.name,
                slug: p.slug,
                category: p.category?.name || "Uncategorized",
                price: minPrice,
                image: p.images && p.images.length > 0 ? p.images[0] : "/honey.jpg",
                badge: p.badge || null,
                hasVariants: p.variants && p.variants.length > 0,
                offer: p.offer || null
            };
        });

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("Failed to fetch recommended products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
