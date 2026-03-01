import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT_SECRET or JWT_REFRESH_SECRET is not set in environment variables');
}

export const USER_ACCESS_TOKEN_AGE = 15 * 60; // 15 Minutes (in seconds)
export const USER_REFRESH_TOKEN_AGE = 7 * 24 * 60 * 60; // 7 Days (in seconds)

export interface JwtPayload {
    id: string;
    role: string;
    type: "access" | "refresh";
}

export const signAccessToken = (payload: Omit<JwtPayload, 'type'>): string => {
    return jwt.sign({ ...payload, type: 'access' }, JWT_SECRET, {
        expiresIn: USER_ACCESS_TOKEN_AGE,
    });
};

export const signRefreshToken = (payload: Omit<JwtPayload, 'type'>): string => {
    return jwt.sign({ ...payload, type: 'refresh' }, JWT_REFRESH_SECRET, {
        expiresIn: USER_REFRESH_TOKEN_AGE,
    });
};

export const verifyToken = (token: string, type: "access" | "refresh" = "access"): JwtPayload | null => {
    try {
        const secret = type === "access" ? JWT_SECRET : JWT_REFRESH_SECRET;
        const decoded = jwt.verify(token, secret) as JwtPayload;

        if (!decoded.id || !decoded.role || typeof decoded.type !== "string") {
            return null;
        }

        // Ensure the token type actually matches what we are verifying against
        if (decoded.type !== type) {
            return null;
        }

        return decoded;
    } catch (error) {
        return null; // Invalid token or expired
    }
};
