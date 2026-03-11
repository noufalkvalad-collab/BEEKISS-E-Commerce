"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalOfferBanner from "@/components/GlobalOfferBanner";
import ChatBot from "@/components/ChatBot";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <GlobalOfferBanner />}
            {!isAdminRoute && <Header />}
            <main className="flex-1 w-full flex flex-col">
                {children}
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <ChatBot />}
        </>
    );
}
