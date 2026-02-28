import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (adminEmail && adminPassword && credentials.email === adminEmail && credentials.password === adminPassword) {
                    return { id: "admin-1", name: "Admin", email: adminEmail };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
