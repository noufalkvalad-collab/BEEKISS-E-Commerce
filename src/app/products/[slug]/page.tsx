"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star, Truck, ShieldCheck, Leaf } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useState } from "react";

// Mock data
const productData = {
    id: "wildflower-reserve",
    name: "Wildflower Reserve",
    slug: "wildflower-reserve",
    price: 1299,
    description: "Our signature Wildflower Reserve is harvested from the untouched meadows of the high forests. This rare, slow-crystallizing honey offers a delicate floral bouquet with subtle notes of vanilla and warm spice. Unpasteurized, unfiltered, and 100% organic.",
    category: "Raw Honey",
    stock: 124,
    image: "/honey.jpg",
    badges: ["Bestseller", "Organic"]
};

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("500g");
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        // Price variation logic could go here based on size
        const adjustedPrice = size === "250g" ? 799 : size === "1kg" ? 2399 : productData.price;

        addItem({
            id: productData.id,
            name: productData.name,
            price: adjustedPrice,
            image: productData.image,
            quantity,
            size
        });

        // Optional: add a toast notification
        alert(`${quantity}x ${productData.name} (${size}) added to cart.`);
    };

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
                            src={productData.image}
                            alt={productData.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            {productData.badges.map(badge => (
                                <span key={badge} className="bg-honey-gold text-forest-green text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                    {badge}
                                </span>
                            ))}
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

                        <p className="text-3xl font-medium text-forest-green mb-8">
                            ₹{(size === "250g" ? 799 : size === "1kg" ? 2399 : productData.price).toLocaleString('en-IN')}
                        </p>

                        <p className="text-gray-600 font-light leading-relaxed mb-8">
                            {productData.description}
                        </p>

                        {/* Weight Options */}
                        <div className="mb-8">
                            <h3 className="font-medium text-forest-green mb-3">Sizes Available</h3>
                            <div className="flex gap-4">
                                {["250g", "500g", "1kg"].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSize(s)}
                                        className={`px - 6 py - 2 border - 2 font - medium rounded transition - colors ${size === s
                                            ? "border-honey-gold text-forest-green"
                                            : "border-gray-200 text-gray-500 hover:border-honey-gold hover:text-forest-green"
                                            } `}
                                    >
                                        {s}
                                    </button>
                                ))}
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
