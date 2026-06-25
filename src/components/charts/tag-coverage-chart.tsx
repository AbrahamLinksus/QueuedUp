"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TagCoverageChart({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 32, 100)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: "#18181b", border: "1px solid #27272a", fontSize: 12 }}
          labelStyle={{ color: "#e4e4e7" }}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}
