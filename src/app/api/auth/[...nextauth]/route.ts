import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import dbConnect from "@/lib/db/mongodb"
import User from "@/lib/models/User"
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                try {
                    await dbConnect();

                    const userExists = await User.findOne({ email: user.email });

                    if (!userExists) {
                        await User.create({
                            name: user.name || "Google User",
                            email: user.email || "",
                            role: "user",
                            // No password since they use Google
                        });
                    }
                    return true;
                } catch (error) {
                    console.error("Error saving Google user to DB:", error);
                    return false;
                }
            }
            return true;
        }
    },
    pages: {
        signIn: '/login',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
