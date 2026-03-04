"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProductCardActions({ product, className = "" }: { product: any, className?: string }) {
    const { status } = useSession();
    const router = useRouter();
    const addItemToCart = useCartStore((state) => state.addItem);
    const { hasItem, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isWishlisted = mounted ? hasItem(product.id) : false;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation wrapping the card

        if (status === "unauthenticated") {
            router.push(`/login`);
            return;
        }

        if (product.hasVariants) {
            router.push(`/products/${product.slug}`);
            return;
        }

        addItemToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "/honey.jpg",
            quantity: 1,
            size: "Standard"
        });
        toast.success(`1x ${product.name} added to cart.`);
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation wrapping the card

        if (status === "unauthenticated") {
            router.push(`/login`);
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (isWishlisted) {
                await fetch(`/api/user/wishlist?productId=${product.id}`, { method: "DELETE" });
                removeWishlist(product.id);
            } else {
                await fetch("/api/user/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id })
                });
                addWishlist(product.id);
            }
        } catch (error) {
            console.error("Wishlist toggle failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className={`flex flex-row gap-3 ${className}`}>
            <button
                onClick={toggleWishlist}
                disabled={isProcessing}
                className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md transition-colors ${isWishlisted ? "text-red-500 bg-red-50" : "text-gray-400 hover:text-red-500"}`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button
                onClick={handleAddToCart}
                className="w-10 h-10 rounded-full bg-forest-green text-white flex items-center justify-center shadow-md transition-colors hover:bg-forest-green/90"
                title="Add to cart"
            >
                <ShoppingBag className="w-5 h-5" />
            </button>
        </div>
    );
}
