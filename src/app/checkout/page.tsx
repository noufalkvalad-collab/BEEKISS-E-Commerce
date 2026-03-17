"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCartStore();

    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState("");

    // Address State
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState("COD");

    useEffect(() => {
        setMounted(true);
        if (status === "authenticated") {
            fetchAddresses();
        }
    }, [status]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch("/api/user/addresses", {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            const data = await res.json();
            if (data.success) {
                setSavedAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddressIndex(0);
                }
            }
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

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

        // Basic Validation
        if (selectedAddressIndex === null || !savedAddresses[selectedAddressIndex]) {
            setError("Please select a delivery address.");
            setIsProcessing(false);
            return;
        }

        const selectedAddress = savedAddresses[selectedAddressIndex];

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    address: selectedAddress,
                    paymentMethod
                }),
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
                        {/* Delivery Address Selector */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#0F2E1D]/5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-[#0F2E1D]">Delivery Address</h2>
                                <Link href="/user/addresses/new?callbackUrl=/checkout" className="text-sm font-bold text-[#D4A017] hover:underline">
                                    + Add New Address
                                </Link>
                            </div>

                            {isLoadingAddresses ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#D4A017]" />
                                </div>
                            ) : savedAddresses.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 mb-4 font-sans text-sm">You have no saved delivery addresses.</p>
                                    <Link href="/user/addresses/new?callbackUrl=/checkout" className="inline-block bg-[#0F2E1D] text-[#D4A017] font-bold py-3 px-6 rounded-xl hover:bg-[#163b22] transition-colors font-sans text-sm">
                                        Add Delivery Address
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                    {savedAddresses.map((addr, index) => (
                                        <label key={index} className={`flex items-start gap-4 p-5 border rounded-xl cursor-pointer transition-all ${selectedAddressIndex === index ? 'border-[#D4A017] bg-[#D4A017]/5 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <div className="flex bg-white items-center justify-center w-6 h-6 rounded-full border border-gray-300 mt-1 shrink-0">
                                                {selectedAddressIndex === index && <div className="w-3 h-3 bg-[#D4A017] rounded-full" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <p className="font-bold text-[#0F2E1D] text-lg">{addr.name}</p>
                                                    <div className="flex gap-2">
                                                        <Link 
                                                            href={`/user/addresses/new?edit=${addr._id}&callbackUrl=/checkout`}
                                                            className="p-1.5 hover:bg-[#D4A017]/20 rounded-lg text-[#D4A017] transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="Edit Address"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                                        </Link>
                                                        <button 
                                                            type="button"
                                                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toast("Delete this address?", {
                                                                    description: "This action cannot be undone.",
                                                                    action: {
                                                                        label: "Delete",
                                                                        onClick: async () => {
                                                                            try {
                                                                                const res = await fetch(`/api/user/addresses?addressId=${addr._id}`, {
                                                                                    method: 'DELETE'
                                                                                });
                                                                                const data = await res.json();
                                                                                if (data.success) {
                                                                                    setSavedAddresses(data.addresses);
                                                                                    if (selectedAddressIndex === index) {
                                                                                        setSelectedAddressIndex(data.addresses.length > 0 ? 0 : null);
                                                                                    }
                                                                                    toast.success("Address deleted");
                                                                                }
                                                                            } catch (err) {
                                                                                toast.error("Failed to delete address");
                                                                            }
                                                                        },
                                                                    },
                                                                    cancel: {
                                                                        label: "Cancel",
                                                                        onClick: () => {},
                                                                    },
                                                                });
                                                            }}
                                                            title="Delete Address"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2 font-sans leading-relaxed">
                                                    {addr.houseName}, {addr.landmark ? `${addr.landmark}, ` : ''} <br />
                                                    {addr.district}, {addr.state} - {addr.pincode}
                                                </p>
                                                <p className="text-sm text-[#0F2E1D] mt-3 font-semibold font-mono">Mobile: {addr.phone}</p>
                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    className="hidden"
                                                    checked={selectedAddressIndex === index}
                                                    onChange={() => setSelectedAddressIndex(index)}
                                                />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#0F2E1D]/5">
                            <h2 className="text-2xl font-serif font-bold text-[#0F2E1D] mb-6">Payment Method</h2>

                            <div className="space-y-4">
                                {/* Cash on Delivery */}
                                <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#D4A017] bg-[#D4A017]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="flex bg-white items-center justify-center w-6 h-6 rounded-full border border-gray-300 mt-0.5 shrink-0">
                                        {paymentMethod === 'COD' && <div className="w-3 h-3 bg-[#D4A017] rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-[#0F2E1D] mb-1">Cash on Delivery (COD)</p>
                                        <p className="text-sm text-gray-500">Pay with cash upon delivery.</p>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="COD"
                                            className="hidden"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                    </div>
                                </label>

                                {/* Online Payment */}
                                <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-[#D4A017] bg-[#D4A017]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="flex bg-white items-center justify-center w-6 h-6 rounded-full border border-gray-300 mt-0.5 shrink-0">
                                        {paymentMethod === 'ONLINE' && <div className="w-3 h-3 bg-[#D4A017] rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold text-[#0F2E1D]">Online Payment</p>
                                            <div className="flex gap-2">
                                                <span className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold text-gray-600">UPI</span>
                                                <span className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold text-gray-600">CARD</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">Pay securely via Razorpay/Stripe.</p>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="ONLINE"
                                            className="hidden"
                                            checked={paymentMethod === 'ONLINE'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                    </div>
                                </label>
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
