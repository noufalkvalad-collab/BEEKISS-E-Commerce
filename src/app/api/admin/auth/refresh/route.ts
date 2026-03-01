import { NextResponse } from "next/server";
import { signAdminAccessToken, verifyAdminToken, ADMIN_ACCESS_TOKEN_AGE, AdminJwtPayload } from "@/lib/auth/adminJwt";

export async function POST(request: Request) {
    try {
        const refreshTokenCookie = request.headers.get("cookie")
            ?.split("; ")
            .find(row => row.startsWith("admin_refresh_token="))
            ?.split("=")[1];

        if (!refreshTokenCookie) {
            return NextResponse.json({ success: false, error: "No refresh token provided" }, { status: 401 });
        }

        // Validate the remote Refresh Token
        const payload = await verifyAdminToken(refreshTokenCookie, "refresh");

        // Ensure its not an Access Token pretending to be a Refresh Token
        if (!payload || payload.type !== "refresh" || payload.role !== "admin") {
            return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 });
        }

        // Generate a new 15-minute Access Token
        const newAccessToken = await signAdminAccessToken(payload.email);

        const response = NextResponse.json({ success: true, message: "Access token refreshed" }, { status: 200 });

        const isProduction = process.env.NODE_ENV === "production";

        response.cookies.set("admin_access_token", newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: ADMIN_ACCESS_TOKEN_AGE,
        });

        return response;

    } catch (error) {
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
