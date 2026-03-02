"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Truck, ShieldCheck, Leaf, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useWishlistStore } from "@/lib/store/useWishlistStore";
import ImageZoom from "@/components/ImageZoom";
import ProductCardActions from "@/components/ProductCardActions";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const [productData, setProductData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("");
    const [recommended, setRecommended] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const addItemToCart = useCartStore((state) => state.addItem);
    const { hasItem, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
    const isWishlisted = productData ? hasItem(productData._id) : false;
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/products/${slug}`)
            .then(res => res.json())
            .then(data => {
                setProductData(data);
                if (data.unitQuantity) {
                    setSize(data.unitQuantity);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch product:", err);
                setIsLoading(false);
            });

        fetch(`/api/products?exclude=${slug}`)
            .then(res => res.json())
            .then(data => setRecommended(Array.isArray(data) ? data : []))
            .catch(err => console.error("Failed to fetch recommended:", err));
    }, [slug, status]);

    const handleAddToCart = () => {
        if (!productData) return;

        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/products/${slug}`);
            return;
        }

        addItemToCart({
            id: productData._id,
            name: productData.name,
            price: productData.price,
            image: productData.images?.[0] || "/honey.jpg",
            quantity,
            size: size || "Standard"
        });

        alert(`${quantity}x ${productData.name} added to cart.`);
    };

    const toggleWishlist = async () => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/products/${slug}`);
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            if (isWishlisted) {
                await fetch(`/api/user/wishlist?productId=${productData._id}`, { method: "DELETE" });
                removeWishlist(productData._id);
            } else {
                await fetch("/api/user/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: productData._id })
                });
                addWishlist(productData._id);
            }
        } catch (error) {
            console.error("Wishlist toggle failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center pt-24 pb-24 text-forest-green">Loading product...</div>;
    }

    if (!productData || productData.error) {
        return <div className="min-h-screen flex items-center justify-center pt-24 pb-24 text-red-500">Product not found.</div>;
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4">

                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-400 mb-8 mt-4 font-light">
                    <Link href="/" className="hover:text-honey-gold transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <Link href="/products" className="hover:text-honey-gold transition-colors">Products</Link>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="text-forest-green">{productData.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                    {/* Product Image */}
                    <div className="relative aspect-square md:aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
                        <ImageZoom
                            src={productData.images && productData.images.length > 0 ? productData.images[0] : "/honey.jpg"}
                            alt={productData.name}
                            className="w-full h-full"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            {productData.badge && (
                                <span className="bg-honey-gold text-forest-green text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-10">
                                    {productData.badge}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col relative">
                        <div className="flex justify-between items-start gap-4">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-4 leading-tight">
                                {productData.name}
                            </h1>
                            <button
                                onClick={toggleWishlist}
                                className={`p-3 rounded-full border transition-colors ${isWishlisted
                                    ? "bg-red-50 border-red-100 text-red-500"
                                    : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200"
                                    }`}
                                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-honey-gold">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm font-light">(128 reviews)</span>
                        </div>

                        <p className="text-3xl font-medium text-forest-green mb-8 flex items-baseline gap-4">
                            ₹{productData.price.toLocaleString('en-IN')}
                            {productData.compareAtPrice && (
                                <span className="text-lg text-gray-400 line-through">₹{productData.compareAtPrice.toLocaleString('en-IN')}</span>
                            )}
                        </p>

                        <p className="text-gray-600 font-light leading-relaxed mb-8">
                            {productData.description || "No description available for this product."}
                        </p>

                        {/* Weight Options */}
                        <div className="mb-8">
                            <h3 className="font-medium text-forest-green mb-3">Sizes Available</h3>
                            <div className="flex gap-4">
                                {productData.unitQuantity ? (
                                    <span className="px-6 py-2 border-2 font-medium rounded transition-colors border-honey-gold text-forest-green">
                                        {productData.unitQuantity}
                                    </span>
                                ) : (
                                    <span className="px-6 py-2 border-2 font-medium rounded transition-colors border-honey-gold text-forest-green">
                                        Standard Size
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex gap-4 mb-10">
                            <div className="flex items-center border border-gray-300 rounded w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 text-gray-500 hover:text-forest-green transition-colors"
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-full bg-transparent text-center focus:outline-none font-medium text-forest-green"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 text-gray-500 hover:text-forest-green transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-forest-green text-white font-semibold rounded hover:bg-forest-green/90 transition-colors shadow-lg"
                            >
                                Add to Cart
                            </button>
                        </div>

                        {/* Value Props */}
                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-gray-600 font-light">
                                <Truck className="w-5 h-5 text-honey-gold" />
                                <span>Free shipping on orders over ₹999</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 font-light">
                                <Leaf className="w-5 h-5 text-honey-gold" />
                                <span>100% natural and sustainably sourced</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600 font-light">
                                <ShieldCheck className="w-5 h-5 text-honey-gold" />
                                <span>Secure payment and fast delivery</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Additional Info Tabs */}
                <div className="mt-24">
                    <div className="flex border-b border-gray-200 gap-8">
                        <button className="pb-4 font-semibold text-forest-green border-b-2 border-honey-gold">Description</button>
                        <button className="pb-4 font-medium text-gray-400 hover:text-forest-green transition-colors">Tasting Notes</button>
                        <button className="pb-4 font-medium text-gray-400 hover:text-forest-green transition-colors">Shipping & Returns</button>
                    </div>
                    <div className="py-8 font-light text-gray-600 leading-relaxed max-w-3xl whitespace-pre-wrap">
                        {productData.description || "No detailed description is available for this product yet. It remains a mystery of the hive!"}
                    </div>
                </div>

                {/* Recommended Products */}
                {recommended.length > 0 && (
                    <div className="mt-32">
                        <h2 className="text-3xl font-serif font-bold text-forest-green mb-10 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommended.map((product) => (
                                <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col bg-white border border-gray-100 rounded-lg p-3 hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-[4/5] mb-4 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 z-20">
                                            <ProductCardActions product={product} />
                                        </div>
                                    </div>
                                    <h3 className="text-md font-serif font-semibold text-gray-900 group-hover:text-honey-gold transition-colors truncate">
                                        {product.name}
                                    </h3>
                                    <p className="font-medium text-forest-green mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Sticky Mobile Add To Cart Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-40 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 truncate max-w-[150px]">{productData.name}</span>
                    <span className="text-forest-green font-medium text-sm">₹{productData.price.toLocaleString('en-IN')}</span>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-forest-green text-white font-semibold py-3 px-6 rounded hover:bg-forest-green/90 transition-colors shadow-sm whitespace-nowrap text-center"
                >
                    Add to Cart
                </button>
            </div>

        </div>
    );
}
