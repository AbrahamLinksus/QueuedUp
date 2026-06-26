"use client";

import { motion } from "motion/react";
import type { HeatmapDay } from "@/lib/stats";

function levelClass(count: number) {
  if (count === 0) return "bg-border";
  if (count === 1) return "bg-accent/30";
  if (count <= 3) return "bg-accent/60";
  return "bg-accent";
}

export function Heatmap({ weeks }: { weeks: HeatmapDay[][] }) {
  return (
    <div className="flex gap-1 overflow-x-auto">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {week.map((day, dayIndex) => (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (weekIndex * 7 + dayIndex) * 0.003, duration: 0.2 }}
              whileHover={day.date ? { scale: 1.4 } : undefined}
              title={day.date ? `${day.date}: ${day.count} logged` : undefined}
              className={`h-3 w-3 rounded-sm ${day.date ? levelClass(day.count) : "bg-transparent"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
