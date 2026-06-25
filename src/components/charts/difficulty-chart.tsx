"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS: Record<string, string> = {
  Easy: "#34d399",
  Medium: "#fbbf24",
  Hard: "#f87171",
};

export function DifficultyChart({
  breakdown,
}: {
  breakdown: Record<string, number>;
}) {
  const data = [
    { name: "Easy", value: breakdown.EASY ?? 0 },
    { name: "Medium", value: breakdown.MEDIUM ?? 0 },
    { name: "Hard", value: breakdown.HARD ?? 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={64}
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: "#18181b", border: "1px solid #27272a", fontSize: 12 }}
          labelStyle={{ color: "#e4e4e7" }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={18}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
