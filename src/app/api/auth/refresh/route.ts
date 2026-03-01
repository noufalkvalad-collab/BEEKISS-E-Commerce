import { NextResponse } from "next/server";
import { signAccessToken, verifyToken, USER_ACCESS_TOKEN_AGE } from "@/lib/auth/jwt";

export async function POST(request: Request) {
    try {
        const refreshTokenCookie = request.headers.get("cookie")
            ?.split("; ")
            .find(row => row.startsWith("refresh_token="))
            ?.split("=")[1];

        if (!refreshTokenCookie) {
            return NextResponse.json({ success: false, error: "No refresh token provided" }, { status: 401 });
        }

        // Validate the remote Refresh Token
        const payload = verifyToken(refreshTokenCookie, "refresh");

        // Ensure its a genuine active Refresh Token
        if (!payload || payload.type !== "refresh") {
            return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 });
        }

        // Generate a new 15-minute Access Token
        const newAccessToken = signAccessToken({ id: payload.id, role: payload.role });

        const response = NextResponse.json({ success: true, message: "Access token refreshed" }, { status: 200 });

        const isProduction = process.env.NODE_ENV === "production";

        response.cookies.set("access_token", newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: USER_ACCESS_TOKEN_AGE,
        });

        return response;

    } catch (error) {
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
