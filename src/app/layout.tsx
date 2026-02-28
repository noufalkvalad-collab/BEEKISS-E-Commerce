import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bee Kiss | Premium Pure Honey",
  description: "Experience the luxury of nature with Bee Kiss. 100% natural, premium honey harvested with care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${poppins.variable} font-poppins antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1 mt-20">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
