import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth/adminJwt';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("admin_access_token")?.value;

        if (!accessToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyAdminToken(accessToken);

        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();

        // Fetch all orders, sort by descending creation date (newest first)
        const orders = await Order.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
