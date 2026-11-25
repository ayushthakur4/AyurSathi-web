/**
 * Compact 3D-shaded Meditating Buddha brand logo matching BuddhaHero.
 * Uses scoped gradient IDs so it renders cleanly alongside the hero sculpture.
 */
export default function BuddhaLogo({ className = "h-7 w-7" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="logoHalo" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFE9AE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F4B860" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="logoSkin" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF5E1" />
          <stop offset="60%" stopColor="#F0CFA0" />
          <stop offset="100%" stopColor="#C9965B" />
        </radialGradient>
        <linearGradient id="logoRobe" x1="20%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#F5BD60" />
          <stop offset="50%" stopColor="#DE8A2B" />
          <stop offset="100%" stopColor="#9C5314" />
        </linearGradient>
        <radialGradient id="logoHair" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4F6354" />
          <stop offset="100%" stopColor="#19261D" />
        </radialGradient>
        <radialGradient id="logoOrb" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#B9E3C1" />
          <stop offset="100%" stopColor="#4F8A62" />
        </radialGradient>
      </defs>

      {/* Halo Ring */}
      <circle cx="32" cy="29" r="24" fill="url(#logoHalo)" />
      <circle
        cx="32"
        cy="29"
        r="21"
        fill="none"
        stroke="#E39B38"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeDasharray="3 2.5"
      />

      {/* Lotus Base */}
      <path
        d="M15 52 C20 47.5, 44 47.5, 49 52 C44 56, 20 56, 15 52 Z"
        fill="#DFECE0"
        stroke="#5A8F6B"
        strokeOpacity="0.5"
        strokeWidth="0.9"
      />
      <path d="M24 52 C28 57.5, 36 57.5, 40 52 Z" fill="#F9E5BF" />

      {/* Padmasana Legs */}
      <path
        d="M16 48 C15 42.5, 22.5 39, 32 39 C41.5 39, 49 42.5, 48 48 C47 51, 39.5 52, 32 52 C24.5 52, 17 51, 16 48 Z"
        fill="url(#logoRobe)"
      />

      {/* Torso & Saffron Robe */}
      <path
        d="M25 27 C24 32, 24 37, 25 41.5 L39 41.5 C40 37, 40 32, 39 27 C37 25, 27 25, 25 27 Z"
        fill="url(#logoSkin)"
      />
      <path
        d="M25 27 C28 26, 32 30, 39 35.5 L39 41.5 L25 41.5 C24 37, 24 31, 25 27 Z"
        fill="url(#logoRobe)"
      />

      {/* Arms & Healing Orb */}
      <path
        d="M25 28 C21 31, 21 38, 25 42.5 C27 44.5, 30 44.5, 31 42.5 C28 40, 26 37, 26 33 Z"
        fill="url(#logoRobe)"
      />
      <path
        d="M39 28 C43 31, 43 38, 39 42.5 C37 44.5, 34 44.5, 33 42.5 C36 40, 38 37, 38 33 Z"
        fill="url(#logoSkin)"
      />
      <circle cx="32" cy="42" r="3" fill="url(#logoOrb)" />

      {/* Head & Ushnisha */}
      <circle cx="32" cy="18.5" r="7.2" fill="url(#logoSkin)" />
      <path
        d="M25 17.5 C25 11.2, 39 11.2, 39 17.5 C36.6 15.2, 27.4 15.2, 25 17.5 Z"
        fill="url(#logoHair)"
      />
      <ellipse cx="32" cy="10.8" rx="3.6" ry="2.7" fill="url(#logoHair)" />
      <circle cx="32" cy="7.8" r="1.2" fill="#FFE49C" />

      {/* Serene Eyes & Smile */}
      <path
        d="M27.8 19 Q29.5 20.3 31.1 19"
        fill="none"
        stroke="#5D3D1E"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M32.9 19 Q34.5 20.3 36.2 19"
        fill="none"
        stroke="#5D3D1E"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M30.3 22.6 Q32 23.8 33.7 22.6"
        fill="none"
        stroke="#8F572B"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
    </svg>
  );
}
