import { motion } from "motion/react";

const VaultIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter id="glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-magenta)" stroke="#ff2d95" strokeWidth="2">
      {/* Safe body */}
      <rect x="20" y="25" width="80" height="70" rx="6" />
      {/* Inner door panel */}
      <rect x="30" y="33" width="60" height="54" rx="3" />
      {/* Combination dial outer */}
      <circle cx="60" cy="60" r="16" />
      {/* Dial inner */}
      <circle cx="60" cy="60" r="6" />
      {/* Dial tick marks */}
      <line x1="60" y1="44" x2="60" y2="48" />
      <line x1="60" y1="72" x2="60" y2="76" />
      <line x1="44" y1="60" x2="48" y2="60" />
      <line x1="72" y1="60" x2="76" y2="60" />
      {/* Handle */}
      <line x1="84" y1="55" x2="95" y2="55" strokeLinecap="round" />
      <line x1="84" y1="65" x2="95" y2="65" strokeLinecap="round" />
      <line x1="95" y1="55" x2="95" y2="65" strokeLinecap="round" />
      {/* Hinges */}
      <rect x="20" y="35" width="4" height="8" rx="1" />
      <rect x="20" y="77" width="4" height="8" rx="1" />
    </g>
  </svg>
);

const MysteryBoxIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-cyan)" stroke="#00f0ff" strokeWidth="2">
      {/* Box body — front face */}
      <path d="M30 60 L60 72 L90 60 L90 95 L60 107 L30 95 Z" />
      {/* Box body — center divider */}
      <line x1="60" y1="72" x2="60" y2="107" />
      {/* Box top edge — back */}
      <line x1="30" y1="60" x2="60" y2="48" />
      <line x1="90" y1="60" x2="60" y2="48" />
      {/* Open lid — left flap hinged back */}
      <path d="M30 60 L18 38 L48 26 L60 48" />
      {/* Open lid — right flap hinged back */}
      <path d="M90 60 L102 38 L72 26 L60 48" />
      {/* Sparkle top center */}
      <line x1="60" y1="18" x2="60" y2="8" strokeLinecap="round" />
      <line x1="55" y1="13" x2="65" y2="13" strokeLinecap="round" />
      {/* Sparkle top left */}
      <line x1="36" y1="24" x2="30" y2="16" strokeLinecap="round" />
      <line x1="29" y1="22" x2="37" y2="18" strokeLinecap="round" />
      {/* Sparkle top right */}
      <line x1="84" y1="24" x2="90" y2="16" strokeLinecap="round" />
      <line x1="91" y1="22" x2="83" y2="18" strokeLinecap="round" />
      {/* Small glow rays */}
      <line x1="46" y1="10" x2="43" y2="4" strokeLinecap="round" strokeWidth="1.5" />
      <line x1="74" y1="10" x2="77" y2="4" strokeLinecap="round" strokeWidth="1.5" />
    </g>
  </svg>
);

const CoinsIllustration = () => (
  <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
    <defs>
      <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow-green)" stroke="#39ff14" strokeWidth="2">
      {/* Coin stack — back (top of pile) */}
      <ellipse cx="60" cy="38" rx="24" ry="9" />
      <path d="M36 38 L36 44" />
      <path d="M84 38 L84 44" />
      <path d="M36 44 Q36 53 60 53 Q84 53 84 44" />
      {/* Coin stack — middle */}
      <path d="M36 44 L36 56" />
      <path d="M84 44 L84 56" />
      <path d="M36 56 Q36 65 60 65 Q84 65 84 56" />
      {/* Coin stack — front (bottom of pile) */}
      <path d="M36 56 L36 68" />
      <path d="M84 56 L84 68" />
      <path d="M36 68 Q36 77 60 77 Q84 77 84 68" />
      {/* Dollar sign on top coin face */}
      <path d="M57 34 Q54 35 54 37 Q54 39 60 39 Q66 39 66 41 Q66 43 63 44" strokeLinecap="round" strokeWidth="1.5" />
      <line x1="60" y1="31" x2="60" y2="47" strokeLinecap="round" strokeWidth="1.5" />
      {/* Scattered loose coins — left */}
      <ellipse cx="28" cy="82" rx="14" ry="5" />
      <path d="M14 82 L14 86" />
      <path d="M42 82 L42 86" />
      <path d="M14 86 Q14 91 28 91 Q42 91 42 86" />
      {/* Scattered loose coins — right */}
      <ellipse cx="82" cy="80" rx="12" ry="4.5" />
      <path d="M70 80 L70 84" />
      <path d="M94 80 L94 84" />
      <path d="M70 84 Q70 88.5 82 88.5 Q94 88.5 94 84" />
      {/* Tilted coin — leaning against pile */}
      <ellipse cx="48" cy="86" rx="4" ry="10" transform="rotate(-15 48 86)" />
    </g>
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Pick Your Vault",
    description: "Choose from 6 vaults ranging from bronze - diamond.",
    illustration: <VaultIllustration />,
    icon: (
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
    )
  },
  {
    number: "02",
    title: "Reveal Your Loot",
    description: "Every vault contains a real physical collectible.",
    illustration: <MysteryBoxIllustration />,
    icon: (
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
    )
  },
  {
    number: "03",
    title: "Your Choice",
    description:
      "Store it in your inventory, ship it to your door, or sell it.",
    illustration: <CoinsIllustration />,
    icon: (
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
    )
  }
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-bg relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-6 sm:px-10 md:px-16 py-3 md:py-4.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm sm:text-base md:text-[20px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6">
            How It Works
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative p-5 sm:p-6 md:p-8 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-colors group"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-5 sm:left-6 md:left-8 px-3 py-1 bg-accent text-white text-xs font-black rounded-lg shadow-[0_0_15px_rgba(255,45,149,0.3)]">
                {step.number}
              </div>

              {/* Step illustration */}
              <div className="mt-4 mb-4 h-40 sm:h-44 md:h-48 rounded-xl overflow-hidden bg-surface-elevated flex items-center justify-center">
                {step.illustration}
              </div>

              <div className="mb-6 w-14 h-14 rounded-xl bg-surface-elevated border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                {step.icon}
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">
                {step.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
