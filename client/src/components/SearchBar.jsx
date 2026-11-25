import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * Reusable iOS-style glassmorphic search bar.
 * Enforces the 100-character limit and trims whitespace before submitting.
 */
export default function SearchBar({
  initialValue = "",
  onSearch,
  onFocusChange,
  placeholder = "Search a health concern (e.g. cold, acidity, back pain)...",
  compact = false,
  autoFocus = false,
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex items-center gap-2 rounded-full border border-white/50 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,55,40,0.08)] transition-all duration-200 focus-within:border-white/80 focus-within:bg-white/55 focus-within:shadow-[0_12px_36px_rgba(31,55,40,0.12)] ${
          compact ? "px-3.5 py-2" : "px-4 py-2.5 sm:px-5 sm:py-3"
        }`}
      >
        <Search
          className={`shrink-0 text-sage-700/70 ${
            compact ? "h-4 w-4" : "h-5 w-5"
          }`}
        />
        <input
          type="text"
          value={value}
          maxLength={100}
          autoFocus={autoFocus}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          onChange={(e) => {
            setValue(e.target.value);
            onFocusChange?.(true);
          }}
          placeholder={placeholder}
          aria-label="Search health condition"
          className={`w-full bg-transparent text-sage-900 placeholder:text-sage-700/50 focus:outline-none ${
            compact ? "text-sm sm:text-base" : "text-base sm:text-lg"
          }`}
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Clear search"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sage-700/60 transition hover:bg-white/50 hover:text-sage-900"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={!value.trim()}
          className={`shrink-0 rounded-full bg-sage-700 font-medium text-white shadow-sm transition-all duration-200 hover:bg-sage-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 ${
            compact
              ? "px-4 py-1.5 text-sm"
              : "px-5 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base"
          }`}
        >
          Search
        </button>
      </div>
    </form>
  );
}
