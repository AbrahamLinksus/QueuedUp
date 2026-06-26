type CalendarProps = {
  reviewsByDate: Record<string, number>;
  today: Date;
};

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ReviewCalendar({ reviewsByDate, today }: CalendarProps) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = dateKey(today);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const maxCount = Math.max(1, ...Object.values(reviewsByDate));

  return (
    <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]">
      <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.9px] text-muted">
        {monthName}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_LABELS.map((d) => (
          <div key={d} className="pb-1 text-[9px] font-bold uppercase tracking-[0.5px] text-muted">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const count = reviewsByDate[key] ?? 0;
          const isToday = key === todayKey;
          const intensity = count === 0 ? 0 : Math.ceil((count / maxCount) * 3);

          const bg =
            isToday && count > 0
              ? "bg-foreground text-background"
              : isToday
              ? "ring-[2px] ring-foreground"
              : intensity === 3
              ? "bg-foreground/90 text-background"
              : intensity === 2
              ? "bg-foreground/50 text-foreground"
              : intensity === 1
              ? "bg-foreground/20 text-foreground"
              : "text-muted";

          return (
            <div
              key={i}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-md text-[11px] font-medium ${bg}`}
            >
              <span>{day}</span>
              {count > 0 && (
                <span className="text-[8px] leading-none opacity-80">{count}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
