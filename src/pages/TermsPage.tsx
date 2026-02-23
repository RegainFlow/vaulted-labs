import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";

interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const TERMS_SECTIONS: LegalSection[] = [
  {
    title: "1. Eligibility",
    paragraphs: [
      "You must be at least 18 years old to use the Service. By using VaultedLabs, you represent and warrant that you meet this requirement.",
    ],
  },
  {
    title: "2. Accounts and Access",
    paragraphs: [
      "You are responsible for your use of the Service and for providing accurate information, including waitlist details.",
      "You agree not to impersonate another person or submit fraudulent information.",
    ],
  },
  {
    title: "3. Acceptable Use",
    bullets: [
      "Do not violate applicable law.",
      "Do not interfere with, disrupt, or abuse the Service.",
      "Do not attempt unauthorized access to systems or data.",
      "Do not use bots, automation, or evasion techniques to bypass protections.",
      "Do not reverse engineer or misuse the Service outside permitted use.",
    ],
  },
  {
    title: "4. Product and Feature Availability",
    paragraphs: [
      "The Service may change over time. Features, content, and availability may be modified, suspended, or discontinued at any time.",
    ],
  },
  {
    title: "5. Intellectual Property",
    paragraphs: [
      "The Service, including software, branding, design, and content, is owned by VaultedLabs or its licensors and protected by applicable law.",
      "These Terms do not grant ownership rights.",
    ],
  },
  {
    title: "6. Feedback",
    paragraphs: [
      "If you provide feedback or suggestions, you grant VaultedLabs a non-exclusive, worldwide, royalty-free license to use and incorporate that feedback without obligation to you.",
    ],
  },
  {
    title: "7. Disclaimers",
    paragraphs: [
      "The Service is provided on an AS IS and AS AVAILABLE basis, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, VaultedLabs and its affiliates are not liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, revenues, data, goodwill, or business opportunities.",
    ],
  },
  {
    title: "9. Indemnification",
    paragraphs: [
      "You agree to indemnify and hold harmless VaultedLabs and its affiliates from claims, liabilities, damages, and expenses arising out of your misuse of the Service or violation of these Terms.",
    ],
  },
  {
    title: "10. Governing Law and Venue",
    paragraphs: [
      "These Terms are governed by the laws of the State of California, without regard to conflict-of-law principles.",
      "Any dispute arising out of or relating to these Terms or the Service will be resolved in state or federal courts located in California, and you consent to their jurisdiction.",
    ],
  },
  {
    title: "11. Termination",
    paragraphs: [
      "VaultedLabs may suspend or terminate access to the Service if you violate these Terms or if needed to protect the Service, users, or legal compliance.",
    ],
  },
  {
    title: "12. Changes to Terms",
    paragraphs: [
      "These Terms may be updated from time to time. Continued use of the Service after updated Terms are posted constitutes acceptance of the updated Terms.",
    ],
  },
  {
    title: "13. Contact",
    paragraphs: ["Questions about these Terms: support@vaulted-labs.com."],
  },
];

export function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-text-muted text-sm mb-8">
              Last updated: February 21, 2026
            </p>

            <div className="space-y-8">
              {TERMS_SECTIONS.map((section) => (
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
              These terms are provided for general informational purposes and do
              not constitute legal advice.
            </div>

            <div className="mt-5 text-sm">
              <Link
                to="/privacy"
                className="text-accent hover:text-accent-hover underline underline-offset-4 transition-colors"
              >
                Read Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
