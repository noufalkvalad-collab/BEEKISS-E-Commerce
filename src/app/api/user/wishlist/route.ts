export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product"; // Required for populate()

// Helper to get authenticated user from session securely
const getAuthUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    return user;
};

// GET: Fetch the user's populated wishlist
export async function GET() {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await user.populate({ path: "wishlist", model: Product, strictPopulate: false });

        // Format to match product UI
        const validWishlist = user.wishlist.filter((p: any) => p && typeof p === 'object' && p._id);

        const wishlistData = validWishlist.map((p: any) => {
            let minPrice = 0;
            if (p.variants && p.variants.length > 0) {
                minPrice = Math.min(...p.variants.map((v: any) => v.price));
            } else if (p.price) {
                minPrice = p.price;
            }

            return {
                id: p._id.toString(),
                name: p.name,
                slug: p.slug,
                price: minPrice,
                image: p.images && p.images.length > 0 ? p.images[0] : "/honey.jpg",
                badge: p.badge || null,
            };
        });

        return NextResponse.json(wishlistData);
    } catch (error) {
        console.error("Wishlist GET error:", error);
        return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
    }
}

// POST: Add a product to the wishlist
export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();
        if (!productId) return NextResponse.json({ error: "Product ID is missing" }, { status: 400 });

        // Add to wishlist uniquely
        if (!user.wishlist.some((id: any) => id.toString() === productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        return NextResponse.json({ success: true, message: "Added to wishlist" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
    }
}

// DELETE: Remove a product from the wishlist
export async function DELETE(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const productId = url.searchParams.get("productId");

        if (!productId) return NextResponse.json({ error: "Product ID is missing" }, { status: 400 });

        // Remove from wishlist safely
        user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
        await user.save();

        return NextResponse.json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
    }
}
