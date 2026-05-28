import { useState, useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart";
import { Movie } from "@/types/movie";

interface CartState {
  items: CartItem[];
  addItem: (movie: Movie) => void;
  removeItem: (movieId: number) => void;
  incrementItem: (movieId: number) => void;
  decrementItem: (movieId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (movieId: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      const updateItemQuantity = (movieId: number, delta: number) => {
        set({
          items: get().items.map((item) =>
            item.movie.id === movieId
              ? { ...item, quantity: item.quantity + delta }
              : item
          ),
        });
      };

      return {
        items: [],

        addItem: (movie: Movie) => {
          const { items } = get();
          const existingItem = items.find((item) => item.movie.id === movie.id);

          if (existingItem) {
            updateItemQuantity(movie.id, 1);
          } else {
            set({ items: [...items, { movie, quantity: 1 }] });
          }
        },

        removeItem: (movieId: number) => {
          set({
            items: get().items.filter((item) => item.movie.id !== movieId),
          });
        },

        incrementItem: (movieId: number) => {
          updateItemQuantity(movieId, 1);
        },

        decrementItem: (movieId: number) => {
          const { items } = get();
          const item = items.find((i) => i.movie.id === movieId);

          if (item && item.quantity > 1) {
            updateItemQuantity(movieId, -1);
          } else {
            set({ items: items.filter((i) => i.movie.id !== movieId) });
          }
        },

        clearCart: () => {
          set({ items: [] });
        },

        getTotalItems: () => {
          return get().items.reduce((total, item) => total + item.quantity, 0);
        },

        getTotalPrice: () => {
          return get().items.reduce(
            (total, item) => total + item.movie.price * item.quantity,
            0
          );
        },

        getItemQuantity: (movieId: number) => {
          const item = get().items.find((i) => i.movie.id === movieId);
          return item ? item.quantity : 0;
        },
      };
    },
    { name: "cart-storage" }
  )
);

function useCartHydrated() {
  const [hydrated, setHydrated] = useState(
    () => useCartStore.persist?.hasHydrated() ?? false
  );

  useEffect(() => {
    const unsub = useCartStore.persist?.onFinishHydration(() =>
      setHydrated(true)
    );
    return unsub;
  }, []);

  return hydrated;
}

export function useHydratedCartValue<T>(
  selector: (state: CartState) => T,
  fallback: T
): T {
  const hydrated = useCartHydrated();
  const value = useCartStore(selector);
  return hydrated ? value : fallback;
}
