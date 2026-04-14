export default function ResultLoading() {
  return (
    <div
      className="min-h-screen bg-[#F8FAFC]"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Fake Navbar */}
      <nav className="bg-white border-b border-slate-200 h-16 flex items-center px-6">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg shimmer" />
            <div className="w-28 h-5 rounded-lg shimmer" />
          </div>
          <div className="w-32 h-8 rounded-full shimmer" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header skeleton */}
        <div className="mb-10 space-y-3">
          <div className="w-40 h-4 rounded-lg shimmer" />
          <div className="w-72 h-9 rounded-xl shimmer" />
          <div className="w-96 h-4 rounded-lg shimmer" />
        </div>

        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col items-center gap-4">
            <div className="w-24 h-4 rounded shimmer" />
            <div className="w-40 h-40 rounded-full shimmer" />
            <div className="w-20 h-6 rounded-full shimmer" />
          </div>
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="w-2/3 h-3 rounded shimmer" />
                <div className="w-1/2 h-8 rounded-lg shimmer" />
                <div className="w-3/4 h-3 rounded shimmer" />
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Issues list skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-48 h-6 rounded-lg shimmer mb-6" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50">
                  <div className="w-8 h-8 rounded-full shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-2/3 h-4 rounded shimmer" />
                    <div className="w-full h-3 rounded shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="w-24 h-4 rounded shimmer" />
              <div className="w-full h-4 rounded shimmer" />
              <div className="w-full h-4 rounded shimmer" />
              <div className="w-3/4 h-4 rounded shimmer" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 space-y-2">
                    <div className="w-8 h-7 rounded shimmer mx-auto" />
                    <div className="w-full h-2 rounded shimmer" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <div className="w-32 h-4 rounded shimmer" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-7 rounded-full shimmer" style={{ width: `${60 + i * 10}px` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
