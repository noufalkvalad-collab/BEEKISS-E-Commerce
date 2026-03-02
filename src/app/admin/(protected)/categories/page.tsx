"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, ArrowUpDown, X, Loader2, Image as ImageIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import type { ICategory } from "@/lib/models/Category";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [newCategory, setNewCategory] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
        isActive: true,
    });

    const fetchCategories = () => {
        fetch("/api/admin/categories")
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddOrEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const endpoint = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCategory),
            });
            if (res.ok) {
                setIsAddModalOpen(false);
                setEditingId(null);
                setNewCategory({ name: "", slug: "", description: "", image: "", isActive: true });
                fetchCategories(); // Refresh list
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${editingId ? 'update' : 'create'} category`);
            }
        } catch (error) {
            console.error(`Error ${editingId ? 'updating' : 'creating'} category:`, error);
            alert("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (cat: any) => {
        setEditingId(cat._id);
        setNewCategory({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            image: cat.image || "",
            isActive: cat.isActive,
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete the "${name}" category? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete category");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("An unexpected error occurred while deleting.");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animation-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#0F2E1D]">Categories</h1>
                    <p className="text-gray-500 mt-1 font-sans">Manage your product collections</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setNewCategory({ name: "", slug: "", description: "", image: "", isActive: true });
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-[#0F2E1D] hover:bg-[#D4A017] text-white hover:text-[#0F2E1D] px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md">
                    <Plus className="w-5 h-5" />
                    New Category
                </button>
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-serif font-bold text-[#0F2E1D]">
                                {editingId ? "Edit Category" : "Add New Category"}
                            </h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddOrEditCategory} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCategory.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setNewCategory({
                                                ...newCategory,
                                                name,
                                                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50"
                                        placeholder="e.g. Raw Honey"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newCategory.slug}
                                        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50"
                                        placeholder="e.g. raw-honey"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50 min-h-[100px]"
                                        placeholder="Category description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                                    <CldUploadWidget
                                        uploadPreset="beekiss" // Optional depending on cloud settings
                                        signatureEndpoint="/api/admin/upload"
                                        onSuccess={(result: any) => {
                                            setNewCategory({ ...newCategory, image: result.info.secure_url });
                                        }}
                                    >
                                        {({ open }) => (
                                            <div
                                                onClick={() => open()}
                                                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#D4A017] transition-colors overflow-hidden relative"
                                            >
                                                {newCategory.image ? (
                                                    <img src={newCategory.image} alt="Upload preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </CldUploadWidget>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={newCategory.isActive}
                                        onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                                        className="w-4 h-4 text-[#D4A017] focus:ring-[#D4A017] border-gray-300 rounded"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-gray-700">Category is Active</label>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 text-white bg-[#0F2E1D] hover:bg-[#163b22] rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingId ? "Save Changes" : "Save Category"}
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
                                                <button onClick={() => handleEditClick(cat)} className="hover:text-[#D4A017] transition-colors p-1" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(cat._id as unknown as string, cat.name)} className="hover:text-red-500 transition-colors p-1" title="Delete">
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
