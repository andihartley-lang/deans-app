"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const sections = [
  {
    heading: "About Orbit",
    body: "Orbit is a personal task management and life administration tool designed to help individuals organise tasks, reminders and personal responsibilities. Orbit is intended as an organisational aid only. It is not a medical device, healthcare service, emergency response service, legal service, financial service or substitute for professional advice or support. By creating an account or using Orbit, you agree to these Terms of Service.",
  },
  {
    heading: "Eligibility",
    body: "You must have the legal capacity to agree to these Terms and to use Orbit in accordance with applicable laws. You must provide accurate information when creating your account and keep your account information reasonably up to date. You are responsible for maintaining the security of your account credentials and for any activity carried out through your account.",
  },
  {
    heading: "Your Data and Content",
    body: "You retain ownership of the information you create and store within Orbit. You are responsible for ensuring that information you enter into Orbit is lawful and does not infringe the rights of others. Orbit is designed for personal task management and organisation. Users should not upload or store highly sensitive personal information within Orbit, including medical records, financial account details, government identification documents, passwords, or other confidential, regulated or highly sensitive records. If you choose to store such information, you do so at your own risk.",
  },
  {
    heading: "AI Features",
    body: "Orbit uses AI-powered features to assist with organising, categorising and interpreting information entered by users. Information submitted to Orbit may be processed by AI systems in order to provide these features. Any AI-generated suggestions, classifications, recommendations, reminders or organisational assistance are provided for convenience only and may be inaccurate, incomplete or inappropriate. Users remain solely responsible for reviewing information, verifying its accuracy and making decisions based upon it. Orbit does not guarantee the accuracy, completeness or suitability of any AI-generated output.",
  },
  {
    heading: "Service Availability",
    body: "We aim to provide a reliable service but do not guarantee that Orbit will be available at all times or without interruption. Orbit may occasionally be unavailable due to maintenance, updates, technical issues or circumstances beyond our reasonable control. We may modify, improve or discontinue features from time to time.",
  },
  {
    heading: "What Orbit Is Not Responsible For",
    body: "Orbit helps users organise and remember tasks but cannot guarantee that tasks, reminders or notifications will be seen, acted upon or completed. To the fullest extent permitted by law, Orbit is not responsible for missed reminders, missed deadlines, missed appointments, lost opportunities, loss of data, indirect or consequential losses, or loss arising from reliance on information, reminders, notifications or AI-generated outputs provided by the service. Nothing in these Terms excludes or limits liability where such exclusion would be unlawful under applicable law.",
  },
  {
    heading: "Subscription and Payment",
    body: "Orbit is currently provided free of charge during its early access period. Paid plans may be introduced in the future. Users will be given clear notice before any charges apply. When paid plans become available, additional billing and subscription terms may apply. Nothing in these Terms affects your statutory rights under UK consumer law.",
  },
  {
    heading: "Acceptable Use",
    body: "You agree not to access or attempt to access another user's account or data, interfere with the operation of Orbit, use Orbit for unlawful purposes, attempt to bypass security measures, upload malicious software or harmful content, or use Orbit in a manner that could damage, disable or impair the service.",
  },
  {
    heading: "Account Suspension and Termination",
    body: "You may stop using Orbit and request deletion of your account at any time. We may suspend or terminate accounts that breach these Terms or where continued access presents a security, legal or operational risk. Deletion of an account may result in permanent removal of associated data. Where an account deletion request is made, personal data will normally be removed within 30 days, subject to any legal or operational requirements.",
  },
  {
    heading: "Changes to These Terms",
    body: "We may update these Terms from time to time. Where changes are significant, we will provide reasonable notice by email or through the Orbit application. Continued use of Orbit following any update constitutes acceptance of the revised Terms.",
  },
  {
    heading: "Contact",
    body: "hello@orbit.co.uk",
  },
];

export default function TermsPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white">
      <nav className="max-w-3xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-semibold hover:opacity-80 transition">
          Orbit
        </Link>
        <button
          onClick={() => router.back()}
          className="rounded-xl border border-white/20 px-5 py-2 text-sm hover:bg-white/10 transition"
        >
          ← Back
        </button>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pb-20">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-indigo-300 mb-10">Last updated: June 2026</p>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold mb-2">{s.heading}</h2>
              <p className="text-indigo-100 leading-relaxed" style={{ fontSize: "16px", lineHeight: "1.8" }}>
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
