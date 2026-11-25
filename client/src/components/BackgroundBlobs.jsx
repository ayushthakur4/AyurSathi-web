/**
 * Ambient Ayurvedic gradient backdrop with softly blurred floating color blobs
 * sitting behind the glassmorphic cards.
 */
export default function BackgroundBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#E6EFE4] via-[#FBF6EA] to-[#FBEAD1]"
    >
      {/* Top-left sage blob */}
      <div className="animate-blob-slow absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#9BC4A0]/55 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

      {/* Top-right soft saffron blob */}
      <div className="animate-blob-reverse absolute -right-20 top-16 h-72 w-72 rounded-full bg-[#F5BF6C]/45 blur-3xl sm:h-[24rem] sm:w-[24rem]" />

      {/* Bottom-center warm cream-sage blend */}
      <div className="animate-blob-slow absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-[#B9D6B6]/50 blur-3xl sm:h-[26rem] sm:w-[26rem]" />

      {/* Subtle warm apricot accent on lower left */}
      <div className="animate-blob-reverse absolute bottom-12 -left-16 h-60 w-60 rounded-full bg-[#F7D49E]/40 blur-3xl sm:h-80 sm:w-80" />
    </div>
  );
}
