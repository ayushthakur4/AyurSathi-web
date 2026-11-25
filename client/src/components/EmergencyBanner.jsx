import { ShieldAlert } from "lucide-react";

/**
 * Prominent red glassmorphic banner shown when Gemini flags a query
 * as a potential medical emergency or serious condition.
 */
export default function EmergencyBanner({ message }) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-red-400/60 bg-red-500/20 p-5 text-red-950 backdrop-blur-xl shadow-[0_8px_32px_rgba(185,28,28,0.14)] sm:p-6"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-600/20 text-red-700">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-red-900 sm:text-lg">
            Seek Immediate Medical Attention
          </h2>
          <p className="text-sm leading-relaxed text-red-900/90">
            {message ||
              "This condition may require urgent medical evaluation. Please contact a doctor or emergency medical services immediately rather than relying on home remedies."}
          </p>
        </div>
      </div>
    </div>
  );
}
