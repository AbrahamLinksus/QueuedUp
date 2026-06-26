"use client";

import { motion } from "motion/react";

export function CodeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <rect x="4" y="4" width="112" height="82" rx="10" />
      <line x1="4" y1="24" x2="116" y2="24" />
      <circle cx="16" cy="14" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="26" cy="14" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="36" cy="14" r="2.5" fill="currentColor" stroke="none" />

      <line x1="16" y1="38" x2="48" y2="38" className="text-accent" stroke="currentColor" />
      <line x1="16" y1="50" x2="70" y2="50" />
      <line x1="24" y1="62" x2="60" y2="62" />
      <motion.line
        x1="16"
        y1="74"
        x2="34"
        y2="74"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
