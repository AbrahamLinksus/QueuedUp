"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/animated-number";

export function StatCard({
  label,
  value,
  suffix,
  index = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="rounded-xl border-[2.5px] border-foreground bg-surface p-3 shadow-[3px_3px_0_#111]"
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.9px] text-muted">{label}</p>
      <div className="mt-1 flex items-baseline gap-1">
        <p className="font-display text-[42px] leading-none text-foreground">
          <AnimatedNumber value={value} />
        </p>
        {suffix && <span className="text-xs text-muted">{suffix}</span>}
      </div>
    </motion.div>
  );
}
