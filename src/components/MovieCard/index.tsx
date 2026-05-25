"use client";

import Image from "next/image";
import { Movie } from "@/types/movie";
import { useCartStore, useHydratedCartValue } from "@/store/useCartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import Button from "@/components/Button";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const displayQuantity = useHydratedCartValue((state) => state.getItemQuantity(movie.id), 0);
  const isInCart = displayQuantity > 0;

  return (
    <div className="flex flex-col items-center gap-2 rounded bg-card p-4 md:basis-[calc(33.333%-11px)] md:gap-2">
      <div className="flex flex-col items-center gap-2 self-stretch">
        <Image
          src={movie.image}
          alt={movie.title}
          width={147}
          height={188}
          className="h-[188px] w-[147px]"
          priority={priority}
        />
        <h2 className="text-xs font-bold text-text-dark text-center">{movie.title}</h2>
        <p className="text-base font-bold text-[#2F2E41]">
          {formatCurrency(movie.price)}
        </p>
      </div>
      <Button
        onClick={() => addItem(movie)}
        variant={isInCart ? "success" : "primary"}
        fullWidth
        className="gap-3 px-2"
      >
        <span className="flex items-center gap-1">
          <Image src="/images/mdaddshoppingcart-1.svg" alt="" width={14} height={14} />
          <span className="font-normal">{displayQuantity}</span>
        </span>
        <span>ADICIONAR AO CARRINHO</span>
      </Button>
    </div>
  );
}
