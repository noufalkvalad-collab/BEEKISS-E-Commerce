"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ArrowUpDown, Tag, X, Loader2 } from "lucide-react";

export default function OffersPage() {
    const [offers, setOffers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        code: "",
        type: "GLOBAL" as "GLOBAL" | "CATEGORY" | "PRODUCT",
        discountPercentage: "",
        applicableCategories: [] as string[],
        applicableProducts: [] as string[],
        validUntil: "",
        isActive: true
    });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [oRes, cRes, pRes] = await Promise.all([
                fetch("/api/admin/offers"),
                fetch("/api/admin/categories"),
                fetch("/api/admin/products")
            ]);
            const oData = await oRes.json();
            const cData = await cRes.json();
            const pData = await pRes.json();

            setOffers(Array.isArray(oData) ? oData : []);
            setCategories(Array.isArray(cData) ? cData : []);
            setProducts(Array.isArray(pData) ? pData : []);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (offer?: any) => {
        if (offer) {
            setEditingId(offer._id);
            setFormData({
                title: offer.title,
                description: offer.description || "",
                code: offer.code,
                type: offer.type,
                discountPercentage: offer.discountPercentage?.toString() || "",
                applicableCategories: offer.applicableCategories?.map((c: any) => typeof c === 'string' ? c : c._id) || [],
                applicableProducts: offer.applicableProducts?.map((p: any) => typeof p === 'string' ? p : p._id) || [],
                validUntil: new Date(offer.validUntil).toISOString().split('T')[0],
                isActive: offer.isActive
            });
        } else {
            setEditingId(null);
            setFormData({
                title: "", description: "", code: "", type: "GLOBAL", discountPercentage: "",
                applicableCategories: [], applicableProducts: [],
                validUntil: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // Next week default
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const endpoint = editingId ? `/api/admin/offers/${editingId}` : "/api/admin/offers";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    // Clear references if type changes
                    applicableCategories: formData.type === 'CATEGORY' ? formData.applicableCategories : [],
                    applicableProducts: formData.type === 'PRODUCT' ? formData.applicableProducts : [],
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save offer");
            }
        } catch (error) {
            console.error("Submission error", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete offer "${title}"?`)) return;
        try {
            const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
            else alert("Failed to delete offer");
        } catch (error) {
            console.error("Delete error", error);
        }
    };

    const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: 'applicableCategories' | 'applicableProducts') => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, [field]: options });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animation-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#0F2E1D]">Promotional Offers</h1>
                    <p className="text-gray-500 mt-1 font-sans">Manage global discounts and active banners</p>
                </div>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#0F2E1D] hover:bg-[#D4A017] text-white hover:text-[#0F2E1D] px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md">
                    <Plus className="w-5 h-5" />
                    New Offer
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                            <h2 className="text-xl font-serif font-bold text-[#0F2E1D]">
                                {editingId ? "Edit Offer" : "Create New Offer"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title *</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="e.g. Summer Sale" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                                    <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50 uppercase" placeholder="e.g. SUMMER20" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount % *</label>
                                    <input type="number" required min="1" max="100" value={formData.discountPercentage} onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="10" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
                                    <input type="date" required value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" />
                                </div>

                                {/* Offer Scope Configuration */}
                                <div className="col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Offer Scope / Type *</label>
                                    <div className="flex gap-4 mb-4">
                                        {['GLOBAL', 'CATEGORY', 'PRODUCT'].map(t => (
                                            <label key={t} className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="offerType" value={t} checked={formData.type === t}
                                                    onChange={() => setFormData({ ...formData, type: t as any, applicableCategories: [], applicableProducts: [] })}
                                                    className="text-[#D4A017] focus:ring-[#D4A017]" />
                                                <span className="text-sm font-medium text-gray-700">{t.charAt(0) + t.slice(1).toLowerCase()}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {formData.type === 'CATEGORY' && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Select Categories (Hold Ctrl/Cmd to select multiple)</label>
                                            <select multiple value={formData.applicableCategories} onChange={(e) => handleMultiSelect(e, 'applicableCategories')}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50 h-32">
                                                {categories.map(cat => (
                                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {formData.type === 'PRODUCT' && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Select Products (Hold Ctrl/Cmd to select multiple)</label>
                                            <select multiple value={formData.applicableProducts} onChange={(e) => handleMultiSelect(e, 'applicableProducts')}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50 h-32">
                                                {products.map(prod => (
                                                    <option key={prod._id} value={prod._id}>{prod.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" rows={2} />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-[#D4A017] rounded" />
                                    <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Offer is currently Active</label>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-white bg-[#0F2E1D] hover:bg-[#163b22] rounded-xl font-medium transition-colors flex items-center gap-2">
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingId ? "Save Changes" : "Create Offer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="relative w-72">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search offers..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50 focus:border-[#D4A017] transition-all bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-[#0F2E1D] transition-colors"><div className="flex items-center gap-1">Offer & Code <ArrowUpDown className="w-3 h-3" /></div></th>
                                <th className="px-6 py-4 font-semibold">Scope</th>
                                <th className="px-6 py-4 font-semibold">Discount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Valid Until</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></td>
                                </tr>
                            ) : offers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No offers running. Click "New Offer" to create a promotion.</td>
                                </tr>
                            ) : (
                                offers.map((offer) => {
                                    const isExpired = new Date(offer.validUntil) < new Date();
                                    return (
                                        <tr key={offer._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[#0F2E1D]">{offer.title}</div>
                                                <div className="text-xs font-mono text-gray-500 mt-0.5">{offer.code}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-0.5 rounded textxs font-medium ${offer.type === 'GLOBAL' ? "bg-purple-50 text-purple-700" :
                                                        offer.type === 'CATEGORY' ? "bg-blue-50 text-blue-700" :
                                                            "bg-orange-50 text-orange-700"
                                                    }`}>
                                                    {offer.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-[#D4A017] font-bold">
                                                    <Tag className="w-4 h-4" />
                                                    {offer.discountPercentage}% OFF
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${isExpired
                                                    ? "bg-red-50 text-red-700 border-red-200"
                                                    : offer.isActive
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-gray-100 text-gray-600 border-gray-200"
                                                    }`}>
                                                    {isExpired ? "Expired" : offer.isActive ? "Active" : "Paused"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(offer.validUntil).toLocaleDateString('en-IN', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3 text-gray-400">
                                                    <button onClick={() => openModal(offer)} className="hover:text-[#D4A017] transition-colors p-1" title="Edit">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(offer._id, offer.title)} className="hover:text-red-500 transition-colors p-1" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
