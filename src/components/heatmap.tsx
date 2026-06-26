"use client";

import { motion } from "motion/react";
import type { HeatmapDay } from "@/lib/stats";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function cellBg(count: number, date: string | null, today: string): string {
  if (!date) return "transparent";
  if (date === today) return "#E8342A";
  if (count === 0) return "#DDD9CC";
  if (count === 1) return "#888";
  if (count <= 3) return "#666";
  return "#111";
}

export function Heatmap({ weeks }: { weeks: HeatmapDay[][] }) {
  const today = todayKey();

  return (
    <div className="flex gap-[3px] overflow-x-auto">
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[3px]">
          {week.map((day, dayIndex) => (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (weekIndex * 7 + dayIndex) * 0.003, duration: 0.2 }}
              whileHover={day.date ? { scale: 1.4 } : undefined}
              title={day.date ? `${day.date}: ${day.count} logged` : undefined}
              style={{ backgroundColor: cellBg(day.count, day.date, today) }}
              className="h-3 w-3 rounded-[2px]"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
