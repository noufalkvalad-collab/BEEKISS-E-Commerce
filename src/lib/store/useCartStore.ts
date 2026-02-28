import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (id: string | number) => void;
    updateQuantity: (id: string | number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (newItem) => {
                set((state) => {
                    const existingItem = state.items.find(item => item.id === newItem.id && item.size === newItem.size);
                    const quantityToAdd = newItem.quantity || 1;

                    if (existingItem) {
                        return {
                            items: state.items.map(item =>
                                (item.id === newItem.id && item.size === newItem.size)
                                    ? { ...item, quantity: item.quantity + quantityToAdd }
                                    : item
                            )
                        };
                    }

                    return {
                        items: [...state.items, { ...newItem, quantity: quantityToAdd }]
                    };
                });
            },

            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== id)
                }));
            },

            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map(item =>
                        item.id === id
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    )
                }));
            },

            clearCart: () => set({ items: [] }),

            totalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            totalPrice: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            }
        }),
        {
            name: 'beekiss-cart',
        }
    )
);
