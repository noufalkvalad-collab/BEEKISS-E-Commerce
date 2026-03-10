import { Metadata } from 'next';
import dbConnect from "@/lib/db/mongodb";
import Product from "@/lib/models/Product";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const resolvedParams = await params;

    try {
        await dbConnect();

        // Find product by slug
        const product = await Product.findOne({ slug: resolvedParams.slug, isActive: true }).lean();

        if (!product) {
            return {
                title: "Product Not Found | Bee Kiss",
                description: "The requested Bee Kiss product could not be found."
            }
        }

        // Clean description for SEO snippet (limit chars, remove markdown if any)
        const cleanDescription = product.description
            ? product.description.substring(0, 160) + (product.description.length > 160 ? '...' : '')
            : `Discover ${product.name}, a premium quality product from Bee Kiss.`;

        return {
            title: `${product.name} | Premium Honey & Wayanad Products`,
            description: cleanDescription,
            openGraph: {
                title: `${product.name} | Bee Kiss`,
                description: cleanDescription,
                url: `https://beekiss.in/products/${product.slug}`,
                images: product.images && product.images.length > 0 ? [
                    {
                        url: product.images[0],
                        width: 800,
                        height: 600,
                        alt: product.name,
                    }
                ] : [],
            },
        }
    } catch (error) {
        console.error("Error generating metadata for product:", error);
        return {
            title: "Product Details | Bee Kiss",
            description: "View details for our premium honey and food products."
        }
    }
}

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
