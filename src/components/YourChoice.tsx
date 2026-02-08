import { motion } from "motion/react";

const options = [
  {
    title: "Hold",
    description: "Keep items in your digital collection. Show them off. Trade later.",
    accentText: "text-neon-cyan",
    accentBg: "bg-neon-cyan",
    glowClass: "hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
    hoverBorder: "hover:border-neon-cyan/40",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Ship",
    description: "Get it delivered to your door. Real items, real excitement.",
    accentText: "text-neon-green",
    accentBg: "bg-neon-green",
    glowClass: "hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]",
    hoverBorder: "hover:border-neon-green/40",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H6.375m11.25-3V6.375a1.125 1.125 0 0 0-1.125-1.125H3.375a1.125 1.125 0 0 0-1.125 1.125v11.25" />
      </svg>
    ),
  },
  {
    title: "Cash Out",
    description: "Not your style? Convert to credit and try again.",
    accentText: "text-accent",
    accentBg: "bg-accent",
    glowClass: "hover:shadow-[0_0_20px_rgba(255,45,149,0.2)]",
    hoverBorder: "hover:border-accent/40",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
];

export function YourChoice() {
  return (
    <section className="border-y border-border bg-surface px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
          Your Item, Your Rules
        </h2>
        <p className="mx-auto mb-14 max-w-lg text-center text-text-muted">
          Every reveal comes with three options.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`rounded-2xl border border-border bg-bg p-6 transition-all lg:p-8 ${opt.hoverBorder} ${opt.glowClass}`}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-elevated ${opt.accentText}`}>
                {opt.icon}
              </div>
              <h3 className={`mb-2 text-lg font-semibold ${opt.accentText}`}>
                {opt.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {opt.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
