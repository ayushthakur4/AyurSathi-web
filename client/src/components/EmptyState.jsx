import { Search } from "lucide-react";

/**
 * Empty state shown when no remedies or yoga practices are returned
 * (for example, when the query is not a health condition).
 */
export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/30 p-8 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(31,55,40,0.08)]">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50 text-sage-700">
        <Search className="h-5 w-5" />
      </div>
      <p className="text-base font-medium text-sage-900">
        Please search for a health condition.
      </p>
      <p className="mt-1 text-sm text-sage-700/80">
        Try conditions like Cold, Acidity, Stress, Back pain, or Headache.
      </p>
    </div>
  );
}
