import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth/adminJwt';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/lib/models/Order';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const cookieStore = await cookies();
        const accessToken = cookieStore.get("admin_access_token")?.value;

        if (!accessToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyAdminToken(accessToken);

        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: 'Invalid Order ID format' }, { status: 400 });
        }

        await dbConnect();

        const order = await Order.findById(id).lean();

        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
