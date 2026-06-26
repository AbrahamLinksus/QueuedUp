function SkeletonReviewCard() {
  return (
    <div className="rounded-xl border-[2.5px] border-foreground bg-surface p-4 shadow-[3px_3px_0_#111]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-2 w-20 rounded-full bg-[#DDD9CC]" />
          <div className="h-5 w-48 rounded-lg bg-[#DDD9CC]" />
          <div className="h-2.5 w-24 rounded-full bg-[#DDD9CC]" />
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="h-9 w-16 rounded-xl border-[2.5px] border-foreground bg-[#DDD9CC]" />
          <div className="h-9 w-16 rounded-xl border-[2.5px] border-foreground bg-[#DDD9CC]" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="animate-pulse space-y-3.5">
      {/* Title */}
      <div>
        <div className="h-[50px] w-36 rounded-lg bg-[#DDD9CC]" />
        <div className="mt-2 h-3.5 w-44 rounded-full bg-[#DDD9CC]" />
      </div>

      {/* Review cards */}
      <SkeletonReviewCard />
      <SkeletonReviewCard />
      <SkeletonReviewCard />

      {/* Upcoming section */}
      <div>
        <div className="mb-3 h-7 w-28 rounded-lg bg-[#DDD9CC]" />
        <div className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-[#eee]" : ""}`}
            >
              <div className="h-3.5 w-36 rounded-full bg-[#DDD9CC]" />
              <div className="h-3 w-16 rounded-full bg-[#DDD9CC]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
