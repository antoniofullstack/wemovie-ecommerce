import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

export default function SuccessPage() {
  return (
    <div className="flex flex-1 flex-col pb-8">
      <div className="flex w-full sm:flex-1 flex-col items-center gap-6 rounded bg-card px-6 py-16">
        <h2 className="text-center text-xl font-bold text-text-dark">
          Compra realizada com sucesso!
        </h2>

        <Image
          src="/images/sucess-buy.svg"
          alt="Compra realizada com sucesso"
          width={295}
          height={307}
          className="w-[238px] h-auto md:w-[294.96px]"
        />

        <Link href="/">
          <Button className="w-[173px]">
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  );
}
