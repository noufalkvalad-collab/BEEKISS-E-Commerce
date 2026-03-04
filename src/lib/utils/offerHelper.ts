import Offer from "@/lib/models/Offer";

/**
 * Attaches the best active offer to a product or array of products.
 * Uses the Mongoose objects directly or leaned plain objects.
 */
export async function applyActiveOffers(products: any | any[]) {
    // 1. Fetch all currently active offers
    const now = new Date();
    const activeOffers = await Offer.find({
        isActive: true,
        validUntil: { $gte: now }
    }).lean();

    if (!activeOffers || activeOffers.length === 0) {
        return products; // No active offers, return products as-is
    }

    const isArray = Array.isArray(products);
    const productList = isArray ? products : [products];

    // 2. Evaluate each product against the offers
    const enrichedProducts = productList.map((product) => {
        let bestOffer: any = null;

        for (const offer of activeOffers) {
            let isApplicable = false;

            // Check applicability
            if (offer.type === 'GLOBAL') {
                isApplicable = true;
            } else if (offer.type === 'CATEGORY') {
                const productCatId = product.category?._id?.toString() || product.category?.toString();
                isApplicable = offer.applicableCategories?.some(
                    (catId: any) => catId.toString() === productCatId
                ) || false;
            } else if (offer.type === 'PRODUCT') {
                const productId = product._id?.toString() || product.id?.toString();
                isApplicable = offer.applicableProducts?.some(
                    (prodId: any) => prodId.toString() === productId
                ) || false;
            }

            // If applicable, see if it provides a better discount than previously found offers
            if (isApplicable) {
                if (!bestOffer || offer.discountPercentage > bestOffer.discountPercentage) {
                    bestOffer = {
                        code: offer.code,
                        title: offer.title,
                        discountPercentage: offer.discountPercentage,
                        type: offer.type
                    };
                }
            }
        }

        // Attach the best offer found (if any)
        return {
            ...product,
            offer: bestOffer
        };
    });

    return isArray ? enrichedProducts : enrichedProducts[0];
}
