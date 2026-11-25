import { useState } from "react";
import { Sparkles } from "lucide-react";

/**
 * Interactive 3D-shaded Meditating Buddha centerpiece.
 * - Calm state: peaceful meditation posture on a levitating lotus pedestal.
 * - Awakened state (on clicking Buddha or focusing/searching): blooms a radiant
 *   mandala aura and unfurls 6 additional sacred arms holding Ayurvedic & yoga symbols,
 *   with interactive 3D cursor tilt parallax.
 */
export default function BuddhaHero({ awakened = false, onToggle }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Number((-ny * 10).toFixed(2)),
      y: Number((nx * 12).toFixed(2)),
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const armTransition =
    "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]";

  return (
    <div className="relative mx-auto flex flex-col items-center select-none">
      {/* 3D Perspective Stage */}
      <button
        type="button"
        onClick={onToggle}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        aria-pressed={awakened}
        aria-label={
          awakened
            ? "Multi-armed awakened Buddha. Click to return to meditation."
            : "Meditating Buddha. Click to awaken multi-armed healing form."
        }
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        className="group relative flex h-[230px] w-[320px] cursor-pointer items-center justify-center rounded-[2.5rem] transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500/60 sm:h-[265px] sm:w-[390px]"
      >
        {/* Ambient luminous halo glow behind sculpture */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-4 rounded-full blur-3xl transition-all duration-700 ${
            awakened
              ? "scale-110 bg-gradient-to-tr from-[#F4B860]/55 via-[#FFE5A3]/60 to-[#7EB68A]/50 opacity-100"
              : "scale-95 bg-gradient-to-tr from-[#9CC5A1]/40 via-[#FFF5DF]/50 to-[#F4B860]/35 opacity-80 group-hover:opacity-100"
          }`}
        />

        {/* Glass ring aura pedestal frame */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute h-48 w-48 rounded-full border transition-all duration-700 sm:h-56 sm:w-56 ${
            awakened
              ? "scale-110 border-saffron-300/65 bg-white/20 shadow-[0_0_60px_rgba(227,155,56,0.28)]"
              : "scale-95 border-white/40 bg-white/15 shadow-[0_8px_32px_rgba(31,55,40,0.08)]"
          } backdrop-blur-md`}
        />

        {/* 3D-Shaded Multi-Layer SVG Sculpture */}
        <svg
          viewBox="0 0 420 320"
          className="relative z-10 h-full w-full overflow-visible drop-shadow-[0_14px_24px_rgba(29,54,38,0.16)]"
        >
          <defs>
            {/* 3D Skin / Sandstone-Gold Shading */}
            <radialGradient id="skin3d" cx="42%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#FFF5E1" />
              <stop offset="55%" stopColor="#F0CFA0" />
              <stop offset="100%" stopColor="#C9965B" />
            </radialGradient>

            {/* Darker depth shading for back arms */}
            <linearGradient id="backArm3d" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F6DAB0" />
              <stop offset="60%" stopColor="#DEB277" />
              <stop offset="100%" stopColor="#B88043" />
            </linearGradient>

            {/* 3D Saffron-Amber Robe Shading */}
            <linearGradient id="robe3d" x1="25%" y1="10%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#F5BD60" />
              <stop offset="48%" stopColor="#DE8A2B" />
              <stop offset="100%" stopColor="#9C5314" />
            </linearGradient>

            {/* Robe inner fold shadow */}
            <linearGradient id="robeShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C26E1E" />
              <stop offset="100%" stopColor="#7C3D0C" />
            </linearGradient>

            {/* Sacred Hair & Ushnisha */}
            <radialGradient id="hair3d" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4F6354" />
              <stop offset="60%" stopColor="#2C3D31" />
              <stop offset="100%" stopColor="#19261D" />
            </radialGradient>

            {/* 3D Lotus Pedestal */}
            <linearGradient id="lotusOuter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9EC" />
              <stop offset="65%" stopColor="#DFECE0" />
              <stop offset="100%" stopColor="#8DB696" />
            </linearGradient>
            <linearGradient id="lotusInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="60%" stopColor="#F9E5BF" />
              <stop offset="100%" stopColor="#D7A762" />
            </linearGradient>

            {/* Glowing Chakra / Aura Orb */}
            <radialGradient id="healingOrb" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#B9E3C1" />
              <stop offset="100%" stopColor="#4F8A62" />
            </radialGradient>

            <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE9AE" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#F4B860" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
            </radialGradient>

            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ground Pedestal Shadow */}
          <ellipse
            cx="210"
            cy="296"
            rx="82"
            ry="11"
            fill="#1D3626"
            className="animate-shadow-breathe"
            style={{ transformOrigin: "210px 296px" }}
          />

          {/* Sacred Mandala Halo Behind Buddha */}
          <g
            className={`transition-all duration-700 ${
              awakened ? "scale-110 opacity-100" : "scale-95 opacity-65"
            }`}
            style={{ transformOrigin: "210px 145px" }}
          >
            <circle cx="210" cy="145" r="118" fill="url(#haloGlow)" />

            {/* Outer Sacred Geometry Ring */}
            <g className="animate-mandala-spin">
              <circle
                cx="210"
                cy="145"
                r="102"
                fill="none"
                stroke="#E39B38"
                strokeOpacity={awakened ? "0.65" : "0.3"}
                strokeWidth="1.4"
                strokeDasharray="6 8"
              />
              {Array.from({ length: 12 }).map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 210 145)`}>
                  <path
                    d="M210 38 Q217 50 210 60 Q203 50 210 38 Z"
                    fill={awakened ? "#F5C26B" : "#C5DBC5"}
                    fillOpacity={awakened ? "0.65" : "0.4"}
                  />
                </g>
              ))}
            </g>

            {/* Inner Mandala Ring */}
            <g className="animate-mandala-spin-reverse">
              <circle
                cx="210"
                cy="145"
                r="74"
                fill="none"
                stroke="#5A8F6B"
                strokeOpacity={awakened ? "0.55" : "0.28"}
                strokeWidth="1.2"
                strokeDasharray="3 6"
              />
            </g>
          </g>

          {/* Floating Prana Motes */}
          <g aria-hidden="true">
            <circle
              cx="94"
              cy="102"
              r="3.2"
              fill="#F5C26B"
              className="animate-prana"
            />
            <circle
              cx="326"
              cy="96"
              r="3.5"
              fill="#8CC497"
              className="animate-prana"
              style={{ animationDelay: "1.1s" }}
            />
            <circle
              cx="116"
              cy="205"
              r="2.6"
              fill="#FFE4A3"
              className="animate-prana"
              style={{ animationDelay: "2s" }}
            />
            <circle
              cx="305"
              cy="210"
              r="2.8"
              fill="#9CC5A1"
              className="animate-prana"
              style={{ animationDelay: "0.6s" }}
            />
          </g>

          {/* Main Levitating Buddha Assembly */}
          <g className="animate-buddha-levitate">
            {/* ============================================================
                MULTI-ARMED LAYER (Unfurls gracefully when awakened === true)
               ============================================================ */}

            {/* UPPER ARM PAIR: Left (Lotus) & Right (Prana Sun / Blessing) */}
            <g
              className={armTransition}
              style={{
                transformOrigin: "184px 154px",
                transitionDelay: awakened ? "40ms" : "100ms",
                transform: awakened
                  ? "translate(0px, 0px) rotate(0deg) scale(1)"
                  : "translate(22px, 14px) rotate(36deg) scale(0.32)",
                opacity: awakened ? 1 : 0,
              }}
            >
              {/* Left Upper Arm */}
              <path
                d="M186 156 C154 146, 128 118, 118 88 C115 78, 127 74, 132 84 C140 107, 160 128, 189 140 Z"
                fill="url(#backArm3d)"
              />
              {/* Gold Wrist Bangle */}
              <ellipse
                cx="123"
                cy="84"
                rx="8"
                ry="3.5"
                transform="rotate(-24 123 84)"
                fill="#E39B38"
              />
              {/* Left Upper Hand */}
              <path
                d="M116 80 C110 70, 114 60, 121 63 C125 65, 129 73, 127 81 Z"
                fill="url(#skin3d)"
              />
              {/* Glowing Lotus Blossom Held */}
              <g filter="url(#softGlow)" transform="translate(114, 52)">
                <path
                  d="M0 10 C-7 3, -7 -5, 0 -9 C7 -5, 7 3, 0 10 Z"
                  fill="#FFF5DC"
                />
                <path
                  d="M-2 10 C-12 8, -14 0, -8 -5 C-4 -1, -2 4, -2 10 Z"
                  fill="#F5C26B"
                />
                <path
                  d="M2 10 C12 8, 14 0, 8 -5 C4 -1, 2 4, 2 10 Z"
                  fill="#F5C26B"
                />
              </g>
            </g>

            <g
              className={armTransition}
              style={{
                transformOrigin: "236px 154px",
                transitionDelay: awakened ? "40ms" : "100ms",
                transform: awakened
                  ? "translate(0px, 0px) rotate(0deg) scale(1)"
                  : "translate(-22px, 14px) rotate(-36deg) scale(0.32)",
                opacity: awakened ? 1 : 0,
              }}
            >
              {/* Right Upper Arm */}
              <path
                d="M234 156 C266 146, 292 118, 302 88 C305 78, 293 74, 288 84 C280 107, 260 128, 231 140 Z"
                fill="url(#backArm3d)"
              />
              <ellipse
                cx="297"
                cy="84"
                rx="8"
                ry="3.5"
                transform="rotate(24 297 84)"
                fill="#E39B38"
              />
              {/* Right Upper Hand (Abhaya / Blessing) */}
              <path
                d="M304 80 C310 70, 306 60, 299 63 C295 65, 291 73, 293 81 Z"
                fill="url(#skin3d)"
              />
              {/* Radiant Sun / Prana Orb */}
              <g filter="url(#softGlow)" transform="translate(306, 52)">
                <circle cx="0" cy="0" r="8.5" fill="#FFE6A3" />
                <circle
                  cx="0"
                  cy="0"
                  r="13"
                  fill="none"
                  stroke="#F5B851"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                />
              </g>
            </g>

            {/* MIDDLE ARM PAIR: Left (Tulsi Herb Leaf) & Right (Healing Bowl) */}
            <g
              className={armTransition}
              style={{
                transformOrigin: "180px 168px",
                transitionDelay: awakened ? "110ms" : "50ms",
                transform: awakened
                  ? "translate(0px, 0px) rotate(0deg) scale(1)"
                  : "translate(28px, 4px) rotate(22deg) scale(0.3)",
                opacity: awakened ? 1 : 0,
              }}
            >
              <path
                d="M180 166 C144 166, 108 156, 86 138 C78 131, 86 120, 95 127 C115 142, 146 150, 181 151 Z"
                fill="url(#backArm3d)"
              />
              <ellipse
                cx="91"
                cy="134"
                rx="3.5"
                ry="8"
                transform="rotate(28 91 134)"
                fill="#E39B38"
              />
              <path
                d="M84 134 C74 128, 72 119, 80 118 C86 118, 90 125, 89 132 Z"
                fill="url(#skin3d)"
              />
              {/* Glowing Ayurvedic Herb Leaf */}
              <g filter="url(#softGlow)" transform="translate(72, 112)">
                <path
                  d="M0 10 C-9 2, -6 -10, 4 -12 C12 -4, 9 7, 0 10 Z"
                  fill="#74B084"
                />
                <path
                  d="M0 10 L3 -8"
                  stroke="#E8F5E9"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </g>
            </g>

            <g
              className={armTransition}
              style={{
                transformOrigin: "240px 168px",
                transitionDelay: awakened ? "110ms" : "50ms",
                transform: awakened
                  ? "translate(0px, 0px) rotate(0deg) scale(1)"
                  : "translate(-28px, 4px) rotate(-22deg) scale(0.3)",
                opacity: awakened ? 1 : 0,
              }}
            >
              <path
                d="M240 166 C276 166, 312 156, 334 138 C342 131, 334 120, 325 127 C305 142, 274 150, 239 151 Z"
                fill="url(#backArm3d)"
              />
              <ellipse
                cx="329"
                cy="134"
                rx="3.5"
                ry="8"
                transform="rotate(-28 329 134)"
                fill="#E39B38"
              />
              <path
                d="M336 134 C346 128, 348 119, 340 118 C334 118, 330 125, 331 132 Z"
                fill="url(#skin3d)"
              />
              {/* Golden Singing Bowl / Amrit Kalasha */}
              <g filter="url(#softGlow)" transform="translate(347, 114)">
                <path
                  d="M-11 -2 C-11 8, 11 8, 11 -2 Z"
                  fill="#E8A23C"
                />
                <ellipse cx="0" cy="-2" rx="11" ry="3" fill="#FFE6A7" />
              </g>
            </g>

            {/* LOWER ARM PAIR: Left (Wisdom Mudra) & Right (Healing Pearl) */}
            <g
              className={armTransition}
              style={{
                transformOrigin: "180px 182px",
                transitionDelay: awakened ? "180ms" : "0ms",
                transform: awakened
                  ? "translate(0px, 0px) rotate(0deg) scale(1)"
                  : "translate(28px, -8px) rotate(-18deg) scale(0.28)",
                opacity: awakened ? 1 : 0,
              }}
            >
              <path
                d="M178 180 C145 190, 118 202, 96 196 C86 193, 89 180, 99 183 C120 188, 145 178, 177 168 Z"
                fill="url(#backArm3d)"
              />
              <ellipse
                cx="97"
                cy="189"
                rx="3.5"
                ry="7.5"
                transform="rotate(14 97 189)"
                fill="#E39B38"
              />
              <path
                d="M91 190 C81 190, 77 183, 83 178 C88 175, 94 180, 95 187 Z"
                fill="url(#skin3d)"
              />
              <circle
                cx="78"
                cy="176"
                r="6"
                fill="url(#healingOrb)"
                filter="url(#softGlow)"
              />
            </g>

            <g
              className={armTransition}
              style={{
                transformOrigin: "240px 182px",
                transitionDelay: awakened ? "180ms" : "0ms",
                transform: awakened
                  ? "translate(0px, 0px) rotate(0deg) scale(1)"
                  : "translate(-28px, -8px) rotate(18deg) scale(0.28)",
                opacity: awakened ? 1 : 0,
              }}
            >
              <path
                d="M242 180 C275 190, 302 202, 324 196 C334 193, 331 180, 321 183 C300 188, 275 178, 243 168 Z"
                fill="url(#backArm3d)"
              />
              <ellipse
                cx="323"
                cy="189"
                rx="3.5"
                ry="7.5"
                transform="rotate(-14 323 189)"
                fill="#E39B38"
              />
              <path
                d="M329 190 C339 190, 343 183, 337 178 C332 175, 326 180, 325 187 Z"
                fill="url(#skin3d)"
              />
              <circle
                cx="342"
                cy="176"
                r="6"
                fill="#FFE59F"
                filter="url(#softGlow)"
              />
            </g>

            {/* ============================================================
                3D LOTUS THRONE PEDESTAL
               ============================================================ */}
            <g>
              {/* Back Petals */}
              <path
                d="M126 254 C118 236, 138 228, 158 245 Z"
                fill="url(#lotusOuter)"
              />
              <path
                d="M294 254 C302 236, 282 228, 262 245 Z"
                fill="url(#lotusOuter)"
              />
              {/* Mid Layer Petals */}
              <path
                d="M140 264 C132 242, 162 232, 184 254 Z"
                fill="url(#lotusOuter)"
              />
              <path
                d="M280 264 C288 242, 258 232, 236 254 Z"
                fill="url(#lotusOuter)"
              />
              <path
                d="M168 270 C166 242, 198 236, 210 258 C222 236, 254 242, 252 270 Z"
                fill="url(#lotusInner)"
              />
              {/* Base Cushion */}
              <ellipse
                cx="210"
                cy="268"
                rx="78"
                ry="15"
                fill="url(#lotusOuter)"
                stroke="#FFFFFF"
                strokeOpacity="0.65"
                strokeWidth="1.2"
              />
              {/* Front Sculpted Lotus Petals */}
              <path
                d="M150 269 C155 286, 182 287, 192 272 Z"
                fill="url(#lotusInner)"
              />
              <path
                d="M270 269 C265 286, 238 287, 228 272 Z"
                fill="url(#lotusInner)"
              />
              <path
                d="M188 271 C195 290, 225 290, 232 271 C222 264, 198 264, 188 271 Z"
                fill="url(#lotusInner)"
              />
            </g>

            {/* ============================================================
                PRIMARY MEDITATING BUDDHA SCULPTURE
               ============================================================ */}

            {/* Crossed Legs in Padmasana (Lotus Pose) */}
            <path
              d="M140 245 C135 224, 165 208, 210 208 C255 208, 285 224, 280 245 C275 262, 240 267, 210 267 C180 267, 145 262, 140 245 Z"
              fill="url(#robe3d)"
            />
            {/* Robe Drape Folds on Knees */}
            <path
              d="M152 246 C175 256, 200 254, 210 248 C220 254, 245 256, 268 246"
              fill="none"
              stroke="url(#robeShadow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Feet Resting on Opposite Thighs */}
            <ellipse
              cx="188"
              cy="242"
              rx="13"
              ry="7"
              transform="rotate(-12 188 242)"
              fill="url(#skin3d)"
            />
            <ellipse
              cx="232"
              cy="242"
              rx="13"
              ry="7"
              transform="rotate(12 232 242)"
              fill="url(#skin3d)"
            />

            {/* Torso & Neck */}
            <path
              d="M181 146 C176 168, 174 198, 178 220 L242 220 C246 198, 244 168, 239 146 C230 138, 190 138, 181 146 Z"
              fill="url(#skin3d)"
            />
            {/* Saffron Robe Draped Over Left Shoulder */}
            <path
              d="M179 146 C192 142, 208 158, 242 186 L242 222 L177 222 C173 198, 175 168, 179 146 Z"
              fill="url(#robe3d)"
            />
            {/* Diagonal Robe Fold Highlight */}
            <path
              d="M184 151 C198 156, 218 174, 239 194"
              fill="none"
              stroke="#FFE3A1"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Neck */}
            <path
              d="M198 122 L222 122 L224 143 C215 147, 205 147, 196 143 Z"
              fill="url(#skin3d)"
            />

            {/* Primary Foreground Arms & Dhyana Mudra */}
            <path
              d="M180 148 C162 162, 158 198, 174 218 C184 230, 196 231, 204 226 C194 218, 182 206, 180 188 C179 174, 182 162, 186 154 Z"
              fill="url(#robe3d)"
            />
            <path
              d="M240 148 C258 162, 262 198, 246 218 C236 230, 224 231, 216 226 C226 218, 238 206, 240 188 C241 174, 238 162, 234 154 Z"
              fill="url(#skin3d)"
            />
            {/* Hands in Meditation Lap */}
            <path
              d="M192 223 C198 215, 222 215, 228 223 C224 233, 196 233, 192 223 Z"
              fill="url(#skin3d)"
            />
            {/* Glowing Healing Bowl / Prana Orb in Hands */}
            <circle
              cx="210"
              cy="218"
              r={awakened ? "9.5" : "7.5"}
              fill="url(#healingOrb)"
              filter="url(#softGlow)"
              className="transition-all duration-700"
            />

            {/* Glowing Chakra Nodes When Awakened */}
            <g
              className="transition-opacity duration-700"
              opacity={awakened ? 0.95 : 0}
              filter="url(#softGlow)"
            >
              <circle cx="210" cy="176" r="3.5" fill="#FFEBA8" />
              <circle cx="210" cy="144" r="3" fill="#B6E5BE" />
            </g>

            {/* Head, Ears, Face & Ushnisha */}
            <g>
              {/* Elongated Earlobes */}
              <path
                d="M179 92 C173 94, 173 114, 179 116 C182 117, 184 112, 183 102 Z"
                fill="url(#skin3d)"
              />
              <path
                d="M241 92 C247 94, 247 114, 241 116 C238 117, 236 112, 237 102 Z"
                fill="url(#skin3d)"
              />

              {/* Face Contour */}
              <path
                d="M182 88 C182 64, 238 64, 238 88 C238 112, 226 128, 210 128 C194 128, 182 112, 182 88 Z"
                fill="url(#skin3d)"
              />

              {/* Sculpted Hair & Crown Ushnisha */}
              <path
                d="M181 84 C180 60, 240 60, 239 84 C232 76, 222 73, 210 73 C198 73, 188 76, 181 84 Z"
                fill="url(#hair3d)"
              />
              <ellipse cx="210" cy="56" rx="14" ry="11" fill="url(#hair3d)" />
              {/* Crown Jewel Glow */}
              <circle
                cx="210"
                cy="44"
                r={awakened ? "4" : "2.6"}
                fill="#FFE49C"
                filter="url(#softGlow)"
                className="transition-all duration-700"
              />

              {/* Urna (Third Eye Bindu) */}
              <circle
                cx="210"
                cy="85"
                r={awakened ? "2.6" : "1.8"}
                fill={awakened ? "#FFF2B2" : "#D68928"}
                filter={awakened ? "url(#softGlow)" : undefined}
                className="transition-all duration-500"
              />

              {/* Serene Brows */}
              <path
                d="M191 90 Q198 86 205 90"
                fill="none"
                stroke="#7A5229"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M215 90 Q222 86 229 90"
                fill="none"
                stroke="#7A5229"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Eyes: Calm Half-Closed in Meditation -> Gently Luminous Open-Gaze on Awaken */}
              {awakened ? (
                <g>
                  <path
                    d="M192 96 Q198 92 204 96 Q198 99 192 96 Z"
                    fill="#3E2B18"
                  />
                  <circle cx="198" cy="96" r="1.4" fill="#FFE6A3" />
                  <path
                    d="M216 96 Q222 92 228 96 Q222 99 216 96 Z"
                    fill="#3E2B18"
                  />
                  <circle cx="222" cy="96" r="1.4" fill="#FFE6A3" />
                </g>
              ) : (
                <g>
                  <path
                    d="M192 96 Q198 100 204 96"
                    fill="none"
                    stroke="#5D3D1E"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M216 96 Q222 100 228 96"
                    fill="none"
                    stroke="#5D3D1E"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Delicate Nose & Peaceful Smile */}
              <path
                d="M210 95 L209 105 Q210 107 212 105"
                fill="none"
                stroke="#B57E48"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M203 113 Q210 118 217 113"
                fill="none"
                stroke="#8F572B"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>
          </g>
        </svg>

        {/* Subtle Status Pill */}
        <span
          className={`pointer-events-none absolute -bottom-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-xl transition-all duration-500 ${
            awakened
              ? "border-saffron-300/70 bg-saffron-100/75 text-saffron-700 shadow-sm"
              : "border-white/50 bg-white/40 text-sage-700/80 opacity-90 group-hover:bg-white/65"
          }`}
        >
          <Sparkles className="h-3 w-3" />
          {awakened ? "Healing Wisdom Awakened" : "Tap Buddha or Search to awaken"}
        </span>
      </button>
    </div>
  );
}
