import React from 'react';

export default function ProcessPage() {
    return (
        <main className="min-h-screen bg-[#FDFDF9]">
            {/* Hero Section */}
            <section className="relative w-full py-32 bg-[#0F2E1D] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-0"></div>
                <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center opacity-0 animate-[fadeIn_2s_ease-out_forwards]">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        From Forest <br className="md:hidden" /> to Jar
                    </h1>
                    <div className="w-24 h-[2px] bg-[#D4A017] mb-8"></div>
                    <p className="text-xl md:text-2xl text-gray-200 font-serif italic tracking-wide font-light max-w-2xl drop-shadow-sm">
                        Crafted with patience. Preserved with integrity.
                    </p>
                </div>
            </section>

            {/* Timeline Process Section */}
            <section className="py-24 px-6 max-w-6xl mx-auto relative">
                {/* Center Line for Desktop */}
                <div className="hidden md:block absolute left-1/2 top-32 bottom-24 w-[2px] bg-[#D4A017]/20 -translate-x-1/2"></div>

                <div className="space-y-16 md:space-y-32">
                    {/* Step 01 */}
                    <div className="flex flex-col md:flex-row items-center justify-between group">
                        <div className="w-full md:w-[45%] order-2 md:order-1 flex justify-end">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D4A017]/10 w-full hover:-translate-y-2 transition-transform duration-500 text-left md:text-right">
                                <span className="md:hidden text-[#D4A017] font-serif font-bold text-xl mb-2 block">01</span>
                                <h3 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-4">Wild Forest Sourcing</h3>
                                <p className="text-gray-600 font-sans leading-relaxed text-lg font-light">
                                    Harvested from untouched Wayanad forest regions rich in wild flora.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 h-16 bg-[#0F2E1D] border-4 border-[#FDFDF9] rounded-full text-[#D4A017] font-serif font-bold text-2xl items-center justify-center z-10 order-2 shadow-md group-hover:bg-[#D4A017] group-hover:text-[#0F2E1D] transition-colors duration-300">
                            01
                        </div>
                        <div className="w-full md:w-[45%] order-3"></div>
                    </div>

                    {/* Step 02 */}
                    <div className="flex flex-col md:flex-row items-center justify-between group">
                        <div className="w-full md:w-[45%] order-2 md:order-3 flex justify-start">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D4A017]/10 w-full hover:-translate-y-2 transition-transform duration-500 text-left">
                                <span className="md:hidden text-[#D4A017] font-serif font-bold text-xl mb-2 block">02</span>
                                <h3 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-4">Ethical Beekeeping</h3>
                                <p className="text-gray-600 font-sans leading-relaxed text-lg font-light">
                                    Collected by trained local beekeepers without harming bees or destroying hives.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 h-16 bg-[#0F2E1D] border-4 border-[#FDFDF9] rounded-full text-[#D4A017] font-serif font-bold text-2xl items-center justify-center z-10 order-2 shadow-md group-hover:bg-[#D4A017] group-hover:text-[#0F2E1D] transition-colors duration-300">
                            02
                        </div>
                        <div className="w-full md:w-[45%] order-1"></div>
                    </div>

                    {/* Step 03 */}
                    <div className="flex flex-col md:flex-row items-center justify-between group">
                        <div className="w-full md:w-[45%] order-2 md:order-1 flex justify-end">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D4A017]/10 w-full hover:-translate-y-2 transition-transform duration-500 text-left md:text-right">
                                <span className="md:hidden text-[#D4A017] font-serif font-bold text-xl mb-2 block">03</span>
                                <h3 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-4">Gentle Extraction</h3>
                                <p className="text-gray-600 font-sans leading-relaxed text-lg font-light">
                                    Carefully extracted to preserve enzymes, aroma, and natural nutrients.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 h-16 bg-[#0F2E1D] border-4 border-[#FDFDF9] rounded-full text-[#D4A017] font-serif font-bold text-2xl items-center justify-center z-10 order-2 shadow-md group-hover:bg-[#D4A017] group-hover:text-[#0F2E1D] transition-colors duration-300">
                            03
                        </div>
                        <div className="w-full md:w-[45%] order-3"></div>
                    </div>

                    {/* Step 04 */}
                    <div className="flex flex-col md:flex-row items-center justify-between group">
                        <div className="w-full md:w-[45%] order-2 md:order-3 flex justify-start">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D4A017]/10 w-full hover:-translate-y-2 transition-transform duration-500 text-left">
                                <span className="md:hidden text-[#D4A017] font-serif font-bold text-xl mb-2 block">04</span>
                                <h3 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-4">Minimal Filtration</h3>
                                <p className="text-gray-600 font-sans leading-relaxed text-lg font-light">
                                    Light natural filtering only. No ultra-filtration. No pollen removal.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 h-16 bg-[#0F2E1D] border-4 border-[#FDFDF9] rounded-full text-[#D4A017] font-serif font-bold text-2xl items-center justify-center z-10 order-2 shadow-md group-hover:bg-[#D4A017] group-hover:text-[#0F2E1D] transition-colors duration-300">
                            04
                        </div>
                        <div className="w-full md:w-[45%] order-1"></div>
                    </div>

                    {/* Step 05 */}
                    <div className="flex flex-col md:flex-row items-center justify-between group">
                        <div className="w-full md:w-[45%] order-2 md:order-1 flex justify-end">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D4A017]/10 w-full hover:-translate-y-2 transition-transform duration-500 text-left md:text-right">
                                <span className="md:hidden text-[#D4A017] font-serif font-bold text-xl mb-2 block">05</span>
                                <h3 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-4">No Heating Policy</h3>
                                <p className="text-gray-600 font-sans leading-relaxed text-lg font-light">
                                    Never heated above hive temperature to maintain purity and bioactive properties.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 h-16 bg-[#0F2E1D] border-4 border-[#FDFDF9] rounded-full text-[#D4A017] font-serif font-bold text-2xl items-center justify-center z-10 order-2 shadow-md group-hover:bg-[#D4A017] group-hover:text-[#0F2E1D] transition-colors duration-300">
                            05
                        </div>
                        <div className="w-full md:w-[45%] order-3"></div>
                    </div>

                    {/* Step 06 */}
                    <div className="flex flex-col md:flex-row items-center justify-between group">
                        <div className="w-full md:w-[45%] order-2 md:order-3 flex justify-start">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D4A017]/10 w-full hover:-translate-y-2 transition-transform duration-500 text-left">
                                <span className="md:hidden text-[#D4A017] font-serif font-bold text-xl mb-2 block">06</span>
                                <h3 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-4">Glass Jar Packaging</h3>
                                <p className="text-gray-600 font-sans leading-relaxed text-lg font-light">
                                    Packed in sterilized glass jars to retain flavor and avoid contamination.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex w-16 h-16 bg-[#0F2E1D] border-4 border-[#FDFDF9] rounded-full text-[#D4A017] font-serif font-bold text-2xl items-center justify-center z-10 order-2 shadow-md group-hover:bg-[#D4A017] group-hover:text-[#0F2E1D] transition-colors duration-300">
                            06
                        </div>
                        <div className="w-full md:w-[45%] order-1"></div>
                    </div>
                </div>
            </section>

            {/* Quality Assurance Section */}
            <section className="py-24 px-6 bg-[#FDFDF9]">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-[#0F2E1D]/5">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F2E1D] mb-12 text-center">
                        Quality Without Compromise
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-y-12 max-w-2xl mx-auto">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-[#D4A017] shrink-0 shadow-[0_0_10px_rgba(212,160,23,0.5)]"></div>
                            <p className="text-xl text-gray-800 font-serif font-medium">Moisture level tested</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-[#D4A017] shrink-0 shadow-[0_0_10px_rgba(212,160,23,0.5)]"></div>
                            <p className="text-xl text-gray-800 font-serif font-medium">Purity verified</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-[#D4A017] shrink-0 shadow-[0_0_10px_rgba(212,160,23,0.5)]"></div>
                            <p className="text-xl text-gray-800 font-serif font-medium">No additives</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-[#D4A017] shrink-0 shadow-[0_0_10px_rgba(212,160,23,0.5)]"></div>
                            <p className="text-xl text-gray-800 font-serif font-medium">Small batch inspection</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing Statement Section */}
            <section className="py-24 px-6 mb-10 text-center flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F2E1D] tracking-widest uppercase mb-4 opacity-90">
                    Pure. Rare. Untouched.
                </h2>
                <p className="text-lg text-[#D4A017] font-serif italic tracking-wider">
                    Experience the pinnacle of natural craftsmanship.
                </p>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </main>
    );
}
