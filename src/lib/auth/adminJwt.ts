import { SignJWT, jwtVerify } from "jose";

const getJwtSecret = () => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error("NEXTAUTH_SECRET is not set in environment variables");
    }
    return new TextEncoder().encode(secret);
};

const getJwtRefreshSecret = () => {
    const secret = process.env.ADMIN_REFRESH_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error("ADMIN_REFRESH_SECRET is not set in environment variables");
    }
    return new TextEncoder().encode(secret);
};

export const ADMIN_ACCESS_TOKEN_AGE = 15 * 60; // 15 Mins
export const ADMIN_REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60; // 7 Days

export interface AdminJwtPayload {
    email: string;
    role: "admin";
    type: "access" | "refresh";
}

/**
 * Generates an Access Token meant for authentication (short-lived)
 */
export async function signAdminAccessToken(email: string): Promise<string> {
    const payload: AdminJwtPayload = { email, role: "admin", type: "access" };
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${ADMIN_ACCESS_TOKEN_AGE}s`) // 15m
        .sign(getJwtSecret());
}

/**
 * Generates a Refresh Token meant for acquiring new Access Tokens (long-lived)
 */
export async function signAdminRefreshToken(email: string): Promise<string> {
    const payload: AdminJwtPayload = { email, role: "admin", type: "refresh" };
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${ADMIN_REFRESH_TOKEN_AGE}s`) // 7d
        .sign(getJwtRefreshSecret());
}

/**
 * Verifies any admin token against its specific secret
 */
export async function verifyAdminToken(token: string, type: "access" | "refresh" = "access"): Promise<AdminJwtPayload | null> {
    try {
        const secret = type === "access" ? getJwtSecret() : getJwtRefreshSecret();

        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });

        if (payload.role !== "admin" || !payload.email || payload.type !== type) {
            return null;
        }

        return payload as unknown as AdminJwtPayload;
    } catch (error) {
        return null;
    }
}
