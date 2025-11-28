"use client";

import { useEffect } from "react";
import { useToast } from "./toast-provider";

export function ErrorHandler({ error }: { error: Error & { digest?: string } }) {
  const { showError } = useToast();

  useEffect(() => {
    if (error) {
      showError(error.message || "An unexpected error occurred");
    }
  }, [error, showError]);

  return null;
}

