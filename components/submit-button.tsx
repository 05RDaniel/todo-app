"use client";

import { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ComponentPropsWithoutRef<"button"> & {
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "Saving...",
  className = "",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      {...props}
      className={`inline-flex items-center justify-center gap-2 text-sm font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={pending || props.disabled}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

