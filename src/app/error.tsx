"use client";

import Button from "@/components/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm font-semibold text-white">
        Ocorreu um erro ao carregar os filmes.
      </p>
      <Button onClick={reset} className="px-6">
        Tentar novamente
      </Button>
    </div>
  );
}
