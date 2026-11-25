import { Leaf, Flower2 } from "lucide-react";

/**
 * iOS-style glass segmented control switching between "Remedies" and "Yoga".
 */
export default function SegmentedControl({
  activeTab,
  onChange,
  remediesCount = 0,
  yogaCount = 0,
}) {
  const tabs = [
    { id: "remedies", label: "Remedies", count: remediesCount, icon: Leaf },
    { id: "yoga", label: "Yoga", count: yogaCount, icon: Flower2 },
  ];

  return (
    <div
      role="tablist"
      aria-label="Guidance categories"
      className="inline-flex w-full max-w-sm rounded-full border border-white/50 bg-white/30 p-1.5 backdrop-blur-xl shadow-[0_4px_20px_rgba(31,55,40,0.06)]"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-white/85 text-sage-900 shadow-sm"
                : "text-sage-700/80 hover:text-sage-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActive
                  ? "bg-sage-100 text-sage-700"
                  : "bg-white/35 text-sage-700/75"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
