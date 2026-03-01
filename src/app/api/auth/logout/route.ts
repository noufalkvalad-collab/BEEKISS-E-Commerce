import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        // Clear the token cookies
        const oldCookieTemplate = {
            httpOnly: true,
            expires: new Date(0), // Expire immediately
            path: '/',
        };

        response.cookies.set('access_token', '', oldCookieTemplate);
        response.cookies.set('refresh_token', '', oldCookieTemplate);

        return response;

    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Logout failed', error: error.message },
            { status: 500 }
        );
    }
}
