import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuddhaHero from "../components/BuddhaHero";
import BuddhaLogo from "../components/BuddhaLogo";
import SearchBar from "../components/SearchBar";
import SuggestionChips from "../components/SuggestionChips";
import { useSearch } from "../hooks/useSearch";

/**
 * Minimal landing view centered around the 3D-style interactive Buddha hero,
 * AyurSathi brand, rounded glass search bar, 5 suggestion chips, and recent searches.
 * Focusing the search bar or tapping Buddha awakens the multi-armed healing form.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const { recentSearches, clearRecentSearches } = useSearch();
  const [buddhaManualAwake, setBuddhaManualAwake] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const isAwakened = buddhaManualAwake || searchFocused;

  const handleSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setBuddhaManualAwake(true);
    setTimeout(() => {
      navigate(`/results?q=${encodeURIComponent(trimmed)}`);
    }, 320);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
      <div className="w-full max-w-2xl text-center">
        {/* Subtle Wellness Tag Pill with Buddha Brand Icon */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/35 px-3.5 py-1 backdrop-blur-xl shadow-sm">
          <BuddhaLogo className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wider text-sage-800/85">
            Holistic Wellness Guide
          </span>
        </div>

        {/* Interactive 3D Meditating -> Multi-Armed Buddha Hero */}
        <BuddhaHero
          awakened={isAwakened}
          onToggle={() => setBuddhaManualAwake((prev) => !prev)}
        />

        {/* Headline & Tagline */}
        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-sage-900 sm:text-4xl">
            AyurSathi
          </h1>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-sage-700/85 sm:text-base">
            Gentle Ayurvedic home remedies &amp; yoga for everyday wellness
          </p>
        </div>

        {/* Glass Search Bar */}
        <SearchBar onSearch={handleSearch} onFocusChange={setSearchFocused} />

        {/* 5 Suggestion Chips + Recent Chips */}
        <SuggestionChips
          onSelect={handleSearch}
          recentSearches={recentSearches}
          onClearRecent={clearRecentSearches}
        />
      </div>
    </main>
  );
}
