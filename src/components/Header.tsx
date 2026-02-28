"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useEffect, useState } from "react";

export default function Header() {
    const totalItems = useCartStore((state) => state.totalItems());
    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-[#0F2E1D] shadow-lg border-b border-[#D4A017]/20 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Mobile menu toggle */}
                <button
                    suppressHydrationWarning
                    onClick={toggleMobileMenu}
                    className="md:hidden text-[#D4A017] hover:text-white transition-colors"
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group" suppressHydrationWarning>
                    <div className="w-10 h-10 relative">
                        <div className="absolute inset-0 bg-[#D4A017] rotate-45 rounded-sm group-hover:rotate-90 transition-transform duration-500 shadow-md" />
                        <div className="absolute inset-0 flex items-center justify-center text-[#0F2E1D] font-bold font-serif text-xl z-10">B</div>
                    </div>
                    <span className="text-2xl font-serif font-bold text-white tracking-wide">
                        Bee Kiss
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10 text-sm font-medium uppercase tracking-widest text-gray-300">
                    <Link href="/products" className="hover:text-[#D4A017] transition-colors">Shop</Link>
                    <Link href="/#story" className="hover:text-[#D4A017] transition-colors">Our Story</Link>
                    <Link href="/process" className="hover:text-[#D4A017] transition-colors">Process</Link>
                    <Link href="/contact" className="hover:text-[#D4A017] transition-colors">Contact</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <button className="text-[#D4A017] hover:text-white transition-colors hidden sm:block" suppressHydrationWarning>
                        <Search className="w-5 h-5" />
                    </button>
                    <Link href="/cart" className="text-[#D4A017] hover:text-white transition-colors relative flex items-center" suppressHydrationWarning>
                        <ShoppingBag className="w-6 h-6" />
                        {mounted && totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-[#0F2E1D] text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm border border-[#D4A017]" suppressHydrationWarning>
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-[#0F2E1D] border-b border-[#D4A017]/20 shadow-xl py-4 px-6 flex flex-col gap-6 text-center z-40">
                    <Link
                        href="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white text-lg font-serif font-medium hover:text-[#D4A017] transition-colors uppercase tracking-widest"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/#story"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white text-lg font-serif font-medium hover:text-[#D4A017] transition-colors uppercase tracking-widest"
                    >
                        Our Story
                    </Link>
                    <Link
                        href="/process"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white text-lg font-serif font-medium hover:text-[#D4A017] transition-colors uppercase tracking-widest"
                    >
                        Process
                    </Link>
                    <Link
                        href="/contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white text-lg font-serif font-medium hover:text-[#D4A017] transition-colors uppercase tracking-widest"
                    >
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
}
