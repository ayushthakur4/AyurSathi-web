import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const CHAKRAS = [
  {
    id: "muladhara",
    sanskrit: "Muladhara",
    name: "Root Chakra",
    color: "#E05A47",
    glow: "rgba(224, 90, 71, 0.45)",
    y: 214,
    petals: 4,
    message: "Grounding your physical foundation & vitality",
  },
  {
    id: "svadhishthana",
    sanskrit: "Svadhishthana",
    name: "Sacral Chakra",
    color: "#F08C3A",
    glow: "rgba(240, 140, 58, 0.45)",
    y: 185,
    petals: 6,
    message: "Restoring natural flow & gentle comfort",
  },
  {
    id: "manipura",
    sanskrit: "Manipura",
    name: "Solar Plexus",
    color: "#EBB328",
    glow: "rgba(235, 179, 40, 0.48)",
    y: 156,
    petals: 8,
    message: "Balancing Agni & inner digestive harmony",
  },
  {
    id: "anahata",
    sanskrit: "Anahata",
    name: "Heart Chakra",
    color: "#4CA76B",
    glow: "rgba(76, 167, 107, 0.48)",
    y: 127,
    petals: 10,
    message: "Opening calm breath & healing prana",
  },
  {
    id: "vishuddha",
    sanskrit: "Vishuddha",
    name: "Throat Chakra",
    color: "#3FA3C2",
    glow: "rgba(63, 163, 194, 0.45)",
    y: 98,
    petals: 12,
    message: "Harmonizing soothing herbal wisdom",
  },
  {
    id: "ajna",
    sanskrit: "Ajna",
    name: "Third Eye",
    color: "#5E6CE0",
    glow: "rgba(94, 108, 224, 0.48)",
    y: 68,
    petals: 6,
    message: "Focusing mindful yoga & pranayama",
  },
  {
    id: "sahasrara",
    sanskrit: "Sahasrara",
    name: "Crown Chakra",
    color: "#9A67E6",
    glow: "rgba(154, 103, 230, 0.5)",
    y: 38,
    petals: 16,
    message: "Aligning complete Ayurvedic guidance",
  },
];

/**
 * Animated 7-Chakras Energy Awakening loader.
 * Replaces generic spinners with a progressive chakra alignment meditation
 * along the Sushumna spine and Ida/Pingala energy channels.
 */
