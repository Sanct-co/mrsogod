export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-12 flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gold-mid/20" />
        <div className="h-3 w-20 animate-pulse bg-gold-mid/20" />
        <div className="h-10 w-64 animate-pulse bg-gold-mid/20" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="chamfer-lg border border-gold-mid/20 bg-maroon-core/60 p-4">
            <div className="aspect-[3/4] w-full animate-pulse bg-black-red/60" />
            <div className="mt-4 h-5 w-3/4 animate-pulse bg-gold-mid/20" />
            <div className="mt-2 h-3 w-1/2 animate-pulse bg-gold-mid/10" />
            <div className="mt-3 h-3 w-full animate-pulse bg-gold-mid/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
