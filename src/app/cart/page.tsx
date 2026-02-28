"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/useCartStore";
import { Trash2, ChevronRight, Lock } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-[70vh] flex items-center justify-center">Loading cart...</div>;
    }

    const subtotal = totalPrice();
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Trash2 className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-forest-green mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">
                    Looks like you haven't added any premium honey to your cart yet.
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
        <div className="min-h-screen bg-background pt-16 pb-24">
            <div className="max-w-7xl mx-auto px-4">

                <div className="flex flex-col md:flex-row gap-12 mt-12">

                    {/* Cart Items Area */}
                    <div className="flex-1 border-gray-100">
                        <h1 className="text-3xl font-serif font-bold text-forest-green mb-8">Your Cart</h1>

                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 pb-6">

                                    {/* Item Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden relative flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <Link href={`/products/${item.id}`} className="text-lg font-serif font-semibold text-forest-green hover:text-honey-gold transition-colors block">
                                                    {item.name}
                                                </Link>
                                                {item.size && <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>}
                                            </div>
                                            <p className="font-semibold text-forest-green">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center border border-gray-300 rounded w-28 h-10">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 text-gray-500 hover:text-forest-green h-full"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={item.quantity}
                                                    readOnly
                                                    className="w-full h-full bg-transparent text-center focus:outline-none text-sm font-medium text-forest-green"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 text-gray-500 hover:text-forest-green h-full"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-sm flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Order Summary */}
                    <div className="w-full md:w-[380px] flex-shrink-0">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-serif font-bold text-forest-green mb-6 border-b border-gray-200 pb-4">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="font-medium text-green-600">Free</span>
                                    ) : (
                                        <span className="font-medium text-gray-900">₹{shipping.toLocaleString('en-IN')}</span>
                                    )}
                                </div>

                                {shipping > 0 && (
                                    <div className="text-xs text-honey-gold/80 italic text-right mt-1">
                                        Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for free shipping
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-forest-green">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-gray-500 text-right mt-1">Including GST</p>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full py-4 bg-forest-green text-white font-semibold rounded flex items-center justify-center gap-2 hover:bg-forest-green/90 transition-colors"
                            >
                                Proceed to Checkout <ChevronRight className="w-5 h-5" />
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Lock className="w-3 h-3" /> Secure SSL Checkout
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
