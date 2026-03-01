import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear the cookies by setting them with an expired date
        response.cookies.set("admin_access_token", "", { maxAge: 0, path: "/" });
        response.cookies.set("admin_refresh_token", "", { maxAge: 0, path: "/" });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
