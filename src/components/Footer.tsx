import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-forest-green text-white/80 pt-20 pb-10 border-t border-honey-gold/20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                <div className="col-span-1 md:col-span-1">
                    <h2 className="text-3xl font-serif font-bold text-white mb-6">Bee Kiss</h2>
                    <p className="font-light text-sm leading-relaxed mb-6">
                        The purest expression of nature. Sustainably harvested, raw, and unpasteurized premium honey directly from the hive to your table.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-honey-gold hover:text-forest-green hover:border-transparent transition-all">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-honey-gold hover:text-forest-green hover:border-transparent transition-all">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-honey-gold hover:text-forest-green hover:border-transparent transition-all">
                            <Twitter className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-honey-gold font-semibold uppercase tracking-wider text-sm mb-6">Shop</h4>
                    <ul className="space-y-4 font-light text-sm">
                        <li><Link href="/products" className="hover:text-honey-gold transition-colors">All Products</Link></li>
                        <li><Link href="/products?category=wildflower" className="hover:text-honey-gold transition-colors">Wildflower Reserve</Link></li>
                        <li><Link href="/products?category=manuka" className="hover:text-honey-gold transition-colors">Premium Manuka</Link></li>
                        <li><Link href="/gifts" className="hover:text-honey-gold transition-colors">Gift Sets</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-honey-gold font-semibold uppercase tracking-wider text-sm mb-6">Learn</h4>
                    <ul className="space-y-4 font-light text-sm">
                        <li><Link href="/#story" className="hover:text-honey-gold transition-colors">Our Story</Link></li>
                        <li><Link href="/sustainability" className="hover:text-honey-gold transition-colors">Sustainability</Link></li>
                        <li><Link href="/recipes" className="hover:text-honey-gold transition-colors">Honey Recipes</Link></li>
                        <li><Link href="/faq" className="hover:text-honey-gold transition-colors">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-honey-gold font-semibold uppercase tracking-wider text-sm mb-6">Newsletter</h4>
                    <p className="font-light text-sm leading-relaxed mb-4">
                        Subscribe to receive exclusive offers, recipes, and updates from the hive.
                    </p>
                    <form className="flex" suppressHydrationWarning>
                        <input
                            suppressHydrationWarning
                            type="email"
                            placeholder="Your email address"
                            className="bg-white/5 border border-white/20 rounded-l px-4 py-2 w-full focus:outline-none focus:border-honey-gold text-white font-light text-sm"
                        />
                        <button
                            suppressHydrationWarning
                            type="submit"
                            className="bg-honey-gold text-forest-green px-4 py-2 rounded-r font-semibold hover:bg-honey-light transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs font-light">
                <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Bee Kiss. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
