export default function Loading() {
  return (
    <div className="animate-pulse space-y-3.5">
      {/* Title */}
      <div>
        <div className="h-[50px] w-24 rounded-lg bg-[#DDD9CC]" />
        <div className="mt-2 h-3.5 w-44 rounded-full bg-[#DDD9CC]" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-10 flex-1 rounded-xl border-[2.5px] border-foreground bg-[#DDD9CC]"
          />
        ))}
      </div>

      {/* Problem list */}
      <div className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex flex-col gap-2 p-4 ${i < 4 ? "border-b-[1.5px] border-[#eee]" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-48 rounded-full bg-[#DDD9CC]" />
              <div className="h-4 w-8 rounded-full bg-[#DDD9CC]" />
            </div>
            <div className="flex gap-2">
              <div className="h-3 w-14 rounded-full bg-[#DDD9CC]" />
              <div className="h-3 w-24 rounded-full bg-[#DDD9CC]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
