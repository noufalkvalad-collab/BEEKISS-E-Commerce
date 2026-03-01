"use client";

import { Playfair_Display, Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        <title>Bee Kiss | Premium Pure Honey</title>
        <meta name="description" content="Experience the luxury of nature with Bee Kiss. 100% natural, premium honey harvested with care." />
      </head>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${poppins.variable} font-poppins antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <AuthProvider>
          {!isAdminRoute && <Header />}
          <main className={`flex-1 ${!isAdminRoute ? 'mt-20' : ''}`}>
            {children}
          </main>
          {!isAdminRoute && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
