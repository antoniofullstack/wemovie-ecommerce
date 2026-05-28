"use client";

import Image from "next/image";
import { CartItem as CartItemType } from "@/types/cart";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = item.movie.price * item.quantity;

  return (
    <div
      data-testid={`cart-item-${item.movie.id}`}
      className="flex flex-row gap-4 sm:items-center"
    >
      <Image
        src={item.movie.image}
        alt={item.movie.title}
        width={91}
        height={114}
        sizes="(min-width: 640px) 91px, 64px"
        className="h-[82px] w-[64px] object-contain sm:h-[114px] sm:w-[91px]"
        priority
      />

      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex items-center gap-4 sm:w-[173px] sm:flex-col sm:items-start sm:gap-2">
          <span className="flex-1 text-sm font-bold text-text-dark sm:flex-none">
            {item.movie.title}
          </span>
          <span className="text-base font-bold text-text-dark">
            {formatCurrency(item.movie.price)}
          </span>
          <button
            onClick={() => removeItem(item.movie.id)}
            data-testid="remove-item-mobile"
            aria-label={`Remover ${item.movie.title} do carrinho`}
            className="cursor-pointer text-primary transition-colors hover:text-primary/70 sm:hidden"
          >
            <Image
              src="/images/bin-cart.svg"
              alt="Remover"
              width={16}
              height={18}
            />
          </button>
        </div>

        <div className="flex items-center gap-4 sm:flex-1 sm:flex-row sm:items-center sm:gap-0">
          <div className="flex w-[117px] items-center gap-[11px] sm:w-auto sm:flex-1">
            <button
              onClick={() => decrementItem(item.movie.id)}
              data-testid="decrement-quantity"
              aria-label={`Diminuir quantidade de ${item.movie.title}`}
              className="cursor-pointer text-primary transition-colors hover:text-primary/70"
            >
              <Image
                src="/images/minus.svg"
                alt="Diminuir"
                width={18}
                height={18}
              />
            </button>
            <span
              data-testid="item-quantity"
              className="flex h-[26px] flex-1 items-center justify-center rounded border border-border text-sm text-text-dark sm:w-[62px] sm:flex-none"
            >
              {item.quantity}
            </span>
            <button
              onClick={() => incrementItem(item.movie.id)}
              data-testid="increment-quantity"
              aria-label={`Aumentar quantidade de ${item.movie.title}`}
              className="cursor-pointer text-primary transition-colors hover:text-primary/70"
            >
              <Image
                src="/images/plus.svg"
                alt="Aumentar"
                width={18}
                height={18}
              />
            </button>
          </div>

          <div className="flex flex-col items-end sm:flex-1 sm:flex-row sm:items-center">
            <span className="text-xs font-bold uppercase text-text-gray sm:hidden">
              SUBTOTAL
            </span>
            <span
              data-testid="item-subtotal"
              className="text-base font-bold text-text-dark"
            >
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        <button
          onClick={() => removeItem(item.movie.id)}
          data-testid="remove-item-desktop"
          aria-label={`Remover ${item.movie.title} do carrinho`}
          className="hidden cursor-pointer text-primary transition-colors hover:text-primary/70 sm:flex sm:h-6 sm:w-6 sm:items-center sm:justify-center"
        >
          <Image
            src="/images/bin-cart.svg"
            alt="Remover"
            width={16}
            height={18}
          />
        </button>
      </div>
    </div>
  );
}
