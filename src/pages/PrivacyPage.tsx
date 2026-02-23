import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";

interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Scope",
    paragraphs: [
      "This Privacy Policy applies to information collected through the VaultedLabs website and related online services.",
    ],
  },
  {
    title: "2. Information We Collect",
    bullets: [
      "Contact data: email address submitted for waitlist access.",
      "Usage and analytics data: page views, clicks, navigation paths, and in-app interactions.",
      "Device and technical data: browser type, operating system, approximate location inferred from IP, and session metadata.",
      "Security and anti-abuse data: signals used to prevent spam and abuse, including CAPTCHA and Turnstile verification results.",
      "Replay and heatmap data: interaction playback and aggregate click/scroll behavior.",
    ],
  },
  {
    title: "3. Cookies and Similar Technologies",
    paragraphs: [
      "VaultedLabs uses cookies and local storage to operate analytics and product telemetry, including session continuity and feature behavior.",
      "Analytics is currently collected by default and an in-product cookie consent banner is not yet implemented.",
    ],
  },
  {
    title: "4. How We Use Information",
    bullets: [
      "Provide and improve the VaultedLabs experience.",
      "Analyze engagement and product performance.",
      "Monitor reliability, troubleshoot issues, and secure the service.",
      "Detect and prevent spam, fraud, and abuse.",
      "Communicate service updates and waitlist-related messages.",
    ],
  },
  {
    title: "5. Analytics, Replay, and Heatmaps",
    paragraphs: [
      "VaultedLabs uses PostHog for product analytics, session replay, and heatmaps. This may include event tracking, page metadata, interaction signals, and replayed session behavior configured with input masking controls.",
    ],
  },
  {
    title: "6. How We Share Information",
    bullets: [
      "PostHog (analytics, session replay, heatmaps).",
      "Supabase (application backend and data services).",
      "Cloudflare Turnstile (bot and abuse prevention).",
      "We may also disclose information when required by law, legal process, or to protect rights, safety, and platform integrity.",
    ],
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "Information is retained for as long as reasonably necessary for the purposes in this policy, including security, analytics, legal, and operational needs.",
    ],
  },
  {
    title: "8. Security",
    paragraphs: [
      "VaultedLabs uses reasonable administrative, technical, and organizational safeguards to protect information. No system is fully secure, and absolute security cannot be guaranteed.",
    ],
  },
  {
    title: "9. Eligibility and Children",
    paragraphs: [
      "VaultedLabs is intended for users age 18 and older. VaultedLabs does not knowingly collect personal information from children.",
    ],
  },
  {
    title: "10. Your Choices",
    paragraphs: [
      "You may request access, correction, or deletion of personal information by contacting support@vaulted-labs.com.",
    ],
  },
  {
    title: "11. Changes to this Policy",
    paragraphs: [
      "This Privacy Policy may be updated from time to time. The Last updated date reflects the current version.",
    ],
  },
  {
    title: "12. Contact",
    paragraphs: ["Questions or privacy requests: support@vaulted-labs.com."],
  },
];

export function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg px-4 sm:px-6 pt-28 md:pt-32 pb-14">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-surface-elevated/40 backdrop-blur-sm p-6 sm:p-8 md:p-10">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-accent mb-4">
              Legal
            </p>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-text-muted text-sm mb-8">
              Last updated: February 21, 2026
            </p>

            <div className="space-y-8">
              {PRIVACY_SECTIONS.map((section) => (
                <section key={section.title} className="space-y-3">
                  <h2 className="text-white text-lg sm:text-xl font-black tracking-tight">
                    {section.title}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm sm:text-base leading-7 text-text-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-7 text-text-muted">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 text-xs sm:text-sm text-text-dim">
              This policy is provided for general informational purposes and
              does not constitute legal advice.
            </div>

            <div className="mt-5 text-sm">
              <Link
                to="/terms"
                className="text-accent hover:text-accent-hover underline underline-offset-4 transition-colors"
              >
                Read Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
