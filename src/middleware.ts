import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyAdminToken, ADMIN_ACCESS_TOKEN_AGE } from "@/lib/auth/adminJwt";

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // ==========================================
    // 1. ADMIN ROUTE PROTECTION (/admin/*)
    // ==========================================
    if (path.startsWith("/admin") && path !== "/admin/login") {
        const accessToken = req.cookies.get("admin_access_token")?.value;
        const refreshToken = req.cookies.get("admin_refresh_token")?.value;

        // Verify the 15-minute Access Token
        if (accessToken) {
            const payload = await verifyAdminToken(accessToken);
            if (payload && payload.type === "access") {
                return NextResponse.next(); // Valid! Let them through
            }
        }

        // Access Token missing/expired. Try Refresh Token
        if (refreshToken) {
            const refreshPayload = await verifyAdminToken(refreshToken, "refresh");

            if (refreshPayload && refreshPayload.type === "refresh") {
                // The refresh token is valid! Call our internal API to get a new Access Token
                const refreshRes = await fetch(new URL("/api/admin/auth/refresh", req.url), {
                    method: "POST",
                    headers: {
                        Cookie: `admin_refresh_token=${refreshToken}`
                    }
                });

                if (refreshRes.ok) {
                    // It securely generated a new Access Token cookie. Apply it to the request so it persists through
                    const response = NextResponse.next();
                    const newCookies = refreshRes.headers.get("set-cookie");

                    if (newCookies) {
                        // Extract the new access token value from the Set-Cookie header
                        const match = newCookies.match(/admin_access_token=([^;]+)/);
                        if (match) {
                            const isProduction = process.env.NODE_ENV === "production";
                            response.cookies.set("admin_access_token", match[1], {
                                httpOnly: true,
                                secure: isProduction,
                                sameSite: "lax",
                                path: "/",
                                maxAge: ADMIN_ACCESS_TOKEN_AGE,
                            });
                        }
                    }
                    return response;
                }
            }
        }

        // If neither token is valid, redirect to Admin Login
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // ==========================================
    // 2. CUSTOMER ROUTE PROTECTION (/checkout)
    // ==========================================
    if (path.startsWith("/checkout") || path.startsWith("/api/checkout")) {
        // NextAuth's internal way of checking the session cookie during edge middleware
        const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!sessionToken) {
            return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(path), req.url));
        }
    }

    // Allow all other requests
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/admin", "/checkout", "/api/checkout"],
};
