# VaultedLabs "Fake Front Door" Landing Page

## Context

VaultedLabs needs to validate demand before building the full platform. A "fake front door" landing page with a waitlist CTA gauges real interest at minimal cost. The first 100 signups get $100 in platform credit as an incentive — and the financial analysis below shows this costs far less than it appears.

---

## Financial Analysis: $100 Credit Incentive for First 100 Users

### The Key Insight: Credit ≠ Cash

$100 in platform credit is NOT $100 in cash cost. In the per-demand model (Model #2), COGS is only incurred when a user **ships** an item. The majority of credit gets consumed with zero cash outflow.

### Numbers (from `constants.py`)

| Input | Value |
|-------|-------|
| Blended vault price | $35.36 (weighted by 60/20/12/8% mix) |
| Blended COGS per vault | $17.88 (~50.6% of price) |
| Hold rate | 65% (NO COGS) |
| Ship rate | 15% (COGS event) |
| Cashout rate | 20% (re-issues credit) |
| Breakage rate | 4% (credit expires unused) |
| Shipping cost | $8.00/item (platform pays) |

### Credit Flow Per $100 Given

$100 credit buys ~2.83 vaults at the blended price:

| Behavior | Vaults | Credit Consumed | COGS | Shipping |
|----------|--------|-----------------|------|----------|
| **HOLD (65%)** | 1.84 | $65.00 | $0 | $0 |
| **SHIP (15%)** | 0.42 | $15.00 | $7.56 | $3.40 |
| **CASHOUT (20%)** | 0.57 | $20.00 → re-issued as ~$20 new credit | $0 | $0 |

The ~$20 re-issued credit recirculates (decaying geometrically each round via breakage + shipping):

| Round | Credit Spent | COGS | Shipping |
|-------|-------------|------|----------|
| 1 | $10,000 | $756 | $340 |
| 2 | $1,920 | $145 | $65 |
| 3 | $369 | $28 | $13 |
| 4+ | ~$71 | ~$8 | ~$4 |
| **Total** | — | **~$937** | **~$422** |

### Bottom Line: 100 Users

| Metric | Amount |
|--------|--------|
| Gross credit issued | $10,000 |
| **Real cash cost (COGS + shipping)** | **~$1,259** |
| Breakage recovery (credit that expires) | ~$100 |
| **Net real cash outflow** | **~$1,159** |

### vs Normal Customer Acquisition

| | Credit Incentive | Standard CAC |
|---|---|---|
| Cost for 100 users | **~$1,259** | **$2,250** ($22.50 x 100) |
| Cost per user | $12.59 | $22.50 |
| Savings | **44% cheaper** | — |
| % of $40K budget | **3.1%** | 5.6% |

### Conversion Upside

If even 20% of credit users convert to paying customers:
- 20 users x 4 boxes/mo x $35.36 = **$2,829/mo revenue**
- At ~50% margin = ~$1,414/mo contribution
- **Pays back the $1,259 incentive in under 1 month**

**Verdict:** The incentive is capital-efficient (3.1% of budget), cheaper than normal CAC, and has high conversion upside.

---

## Technical Plan

### Stack

| Tool | Purpose |
|------|---------|
| **Vite** | Build tool (fast dev, optimized production builds) |
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |

### Location

`landing/` subdirectory in the existing repo:
```
vaulted-finance-model/
├── landing/          ← NEW: React SPA
├── constants.py
├── models.py
├── app.py
├── ...
```

### File Structure

```
landing/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── .gitignore
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css                 # Tailwind directives
    ├── lib/
    │   └── supabase.ts           # Supabase client init
    ├── hooks/
    │   └── useWaitlistCount.ts   # Live "X/100 spots" counter
    └── components/
        ├── Navbar.tsx            # Sticky nav with logo + CTA
        ├── Hero.tsx              # Headline + primary CTA
        ├── HowItWorks.tsx        # 3-step flow (Pick → Reveal → Choose)
        ├── VaultTiers.tsx        # 4 vault cards (Bronze-Diamond)
        ├── VaultCard.tsx         # Individual vault card
        ├── IncentiveBanner.tsx   # "$100 free credit" offer + spots counter
        ├── WaitlistForm.tsx      # Email capture form
        └── Footer.tsx
```

### Page Sections (top to bottom)

1. **Navbar** — Sticky. VaultedLabs wordmark + "Join the Waitlist" button
2. **Hero** — "Unbox the Extraordinary" headline, subtext about hold/ship/cashout, CTA button
3. **How It Works** — 3 cards: Pick Your Vault → Reveal Your Item → Your Choice
4. **Vault Tiers** — 4 cards showing Bronze ($24), Silver ($38), Gold ($54), Diamond ($86) with legendary odds
5. **Incentive Banner** — "First 100 Get $100 Free Credit" with spots-remaining counter + progress bar
6. **Waitlist Form** — Email input + submit button, success/error states
7. **Footer** — VaultedLabs, placeholder links, copyright

### Vault Data (matches `constants.py`)

```typescript
const VAULTS = [
  { name: "Bronze",  price: 24, legendaryChance: "1.7%", color: "#cd7f32" },
  { name: "Silver",  price: 38, legendaryChance: "3.1%", color: "#c0c0c0" },
  { name: "Gold",    price: 54, legendaryChance: "4.2%", color: "#ffd700" },
  { name: "Diamond", price: 86, legendaryChance: "4.4%", color: "#b9f2ff" },
];
```

### Design Direction

- **Dark background** (#0a0a0a) with gold accent (#f59e0b) for premium feel
- **Tier-specific colors**: Bronze (#cd7f32), Silver (#c0c0c0), Gold (#ffd700), Diamond (#b9f2ff)
- **Tone**: Confident, collectibles/gaming-adjacent. Use "vault" and "reveal" language, avoid gambling terms
- **Mobile-first** responsive: stack vertically on mobile, grid on desktop

### Email Capture Backend: Supabase

**Supabase** (free tier) — enables the live "X/100 spots remaining" counter:

- Install `@supabase/supabase-js`
- Create a `waitlist` table: `id` (serial), `email` (unique), `name` (optional), `created_at` (timestamp)
- Supabase client in `src/lib/supabase.ts` (env vars for URL + anon key)
- `useWaitlistCount` hook: queries `count` from `waitlist` table for live counter
- On form submit: insert row into `waitlist`, refresh count

### Environment Variables

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Create `.env.example` in `landing/` with placeholder values.

### Deployment

- **Vercel** (recommended): Connect GitHub, set base directory to `landing/`, auto-deploys on push
- Build command: `npm run build`, output: `dist/`
- Free tier sufficient for validation

---

## Implementation Steps

1. Scaffold Vite + React + TypeScript project in `landing/`
2. Install dependencies: Tailwind CSS, `@supabase/supabase-js`
3. Configure Tailwind + PostCSS
4. Create Supabase client (`src/lib/supabase.ts`) and `useWaitlistCount` hook
5. Build components top-to-bottom: Navbar → Hero → HowItWorks → VaultTiers → IncentiveBanner → WaitlistForm → Footer
6. Wire up WaitlistForm to Supabase (insert + refresh count)
7. Add responsive styling (mobile-first)
8. Add SEO meta tags (Open Graph, description)
9. Create `.env.example` with Supabase placeholder vars
10. Update root `.gitignore` for `landing/node_modules/` and `landing/dist/`

## Verification

1. `cd landing && npm run dev` — verify all sections render, responsive on mobile
2. Submit test email through waitlist form — verify it reaches the capture backend
3. `npm run build` — verify production build succeeds
4. Deploy to Vercel/Netlify — verify live URL works

---

## Cost Summary

| Item | Cost | Notes |
|------|------|-------|
| $100 credit incentive (real cash) | ~$1,259 | 3.1% of $40K budget |
| Landing page development | $0 (time only) | Open source tooling |
| Hosting (Vercel free tier) | $0 | Free for hobby projects |
| Supabase (email capture) | $0 | Free tier sufficient |
| Domain name (optional) | ~$12/year | e.g., vaultedlabs.com |
| **Total hard cost** | **~$1,271** | **3.2% of $40K budget** |
