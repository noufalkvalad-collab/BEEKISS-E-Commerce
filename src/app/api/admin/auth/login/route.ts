import { NextResponse } from "next/server";
import { signAdminAccessToken, signAdminRefreshToken, ADMIN_ACCESS_TOKEN_AGE, ADMIN_REFRESH_TOKEN_AGE } from "@/lib/auth/adminJwt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ success: false, error: "Please provide both email and password" }, { status: 400 });
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Strict credential validation
        if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
            return NextResponse.json({ success: false, error: "Invalid admin credentials" }, { status: 401 });
        }

        // 1. Generate Access Token (15 Min)
        const accessToken = await signAdminAccessToken(adminEmail);

        // 2. Generate Refresh Token (7 Days)
        const refreshToken = await signAdminRefreshToken(adminEmail);

        const response = NextResponse.json({
            success: true,
            message: "Admin authenticated successfully"
        }, { status: 200 });

        // HTTP-Only Cookie settings
        const isProduction = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax" as const,
            path: "/",
        };

        // Attach Access Token Cookie
        response.cookies.set("admin_access_token", accessToken, {
            ...cookieOptions,
            maxAge: ADMIN_ACCESS_TOKEN_AGE,
        });

        // Attach Refresh Token Cookie
        response.cookies.set("admin_refresh_token", refreshToken, {
            ...cookieOptions,
            maxAge: ADMIN_REFRESH_TOKEN_AGE,
        });

        return response;

    } catch (error: any) {
        console.error("Admin Login Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
