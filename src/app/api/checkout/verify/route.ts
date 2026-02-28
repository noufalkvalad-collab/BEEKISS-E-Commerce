import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        // In a real app, verify signature:
        // import crypto from 'crypto';
        // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
        // hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        // const expectedSignature = hmac.digest('hex');
        // if (expectedSignature !== razorpay_signature) throw new Error("Invalid signature");

        // Here we will mock successful verification

        // Typically you would also save the order status to your database here

        return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.error("Payment verification failed:", error);
        return NextResponse.json(
            { success: false, error: "Payment verification failed" },
            { status: 400 }
        );
    }
}
