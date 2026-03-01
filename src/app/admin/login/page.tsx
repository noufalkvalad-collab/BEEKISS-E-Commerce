"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Successfully set the High-Security HTTP-only cookies!
            router.push("/admin");
            router.refresh(); // Force Next.js to re-evaluate the middleware with new cookies

        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0F2E1D] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-gradient-to-r from-transparent to-white/5 blur-3xl transform rotate-12 pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[100%] rounded-full bg-gradient-to-l from-transparent to-[#D4A017]/10 blur-3xl transform -rotate-12 pointer-events-none"></div>

            <Link href="/" className="absolute top-8 left-8 text-white/70 hover:text-[#D4A017] flex items-center gap-2 transition-colors z-20 font-sans group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Store</span>
            </Link>

            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] max-w-md w-full text-center relative z-10 animate-[fadeInUp_0.8s_ease-out_forwards]">
                {/* Brand Logo Mini */}
                <div className="w-14 h-14 mx-auto relative mb-6">
                    <div className="absolute inset-0 bg-[#D4A017] rotate-45 rounded-sm shadow-md" />
                    <div className="absolute inset-0 flex items-center justify-center text-[#0F2E1D] font-bold font-serif text-2xl z-10">B</div>
                </div>

                <h1 className="text-4xl font-serif font-bold text-[#0F2E1D] mb-3">
                    Admin Portal
                </h1>

                <p className="text-gray-600 mb-8 font-sans leading-relaxed text-sm">
                    Access restricted. Secure login required.
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

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 font-sans">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0F2E1D] text-[#D4A017] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#163b22] hover:-translate-y-1 transition-all duration-300 font-sans text-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authenticate"}
                    </button>
                </form>

            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </main>
    );
}
