"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";

const HOW_IT_WORKS = [
  {
    heading: "Capture it",
    body: [
      "Just type what's on your mind — Orbit tidies it up. For things with a deadline, like your home insurance or MOT, add a date and tick 'recurring' if it repeats each year. For everyday things like picking up a prescription or 'buy a loaf of bread', just add it with no date. It's all in one place.",
      "Orbit is for reminders and everyday life admin — things to do, not things to keep secret. There's no need to store passwords, bank details, or medical records here; Orbit only ever needs the reminder, like 'renew home insurance', never the policy number.",
    ],
  },
  {
    heading: "Your views",
    body: "Orbit organises everything into simple views. 'Dashboard' shows you everything in one place. 'Today' shows what needs attention now — anything in 'Still to do' may have been missed, so worth a look. 'Upcoming' shows what's coming so you can plan ahead. 'Inbox' holds everything you've captured without a date, ready when you need it.",
  },
  {
    heading: "Check in daily",
    body: "A quick look each day keeps everything calm. Add new things as they come to mind, check what's on your plate, and mark things done when you're ready. No alarms, no guilt — just a gentle place to stay on top of things.",
  },
  {
    heading: "Forgotten your password?",
    body: "If you ever forget your password, just visit the Orbit home page and click 'Forgot your password' — we'll send a reset link straight to your inbox.",
  },
  {
    heading: "Coming soon",
    body: "Soon you'll be able to invite a trusted person — a family member or carer — to support you if you need it. You stay in control of what they see.",
  },
];

interface ProfileSectionProps {
  onDisplayNameSaved?: (name: string) => void;
  onToast?: (message: string) => void;
}

export default function ProfileSection({ onDisplayNameSaved, onToast }: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [accountStep, setAccountStep] = useState<"default" | "confirm" | "final">("default");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .single();

      if (profile?.display_name) {
        setDisplayName(profile.display_name);
      }
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert(
        { user_id: user.id, display_name: displayName.trim() },
        { onConflict: "user_id" }
      );

    if (error) {
      onToast?.(error.message);
      return;
    }

    const { data: profile, error: confirmError } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();

    if (confirmError || !profile) {
      onToast?.(confirmError?.message ?? "Could not confirm the saved profile.");
      return;
    }

    setDisplayName(profile.display_name ?? "");
    onDisplayNameSaved?.(profile.display_name ?? "");
    onToast?.("Profile saved.");
  }

  async function sendFeedback() {
    if (!feedback.trim() || isSending) return;
    setIsSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    try {
      await emailjs.send(
        "service_ecsh1ih",
        "template_3etw4ta",
        {
          message: feedback.trim(),
          user_name: displayName || "Orbit user",
          user_email: user?.email ?? "",
        },
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
      );
      setFeedback("");
      onToast?.("Thank you — your thoughts help shape Orbit");
    } catch {
      onToast?.("Something went wrong — please try again");
    } finally {
      setIsSending(false);
    }
  }

  async function deleteAccount() {
    setIsDeleting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await supabase.auth.signOut();
      onToast?.("Your account has been deleted.");
      window.location.href = "/";
    } catch {
      onToast?.("Something went wrong — please try again");
      setAccountStep("default");
      setIsDeleting(false);
    }
  }

  const card = "bg-white rounded-3xl shadow-lg p-8 w-full";

  return (
    <div className="mt-6 max-w-6xl mx-auto space-y-6 w-full">

      <div className={card}>
        <h2 className="text-2xl font-bold mb-2">About You</h2>
        <p className="text-gray-600 mb-4">What would you like Orbit to call you?</p>
        <input
          type="text"
          placeholder="Your name"
          maxLength={30}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border rounded-xl p-3 w-full mb-2"
        />
        <p className="text-sm text-gray-500 mb-4">Maximum 30 characters</p>
        <button
          onClick={saveProfile}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          Save
        </button>
      </div>

      <div className={card}>
        <h2 className="text-2xl font-bold mb-2">Security</h2>
        <p className="text-gray-600 mb-4">Manage your account security.</p>
        <div className="flex items-center justify-between">
          <span className="text-indigo-950 font-medium">Change your password</span>
          <button
            disabled
            className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl cursor-not-allowed"
          >
            Coming soon
          </button>
        </div>
      </div>

      <div className={card}>
        <button
          className="flex w-full items-center justify-between text-left"
          onClick={() => setHowItWorksOpen((open) => !open)}
          aria-expanded={howItWorksOpen}
        >
          <h2 className="text-2xl font-bold">How Orbit Works</h2>
          <svg
            className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${howItWorksOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`grid transition-all duration-300 ${howItWorksOpen ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {HOW_IT_WORKS.map((section, i) => (
                <div key={section.heading}>
                  <button
                    className="flex w-full items-center justify-between py-4 text-left"
                    onClick={() => setOpenSection(openSection === i ? null : i)}
                    aria-expanded={openSection === i}
                  >
                    <span className="text-lg font-semibold text-indigo-950">{section.heading}</span>
                    <svg
                      className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${openSection === i ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`grid transition-all duration-300 ${openSection === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      {(Array.isArray(section.body) ? section.body : [section.body]).map((paragraph, pi, arr) => (
                        <p
                          key={pi}
                          className={`text-gray-600 ${pi > 0 ? "mt-3" : ""} ${pi === arr.length - 1 ? "pb-4" : ""}`}
                          style={{ fontSize: "16px", lineHeight: "1.8" }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={card}>
        <h2 className="text-2xl font-bold mb-2">Share Your Thoughts</h2>
        <p className="text-gray-600 mb-4">We'd love to hear how Orbit is working for you.</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what's working, what isn't, or what you'd love to see"
          className="border rounded-xl p-3 w-full h-28 resize-none mb-4"
        />
        <button
          onClick={sendFeedback}
          disabled={isSending || !feedback.trim()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>

      <div className={card}>
        <h2 className="text-2xl font-bold mb-2">Your Account</h2>
        <p className="text-gray-600 mb-4">Your account, your choice — manage it here.</p>

        {accountStep === "default" && (
          <button
            onClick={() => setAccountStep("confirm")}
            className="text-indigo-950 font-medium"
          >
            Delete my account
          </button>
        )}

        {accountStep === "confirm" && (
          <div>
            <p className="text-gray-600 mb-4">
              Deleting your account will permanently remove your tasks, your profile, and your sign-in details. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAccountStep("default")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
              >
                Keep my account
              </button>
              <button
                onClick={() => setAccountStep("final")}
                className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl"
              >
                Delete my account
              </button>
            </div>
          </div>
        )}

        {accountStep === "final" && (
          <div>
            <p className="text-gray-600 mb-4">
              Last check — delete your account permanently?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAccountStep("default")}
                disabled={isDeleting}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={isDeleting}
                className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yes, delete everything
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 py-2">
        <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600 transition">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600 transition">
          Privacy Policy
        </Link>
      </div>

    </div>
  );
}