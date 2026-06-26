function SkeletonCard({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border-[2.5px] border-foreground bg-surface shadow-[3px_3px_0_#111] ${className ?? ""}`}>
      {children}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="animate-pulse space-y-3.5">
      {/* Title */}
      <div>
        <div className="h-[50px] w-52 rounded-lg bg-[#DDD9CC]" />
        <div className="mt-2 h-3.5 w-40 rounded-full bg-[#DDD9CC]" />
      </div>

      {/* 2×2 stat cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="p-3.5">
            <div className="mb-2 h-2 w-16 rounded-full bg-[#DDD9CC]" />
            <div className="h-9 w-14 rounded-lg bg-[#DDD9CC]" />
            <div className="mt-1 h-2.5 w-8 rounded-full bg-[#DDD9CC]" />
          </SkeletonCard>
        ))}
      </div>

      {/* Heatmap */}
      <SkeletonCard className="p-4">
        <div className="mb-2.5 h-2 w-32 rounded-full bg-[#DDD9CC]" />
        <div className="flex gap-1">
          {Array.from({ length: 15 }).map((_, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, di) => (
                <div key={di} className="h-3 w-3 rounded-[2px] bg-[#DDD9CC]" />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex gap-1.5">
          <div className="h-2.5 w-10 rounded-full bg-[#DDD9CC]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-2.5 w-2.5 rounded-[2px] bg-[#DDD9CC]" />
          ))}
          <div className="h-2.5 w-10 rounded-full bg-[#DDD9CC]" />
        </div>
      </SkeletonCard>

      {/* Difficulty bar */}
      <SkeletonCard className="p-4">
        <div className="mb-3 h-2 w-40 rounded-full bg-[#DDD9CC]" />
        <div className="mb-3 h-5 rounded-md bg-[#DDD9CC]" />
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3 w-16 rounded-full bg-[#DDD9CC]" />
          ))}
        </div>
      </SkeletonCard>
    </div>
  );
}
