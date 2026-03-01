"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ArrowUpDown } from "lucide-react";
import type { ICategory } from "@/lib/models/Category";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/categories")
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto animation-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#0F2E1D]">Categories</h1>
                    <p className="text-gray-500 mt-1 font-sans">Manage your product collections</p>
                </div>
                <button className="flex items-center gap-2 bg-[#0F2E1D] hover:bg-[#D4A017] text-white hover:text-[#0F2E1D] px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md">
                    <Plus className="w-5 h-5" />
                    New Category
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="relative w-72">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50 focus:border-[#D4A017] transition-all bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold cursor-pointer hover:text-[#0F2E1D] transition-colors"><div className="flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></div></th>
                                <th className="px-6 py-4 font-semibold">Slug</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading categories...</td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No categories found. Click "New Category" to create one.</td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.slug} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#0F2E1D]">{cat.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm font-mono">{cat.slug}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${cat.isActive
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                                }`}>
                                                {cat.isActive ? "Active" : "Hidden"}
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