export default function ChakraLoader({ query = "" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CHAKRAS.length);
    }, 1250);
    return () => clearInterval(interval);
  }, []);

  const currentChakra = CHAKRAS[activeIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/35 p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(31,55,40,0.1)] sm:p-7">
      {/* Dynamic Chakra Color Aura Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl transition-colors duration-700"
        style={{ backgroundColor: currentChakra.glow }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-sage-200/50 blur-3xl"
      />

      <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* 7-Chakras Meditating Silhouette & Energy Spine */}
        <div className="relative flex h-60 w-48 shrink-0 items-center justify-center rounded-3xl border border-white/50 bg-white/30 shadow-inner backdrop-blur-md">
          <svg
            viewBox="0 0 200 250"
            className="h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="spineGlow" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#E05A47" />
                <stop offset="35%" stopColor="#EBB328" />
                <stop offset="65%" stopColor="#4CA76B" />
                <stop offset="100%" stopColor="#9A67E6" />
              </linearGradient>

              <linearGradient id="yogiSilhouette" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#355E43" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#1D3626" stopOpacity="0.34" />
              </linearGradient>

              <filter id="chakraBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Translucent Meditating Figure Silhouette */}
            <g fill="url(#yogiSilhouette)" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1">
              {/* Head & Crown */}
              <circle cx="100" cy="64" r="19" />
              <ellipse cx="100" cy="42" rx="7" ry="5" />
              {/* Shoulders, Torso & Lotus Legs */}
              <path d="M86 84 C64 90, 56 118, 52 152 C48 182, 28 202, 24 218 C22 228, 44 234, 100 234 C156 234, 178 228, 176 218 C172 202, 152 182, 148 152 C144 118, 136 90, 114 84 Z" />
            </g>

            {/* Ida & Pingala Intertwined Sine-Wave Nadis */}
            <path
              d="M100 214 C72 198, 72 170, 100 156 C128 142, 128 112, 100 98 C74 84, 76 54, 100 38"
              fill="none"
              stroke="#F4B860"
              strokeWidth="1.6"
              strokeOpacity="0.65"
              strokeDasharray="5 5"
              className="animate-nadi-flow"
            />
            <path
              d="M100 214 C128 198, 128 170, 100 156 C72 142, 72 112, 100 98 C126 84, 124 54, 100 38"
              fill="none"
              stroke="#7EC492"
              strokeWidth="1.6"
              strokeOpacity="0.65"
              strokeDasharray="5 5"
              className="animate-nadi-flow"
              style={{ animationDirection: "reverse" }}
            />

            {/* Central Sushumna Spine Channel */}
            <line
              x1="100"
              y1="216"
              x2="100"
              y2="34"
              stroke="url(#spineGlow)"
              strokeWidth="2.4"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />

            {/* Ascending Prana Energy Spark */}
            <circle
              cx="100"
              cy="32"
              r="4.5"
              fill="#FFFFFF"
              filter="url(#chakraBlur)"
              className="animate-prana-rise"
            />

            {/* 7 Chakra Nodes (Root to Crown) */}
            {CHAKRAS.map((chakra, idx) => {
              const isCurrent = idx === activeIndex;
              const isLit = idx <= activeIndex;

              return (
                <g key={chakra.id} transform={`translate(100, ${chakra.y})`}>
                  {/* Expanding Energy Ripple on Active Chakra */}
                  {isCurrent && (
                    <circle
                      cx="0"
                      cy="0"
                      r="11"
                      fill="none"
                      stroke={chakra.color}
                      strokeWidth="2"
                      className="animate-chakra-ripple"
                    />
                  )}

                  {/* Outer Lotus Mandala Petals */}
                  <g
                    style={{
                      transform: isCurrent ? "scale(1.28)" : isLit ? "scale(1)" : "scale(0.82)",
                      transition: "transform 450ms cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    {Array.from({ length: Math.min(chakra.petals, 8) }).map((_, pIdx) => (
                      <ellipse
                        key={pIdx}
                        cx="0"
                        cy="-9"
                        rx="2.3"
                        ry="4.2"
                        transform={`rotate(${(pIdx * 360) / Math.min(chakra.petals, 8)})`}
                        fill={chakra.color}
                        fillOpacity={isLit ? 0.72 : 0.25}
                      />
                    ))}

                    {/* Chakra Core */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isCurrent ? 7.5 : 5.5}
                      fill={chakra.color}
                      fillOpacity={isLit ? 1 : 0.4}
                      stroke="#FFFFFF"
                      strokeWidth="1.4"
                      filter={isCurrent ? "url(#chakraBlur)" : undefined}
                    />
                    <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" fillOpacity={isLit ? 0.95 : 0.45} />
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Chakra Alignment Status & Controls */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/55 px-3 py-1 text-xs font-semibold text-sage-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-saffron-700" />
            <span>
              {query ? `Preparing guidance for "${query}"` : "Aligning Holistic Guidance"}
            </span>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span
                className="h-3 w-3 rounded-full shadow-sm transition-colors duration-500"
                style={{
                  backgroundColor: currentChakra.color,
                  boxShadow: `0 0 12px ${currentChakra.glow}`,
                }}
              />
              <h2 className="text-xl font-bold text-sage-900 sm:text-2xl">
                {currentChakra.sanskrit}
                <span className="ml-2 text-sm font-medium text-sage-700/80">
                  · {currentChakra.name}
                </span>
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-sage-800/90 sm:text-base">
              {currentChakra.message}...
            </p>
          </div>

          {/* 7-Chakra Energy Progress Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {CHAKRAS.map((chakra, idx) => {
              const isCurrent = idx === activeIndex;
              const isLit = idx <= activeIndex;
              return (
                <button
                  key={chakra.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  title={`${chakra.sanskrit} (${chakra.name})`}
                  aria-label={`Focus ${chakra.sanskrit} ${chakra.name}`}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    isCurrent ? "w-9" : "w-3.5"
                  }`}
                  style={{
                    backgroundColor: isLit ? chakra.color : "rgba(255,255,255,0.55)",
                    boxShadow: isCurrent ? `0 0 12px ${chakra.glow}` : "none",
                  }}
                />
              );
            })}
          </div>

          <p className="mt-3 text-xs text-sage-700/75">
            Awakening 4 Ayurvedic home remedies &amp; 4 yoga practices...
          </p>
        </div>
      </div>
    </div>
  );
}
