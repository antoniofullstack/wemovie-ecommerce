"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function EmptyCart() {
  const router = useRouter();

  const handleReload = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-1 flex-col pb-8">
      <div className="flex w-full flex-col items-center gap-6 rounded bg-card p-16 sm:flex-1">
        <h2 className="text-center text-xl font-bold text-[#2F2E41]">
          Parece que não há nada por aqui :(
        </h2>

        <div className="flex flex-col items-center">
          <Image
            src="/images/empty-cart-illustration.svg"
            alt="Carrinho vazio"
            width={179}
            height={264}
            priority
          />
          <hr className="mt-0 w-full border-0 border-t border-t-[#3F3D56] sm:w-[447px]" />
        </div>

        <Button onClick={handleReload} className="w-[179px] px-4">
          Recarregar página
        </Button>
      </div>
    </div>
  );
}
