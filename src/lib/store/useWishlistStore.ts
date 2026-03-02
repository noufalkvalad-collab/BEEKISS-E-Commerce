import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
    items: string[]; // array of product IDs
    setItems: (items: string[]) => void;
    addItem: (id: string) => void;
    removeItem: (id: string) => void;
    hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            setItems: (items) => set({ items }),
            addItem: (id) => set((state) => ({
                items: state.items.includes(id) ? state.items : [...state.items, id]
            })),
            removeItem: (id) => set((state) => ({
                items: state.items.filter(itemId => itemId !== id)
            })),
            hasItem: (id) => get().items.includes(id)
        }),
        {
            name: 'wishlist-storage', // unique name
        }
    )
);
