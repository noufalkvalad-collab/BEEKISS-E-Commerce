"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import MapAddressSelector from "@/components/MapAddressSelector";

function AddAddressForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/checkout";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const editId = searchParams.get("edit");
    const isEditing = !!editId;

    const [address, setAddress] = useState({
        name: "",
        houseName: "",
        phone: "",
        pincode: "",
        district: "",
        state: "",
        landmark: ""
    });

    // Fetch address data if in edit mode
    useEffect(() => {
        if (isEditing) {
            const fetchAddress = async () => {
                try {
                    const res = await fetch("/api/user/addresses");
                    const data = await res.json();
                    if (data.success) {
                        const addrToEdit = data.addresses.find((a: any) => a._id === editId);
                        if (addrToEdit) {
                            setAddress({
                                name: addrToEdit.name,
                                houseName: addrToEdit.houseName,
                                phone: addrToEdit.phone,
                                pincode: addrToEdit.pincode,
                                district: addrToEdit.district,
                                state: addrToEdit.state,
                                landmark: addrToEdit.landmark || ""
                            });
                        }
                    }
                } catch (error) {
                    toast.error("Failed to load address for editing");
                }
            };
            fetchAddress();
        }
    }, [isEditing, editId]);

    const handleMapSelect = (data: any) => {
        console.log("Receiving Map Data in Form:", data);
        setAddress(prev => ({
            ...prev,
            houseName: data.houseName !== "" ? data.houseName : prev.houseName,
            district: data.district !== "" ? data.district : prev.district,
            state: data.state !== "" ? data.state : prev.state,
            pincode: data.pincode !== "" ? data.pincode : prev.pincode,
            landmark: data.landmark !== "" ? data.landmark : prev.landmark
        }));
        toast.success("Location details updated! Check the fields below.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const endpoint = "/api/user/addresses";
            const method = isEditing ? "PUT" : "POST";
            const body = isEditing ? { ...address, addressId: editId } : address;

            const res = await fetch(endpoint, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} address`);

            toast.success(`Address ${isEditing ? 'updated' : 'added'} successfully!`);
            router.push(callbackUrl);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFDF9] pt-32 pb-24 px-6 md:px-12 flex items-center justify-center">
            <div className="max-w-xl w-full">
                <Link href={callbackUrl} className="inline-flex items-center gap-2 text-[#0F2E1D]/60 hover:text-[#D4A017] font-semibold transition-colors mb-8 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Link>

                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-[#0F2E1D]/5">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-[#0F2E1D]">{isEditing ? "Edit Delivery Address" : "Add New Delivery Address"}</h1>
                        <button 
                            type="button"
                            onClick={() => setShowMap(!showMap)}
                            className="flex items-center gap-2 text-sm font-bold text-[#D4A017] hover:bg-[#D4A017]/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#D4A017]/20"
                        >
                            <MapPin className="w-4 h-4" />
                            {showMap ? "Hide Map" : (isEditing ? "Adjust on Map" : "Select from Map")}
                        </button>
                    </div>

                    {showMap && (
                        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <MapAddressSelector onAddressSelect={handleMapSelect} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                required
                                type="text"
                                minLength={2}
                                maxLength={50}
                                value={address.name}
                                onChange={e => setAddress({ ...address, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
                                placeholder="John Doe"
                                title="Full Name must be between 2 and 50 characters."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">House Name / Flat No. *</label>
                            <input
                                required
                                type="text"
                                minLength={4}
                                maxLength={100}
                                value={address.houseName}
                                onChange={e => setAddress({ ...address, houseName: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
                                placeholder="123 Bee Hive Appts"
                                title="Please enter a valid House Name / Flat No."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    required
                                    type="tel"
                                    pattern="^[0-9]{10}$"
                                    value={address.phone}
                                    onChange={e => setAddress({ ...address, phone: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
                                    placeholder="9876543210"
                                    title="Please enter a valid 10-digit mobile number."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                                <input
                                    required
                                    type="text"
                                    pattern="^[1-9][0-9]{5}$"
                                    value={address.pincode}
                                    onChange={e => setAddress({ ...address, pincode: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
                                    placeholder="682001"
                                    title="Please enter a valid 6-digit Indian Pincode."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                                <input
                                    required
                                    type="text"
                                    minLength={2}
                                    maxLength={50}
                                    value={address.district}
                                    onChange={e => setAddress({ ...address, district: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
                                    placeholder="Ernakulam"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                <input
                                    required
                                    type="text"
                                    minLength={2}
                                    maxLength={50}
                                    value={address.state}
                                    onChange={e => setAddress({ ...address, state: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
                                    placeholder="Kerala"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                            <input
                                type="text"
                                maxLength={100}
                                value={address.landmark}
                                onChange={e => setAddress({ ...address, landmark: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]"
                                placeholder="Near the old banyan tree"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#0F2E1D] text-[#D4A017] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#163b22] transition-colors font-sans text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {isEditing ? "Updating..." : "Saving..."}
                                    </>
                                ) : (
                                    isEditing ? "Update Delivery Address" : "Save Delivery Address"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default function AddAddressPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FDFDF9] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#D4A017]" />
            </div>
        }>
            <AddAddressForm />
        </Suspense>
    );
}
