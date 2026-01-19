export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative pt-20 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 bg-secondary/20">
        <div className="max-w-[80rem] mx-auto">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-12 bg-secondary rounded" />
            <div className="h-4 w-4 bg-secondary rounded" />
            <div className="h-4 w-16 bg-secondary rounded" />
            <div className="h-4 w-4 bg-secondary rounded" />
            <div className="h-4 w-24 bg-secondary rounded" />
          </div>

          {/* Main Hero Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Pokemon Image Skeleton */}
            <div className="flex-shrink-0 flex justify-center lg:justify-start">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-secondary rounded-full" />
            </div>

            {/* Pokemon Info Skeleton */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {/* Name & ID */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-48 bg-secondary rounded-lg" />
                <div className="h-10 w-20 bg-secondary rounded-lg" />
              </div>

              {/* Type Badges */}
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-secondary rounded-full" />
                <div className="h-8 w-20 bg-secondary rounded-full" />
              </div>

              {/* Category Badges */}
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-secondary rounded" />
                <div className="h-6 w-20 bg-secondary rounded" />
                <div className="h-6 w-24 bg-secondary rounded" />
              </div>

              {/* Flavor Text */}
              <div className="space-y-2">
                <div className="h-4 w-full max-w-xl bg-secondary rounded" />
                <div className="h-4 w-3/4 max-w-lg bg-secondary rounded" />
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="h-5 w-32 bg-secondary rounded" />
                <div className="h-5 w-32 bg-secondary rounded" />
              </div>

              {/* Battle Button */}
              <div className="h-12 w-40 bg-secondary rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Three Column Layout for Stats, Abilities & Evolution */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Stats Section */}
          <div className="p-6 bg-card/30 rounded-2xl border border-border/50">
            <div className="h-7 w-40 bg-secondary rounded mb-4" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-16 bg-secondary rounded" />
                  <div className="h-4 w-8 bg-secondary rounded" />
                  <div className="flex-1 h-4 bg-secondary rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Abilities Skeleton */}
          <div className="p-6 bg-card/30 rounded-2xl border border-border/50">
            <div className="h-7 w-32 bg-secondary rounded mb-4" />
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="h-5 w-32 bg-secondary rounded mb-2" />
                  <div className="h-4 w-full bg-secondary rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Evolution Chain Skeleton - spans full width on md (2 cols) and lg (2 cols) */}
          <div className="md:col-span-2 lg:col-span-2 p-6 bg-card/30 rounded-2xl border border-border/50">
            <div className="h-7 w-40 bg-secondary rounded mb-4" />
            <div className="flex justify-center gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 bg-secondary rounded-xl" />
                  <div className="h-4 w-16 bg-secondary rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Moves Table Skeleton */}
        <div className="p-6 bg-card/30 rounded-2xl border border-border/50">
          <div className="h-7 w-32 bg-secondary rounded mb-4" />
          <div className="flex gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-secondary rounded-lg" />
            ))}
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
