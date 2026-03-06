import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import ProductsClient from "./ProductsClient";
import { applyActiveOffers } from "@/lib/utils/offerHelper";
import { Suspense } from "react";

export default async function ProductsPage() {
    await dbConnect();
    const dbProductsBase = await Product.find({ isActive: true }).populate("category", "name slug").sort({ createdAt: -1 }).lean();
    const dbProducts = await applyActiveOffers(dbProductsBase);

    // Map to the format expected by the UI
    const products = dbProducts.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        category: p.category?.name || "Uncategorized",
        price: p.price,
        image: p.images && p.images.length > 0 ? p.images[0] : "/honey.jpg",
        badge: p.badge || null,
        offer: p.offer || null,
    }));

    const dbCategories = await Category.find({}).sort({ name: 1 }).lean();
    const categories = dbCategories.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug
    }));

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Page Header */}
            <div className="bg-forest-green text-white py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Collection</h1>
                    <p className="text-gray-300 font-light max-w-2xl mx-auto">
                        Discover our range of premium, sustainably sourced honeys. Each jar is a testament to nature's perfection.
                    </p>
                </div>
            </div>

            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading products...</div>}>
                <ProductsClient products={products} categories={categories} />
            </Suspense>
        </div>
    );
}
