"use client";

import ErrorState from "@/components/ErrorState";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return <ErrorState onRetry={reset} />;
}
