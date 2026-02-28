"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-[#0F2E1D] text-[#D4A017] font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#163b22] hover:shadow-lg transition-all duration-300 font-sans text-lg group border border-transparent hover:border-[#D4A017]/30"
        >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
        </button>
    );
}
