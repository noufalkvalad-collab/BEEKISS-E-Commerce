import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Review from "@/lib/models/Review";

// PUT /api/products/[slug]/reviews/[reviewId] - Edit an existing review
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ slug: string, reviewId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const resolvedParams = await params;
        const reviewId = resolvedParams.reviewId;

        const review = await Review.findById(reviewId);
        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        // Strict ownership check (Admins cannot physically edit text on behalf of users, only delete)
        if (review.userEmail !== session.user.email) {
            return NextResponse.json({ success: false, error: "Forbidden: You cannot edit someone else's review" }, { status: 403 });
        }

        const body = await request.json();
        const { rating, comment } = body;

        if (rating && (rating < 1 || rating > 5)) {
            return NextResponse.json({ success: false, error: "Invalid rating" }, { status: 400 });
        }

        if (comment && comment.trim().length < 2) {
            return NextResponse.json({ success: false, error: "Comment too short" }, { status: 400 });
        }

        if (rating) review.rating = Number(rating);
        if (comment) review.comment = comment.trim();

        await review.save();

        return NextResponse.json({ success: true, review });

    } catch (error: any) {
        console.error("Update review error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/products/[slug]/reviews/[reviewId] - Delete a review
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string, reviewId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const resolvedParams = await params;
        const reviewId = resolvedParams.reviewId;

        const review = await Review.findById(reviewId);
        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
        }

        // Ownership or Admin Check
        const isOwner = review.userEmail === session.user.email;
        const isAdmin = (session.user as any).role === "admin";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ success: false, error: "Forbidden: You do not have permission to delete this review" }, { status: 403 });
        }

        await review.deleteOne();

        return NextResponse.json({ success: true, message: "Review deleted successfully" });

    } catch (error: any) {
        console.error("Delete review error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
