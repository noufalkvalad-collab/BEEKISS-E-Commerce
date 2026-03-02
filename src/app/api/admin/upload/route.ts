import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const { paramsToSign } = await request.json();

        // We only sign the payload on the server, ensuring secrets stay safe.
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET as string
        );

        return NextResponse.json({ signature });
    } catch (error: any) {
        console.error("Cloudinary Signature Error:", error);
        return NextResponse.json(
            { error: "Failed to sign Cloudinary request", details: error.message },
            { status: 500 }
        );
    }
}
