import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import mongoose from "mongoose";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: "Invalid Order ID" }, { status: 400 });
        }

        const body = await request.json();
        const { reason } = body;

        await dbConnect();

        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
        }

        // Extremely important secure scope: Enforce that user can only mutate their OWN order ID!
        if (order.userEmail !== session.user.email) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // Enforce state logic: only allow cancellation if it hasn't been shipped!
        if (order.status === "Shipped" || order.status === "Delivered" || order.status === "Cancelled") {
            return NextResponse.json({ success: false, error: `Order cannot be cancelled in '${order.status}' status` }, { status: 400 });
        }

        order.status = "Cancelled";
        if (reason) order.cancellationReason = reason;

        await order.save();

        return NextResponse.json({ success: true, message: "Order successfully cancelled" });

    } catch (error: any) {
        console.error("Cancel order error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
