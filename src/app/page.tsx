// for testing purpous
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Droplets } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#FDFDF9] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#0F2E1D]">
          {/* Black overlay with 50% opacity */}
          <div className="absolute inset-0 bg-black/50 z-10" />
          <Image
            src="/hero.png"
            alt="Bee Kiss Luxury Honey"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-7xl mx-auto w-full h-full">
          <span className="text-[#D4A017] uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-6 drop-shadow-md">
            Pure • Raw • Organic
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            The Essence of <br />
            <span className="text-[#D4A017] italic">Pure Luxury</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light drop-shadow-md font-sans">
            Indulge in the finest, ethically sourced honey, harvested from pristine forests. A taste of uncompromised nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/products"
              className="px-10 py-4 bg-[#D4A017] text-[#0F2E1D] font-semibold text-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center shadow-xl rounded-full"
            >
              Shop Collection
            </Link>
            <Link
              href="#story"
              className="px-10 py-4 border border-white text-white font-medium text-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center backdrop-blur-sm rounded-full"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section id="story" className="w-full py-20 px-6 bg-[#FDFDF9]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-[4/5] relative rounded-t-full overflow-hidden border-8 border-white shadow-2xl">
              <Image
                src="/bee.jpg"
                alt="Beekeeper at work"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4A017] rounded-full blur-3xl opacity-30 -z-10" />
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            <span className="text-[#D4A017] font-semibold uppercase tracking-wider mb-2 text-sm">Our Heritage</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F2E1D] mb-6 leading-tight font-serif">
              Nature&apos;s Most <br />Precious Gift
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed font-light text-lg font-sans">
              Bee Kiss was born from a passion for preserving the ancient art of beekeeping. We partner with local artisans who treat their hives with reverence, ensuring every drop of honey is as pure as nature intended. No additives, no heating—just raw perfection.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-[var(--color-honey-light)]/50 rounded-full text-[#D4A017]">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F2E1D] mb-1 font-serif">100% Organic</h3>
                  <p className="text-gray-500 font-light font-sans leading-relaxed">Sourced from untouched, wild floral regions.</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="p-4 bg-[var(--color-honey-light)]/50 rounded-full text-[#D4A017]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F2E1D] mb-1 font-serif">Unprocessed & Raw</h3>
                  <p className="text-gray-500 font-light font-sans leading-relaxed">Never heated above hive temperature to retain pure nutrients.</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="p-4 bg-[var(--color-honey-light)]/50 rounded-full text-[#D4A017]">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F2E1D] mb-1 font-serif">Exquisite Taste</h3>
                  <p className="text-gray-500 font-light font-sans leading-relaxed">A complex flavor profile that speaks of its unique terroir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-20 bg-[#0F2E1D] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#D4A017] font-semibold uppercase tracking-wider mb-2 block text-sm">Our Collection</span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif">Featured Nectars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Product Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300 overflow-hidden flex flex-col group">
              <div className="relative aspect-[4/3] w-full bg-gray-100 p-8 flex items-center justify-center border-b border-gray-100">
                {/* Fallback pattern logic if /product-1 doesn't exist yet */}
                <Image
                  src="/honey.jpg"
                  alt="Wildflower Reserve"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1 text-center bg-white justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-2 font-serif text-[#0F2E1D]">Wildflower Reserve</h3>
                  <p className="text-[#D4A017] mb-6 font-medium text-lg">₹1,299</p>
                </div>
                <div>
                  <button className="w-full py-3 bg-[#D4A017] text-[#0F2E1D] font-semibold rounded-full hover:bg-white hover:text-[#D4A017] hover:border hover:border-[#D4A017] transition-all duration-300 shadow-md">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300 overflow-hidden flex flex-col group">
              <div className="relative aspect-[4/3] w-full bg-gray-100 p-8 flex items-center justify-center border-b border-gray-100">
                <Image
                  src="/honeyjar.jpg"
                  alt="Forest Honeydew"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1 text-center bg-white justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-2 font-serif text-[#0F2E1D]">Forest Honeydew</h3>
                  <p className="text-[#D4A017] mb-6 font-medium text-lg">₹1,499</p>
                </div>
                <div>
                  <button className="w-full py-3 bg-[#D4A017] text-[#0F2E1D] font-semibold rounded-full hover:bg-white hover:text-[#D4A017] hover:border hover:border-[#D4A017] transition-all duration-300 shadow-md">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg hover:-translate-y-2 transition-transform duration-300 overflow-hidden flex flex-col group">
              <div className="relative aspect-[4/3] w-full bg-gray-100 p-8 flex items-center justify-center border-b border-gray-100">
                <Image
                  src="/lemonhoney.jpeg"
                  alt="Acacia Gold"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1 text-center bg-white justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-2 font-serif text-[#0F2E1D]">Acacia Gold</h3>
                  <p className="text-[#D4A017] mb-6 font-medium text-lg">₹1,099</p>
                </div>
                <div>
                  <button className="w-full py-3 bg-[#D4A017] text-[#0F2E1D] font-semibold rounded-full hover:bg-white hover:text-[#D4A017] hover:border hover:border-[#D4A017] transition-all duration-300 shadow-md">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-[#D4A017] hover:text-white transition-colors border-b border-[#D4A017] pb-1 font-medium font-sans">
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 px-6 bg-[#FDFDF9] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017]/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0F2E1D]/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#D4A017] font-semibold uppercase tracking-wider mb-2 block text-sm">Purity Experienced</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0F2E1D] mb-16 font-serif">
            Words from Honored Guests
          </h2>

          <div className="relative bg-white p-10 md:p-16 rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-[#D4A017]/10">
            {/* Quotation Mark Icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#D4A017] text-[#0F2E1D] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-5xl font-serif mt-5 leading-none">"</span>
            </div>

            <p className="text-xl md:text-2xl text-gray-700 italic font-light leading-relaxed mb-10 font-serif">
              Absolutely exquisite. The Wildflower Reserve has a complexity I’ve never experienced in commercial honey. It truly tastes like a blossoming forest in spring. Bee Kiss is now a staple on my breakfast table.
            </p>

            <div className="flex items-center justify-center gap-5 border-t border-gray-100 pt-8 w-64 mx-auto">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shadow-inner relative flex-shrink-0">
                <Image
                  src="/beekiss.jpeg"
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left flex-1 whitespace-nowrap">
                <h4 className="font-bold text-[#0F2E1D] font-serif text-lg">Eleanor Vance</h4>
                <p className="text-xs text-[#D4A017] uppercase tracking-wider font-semibold">Culinary Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
