"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const sections = [
  {
    heading: "Who We Are",
    body: "Orbit is a personal task management and life administration application operated by Orbit, a business based in the United Kingdom. We act as the data controller for the personal data you provide when using the service. For privacy-related enquiries please contact hello@orbit.co.uk",
  },
  {
    heading: "What Data We Collect",
    body: "Depending on how you use Orbit, we may collect your email address, authentication information managed through our authentication provider, your display name if you choose to create one, task titles and due dates you create within Orbit, feedback messages you choose to send us, information relating to account activity and service usage, and trusted contact details if this feature is introduced and you choose to use it. Orbit may also process personal information that users choose to enter within task descriptions. Orbit is not designed for the storage of highly sensitive personal information. Users should avoid entering unnecessary sensitive information including medical records, financial account details, government identification information, passwords, or other confidential or highly sensitive records.",
  },
  {
    heading: "How We Use Your Data",
    body: "We use personal data to create and manage your Orbit account, authenticate users and maintain account security, provide task management and reminder functionality, process task information using AI-powered features, respond to feedback and support requests, improve, maintain and secure the Orbit service, and comply with legal obligations where required.",
  },
  {
    heading: "AI Processing",
    body: "Orbit uses AI services provided by Anthropic to help organise, categorise and simplify task information entered by users. When AI-powered features are used, relevant task information may be transmitted to Anthropic for processing. Orbit stores the resulting task title generated through this process. Orbit does not intentionally store the original AI processing request within its application database. However, limited operational, technical and infrastructure logs may be retained by Orbit and its service providers for security, reliability, troubleshooting and service operation purposes. Users should avoid entering unnecessary sensitive personal information into AI-powered features. AI-generated outputs are provided for organisational assistance only and may not always be accurate.",
  },
  {
    heading: "Our Lawful Basis For Processing",
    body: "Under UK GDPR, we process personal data on the following lawful bases: performance of a contract with you to provide the Orbit service, legitimate interests including maintaining, improving and securing the service, compliance with legal obligations where applicable, and consent where consent is specifically requested.",
  },
  {
    heading: "Who We Share Your Data With",
    body: "We do not sell your personal data. We use trusted third-party service providers to operate Orbit including Supabase for authentication and database services, Vercel for application hosting and delivery, Anthropic for AI-powered task processing, EmailJS for delivery of feedback messages, and Stripe for payment processing when paid plans are introduced. These providers only receive information necessary to perform their services on our behalf.",
  },
  {
    heading: "International Data Transfers",
    body: "Some of our service providers may process personal data outside the United Kingdom. Where this occurs, we take reasonable steps to ensure appropriate safeguards are in place in accordance with UK GDPR and applicable data protection laws.",
  },
  {
    heading: "How Long We Keep Your Data",
    body: "We keep personal data for as long as your account remains active. If you request deletion of your account, we will normally remove your personal data within 30 days unless we are required to retain certain information for legal, regulatory or security reasons. Some service providers may retain limited operational logs in accordance with their own retention policies.",
  },
  {
    heading: "Security",
    body: "We take reasonable technical and organisational measures to protect personal data against unauthorised access, loss, misuse or disclosure. No online service can guarantee absolute security, but we work to maintain appropriate safeguards appropriate to the nature of the service.",
  },
  {
    heading: "Your Rights",
    body: "Under UK GDPR, you may have the right to access your personal data, correct inaccurate personal data, request deletion of your personal data, restrict processing of your personal data, object to certain processing activities, request transfer of your personal data where applicable, and withdraw consent where processing is based on consent. To exercise any of these rights please contact hello@orbit.co.uk. We will respond in accordance with applicable legal requirements. You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO).",
  },
  {
    heading: "Cookies",
    body: "Orbit uses only cookies and similar technologies necessary for authentication, security and operation of the service. Orbit does not currently use advertising or tracking cookies. If this changes in future, this Privacy Policy will be updated accordingly.",
  },
  {
    heading: "Changes To This Policy",
    body: "We may update this Privacy Policy from time to time. Where changes are significant, we will provide reasonable notice by email or through the Orbit application.",
  },
  {
    heading: "Contact",
    body: "For privacy-related enquiries please contact hello@orbit.co.uk",
  },
];

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
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
