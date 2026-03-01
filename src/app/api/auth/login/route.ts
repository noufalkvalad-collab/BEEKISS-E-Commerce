import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Find user and explicitly select password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate tokens
        const accessToken = signAccessToken({ id: user._id.toString(), role: user.role });
        const refreshToken = signRefreshToken({ id: user._id.toString(), role: user.role });

        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 200 }
        );

        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax' as const,
            path: '/',
        };

        response.cookies.set('access_token', accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60, // 15 minutes
        });

        response.cookies.set('refresh_token', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Login failed', error: error.message },
            { status: 500 }
        );
    }
}
