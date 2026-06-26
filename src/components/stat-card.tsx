"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/animated-number";

export function StatCard({
  label,
  value,
  tone,
  index = 0,
}: {
  label: string;
  value: number;
  tone?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="rounded-lg border border-border bg-surface p-4"
    >
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone ?? "text-foreground"}`}>
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  );
}
