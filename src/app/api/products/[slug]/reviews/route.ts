import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";
import Review from "@/lib/models/Review";
import Order from "@/lib/models/Order";

export const dynamic = "force-dynamic";

// GET /api/products/[slug]/reviews - Fetch all reviews & basic eligibility state for current user
export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const resolvedParams = await params;
        const slug = resolvedParams.slug;
        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 }).lean();

        let averageRating = 0; // null dummy default
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0);
            averageRating = parseFloat((sum / reviews.length).toFixed(1));
        }

        // Check if current user is eligible to write a review (if authenticated)
        let isEligible = false;
        let hasReviewed = false;
        const session = await getServerSession(authOptions);

        if (session && session.user?.email) {
            // Did they already review?
            const existingReview = await Review.findOne({ product: product._id, userEmail: session.user.email });
            if (existingReview) {
                hasReviewed = true;
            } else {
                // Have they received this item?
                const deliveredOrder = await Order.findOne({
                    userEmail: session.user.email,
                    status: "Delivered",
                    "items.productId": product._id.toString()
                });
                if (deliveredOrder) {
                    isEligible = true;
                }
            }
        }

        return NextResponse.json({
            success: true,
            reviews,
            stats: {
                average: averageRating,
                count: reviews.length
            },
            userState: {
                isEligible,
                hasReviewed
            }
        });
    } catch (error: any) {
        console.error("Fetch reviews error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/products/[slug]/reviews - Submit a new review
export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const resolvedParams = await params;
        const slug = resolvedParams.slug;
        const product = await Product.findOne({ slug });

        if (!product) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }

        // Enforce Eligibility
        const deliveredOrder = await Order.findOne({
            userEmail: session.user.email,
            status: "Delivered",
            "items.productId": product._id.toString()
        });

        if (!deliveredOrder) {
            return NextResponse.json({ success: false, error: "You can only review products that have been delivered to you." }, { status: 403 });
        }

        // Enforce Unique Review 
        const existingReview = await Review.findOne({ product: product._id, userEmail: session.user.email });
        if (existingReview) {
            return NextResponse.json({ success: false, error: "You have already reviewed this product." }, { status: 400 });
        }

        const body = await request.json();
        const { rating, comment } = body;

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: "Invalid rating" }, { status: 400 });
        }

        if (!comment || comment.trim().length < 2) {
            return NextResponse.json({ success: false, error: "Comment too short" }, { status: 400 });
        }

        const newReview = await Review.create({
            product: product._id,
            userEmail: session.user.email,
            userName: session.user.name || "Customer",
            rating: Number(rating),
            comment: comment.trim()
        });

        return NextResponse.json({ success: true, review: newReview });

    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: "You have already reviewed this product." }, { status: 400 });
        }
        console.error("Create review error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
