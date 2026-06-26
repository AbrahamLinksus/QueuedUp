"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS: Record<string, string> = {
  Easy: "#4ade80",
  Medium: "#c2c20a",
  Hard: "#ef4444",
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
          tick={{ fill: "#9c9b8e", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: "#2b2c27", border: "1px solid #3c3d37", fontSize: 12 }}
          labelStyle={{ color: "#ececE2" }}
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
