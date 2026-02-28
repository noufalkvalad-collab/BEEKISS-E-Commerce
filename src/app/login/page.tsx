"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid admin credentials");
            setIsLoading(false);
        } else {
            router.push("/admin");
        }
    };

    if (!mounted) return null; // Prevent hydration mismatch before checking session

    // If user is already logged in, show a simple profile/logout view
    if (status === "authenticated" && session) {
        return (
            <main className="min-h-screen bg-[#0F2E1D] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="bg-white p-10 md:p-14 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 animate-[fadeIn_0.5s_ease-out_forwards]">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#D4A017] mb-6">
                        {session.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={96}
                                height={96}
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#0F2E1D] flex items-center justify-center text-[#D4A017] text-3xl font-serif">
                                {session.user?.name?.charAt(0) || "U"}
                            </div>
                        )}
                    </div>

                    <h2 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-2">
                        Welcome, {session.user?.name?.split(' ')[0] || "Guest"}
                    </h2>
                    <p className="text-gray-600 mb-8 font-sans">{session.user?.email}</p>

                    <button
                        onClick={() => signOut()}
                        className="w-full bg-[#0F2E1D] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#163b22] transition-colors duration-300 font-sans text-lg mb-4 group border border-transparent hover:border-[#D4A017]/30"
                    >
                        <LogOut className="w-5 h-5 text-[#D4A017] group-hover:scale-110 transition-transform" />
                        <span>Sign Out</span>
                    </button>

                    <div className="flex justify-between items-center px-4">
                        <Link
                            href="/"
                            className="text-[#D4A017] font-semibold hover:text-[#b88a10] hover:underline underline-offset-4 transition-colors font-sans"
                        >
                            Return Home
                        </Link>
                        {session.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                            <Link
                                href="/admin"
                                className="text-[#0F2E1D] font-semibold hover:text-black hover:underline underline-offset-4 transition-colors font-sans"
                            >
                                Admin Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        );
    }

    // Default Login View for unauthenticated users
    return (
        <main className="min-h-screen bg-[#0F2E1D] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-gradient-to-r from-transparent to-white/5 blur-3xl transform rotate-12 pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[100%] rounded-full bg-gradient-to-l from-transparent to-[#D4A017]/10 blur-3xl transform -rotate-12 pointer-events-none"></div>

            <Link href="/" className="absolute top-8 left-8 text-white/70 hover:text-[#D4A017] flex items-center gap-2 transition-colors z-20 font-sans group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
            </Link>

            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-w-md w-full text-center relative z-10 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
                {/* Brand Logo Mini */}
                <div className="w-14 h-14 mx-auto relative mb-6">
                    <div className="absolute inset-0 bg-[#D4A017] rotate-45 rounded-sm shadow-md" />
                    <div className="absolute inset-0 flex items-center justify-center text-[#0F2E1D] font-bold font-serif text-2xl z-10">B</div>
                </div>

                <h1 className="text-4xl font-serif font-bold text-[#0F2E1D] mb-3">
                    Welcome Back
                </h1>

                <p className="text-gray-600 mb-8 font-sans leading-relaxed text-sm">
                    Sign in to your Bee Kiss account or enter admin credentials.
                </p>

                <form onSubmit={handleAdminLogin} className="space-y-4 mb-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A017] font-sans text-[#0F2E1D]"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A017] font-sans text-[#0F2E1D]"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm font-sans">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0F2E1D] text-[#D4A017] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#163b22] hoverAndFocus:-translate-y-1 transition-all duration-300 font-sans text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in as Admin"}
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400 font-sans uppercase tracking-widest text-xs">Or</span>
                    </div>
                </div>

                <button
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="w-full bg-white border-2 border-gray-100 text-[#0F2E1D] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-4 hover:border-[#D4A017] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-sans text-lg group"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                </button>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-sans">
                        By signing in, you agree to our <br />
                        <Link href="/terms" className="text-[#D4A017] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#D4A017] hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </main>
    );
}
