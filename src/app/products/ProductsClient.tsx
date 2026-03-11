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

    const [isFilterOpen, setIsFilterOpen] = useState(false);

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
                break;
            case "featured":
            default:
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
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8">
            {/* Top Bar for Sorting, Filters Toggle & Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-gray-100 gap-4">
                <p className="text-gray-500 text-sm">
                    Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
                </p>

                <div className="flex items-center gap-4 text-sm relative w-full sm:w-auto">
                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 font-medium px-4 py-2 border rounded transition-colors ${isFilterOpen ? 'bg-forest-green text-white border-forest-green' : 'text-forest-green hover:border-honey-gold bg-white'}`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {(searchQuery || selectedCategory || minPrice || maxPrice) && (
                            <span className="bg-honey-gold text-forest-green text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
                                {(searchQuery ? 1 : 0) + (selectedCategory ? 1 : 0) + (minPrice || maxPrice ? 1 : 0)}
                            </span>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <span className="text-gray-500 flex items-center gap-1 hidden sm:flex">
                        <SlidersHorizontal className="w-4 h-4" /> Sort by:
                    </span>
                    
                    <div className="relative flex-1 sm:flex-none">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="w-full flex items-center gap-1 font-medium text-forest-green px-3 py-2 border rounded hover:border-honey-gold transition-colors min-w-[150px] justify-between bg-white"
                        >
                            {sortBy === 'featured' ? 'Featured' :
                                sortBy === 'price_asc' ? 'Price: Low to High' :
                                    sortBy === 'price_desc' ? 'Price: High to Low' : 'Newest'}
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {isSortOpen && (
                            <div className="absolute right-0 top-full mt-1 w-full sm:w-48 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1">
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

            {/* Expandable Filter Panel */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-[800px] opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-inner grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Search */}
                    <div>
                        <h3 className="font-medium text-gray-800 mb-4">Search</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:border-honey-gold bg-white"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-medium text-gray-800 mb-4">Categories</h3>
                        <ul className="space-y-2 font-light text-sm text-gray-600 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            <li
                                onClick={() => setSelectedCategory(null)}
                                className={`flex items-center justify-between cursor-pointer transition-colors p-2 rounded ${!selectedCategory ? 'bg-white text-honey-gold font-medium shadow-sm' : 'hover:bg-gray-100'}`}
                            >
                                <span>All Products</span>
                                <span className={!selectedCategory ? "bg-honey-gold/20 text-forest-green px-2 py-0.5 rounded-full text-xs" : "bg-gray-200 px-2 py-0.5 rounded-full text-xs"}>
                                    {products.length}
                                </span>
                            </li>
                            {categories.map(cat => (
                                <li
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`flex items-center justify-between cursor-pointer transition-colors p-2 rounded ${selectedCategory === cat.name ? 'bg-white text-honey-gold font-medium shadow-sm' : 'hover:bg-gray-100'}`}
                                >
                                    <span>{cat.name}</span>
                                    <span className={selectedCategory === cat.name ? "bg-honey-gold/20 text-forest-green px-2 py-0.5 rounded-full text-xs" : "bg-gray-200 px-2 py-0.5 rounded-full text-xs"}>
                                        {categoryCounts[cat.name] || 0}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Range */}
                    <div className="flex flex-col">
                        <h3 className="font-medium text-gray-800 mb-4">Price Range</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full border pl-7 pr-3 py-2 text-sm rounded focus:outline-none focus:border-honey-gold bg-white"
                                />
                            </div>
                            <span className="text-gray-400 font-medium">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full border pl-7 pr-3 py-2 text-sm rounded focus:outline-none focus:border-honey-gold bg-white"
                                />
                            </div>
                        </div>
                        
                        {(searchQuery || selectedCategory || minPrice || maxPrice) && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory(null);
                                    setMinPrice("");
                                    setMaxPrice("");
                                    router.replace('/products', { scroll: false });
                                }}
                                className="mt-8 text-sm text-red-500 font-medium hover:text-red-700 transition-colors self-start border border-red-200 bg-red-50 px-3 py-1.5 rounded"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Grid Area */}
            <div className="flex-1">
                {/* Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredProducts.map((product) => (
                            <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden pb-4">
                                <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden flex items-center justify-center">
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

                                <div className="px-4 pt-4 flex flex-col flex-1">
                                    <h3 className="text-base font-serif font-semibold text-gray-900 group-hover:text-honey-gold transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                                    <p className="font-medium text-forest-green mt-3 flex items-center gap-2">
                                        <span>{product.hasVariants ? "From " : ""}₹{(product.offer ? (Number(product.price !== undefined ? product.price : 0) - (Number(product.price !== undefined ? product.price : 0) * (Number(product.offer.discountPercentage) / 100))) : Number(product.price !== undefined ? product.price : 0)).toLocaleString('en-IN')}</span>
                                        {product.offer && (
                                            <span className="text-xs text-gray-400 line-through">₹{Number(product.price !== undefined ? product.price : 0).toLocaleString('en-IN')}</span>
                                        )}
                                    </p>
                                </div>
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
