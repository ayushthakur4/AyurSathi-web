import ChakraLoader from "./ChakraLoader";

/**
 * Loading state combining the 7-Chakras alignment sanctuary with
 * glassmorphic skeleton shimmer placeholders (no generic spinner).
 */
export default function SkeletonCards({ query = "" }) {
  return (
    <div aria-busy="true" aria-label="Loading Ayurvedic guidance" className="space-y-5">
      {/* 7-Chakras Alignment Sanctuary */}
      <ChakraLoader query={query} />

      {/* Segmented control shimmer */}
      <div className="skeleton-shimmer h-12 w-full max-w-sm rounded-full border border-white/40 bg-white/30 backdrop-blur-xl" />

      {/* 4 Card shimmers with thumbnails */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-3xl border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,55,40,0.06)]"
          >
            <div className="skeleton-shimmer aspect-[16/10] w-full bg-white/35" />
            <div className="flex items-start justify-between gap-4 p-5">
              <div className="flex-1 space-y-2.5">
                <div className="skeleton-shimmer h-5 w-44 rounded-full bg-white/50" />
                <div className="skeleton-shimmer h-4 w-full rounded-full bg-white/40" />
              </div>
              <div className="skeleton-shimmer h-9 w-9 shrink-0 rounded-full bg-white/45" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
