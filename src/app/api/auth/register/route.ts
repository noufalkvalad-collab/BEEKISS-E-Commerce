import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { signToken } from '@/lib/auth/jwt';

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

        // Generate token
        const token = signToken({ id: user._id.toString(), role: user.role });

        // Set token in HTTP-only cookie
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

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
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
