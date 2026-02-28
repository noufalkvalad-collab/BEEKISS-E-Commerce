import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        // Clear the token cookie
        response.cookies.set({
            name: 'token',
            value: '',
            httpOnly: true,
            expires: new Date(0), // Expire immediately
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Logout failed', error: error.message },
            { status: 500 }
        );
    }
}
