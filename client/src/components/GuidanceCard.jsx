import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  ExternalLink,
  Flower2,
  Leaf,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { getBingThumbnailUrl } from "../utils/thumbnail";

/**
 * Expandable glass card displaying a Bing thumbnail image, title, and summary line.
 * Clicking expands the card to show ingredients/benefit, numbered steps,
 * suggested duration, highlighted caution, and a YouTube search button.
 */
export default function GuidanceCard({ item, type }) {
  const [expanded, setExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isRemedy = type === "remedies";
  const shortLine = isRemedy
    ? item.ingredients?.length
      ? `${item.ingredients.slice(0, 3).join(", ")}${
          item.ingredients.length > 3 ? ` +${item.ingredients.length - 3} more` : ""
        }`
      : item.duration
    : item.benefit;

  const thumbnailUrl = getBingThumbnailUrl(item.name, type);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    item.youtubeQuery || item.name
  )}`;

  const FallbackIcon = isRemedy ? Leaf : Flower2;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,55,40,0.08)] transition-all duration-300 hover:bg-white/40 hover:shadow-[0_12px_36px_rgba(31,55,40,0.12)]">
      {/* Clickable Card Header + Bing Thumbnail */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full flex-col text-left"
      >
        {/* Thumbnail Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-sage-100/80 via-[#FBF6EA] to-saffron-100/80">
          {!imgError ? (
            <>
              {!imgLoaded && (
                <div className="skeleton-shimmer absolute inset-0 bg-white/30" />
              )}
              <img
                src={thumbnailUrl}
                alt={item.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sage-700/60">
              <FallbackIcon className="h-10 w-10" />
            </div>
          )}

          {/* Subtle gradient scrim for legible glass pills */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 via-black/10 to-transparent"
          />

          {/* Top-left Category Badge */}
          <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/65 px-3 py-1 text-xs font-semibold text-sage-900 backdrop-blur-md shadow-sm">
            <FallbackIcon className="h-3.5 w-3.5 text-sage-700" />
            {isRemedy ? "Remedy" : "Yoga"}
          </span>

          {/* Bottom-left Duration Pill */}
          {item.duration && (
            <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1 rounded-full border border-white/40 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              <Clock className="h-3 w-3" />
              {item.duration}
            </span>
          )}
        </div>

        {/* Title & Summary Row */}
        <div className="flex w-full items-start justify-between gap-3 p-5">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h3 className="text-lg font-semibold leading-snug text-sage-900">
              {item.name}
            </h3>
            {shortLine && (
              <p className="line-clamp-2 text-sm leading-relaxed text-sage-700/90">
                {shortLine}
              </p>
            )}
          </div>

          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/45 text-sage-700 transition-transform duration-300 ${
              expanded ? "rotate-180 bg-white/75" : ""
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="space-y-4 border-t border-white/40 px-5 pb-5 pt-4">
          {/* Ingredients (Remedies) or Benefit (Yoga) */}
          {isRemedy && item.ingredients?.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sage-700/80">
                Ingredients
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, idx) => (
                  <span
                    key={`${ingredient}-${idx}`}
                    className="rounded-full border border-white/50 bg-white/45 px-3 py-1 text-xs font-medium text-sage-900"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isRemedy && item.benefit && (
            <div className="rounded-2xl border border-white/45 bg-white/35 p-3.5">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sage-700/80">
                <Sparkles className="h-3.5 w-3.5 text-sage-700" />
                Key Benefit
              </div>
              <p className="text-sm leading-relaxed text-sage-900">
                {item.benefit}
              </p>
            </div>
          )}

          {/* Numbered Steps */}
          {item.steps?.length > 0 && (
            <div>
              <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sage-700/80">
                <ListChecks className="h-3.5 w-3.5" />
                Steps
              </h4>
              <ol className="space-y-2">
                {item.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm leading-relaxed text-sage-900"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-700/15 text-xs font-semibold text-sage-800">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Caution */}
          {item.caution && (
            <div className="rounded-2xl border border-amber-300/60 bg-amber-100/55 p-3.5 text-sm text-amber-950 backdrop-blur-sm">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                Caution
              </div>
              <p className="leading-relaxed">{item.caution}</p>
            </div>
          )}

          {/* YouTube Search Button */}
          <div className="pt-1">
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/55 px-4 py-2 text-sm font-medium text-sage-900 shadow-sm transition-all duration-200 hover:bg-white/85 active:scale-[0.98]"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="h-3.5 w-3.5 text-sage-700" />
            </a>
          </div>
        </div>
      )}
    </article>
  );
}
