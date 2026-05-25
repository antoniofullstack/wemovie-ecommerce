"use client";

import Image from "next/image";
import Link from "next/link";
import { useHydratedCartValue } from "@/store/useCartStore";

export default function Header() {
  const displayItems = useHydratedCartValue((state) => state.getTotalItems(), 0);

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-[30px]">
        <Link href="/" className="text-xl font-bold text-white">
          WeMovies
        </Link>

        <Link href="/cart" className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="hidden text-sm font-semibold text-white md:block">
              Meu Carrinho
            </span>
            <span className="text-xs font-semibold text-text-gray">
              {displayItems} {displayItems === 1 ? "item" : "itens"}
            </span>
          </div>
          <Image
            src="/assets/cart-icon.svg"
            alt="Carrinho"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </header>
  );
}
