"use client";

import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await fetch("/api/admin/auth/logout", { method: "POST" });
            router.push("/admin/login");
            router.refresh(); // Force a fresh state locally
        } catch (error) {
            console.error("Failed to logout:", error);
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-[#0F2E1D] text-[#D4A017] font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#163b22] hover:shadow-lg transition-all duration-300 font-sans text-lg group border border-transparent hover:border-[#D4A017]/30 disabled:opacity-70"
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
            <span>Sign Out Admin</span>
        </button>
    );
}
