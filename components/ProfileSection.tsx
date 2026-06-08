"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProfileSectionProps {
  onDisplayNameSaved?: (name: string) => void;
}

export default function ProfileSection({ onDisplayNameSaved }: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState("");

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
      alert(error.message);
      return;
    }

    const { data: profile, error: confirmError } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .single();

    if (confirmError || !profile) {
      alert(confirmError?.message ?? "Could not confirm the saved profile.");
      return;
    }

    setDisplayName(profile.display_name ?? "");
    onDisplayNameSaved?.(profile.display_name ?? "");
    alert("Profile saved.");
  }

  const card = "bg-white rounded-3xl shadow-lg p-8 w-full";

  return (
    <div className="mt-6 space-y-6 w-full">

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
          disabled
          placeholder="Feedback coming soon."
          className="border rounded-xl p-3 w-full h-28 text-gray-400 bg-gray-50 cursor-not-allowed resize-none"
        />
      </div>

    </div>
  );
}