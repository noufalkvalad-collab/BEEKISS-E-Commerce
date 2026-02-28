import { NextResponse } from 'next/server';

// In a real application, you would initialize Razorpay here:
// import Razorpay from 'razorpay';
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency = "INR" } = body;

        // Simulate creating a Razorpay order
        // In production:
        // const options = { amount: amount * 100, currency, receipt: "receipt_order_1" };
        // const order = await razorpay.orders.create(options);

        // Mock response for development
        const mockOrder = {
            id: `order_mock_${Math.floor(Math.random() * 1000000)}`,
            amount: amount * 100, // paise
            currency,
        };

        return NextResponse.json({ success: true, order: mockOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
