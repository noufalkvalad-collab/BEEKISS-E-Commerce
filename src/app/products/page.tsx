import Image from "next/image";
import Link from "next/link";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";

// Mock data until we integrate MongoDB
const products = [
    {
        id: 1,
        name: "Wildflower Reserve",
        slug: "wildflower-reserve",
        price: 1299,
        category: "Raw Honey",
        image: "/honey.jpg",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Premium Manuka (MGO 400+)",
        slug: "premium-manuka",
        price: 3499,
        category: "Medicinal",
        image: "/honeyjar.jpg",
    },
    {
        id: 3,
        name: "Acacia Blossom",
        slug: "acacia-blossom",
        price: 999,
        category: "Light Honey",
        image: "/lemonhoney.jpeg",
    },
    {
        id: 4,
        name: "Forest Honeydew",
        slug: "forest-honeydew",
        price: 1499,
        category: "Dark Honey",
        image: "/bee.jpg",
        badge: "Limited Edition"
    },
    {
        id: 5,
        name: "Lavender Infused",
        slug: "lavender-infused",
        price: 1199,
        category: "Infused",
        image: "/beekiss.jpeg",
    },
    {
        id: 6,
        name: "Royal Jelly Blend",
        slug: "royal-jelly-blend",
        price: 2499,
        category: "Wellness",
        image: "/honey.jpg",
    }
];

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-background pt-10 pb-24">

            {/* Page Header */}
            <div className="bg-forest-green text-white py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Collection</h1>
                    <p className="text-gray-300 font-light max-w-2xl mx-auto">
                        Discover our range of premium, sustainably sourced honeys. Each jar is a testament to nature's perfection.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-28 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 font-semibold text-forest-green border-b pb-4">
                            <Filter className="w-5 h-5" />
                            <span>Filters</span>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-medium text-gray-800 mb-4">Categories</h3>
                            <ul className="space-y-3 font-light text-sm text-gray-600">
                                <li className="flex items-center justify-between cursor-pointer hover:text-honey-gold transition-colors">
                                    <span>All Products</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">12</span>
                                </li>
                                <li className="flex items-center justify-between cursor-pointer hover:text-honey-gold transition-colors">
                                    <span>Raw Honey</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">4</span>
                                </li>
                                <li className="flex items-center justify-between cursor-pointer hover:text-honey-gold transition-colors text-honey-gold font-medium">
                                    <span>Medicinal</span>
                                    <span className="bg-honey-gold/20 text-forest-green px-2 py-0.5 rounded-full text-xs">2</span>
                                </li>
                                <li className="flex items-center justify-between cursor-pointer hover:text-honey-gold transition-colors">
                                    <span>Infused</span>
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">3</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800 mb-4">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Min" className="w-full border p-2 text-sm rounded focus:outline-none focus:border-honey-gold" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="Max" className="w-full border p-2 text-sm rounded focus:outline-none focus:border-honey-gold" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid Area */}
                <div className="flex-1">

                    {/* Top Bar for Sorting & Results Count */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <p className="text-gray-500 text-sm mb-4 sm:mb-0">
                            Showing <span className="font-semibold text-gray-800">1-6</span> of 12 products
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 flex items-center gap-1">
                                <SlidersHorizontal className="w-4 h-4" /> Sort by:
                            </span>
                            <button className="flex items-center gap-1 font-medium text-forest-green px-3 py-1.5 border rounded hover:border-honey-gold transition-colors">
                                Featured <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
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
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <h3 className="text-lg font-serif font-semibold text-gray-900 group-hover:text-honey-gold transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                <p className="font-medium text-forest-green mt-auto">₹{product.price.toLocaleString('en-IN')}</p>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-16 flex justify-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center border rounded border-honey-gold bg-honey-gold text-forest-green font-medium">1</button>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:border-honey-gold hover:text-honey-gold transition-colors">2</button>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded text-gray-600 hover:border-honey-gold hover:text-honey-gold transition-colors">Next</button>
                    </div>

                </div>
            </div>
        </div>
    );
}
