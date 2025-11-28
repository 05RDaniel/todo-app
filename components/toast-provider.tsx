"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { ToastContainer } from "./toast";
import type { Toast } from "./toast";

type ToastContextType = {
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", duration?: number) => {
      const id = Math.random().toString(36).substring(7);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback((message: string) => {
    showToast(message, "error", 6000);
  }, [showToast]);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success", 3000);
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, "info", 4000);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess, showInfo }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

