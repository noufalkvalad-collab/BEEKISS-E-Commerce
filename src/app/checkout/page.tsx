"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCartStore();

    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/checkout");
        }
    }, [status, router]);

    if (!mounted || status === "loading") {
        return (
            <div className="min-h-screen bg-[#FDFDF9] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#D4A017]" />
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-screen bg-[#FDFDF9] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8 font-sans">You need to add items to your cart before checking out.</p>
                <Link
                    href="/products"
                    className="bg-[#D4A017] text-[#0F2E1D] font-bold py-3 px-8 rounded-xl hover:bg-[#b88a10] transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const handleConfirmOrder = async () => {
        setIsProcessing(true);
        setError("");

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to process order.");
            }

            setSuccess(true);
            setOrderId(data.orderId);
            clearCart();

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#0F2E1D] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-gradient-to-r from-transparent to-white/5 blur-3xl transform rotate-12 pointer-events-none" />

                <div className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 animate-[fadeInUp_0.8s_ease-out_forwards]">
                    <div className="w-20 h-20 bg-[#D4A017]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-[#D4A017]" />
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-2 tracking-wide">
                        Order Confirmed
                    </h1>
                    <p className="text-gray-600 font-sans mb-8">
                        Thank you for your purchase. We are preparing your premium honey for shipment.
                    </p>

                    <div className="bg-[#FDFDF9] border border-[#0F2E1D]/5 rounded-xl p-4 mb-8 text-left">
                        <p className="text-xs text-gray-400 font-sans tracking-widest uppercase mb-1">Order ID</p>
                        <p className="font-mono text-sm text-[#0F2E1D] font-bold">{orderId}</p>
                    </div>

                    <Link
                        href="/products"
                        className="block w-full bg-[#0F2E1D] text-[#D4A017] font-bold py-4 rounded-xl hover:bg-[#163b22] hover:-translate-y-1 transition-all duration-300 font-sans text-lg"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FDFDF9] pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/cart" className="inline-flex items-center gap-2 text-[#0F2E1D]/60 hover:text-[#D4A017] font-semibold transition-colors mb-10 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Cart
                </Link>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F2E1D] mb-12 border-b border-[#0F2E1D]/10 pb-6">
                    Secure Checkout
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Left Column: Order Summary Info */}
                    <div className="md:col-span-7 space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#0F2E1D]/5">
                            <h2 className="text-2xl font-serif font-bold text-[#0F2E1D] mb-6">Contact Information</h2>
                            <div className="flex items-center gap-4">
                                {session?.user?.image && (
                                    <Image src={session.user.image} alt="User" width={48} height={48} className="rounded-full" />
                                )}
                                <div>
                                    <p className="font-bold text-[#0F2E1D]">{session?.user?.name}</p>
                                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#0F2E1D]/5 opacity-50 cursor-not-allowed">
                            <h2 className="text-2xl font-serif font-bold text-[#0F2E1D] mb-2 flex justify-between items-center">
                                Payment Method
                                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase font-sans tracking-widest">Coming Soon</span>
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">Online payments are currently disabled. This order will be processed securely using your internal account balance.</p>

                            <div className="border-2 border-[#D4A017] rounded-xl p-4 bg-[#D4A017]/5">
                                <p className="font-bold text-[#0F2E1D] flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#D4A017] inline-block"></span>
                                    Internal Billing
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary Card */}
                    <div className="md:col-span-5">
                        <div className="bg-[#0F2E1D] text-white p-8 md:p-10 rounded-3xl shadow-xl sticky top-32">
                            <h2 className="text-2xl font-serif font-bold mb-8 text-[#D4A017]">Order Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden relative shrink-0">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold font-serif text-sm line-clamp-2">{item.name}</h3>
                                            <p className="text-[#D4A017] text-xs mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/20 pt-6 space-y-4 mb-8">
                                <div className="flex justify-between text-gray-300">
                                    <span className="font-light">Subtotal</span>
                                    <span>₹{totalPrice().toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span className="font-light">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-white text-xl font-bold border-t border-white/20 pt-4 mt-4">
                                    <span>Total</span>
                                    <span className="text-[#D4A017]">₹{totalPrice().toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/50 text-red-100 p-4 rounded-xl mb-6 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleConfirmOrder}
                                disabled={isProcessing}
                                className="w-full bg-[#D4A017] text-[#0F2E1D] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b88a10] transition-colors font-sans text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing Securely...
                                    </>
                                ) : (
                                    "Confirm Order"
                                )}
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4 font-light">
                                Your data is protected by industry standard encryption.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 160, 23, 0.5);
          border-radius: 4px;
        }
      `}} />
        </main>
    );
}
