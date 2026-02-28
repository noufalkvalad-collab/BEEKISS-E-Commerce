import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact | Bee Kiss",
    description: "We would love to hear from you. Whether it's a question, partnership, or wholesale inquiry.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FDFDF9] overflow-hidden">
            {/* Hero Section */}
            <section className="w-full pt-44 pb-32 px-6 bg-gradient-to-b from-[#0F2E1D] to-[#163b22] text-center text-white relative">
                {/* Subtle decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-gradient-to-r from-transparent to-white/10 blur-3xl transform rotate-12"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[100%] rounded-full bg-gradient-to-l from-transparent to-[#D4A017]/20 blur-3xl transform -rotate-12"></div>
                </div>

                <div className="max-w-3xl mx-auto relative z-10 transition-all duration-1000">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-wide drop-shadow-md">
                        Get in Touch
                    </h1>
                    <div className="w-20 h-[2px] bg-[#D4A017] mx-auto mb-8"></div>
                    <p className="text-lg md:text-xl font-light text-gray-200 font-sans leading-relaxed">
                        We would love to hear from you. Whether it&apos;s a question, partnership, or wholesale inquiry.
                    </p>
                </div>
            </section>

            {/* Contact Grid Section */}
            <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10 -mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left Side: Contact Form */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-[#0F2E1D]/5 transition-all duration-1000">
                        <h2 className="text-3xl font-serif font-bold text-[#0F2E1D] mb-8">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 font-sans uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full border-b-2 border-gray-200 py-3 bg-transparent text-[#0F2E1D] font-medium focus:outline-none focus:border-[#D4A017] transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 font-sans uppercase tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full border-b-2 border-gray-200 py-3 bg-transparent text-[#0F2E1D] font-medium focus:outline-none focus:border-[#D4A017] transition-colors"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700 font-sans uppercase tracking-wider">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full border-b-2 border-gray-200 py-3 bg-transparent text-[#0F2E1D] font-medium focus:outline-none focus:border-[#D4A017] transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-700 font-sans uppercase tracking-wider">Your Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full border-2 border-gray-200 rounded-xl p-4 bg-transparent text-[#0F2E1D] font-medium focus:outline-none focus:border-[#D4A017] transition-colors resize-none mt-2"
                                    placeholder="How can we help you?"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#D4A017] text-[#0F2E1D] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#b88a10] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-sans text-lg mt-4"
                            >
                                <span>Send Message</span>
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Contact Information Card */}
                    <div className="flex flex-col gap-10 transition-all duration-1000">

                        <div className="bg-[#0F2E1D] text-white p-10 md:p-12 rounded-3xl shadow-[0_15px_50px_-15px_rgba(15,46,29,0.3)] relative overflow-hidden h-full flex flex-col justify-center">
                            {/* Decorative faint logo/icon in background */}
                            <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none text-[300px] leading-none font-serif">
                                B
                            </div>

                            <h2 className="text-3xl font-serif font-bold text-white mb-10 relative z-10">Contact Information</h2>

                            <div className="space-y-8 relative z-10 flex-grow">
                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-full bg-[#D4A017]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4A017] transition-colors duration-300">
                                        <MapPin className="w-6 h-6 text-[#D4A017] group-hover:text-[#0F2E1D] transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#D4A017] font-semibold tracking-wider uppercase text-sm mb-1">Our Location</h3>
                                        <p className="text-gray-200 font-light leading-relaxed font-sans text-lg">
                                            Bee Kiss Honey Farm,<br />
                                            Wayanad, Kerala,<br />
                                            India - 673121
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-full bg-[#D4A017]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4A017] transition-colors duration-300">
                                        <Phone className="w-6 h-6 text-[#D4A017] group-hover:text-[#0F2E1D] transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#D4A017] font-semibold tracking-wider uppercase text-sm mb-1">Phone Number</h3>
                                        <p className="text-gray-200 font-light font-sans text-lg">
                                            +91 98765 43210
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-full bg-[#D4A017]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4A017] transition-colors duration-300">
                                        <Mail className="w-6 h-6 text-[#D4A017] group-hover:text-[#0F2E1D] transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#D4A017] font-semibold tracking-wider uppercase text-sm mb-1">Email Address</h3>
                                        <p className="text-gray-200 font-light font-sans text-lg">
                                            support@beekiss.in
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="w-12 h-12 rounded-full bg-[#D4A017]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4A017] transition-colors duration-300">
                                        <Clock className="w-6 h-6 text-[#D4A017] group-hover:text-[#0F2E1D] transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#D4A017] font-semibold tracking-wider uppercase text-sm mb-1">Working Hours</h3>
                                        <p className="text-gray-200 font-light font-sans text-lg">
                                            Mon–Sat: 9AM – 6PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10 relative z-10 flex gap-4">
                                <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4A017] hover:text-[#0F2E1D] hover:border-[#D4A017] transition-all duration-300 text-white" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4A017] hover:text-[#0F2E1D] hover:border-[#D4A017] transition-all duration-300 text-white" aria-label="Facebook">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                {/* Custom WhatsApp Vector */}
                                <a href="#" className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D4A017] hover:text-[#0F2E1D] hover:border-[#D4A017] transition-all duration-300 text-white" aria-label="WhatsApp">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.651.83 5.125 2.27 7.2L.613 24l4.903-1.634a11.968 11.968 0 0 0 6.515 1.916c6.646 0 12.031-5.384 12.031-12.03C24.062 5.385 18.677 0 12.031 0zm0 21.828c-2.222 0-4.32-.577-6.134-1.6l-.44-.246-3.411 1.137 1.144-3.328-.27-.458A9.773 9.773 0 0 1 2.234 12.03c0-5.4 4.39-9.791 9.797-9.791 5.405 0 9.796 4.391 9.796 9.792 0 5.4-4.391 9.797-9.796 9.797zm5.372-7.332c-.295-.148-1.745-.86-2.015-.96-.27-.098-.466-.147-.663.148-.196.295-.761.96-.933 1.157-.172.196-.344.22-.64.072-.295-.147-1.244-.458-2.37-1.46-.877-.78-1.469-1.742-1.641-2.038-.172-.295-.018-.454.13-.601.132-.132.295-.344.442-.516.147-.172.196-.296.295-.492.098-.196.049-.368-.025-.516-.073-.147-.663-1.6-.909-2.19-.24-.577-.482-.5-.662-.508-.172-.008-.368-.01-.565-.01-.196 0-.515.074-.785.369-.271.295-1.031 1.007-1.031 2.457 1.45.64 3.09 1.442 3.518.196.425.86 1.178.86 1.472 0 .295-.392 1.348-1.35 1.741-1.35.393-.564 1.18-.564 1.474-.296.296.76.148 1.932-.86 2.08-.984.148-1.127.344-1.324.786-2.162" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
        </main>
    );
}
