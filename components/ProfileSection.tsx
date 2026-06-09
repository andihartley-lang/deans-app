"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";

interface ProfileSectionProps {
  onDisplayNameSaved?: (name: string) => void;
  onToast?: (message: string) => void;
}

export default function ProfileSection({ onDisplayNameSaved, onToast }: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSending, setIsSending] = useState(false);

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
      .update({
        display_name: displayName.trim(),
      })
      .eq("user_id", user.id);

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
        <h2 className="text-2xl font-bold mb-2">How Orbit Works</h2>
        <p className="text-gray-400">Guide coming soon.</p>
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

    </div>
  );
}