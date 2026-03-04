"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ArrowUpDown, Image as ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [newProduct, setNewProduct] = useState({
        name: "",
        slug: "",
        description: "",
        category: "",
        images: [] as string[],
        variants: [{ weight: "", price: "", stock: "10" }],
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

    const handleAddOrEditProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Clean up the data for submission
            const payload = {
                ...newProduct,
            };

            const endpoint = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setEditingId(null);
                setNewProduct({
                    name: "", slug: "", description: "", category: "", images: [], variants: [{ weight: "", price: "", stock: "10" }], isActive: true
                });
                fetchData(); // Refresh list
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${editingId ? 'update' : 'create'} product`);
            }
        } catch (error) {
            console.error(`Error ${editingId ? 'updating' : 'creating'} product:`, error);
            alert("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (prod: any) => {
        setEditingId(prod._id);
        setNewProduct({
            name: prod.name,
            slug: prod.slug,
            description: prod.description || "",
            category: prod.category?._id || "",
            images: prod.images || [],
            variants: prod.variants && prod.variants.length > 0
                ? prod.variants.map((v: any) => ({ weight: v.weight, price: v.price?.toString() || "", stock: v.stock?.toString() || "" }))
                : [{ weight: prod.unitQuantity || "Standard", price: prod.price?.toString() || "", stock: prod.stock?.toString() || "0" }],
            isActive: prod.isActive ?? true,
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("An unexpected error occurred while deleting.");
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
                    onClick={() => {
                        setEditingId(null);
                        setNewProduct({
                            name: "", slug: "", description: "", category: "", images: [], variants: [{ weight: "", price: "", stock: "10" }], isActive: true
                        });
                        setIsAddModalOpen(true);
                    }}
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
                            <h2 className="text-xl font-serif font-bold text-[#0F2E1D]">
                                {editingId ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddOrEditProduct} className="p-6">
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
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-medium text-gray-800">Product Variants *</label>
                                            <button type="button" onClick={() => setNewProduct({ ...newProduct, variants: [...newProduct.variants, { weight: "", price: "", stock: "10" }] })}
                                                className="text-xs text-honey-gold hover:text-yellow-700 font-medium">+ Add Size</button>
                                        </div>
                                        <div className="space-y-3">
                                            {newProduct.variants.map((variant, index) => (
                                                <div key={index} className="flex gap-2 items-center bg-white p-2 border border-gray-100 rounded shadow-sm">
                                                    <input type="text" required placeholder="Size / Weight (e.g. 250g)" value={variant.weight}
                                                        onChange={(e) => {
                                                            const newVariants = [...newProduct.variants];
                                                            newVariants[index].weight = e.target.value;
                                                            setNewProduct({ ...newProduct, variants: newVariants });
                                                        }}
                                                        className="w-1/3 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#D4A017]/50" />
                                                    <input type="number" required min="0" step="0.01" placeholder="Variant Price ₹" value={variant.price}
                                                        onChange={(e) => {
                                                            const newVariants = [...newProduct.variants];
                                                            newVariants[index].price = e.target.value;
                                                            setNewProduct({ ...newProduct, variants: newVariants });
                                                        }}
                                                        className="w-1/3 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#D4A017]/50" />
                                                    <input type="number" required min="0" placeholder="Variant Stock Qty" value={variant.stock}
                                                        onChange={(e) => {
                                                            const newVariants = [...newProduct.variants];
                                                            newVariants[index].stock = e.target.value;
                                                            setNewProduct({ ...newProduct, variants: newVariants });
                                                        }}
                                                        className="w-1/4 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#D4A017]/50" />
                                                    {newProduct.variants.length > 1 && (
                                                        <button type="button" onClick={() => {
                                                            const newVariants = newProduct.variants.filter((_, i) => i !== index);
                                                            setNewProduct({ ...newProduct, variants: newVariants });
                                                        }}
                                                            className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                                        <div className="flex flex-wrap gap-4">
                                            {newProduct.images.map((url, index) => (
                                                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
                                                            }}
                                                            className="bg-white text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <CldUploadWidget
                                                uploadPreset="beekiss" // Optional depending on cloud settings
                                                signatureEndpoint="/api/admin/upload"
                                                onSuccess={(result: any) => {
                                                    setNewProduct(prev => ({ ...prev, images: [...prev.images, result.info.secure_url] }));
                                                }}
                                            >
                                                {({ open }) => (
                                                    <div
                                                        onClick={() => open()}
                                                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#D4A017] transition-colors"
                                                    >
                                                        <Plus className="w-6 h-6 text-gray-400 mb-1" />
                                                        <span className="text-[10px] text-gray-500 font-medium">Add Image</span>
                                                    </div>
                                                )}
                                            </CldUploadWidget>
                                        </div>
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
                                    {editingId ? "Save Changes" : "Save Product"}
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
                                            <div className="font-medium text-[#0F2E1D]">
                                                {prod.name}
                                                {(!prod.variants || prod.variants.length === 0) && prod.unitQuantity && (
                                                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                                        {prod.unitQuantity}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-gray-400 text-xs mt-0.5 font-mono">{prod.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {prod.category?.name || "Uncategorized"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#0F2E1D]">
                                                {prod.variants && prod.variants.length > 0
                                                    ? `From ₹${Math.min(...prod.variants.map((v: any) => v.price)).toLocaleString('en-IN')}`
                                                    : `₹${(prod.price || 0).toLocaleString('en-IN')}`
                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {prod.variants && prod.variants.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {prod.variants.map((v: any) => (
                                                        <div key={v._id || v.weight} className="flex justify-between text-xs items-center gap-2">
                                                            <span className="text-gray-500 w-12">{v.weight}:</span>
                                                            <span className="text-[#0F2E1D] font-medium flex-1 text-center">₹{(v.price || 0).toLocaleString('en-IN')}</span>
                                                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${v.stock > 10
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : v.stock > 0
                                                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                                                    : "bg-red-50 text-red-700 border-red-200"
                                                                }`}>
                                                                {v.stock} qty
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${prod.stock > 10
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : prod.stock > 0
                                                        ? "bg-orange-50 text-orange-700 border-orange-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                    }`}>
                                                    {prod.stock} in stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-gray-400">
                                                <button onClick={() => handleEditClick(prod)} className="hover:text-[#D4A017] transition-colors p-1" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(prod._id as unknown as string, prod.name)} className="hover:text-red-500 transition-colors p-1" title="Delete">
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
