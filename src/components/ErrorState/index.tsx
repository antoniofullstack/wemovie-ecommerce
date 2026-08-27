"use client";

import Button from "@/components/Button";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = "Ocorreu um erro ao carregar os filmes.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm font-semibold text-white">{message}</p>
      <Button onClick={onRetry} className="px-6">
        Tentar novamente
      </Button>
    </div>
  );
}
