export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-8 w-16"></div>
        </div>
        <div className="skeleton w-12 h-12 rounded-xl"></div>
      </div>
      <div className="skeleton h-3 w-32"></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-5 w-40 mb-4"></div>
      <div className="skeleton h-64 w-full"></div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="skeleton w-10 h-10 rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4"></div>
        <div className="skeleton h-3 w-1/2"></div>
      </div>
      <div className="skeleton h-6 w-20 rounded-full"></div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="skeleton h-8 w-48"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
}
