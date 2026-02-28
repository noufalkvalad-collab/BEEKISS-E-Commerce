import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_beep_boop';
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
    id: string;
    role: string;
}

export const signToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
};
