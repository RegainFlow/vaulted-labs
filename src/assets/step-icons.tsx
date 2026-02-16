export const VaultIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter
        id="glow-magenta-hiw"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-magenta-hiw)" stroke="#ff2d95" strokeWidth="2">
      <rect x="20" y="25" width="80" height="70" rx="6" />
      <rect x="30" y="33" width="60" height="54" rx="3" />
      <circle cx="60" cy="60" r="16" />
      <circle cx="60" cy="60" r="6" />
      <line x1="60" y1="44" x2="60" y2="48" />
      <line x1="60" y1="72" x2="60" y2="76" />
      <line x1="44" y1="60" x2="48" y2="60" />
      <line x1="72" y1="60" x2="76" y2="60" />
      <line x1="84" y1="55" x2="95" y2="55" strokeLinecap="round" />
      <line x1="84" y1="65" x2="95" y2="65" strokeLinecap="round" />
      <line x1="95" y1="55" x2="95" y2="65" strokeLinecap="round" />
      <rect x="20" y="35" width="4" height="8" rx="1" />
      <rect x="20" y="77" width="4" height="8" rx="1" />
    </g>
  </svg>
);

export const MysteryBoxIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter id="glow-cyan-hiw" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-cyan-hiw)" stroke="#00f0ff" strokeWidth="2">
      <path d="M30 60 L60 72 L90 60 L90 95 L60 107 L30 95 Z" />
      <line x1="60" y1="72" x2="60" y2="107" />
      <line x1="30" y1="60" x2="60" y2="48" />
      <line x1="90" y1="60" x2="60" y2="48" />
      <path d="M30 60 L18 38 L48 26 L60 48" />
      <path d="M90 60 L102 38 L72 26 L60 48" />
      <line x1="60" y1="18" x2="60" y2="8" strokeLinecap="round" />
      <line x1="55" y1="13" x2="65" y2="13" strokeLinecap="round" />
      <line x1="36" y1="24" x2="30" y2="16" strokeLinecap="round" />
      <line x1="29" y1="22" x2="37" y2="18" strokeLinecap="round" />
      <line x1="84" y1="24" x2="90" y2="16" strokeLinecap="round" />
      <line x1="91" y1="22" x2="83" y2="18" strokeLinecap="round" />
    </g>
  </svg>
);

export const DecisionIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter id="glow-green-hiw" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-green-hiw)" stroke="#39ff14" strokeWidth="2">
      {/* Central circle — decision point */}
      <circle cx="60" cy="40" r="12" />
      <circle cx="60" cy="40" r="4" fill="#39ff14" />
      {/* Three branching paths */}
      <path d="M48 48 L25 80" strokeLinecap="round" />
      <path d="M60 52 L60 80" strokeLinecap="round" />
      <path d="M72 48 L95 80" strokeLinecap="round" />
      {/* Store icon — left (box) */}
      <rect x="14" y="82" width="22" height="18" rx="3" />
      <line x1="14" y1="90" x2="36" y2="90" />
      {/* Ship icon — center (truck) */}
      <rect x="47" y="82" width="18" height="18" rx="2" />
      <path d="M65 90 L74 90 L78 96 L78 100 L65 100" />
      <circle cx="52" cy="103" r="3" />
      <circle cx="73" cy="103" r="3" />
      {/* Cashout icon — right (coins) */}
      <ellipse cx="95" cy="88" rx="12" ry="5" />
      <path d="M83 88 L83 94" />
      <path d="M107 88 L107 94" />
      <path d="M83 94 Q83 99 95 99 Q107 99 107 94" />
    </g>
  </svg>
);

export const ShopIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter
        id="glow-magenta2-hiw"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-magenta2-hiw)" stroke="#ff2d95" strokeWidth="2">
      {/* Storefront roof */}
      <path d="M15 50 L60 25 L105 50" strokeLinecap="round" />
      <line x1="15" y1="50" x2="105" y2="50" />
      {/* Awning scallops */}
      <path d="M20 50 Q30 62 40 50" />
      <path d="M40 50 Q50 62 60 50" />
      <path d="M60 50 Q70 62 80 50" />
      <path d="M80 50 Q90 62 100 50" />
      {/* Building body */}
      <rect x="20" y="50" width="80" height="48" rx="2" />
      {/* Door */}
      <rect x="46" y="70" width="28" height="28" rx="2" />
      <circle cx="70" cy="84" r="2" />
      {/* Window left */}
      <rect x="26" y="58" width="16" height="12" rx="1" />
      <line x1="34" y1="58" x2="34" y2="70" />
      {/* Price tag */}
      <circle cx="96" cy="36" r="8" />
      <line
        x1="96"
        y1="32"
        x2="96"
        y2="40"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <line
        x1="93"
        y1="35"
        x2="99"
        y2="35"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

export const LevelUpIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter id="glow-cyan2-hiw" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-cyan2-hiw)" stroke="#00f0ff" strokeWidth="2">
      {/* Star */}
      <path d="M60 15 L67 40 L92 40 L72 55 L79 80 L60 65 L41 80 L48 55 L28 40 L53 40 Z" />
      {/* Progress arc */}
      <path d="M30 95 A35 35 0 0 1 90 95" strokeDasharray="6 4" />
      {/* Progress fill */}
      <path
        d="M30 95 A35 35 0 0 1 75 87"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Up arrow */}
      <line
        x1="60"
        y1="105"
        x2="60"
        y2="88"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <polyline
        points="52 96 60 88 68 96"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      {/* XP sparkles */}
      <line
        x1="95"
        y1="25"
        x2="100"
        y2="20"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <line
        x1="100"
        y1="25"
        x2="95"
        y2="20"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <line
        x1="20"
        y1="30"
        x2="25"
        y2="25"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <line
        x1="25"
        y1="30"
        x2="20"
        y2="25"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

export const CoinsIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter id="glow-gold-hiw" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-gold-hiw)" stroke="#ffd700" strokeWidth="2">
      {/* Circular arrow — closed loop */}
      <path d="M60 20 A35 35 0 1 1 30 75" fill="none" />
      <polyline points="22 68 30 75 37 68" strokeLinecap="round" />
      {/* Center coin */}
      <circle cx="60" cy="58" r="20" />
      <circle cx="60" cy="58" r="14" />
      {/* Dollar sign */}
      <path
        d="M57 52 Q54 53 54 55 Q54 57 60 57 Q66 57 66 59 Q66 61 63 62"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <line
        x1="60"
        y1="49"
        x2="60"
        y2="65"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      {/* Small coins orbiting */}
      <circle cx="30" cy="40" r="8" />
      <circle cx="90" cy="40" r="8" />
      <circle cx="38" cy="88" r="6" />
      <circle cx="82" cy="88" r="6" />
    </g>
  </svg>
);

export const HexagonalIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="text-accent"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

export const DiamondIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="text-neon-cyan"
  >
    <path d="M6 3h12l4 6-10 13L2 9z" />
  </svg>
);

export const CheckMarkIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="text-neon-green"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const BoxIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="text-accent"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

export const StarIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="text-neon-cyan"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const MoneyIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="text-vault-gold"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);
