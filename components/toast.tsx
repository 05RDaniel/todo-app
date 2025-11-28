"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastType = "error" | "success" | "info";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastProps = {
  toast: Toast;
  onRemove: (id: string) => void;
};

function ToastComponent({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const colors = {
    error: "bg-rose-500/90 border-rose-400/50 text-white",
    success: "bg-emerald-500/90 border-emerald-400/50 text-white",
    info: "bg-sky-500/90 border-sky-400/50 text-white",
  };

  const icons = {
    error: "✕",
    success: "✓",
    info: "ℹ",
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm transition-all animate-in slide-in-from-top-5 ${colors[toast.type]}`}
      role="alert"
    >
      <span className="text-lg font-bold">{icons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 rounded-lg px-2 py-1 text-xs font-semibold opacity-70 transition-opacity hover:opacity-100"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid calling setState synchronously
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 sm:right-6">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body,
  );
}
