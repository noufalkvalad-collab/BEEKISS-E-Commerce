"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ArrowUpDown, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto animation-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#0F2E1D]">Products</h1>
                    <p className="text-gray-500 mt-1 font-sans">Manage inventory, pricing, and details</p>
                </div>
                <button className="flex items-center gap-2 bg-[#0F2E1D] hover:bg-[#D4A017] text-white hover:text-[#0F2E1D] px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md">
                    <Plus className="w-5 h-5" />
                    New Product
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="relative w-72">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50 focus:border-[#D4A017] transition-all bg-white"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#D4A017] bg-white cursor-pointer">
                            <option>All Categories</option>
                        </select>
                        <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#D4A017] bg-white cursor-pointer">
                            <option>Stock: All</option>
                            <option>In Stock</option>
                            <option>Low Stock</option>
                            <option>Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold w-16">Image</th>
                                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-[#0F2E1D] transition-colors"><div className="flex items-center gap-1">Product Details <ArrowUpDown className="w-3 h-3" /></div></th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold">Stock</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No products found. Click "New Product" to add inventory.</td>
                                </tr>
                            ) : (
                                products.map((prod) => (
                                    <tr key={prod.slug} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative">
                                                {prod.images && prod.images.length > 0 ? (
                                                    <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#0F2E1D]">{prod.name}</div>
                                            <div className="text-gray-400 text-xs mt-0.5 font-mono">{prod.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {prod.category?.name || "Uncategorized"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#0F2E1D]">₹{prod.price.toLocaleString('en-IN')}</div>
                                            {prod.compareAtPrice && (
                                                <div className="text-gray-400 text-xs line-through mt-0.5">₹{prod.compareAtPrice.toLocaleString('en-IN')}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${prod.stock > 10
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : prod.stock > 0
                                                        ? "bg-orange-50 text-orange-700 border-orange-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                }`}>
                                                {prod.stock} in stock
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-gray-400">
                                                <button className="hover:text-[#D4A017] transition-colors p-1" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="hover:text-red-500 transition-colors p-1" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
