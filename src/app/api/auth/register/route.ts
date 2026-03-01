import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide name, email, and password' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json(
                { message: 'User already exists with this email' },
                { status: 400 }
            );
        }

        // Create new user (role defaults to 'user' in schema)
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate tokens
        const accessToken = signAccessToken({ id: user._id.toString(), role: user.role });
        const refreshToken = signRefreshToken({ id: user._id.toString(), role: user.role });

        const response = NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 201 }
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
            maxAge: 15 * 60, // 15 mins
        });

        response.cookies.set('refresh_token', refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Registration failed', error: error.message },
            { status: 500 }
        );
    }
}
