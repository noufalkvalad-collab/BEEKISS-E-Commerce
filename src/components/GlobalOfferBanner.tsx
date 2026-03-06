"use client";

import { useEffect, useState } from "react";
import { Tag, X } from "lucide-react";

export default function GlobalOfferBanner() {
    const [offer, setOffer] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const res = await fetch("/api/offers/active");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.offer) {
                        setOffer(data.offer);
                    }
                }
            } catch (error) {
                console.error("Failed to load global offer:", error);
            }
        };

        fetchOffer();
    }, []);

    if (!offer || !isVisible) return null;

    return (
        <div className="bg-honey-gold text-forest-green px-4 py-2.5 w-full flex justify-between items-center relative z-50">
            <div className="flex-1 flex justify-center items-center gap-2 text-sm font-semibold tracking-wide text-center">
                <Tag className="w-4 h-4 hidden sm:block" />
                <span>
                    {offer.title} - Get {offer.discountPercentage}% OFF! Use code:{" "}
                    <span className="font-bold bg-white/40 px-2 py-0.5 rounded ml-1 tracking-wider uppercase">
                        {offer.code}
                    </span>
                </span>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="text-forest-green/60 hover:text-forest-green transition-colors p-1"
                aria-label="Dismiss offer"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
