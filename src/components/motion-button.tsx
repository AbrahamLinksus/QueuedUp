"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";

export function MotionButton({ className, ...props }: ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
      {...props}
    />
  );
}
