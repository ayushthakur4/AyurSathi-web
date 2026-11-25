import { Clock, Sparkles } from "lucide-react";

const SUGGESTED_CONDITIONS = [
  "Cold",
  "Acidity",
  "Stress",
  "Back pain",
  "Headache",
];

/**
 * Displays curated quick-search suggestion chips and up to 5 recent searches
 * stored in localStorage.
 */
export default function SuggestionChips({
  onSelect,
  recentSearches = [],
  onClearRecent,
}) {
  return (
    <div className="mt-7 space-y-5">
      {/* Suggested health conditions */}
      <div className="flex flex-col items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-sage-700/75">
          <Sparkles className="h-3.5 w-3.5 text-saffron-700" />
          Try searching
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_CONDITIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className="rounded-full border border-white/50 bg-white/35 px-4 py-2 text-sm font-medium text-sage-900 backdrop-blur-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/60 hover:shadow active:translate-y-0"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Recent searches from localStorage */}
      {recentSearches.length > 0 && (
        <div className="flex flex-col items-center gap-2.5 pt-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-sage-700/75">
              <Clock className="h-3.5 w-3.5 text-sage-700/70" />
              Recent
            </span>
            {onClearRecent && (
              <button
                type="button"
                onClick={onClearRecent}
                className="text-xs text-sage-700/60 underline-offset-2 transition hover:text-sage-900 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onSelect(item)}
                className="rounded-full border border-white/40 bg-white/25 px-3.5 py-1.5 text-sm text-sage-900/90 backdrop-blur-lg transition-all duration-200 hover:bg-white/50"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
