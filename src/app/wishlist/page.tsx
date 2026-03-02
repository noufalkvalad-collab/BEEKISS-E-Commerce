"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash2, Heart, ExternalLink } from "lucide-react";
import { useWishlistStore } from "@/lib/store/useWishlistStore";

export default function WishlistPage() {
    const { status } = useSession();
    const router = useRouter();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const removeWishlist = useWishlistStore((state) => state.removeItem);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/wishlist");
        }
    }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            fetchWishlist();
        }
    }, [status]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch("/api/user/wishlist", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setWishlist(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            await fetch(`/api/user/wishlist?productId=${productId}`, { method: "DELETE" });
            setWishlist(prev => prev.filter(item => item.id !== productId));
            removeWishlist(productId);
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    if (status === "loading" || isLoading) {
        return <div className="min-h-[70vh] flex items-center justify-center text-forest-green">Loading wishlist...</div>;
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] bg-background pt-24 pb-24 flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-forest-green mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">
                    You haven't saved any of our exquisite honeys to your wishlist yet.
                </p>
                <Link
                    href="/products"
                    className="bg-honey-gold text-forest-green font-semibold px-8 py-3 rounded hover:bg-honey-gold/90 transition-colors"
                >
                    Explore Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
                    <Heart className="w-8 h-8 text-honey-gold fill-honey-gold" />
                    <h1 className="text-4xl font-serif font-bold text-forest-green">Your Wishlist</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {wishlist.map((product) => (
                        <div key={product.id} className="group flex flex-col border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
                            <Link href={`/products/${product.slug}`} className="relative aspect-[4/5] mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mx-auto w-full">
                                <Image
                                    src={product.image || "/honey.jpg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.badge && (
                                    <span className="absolute top-4 left-4 bg-honey-gold text-forest-green text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10 shadow-md">
                                        {product.badge}
                                    </span>
                                )}
                            </Link>

                            <h3 className="text-lg font-serif font-semibold text-gray-900 group-hover:text-honey-gold transition-colors truncate">
                                {product.name}
                            </h3>
                            <p className="font-medium text-forest-green mt-1 mb-4">₹{product.price.toLocaleString('en-IN')}</p>

                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors rounded"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="flex-1 flex items-center justify-center gap-2 bg-forest-green text-white font-semibold py-2 rounded hover:bg-forest-green/90 transition-colors"
                                >
                                    View Product <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
