import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Friendly glassmorphic error state with a Retry button.
 */
export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="rounded-3xl border border-white/45 bg-white/35 p-6 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(31,55,40,0.08)] sm:p-8">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-700">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-sage-900">
        Couldn&apos;t load guidance
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-sage-700/90">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-sage-900 active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
