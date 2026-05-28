"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import CartItem from "@/components/CartItem";
import EmptyCart from "@/components/EmptyCart";
import Button from "@/components/Button";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.movie.price * item.quantity, 0),
    [items]
  );

  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinishOrder = () => {
    if (isFinishing) return;
    setIsFinishing(true);
    clearCart();
    router.push("/success");
  };

  if (items.length === 0 && !isFinishing) {
    return <EmptyCart />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-[21px] rounded bg-card p-4 sm:gap-6 sm:p-6">
        <div className="hidden items-center sm:flex">
          <span className="w-[280px] text-sm font-bold uppercase text-text-gray">
            Produto
          </span>
          <span className="flex-1 text-sm font-bold uppercase text-text-gray">
            Qtd
          </span>
          <span className="flex-1 text-sm font-bold uppercase text-text-gray">
            Subtotal
          </span>
          <span className="w-6" />
        </div>

        <div className="flex flex-col gap-[21px] sm:gap-6">
          {items.map((item) => (
            <CartItem key={item.movie.id} item={item} />
          ))}
        </div>

        <hr className="border-text-gray" />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex w-full items-center gap-[5px] sm:order-last sm:w-auto">
            <span className="flex-1 text-sm font-bold uppercase text-text-gray sm:flex-none">
              Total
            </span>
            <span className="text-2xl font-bold text-text-dark">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <Button
            onClick={handleFinishOrder}
            disabled={isFinishing}
            aria-busy={isFinishing}
            className="w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-[173px]"
          >
            {isFinishing ? "Finalizando..." : "Finalizar Pedido"}
          </Button>
        </div>
      </div>
    </div>
  );
}
