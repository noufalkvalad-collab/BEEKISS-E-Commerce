"use client";

import { useCartStore } from "@/lib/store/useCartStore";
import { Lock, ShieldCheck, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Basic form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const subtotal = totalPrice();
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Create order on "backend"
            const orderRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total })
            });
            const orderData = await orderRes.json();

            if (!orderData.success) {
                throw new Error("Failed to create order");
            }

            // Simulate a 1.5s delay to represent Razorpay modal loading and user paying
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate successful payment completion from Razorpay
            const verifyRes = await fetch('/api/checkout/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_order_id: orderData.order.id,
                    razorpay_payment_id: `pay_mock_${Math.random()}`,
                    razorpay_signature: "mock_signature_valid"
                })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
                setIsSuccess(true);
                clearCart();
                // Setup redirect to a real order-success page if needed, but for now we show a UI state here
            } else {
                throw new Error("Payment verification failed");
            }

        } catch (error) {
            console.error(error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-gray-50">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-serif text-forest-green font-bold mb-4">Payment Successful!</h2>
                <p className="text-gray-600 mb-8 max-w-md text-center leading-relaxed">
                    Thank you for choosing Bee Kiss. Your order has been placed and will be shipped shortly. You will receive a confirmation email soon.
                </p>
                <Link href="/products" className="bg-forest-green text-white font-semibold px-8 py-3 rounded hover:bg-forest-green/90 transition-colors shadow-md">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-serif text-forest-green mb-4">Your cart is empty</h2>
                <Link href="/products" className="text-honey-gold hover:underline">Return to Shop</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-24">
            <div className="max-w-7xl mx-auto px-4 mt-8">

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Checkout Form */}
                    <div className="flex-1 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
                        <h1 className="text-3xl font-serif font-bold text-forest-green mb-8">Secure Checkout</h1>

                        <form onSubmit={handlePayment}>
                            {/* Contact Info */}
                            <div className="mb-10">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-10">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Shipping Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.state}
                                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border p-3 rounded focus:outline-none focus:border-honey-gold transition-colors"
                                            value={formData.pincode}
                                            onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50/50 p-4 border border-green-100 rounded-lg flex gap-3 text-forest-green text-sm mb-8">
                                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-green-600" />
                                <p>Your payment information will be encrypted and processed securely by Razorpay.</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-forest-green text-white text-lg font-semibold rounded flex items-center justify-center gap-2 hover:bg-forest-green/90 transition-colors shadow-lg"
                            >
                                <CreditCard className="w-5 h-5" /> Pay ₹{total.toLocaleString('en-IN')}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-[420px] flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-28">
                            <h2 className="text-xl font-serif font-bold text-forest-green mb-6 border-b pb-4">Order Summary</h2>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded bg-gray-50 flex-shrink-0 overflow-hidden border">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            <span className="absolute -top-2 -right-2 bg-gray-500 text-white w-5 h-5 flex items-center justify-center text-[10px] rounded-full z-10 font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                            {item.size && <p className="text-xs text-gray-500">{item.size}</p>}
                                        </div>
                                        <div className="font-medium text-sm text-forest-green">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t font-light text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="font-medium text-green-600">Free</span>
                                    ) : (
                                        <span className="font-medium text-gray-900">₹{shipping.toLocaleString('en-IN')}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t mt-4 pt-4">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-forest-green">₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Lock className="w-3 h-3" /> Secure SSL Checkout
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
