import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Image
        src="/assets/load-spinner.svg"
        alt="Carregando..."
        width={63}
        height={63}
        className="animate-spin"
      />
    </div>
  );
}
