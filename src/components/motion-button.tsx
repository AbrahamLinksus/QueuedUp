"use client";

import { motion } from "motion/react";
import { useFormStatus } from "react-dom";
import type { ComponentProps, ReactNode } from "react";

type Props = Omit<ComponentProps<typeof motion.button>, "children"> & {
  children?: ReactNode;
  loading?: boolean;
};

export function MotionButton({ className, children, disabled, loading, ...props }: Props) {
  const { pending } = useFormStatus();
  const isLoading = loading || pending;
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.03 }}
      whileTap={isDisabled ? {} : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={isDisabled}
      className={`${className ?? ""} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
