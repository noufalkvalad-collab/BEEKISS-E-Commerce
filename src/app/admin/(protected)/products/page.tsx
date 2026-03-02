"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ArrowUpDown, Image as ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        compareAtPrice: "",
        category: "",
        stock: "10",
        imageUrl: "",
        isActive: true,
    });

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch("/api/admin/products"),
                fetch("/api/admin/categories")
            ]);
            const prodData = await prodRes.json();
            const catData = await catRes.json();

            setProducts(prodData);
            setCategories(catData);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Clean up the data for submission
            const payload = {
                ...newProduct,
                images: newProduct.imageUrl ? [newProduct.imageUrl] : [],
            };

            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setNewProduct({
                    name: "", slug: "", description: "", price: "", compareAtPrice: "", category: "", stock: "10", imageUrl: "", isActive: true
                });
                fetchData(); // Refresh list
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create product");
            }
        } catch (error) {
            console.error("Error creating product:", error);
            alert("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animation-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#0F2E1D]">Products</h1>
                    <p className="text-gray-500 mt-1 font-sans">Manage inventory, pricing, and details</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-[#0F2E1D] hover:bg-[#D4A017] text-white hover:text-[#0F2E1D] px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md">
                    <Plus className="w-5 h-5" />
                    New Product
                </button>
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 animate-[fadeInUp_0.3s_ease-out]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                            <h2 className="text-xl font-serif font-bold text-[#0F2E1D]">Add New Product</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input type="text" required value={newProduct.name}
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                setNewProduct({
                                                    ...newProduct, name,
                                                    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                                });
                                            }}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="Product Name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                        <input type="text" required value={newProduct.slug}
                                            onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="product-slug" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                        <select required value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50 bg-white">
                                            <option value="" disabled>Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea value={newProduct.description}
                                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50 min-h-[100px]" placeholder="Product description..." />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                                            <input type="number" required min="0" step="0.01" value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="0.00" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (₹)</label>
                                            <input type="number" min="0" step="0.01" value={newProduct.compareAtPrice}
                                                onChange={(e) => setNewProduct({ ...newProduct, compareAtPrice: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="Optional" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Amount *</label>
                                        <input type="number" required min="0" value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="10" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input type="url" value={newProduct.imageUrl}
                                            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4A017]/50" placeholder="https://..." />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <input type="checkbox" id="isProductActive" checked={newProduct.isActive}
                                            onChange={(e) => setNewProduct({ ...newProduct, isActive: e.target.checked })}
                                            className="w-4 h-4 text-[#D4A017] rounded" />
                                        <label htmlFor="isProductActive" className="text-sm text-gray-700">Product is Active</label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                <button type="button" onClick={() => setIsAddModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting}
                                    className="px-5 py-2.5 text-white bg-[#0F2E1D] hover:bg-[#163b22] rounded-xl font-medium transition-colors flex items-center gap-2">
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Product
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
