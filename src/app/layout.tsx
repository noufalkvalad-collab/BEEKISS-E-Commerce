import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "sonner";

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
  title: {
    default: "Bee Kiss | Premium Pure Honey & Wayanad Food Products",
    template: "%s | Bee Kiss"
  },
  description: "Experience the luxury of nature with Bee Kiss. 100% natural, premium pure honey, flavoured honey, and healthy Wayanad food products harvested with care from Kerala.",
  authors: [{ name: "Bee Kiss" }],
  creator: "Bee Kiss",
  publisher: "Bee Kiss",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://beekiss.in", // Replace with actual production domain when deployed
    title: "Bee Kiss | Premium Pure Honey",
    description: "100% natural, premium pure honey and healthy authentic food products directly from Wayanad, Kerala.",
    siteName: "Bee Kiss",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
          <Toaster position="top-right" richColors />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
