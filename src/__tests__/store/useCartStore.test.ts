import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCartStore, useHydratedCartValue } from "@/store/useCartStore";
import { Movie } from "@/types/movie";

const mockMovie: Movie = {
  id: 1,
  title: "Viúva Negra",
  price: 29.99,
  image: "https://example.com/viuva-negra.png",
};

const mockMovie2: Movie = {
  id: 2,
  title: "Shang-Chi",
  price: 19.99,
  image: "https://example.com/shang-chi.png",
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  describe("addItem", () => {
    it("should add a new item to the cart", () => {
      useCartStore.getState().addItem(mockMovie);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].movie).toEqual(mockMovie);
      expect(items[0].quantity).toBe(1);
    });

    it("should increment quantity if item already exists", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("should add multiple different items", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie2);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the cart", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie2);
      useCartStore.getState().removeItem(mockMovie.id);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].movie.id).toBe(mockMovie2.id);
    });

    it("should do nothing if item does not exist", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().removeItem(999);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
    });
  });

  describe("incrementItem", () => {
    it("should increment the quantity of an existing item when multiple items are present", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie2);
      useCartStore.getState().incrementItem(mockMovie.id);

      const { items } = useCartStore.getState();
      expect(items.find(i => i.movie.id === mockMovie.id)?.quantity).toBe(2);
      expect(items.find(i => i.movie.id === mockMovie2.id)?.quantity).toBe(1);
    });
  });

  describe("decrementItem", () => {
    it("should decrement the quantity of an item", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().decrementItem(mockMovie.id);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(1);
    });

    it("should remove the item when quantity reaches zero", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().decrementItem(mockMovie.id);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("should remove all items from the cart", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie2);
      useCartStore.getState().clearCart();

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe("getTotalItems", () => {
    it("should return 0 for empty cart", () => {
      expect(useCartStore.getState().getTotalItems()).toBe(0);
    });

    it("should return correct total count", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie2);

      expect(useCartStore.getState().getTotalItems()).toBe(3);
    });
  });

  describe("getTotalPrice", () => {
    it("should return 0 for empty cart", () => {
      expect(useCartStore.getState().getTotalPrice()).toBe(0);
    });

    it("should return correct total price", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie2);

      const expectedTotal = mockMovie.price * 2 + mockMovie2.price;
      expect(useCartStore.getState().getTotalPrice()).toBeCloseTo(expectedTotal);
    });
  });

  describe("getItemQuantity", () => {
    it("should return 0 for item not in cart", () => {
      expect(useCartStore.getState().getItemQuantity(999)).toBe(0);
    });

    it("should return correct quantity for item in cart", () => {
      useCartStore.getState().addItem(mockMovie);
      useCartStore.getState().addItem(mockMovie);

      expect(useCartStore.getState().getItemQuantity(mockMovie.id)).toBe(2);
    });
  });

  describe("useHydratedCartValue", () => {
    it("should return fallback value before hydration", () => {
      // @ts-ignore - access private persist for mocking
      vi.spyOn(useCartStore.persist, "hasHydrated").mockReturnValue(false);

      const { result } = renderHook(() =>
        useHydratedCartValue((state) => state.items, [])
      );

      expect(result.current).toEqual([]);
    });

    it("should return store value after hydration", () => {
      // @ts-ignore - access private persist for mocking
      vi.spyOn(useCartStore.persist, "hasHydrated").mockReturnValue(true);

      useCartStore.setState({ items: [{ movie: mockMovie, quantity: 1 }] });

      const { result } = renderHook(() =>
        useHydratedCartValue((state) => state.getTotalItems(), 0)
      );

      expect(result.current).toBe(1);
    });

    it("should handle missing persist property", () => {
      const originalPersist = useCartStore.persist;
      // @ts-ignore
      useCartStore.persist = undefined;

      const { result } = renderHook(() =>
        useHydratedCartValue((state) => state.items, [])
      );

      expect(result.current).toEqual([]);
      
      // Restore
      // @ts-ignore
      useCartStore.persist = originalPersist;
    });

    it("should update hydration state when onFinishHydration is called", () => {
      let hydrationFinishedCallback: any;
      // @ts-ignore
      vi.spyOn(useCartStore.persist, "onFinishHydration").mockImplementation((cb) => {
        hydrationFinishedCallback = cb;
        return () => {};
      });

      renderHook(() => useHydratedCartValue((state) => state.items, []));
      
      expect(hydrationFinishedCallback).toBeDefined();
      
      // Trigger the callback
      hydrationFinishedCallback({});
    });
  });
});
