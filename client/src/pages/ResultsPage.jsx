import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Stethoscope } from "lucide-react";
import BuddhaLogo from "../components/BuddhaLogo";
import SearchBar from "../components/SearchBar";
import SegmentedControl from "../components/SegmentedControl";
import GuidanceCard from "../components/GuidanceCard";
import EmergencyBanner from "../components/EmergencyBanner";
import SkeletonCards from "../components/SkeletonCards";
import ErrorCard from "../components/ErrorCard";
import EmptyState from "../components/EmptyState";
import { useSearch } from "../hooks/useSearch";

/**
 * Results view reading the search query from `/results?q=...`.
 * Displays Remedies and Yoga tabs, emergency alert if flagged, and doctor-visit notes.
 */
export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get("q") || "").trim();

  const [activeTab, setActiveTab] = useState("remedies");
  const { data, loading, error, executeSearch, retry } = useSearch();

  useEffect(() => {
    setActiveTab("remedies");
    executeSearch(query);
  }, [query, executeSearch]);

  const handleNewSearch = (nextQuery) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) return;
    if (trimmed === query) {
      executeSearch(trimmed);
      return;
    }
    navigate(`/results?q=${encodeURIComponent(trimmed)}`);
  };

  const remedies = data?.remedies || [];
  const yoga = data?.yoga || [];
  const hasAnyItems = remedies.length > 0 || yoga.length > 0;
  const activeItems = activeTab === "remedies" ? remedies : yoga;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      {/* Compact Top Navigation + Search Bar */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/50 bg-white/35 px-3.5 py-1.5 text-sm font-semibold text-sage-900 backdrop-blur-xl shadow-sm transition hover:bg-white/60"
        >
          <ArrowLeft className="h-4 w-4 text-sage-700" />
          <BuddhaLogo className="h-6 w-6" />
          <span>AyurSathi</span>
        </Link>

        <div className="flex-1">
          <SearchBar
            initialValue={query}
            onSearch={handleNewSearch}
            compact
            placeholder="Search another condition..."
          />
        </div>
      </header>

      {/* Main Content Area */}
      {!query ? (
        <EmptyState />
      ) : loading ? (
        <SkeletonCards query={query} />
      ) : error ? (
        <ErrorCard message={error} onRetry={retry} />
      ) : data ? (
        <div className="space-y-5">
          {/* Emergency Alert Banner */}
          {data.emergency && <EmergencyBanner message={data.summary} />}

          {/* Condition Overview Card */}
          {hasAnyItems && (
            <section className="rounded-3xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,55,40,0.08)] sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-sage-700/75">
                Ayurvedic &amp; Yoga Guidance
              </p>
              <h1 className="mt-1 text-2xl font-bold capitalize text-sage-900 sm:text-3xl">
                {data.condition || query}
              </h1>
              {data.summary && (
                <p className="mt-2 text-sm leading-relaxed text-sage-800/90 sm:text-base">
                  {data.summary}
                </p>
              )}
            </section>
          )}

          {/* Empty Lists vs Remedies / Yoga Results */}
          {!hasAnyItems ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex justify-center sm:justify-start">
                <SegmentedControl
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  remediesCount={remedies.length}
                  yogaCount={yoga.length}
                />
              </div>

              <section aria-live="polite">
                {activeItems.length > 0 ? (
                  <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
                    {activeItems.map((item, idx) => (
                      <GuidanceCard
                        key={`${activeTab}-${item.name}-${idx}`}
                        item={item}
                        type={activeTab}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </section>
            </>
          )}

          {/* When to see a doctor note */}
          {data.seeDoctorIf && (
            <aside className="rounded-3xl border border-white/40 bg-white/30 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,55,40,0.06)] sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-sage-700/15 text-sage-800">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-sage-900">
                    When to consult a doctor
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-sage-800/90">
                    {data.seeDoctorIf}
                  </p>
                </div>
              </div>
            </aside>
          )}
        </div>
      ) : null}
    </main>
  );
}
