"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronDown, Search } from "lucide-react";
import ProductCardActions from "@/components/ProductCardActions";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductsClient({ products, categories }: { products: any[], categories: any[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlSearchQuery = searchParams.get('search') || "";

    const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("featured");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Sync state with URL if it changes externally
    useEffect(() => {
        setSearchQuery(urlSearchQuery);
    }, [urlSearchQuery]);

    // Update URL when search changes if maintaining deep links is desired
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Update URL parameter without reloading
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    // Filter and Sort Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.category && p.category.toLowerCase().includes(query))
            );
        }

        // Category Filter
        if (selectedCategory) {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Price Filter
        if (minPrice) {
            result = result.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
            result = result.filter(p => p.price <= Number(maxPrice));
        }

        // Sort
        switch (sortBy) {
            case "price_asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                // Assuming newer products have higher IDs or we can keep the default order as newest
                // If we don't have createdAt date in client, we rely on the default order passed from server
                break;
            case "featured":
            default:
                // Keep default order
                break;
        }

        return result;
    }, [products, searchQuery, selectedCategory, minPrice, maxPrice, sortBy]);

    // Calculate category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        products.forEach(p => {
            const cat = p.category || "Uncategorized";
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return counts;
    }, [products]);

    return (
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-28 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 font-semibold text-forest-green border-b pb-4">
                        <Filter className="w-5 h-5" />
                        <span>Filters</span>
                    </div>

                    {/* Search */}
                    <div className="mb-8">
                        <h3 className="font-medium text-gray-800 mb-4">Search</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:border-honey-gold"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-medium text-gray-800 mb-4">Categories</h3>
                        <ul className="space-y-3 font-light text-sm text-gray-600">
                            <li
                                onClick={() => setSelectedCategory(null)}
                                className={`flex items-center justify-between cursor-pointer transition-colors ${!selectedCategory ? 'text-honey-gold font-medium' : 'hover:text-honey-gold'}`}
                            >
                                <span>All Products</span>
                                <span className={!selectedCategory ? "bg-honey-gold/20 text-forest-green px-2 py-0.5 rounded-full text-xs" : "bg-gray-100 px-2 py-0.5 rounded-full text-xs"}>
                                    {products.length}
                                </span>
                            </li>
                            {categories.map(cat => (
                                <li
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex items-center justify-between cursor-pointer transition-colors ${selectedCategory === cat.name ? 'text-honey-gold font-medium' : 'hover:text-honey-gold'}`}
                                >
                                    <span>{cat.name}</span>
                                    <span className={selectedCategory === cat.name ? "bg-honey-gold/20 text-forest-green px-2 py-0.5 rounded-full text-xs" : "bg-gray-100 px-2 py-0.5 rounded-full text-xs"}>
                                        {categoryCounts[cat.name] || 0}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-800 mb-4">Price Range</h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full border p-2 text-sm rounded focus:outline-none focus:border-honey-gold"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full border p-2 text-sm rounded focus:outline-none focus:border-honey-gold"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1">
                {/* Top Bar for Sorting & Results Count */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <p className="text-gray-500 text-sm mb-4 sm:mb-0">
                        Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
                    </p>

                    <div className="flex items-center gap-2 text-sm relative">
                        <span className="text-gray-500 flex items-center gap-1">
                            <SlidersHorizontal className="w-4 h-4" /> Sort by:
                        </span>
                        <div className="relative">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-1 font-medium text-forest-green px-3 py-1.5 border rounded hover:border-honey-gold transition-colors min-w-[120px] justify-between"
                            >
                                {sortBy === 'featured' ? 'Featured' :
                                    sortBy === 'price_asc' ? 'Price: Low to High' :
                                        sortBy === 'price_desc' ? 'Price: High to Low' : 'Newest'}
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {isSortOpen && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1">
                                    <button
                                        onClick={() => { setSortBy('featured'); setIsSortOpen(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'featured' ? 'text-honey-gold font-medium' : 'text-gray-700'}`}
                                    >
                                        Featured
                                    </button>
                                    <button
                                        onClick={() => { setSortBy('price_asc'); setIsSortOpen(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price_asc' ? 'text-honey-gold font-medium' : 'text-gray-700'}`}
                                    >
                                        Price: Low to High
                                    </button>
                                    <button
                                        onClick={() => { setSortBy('price_desc'); setIsSortOpen(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price_desc' ? 'text-honey-gold font-medium' : 'text-gray-700'}`}
                                    >
                                        Price: High to Low
                                    </button>
                                    <button
                                        onClick={() => { setSortBy('newest'); setIsSortOpen(false); }}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'newest' ? 'text-honey-gold font-medium' : 'text-gray-700'}`}
                                    >
                                        Newest arrivals
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col">
                                <div className="relative aspect-[4/5] mb-4 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {product.badge && (
                                        <span className="absolute top-4 left-4 bg-honey-gold text-forest-green text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full z-10 shadow-md">
                                            {product.badge}
                                        </span>
                                    )}
                                    {product.offer && (
                                        <span className={"absolute left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow " + (product.badge ? "top-12" : "top-4")}>
                                            {product.offer.discountPercentage}% OFF
                                        </span>
                                    )}
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute top-4 right-4 z-20" onClick={(e) => e.preventDefault()}>
                                        <ProductCardActions product={product} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-serif font-semibold text-gray-900 group-hover:text-honey-gold transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                <p className="font-medium text-forest-green mt-auto flex items-center gap-2">
                                    <span>{product.hasVariants ? "From " : ""}₹{(product.offer ? (product.price - (product.price * (product.offer.discountPercentage / 100))) : product.price).toLocaleString('en-IN')}</span>
                                    {product.offer && (
                                        <span className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                                    )}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-gray-500">No products found matching your active filters.</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory(null);
                                setMinPrice("");
                                setMaxPrice("");
                                router.replace('/products', { scroll: false });
                            }}
                            className="mt-4 text-forest-green font-medium hover:text-honey-gold transition-colors"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
