"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Truck, ShieldCheck, Leaf } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useState, useEffect } from "react";

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
    const [productData, setProductData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("");
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        fetch(`/api/products/${params.slug}`)
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
    }, [params.slug]);

    const handleAddToCart = () => {
        if (!productData) return;
        addItem({
            id: productData._id,
            name: productData.name,
            price: productData.price,
            image: productData.images?.[0] || "/honey.jpg",
            quantity,
            size: size || "Standard"
        });

        alert(`${quantity}x ${productData.name} added to cart.`);
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
                        <Image
                            src={productData.images && productData.images.length > 0 ? productData.images[0] : "/honey.jpg"}
                            alt={productData.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            {productData.badge && (
                                <span className="bg-honey-gold text-forest-green text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                    {productData.badge}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest-green mb-4 leading-tight">
                            {productData.name}
                        </h1>

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
                    <div className="py-8 font-light text-gray-600 leading-relaxed max-w-3xl">
                        <p className="mb-4">
                            Our honeys are completely unpasteurized, ensuring all naturally occurring enzymes, vitamins, and minerals are intact. Because our honey is raw, it may crystallize over time—a natural guarantee of its purity.
                        </p>
                        <p>
                            To soften, gently place the jar in warm water. Do not microwave. Store at room temperature away from direct sunlight. Not suitable for infants under 12 months.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
