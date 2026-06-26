function SkeletonReviewCard() {
  return (
    <div className="overflow-hidden rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111]">
      <div className="p-4">
        <div className="space-y-2">
          <div className="h-2 w-16 rounded-full bg-[#DDD9CC]" />
          <div className="h-5 w-3/4 rounded-lg bg-[#DDD9CC]" />
          <div className="h-2.5 w-20 rounded-full bg-[#DDD9CC]" />
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-14 w-full rounded-lg bg-[#DDD9CC]" />
          <div className="h-9 w-full rounded-lg bg-[#DDD9CC]" />
          <div className="h-9 w-full rounded-lg bg-[#DDD9CC]" />
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
        <div className="mt-2 h-3.5 w-40 rounded-full bg-[#DDD9CC]" />
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
              className={`flex items-center gap-3 px-4 py-3 ${i < 2 ? "border-b border-[#eee]" : ""}`}
            >
              <div className="h-3.5 min-w-0 flex-1 rounded-full bg-[#DDD9CC]" />
              <div className="h-3 w-8 shrink-0 rounded-full bg-[#DDD9CC]" />
              <div className="h-3 w-12 shrink-0 rounded-full bg-[#DDD9CC]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
