import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db/mongodb";
import User from "@/lib/models/User";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).lean();

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, addresses: user.addresses || [] });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await request.json();
        const { name, houseName, phone, pincode, district, state, landmark } = body;

        // Basic validation
        if (!name || !houseName || !phone || !pincode || !district || !state) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Add to user's addresses array
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $push: {
                    addresses: { name, houseName, phone, pincode, district, state, landmark }
                }
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Address added successfully",
            addresses: user.addresses
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
