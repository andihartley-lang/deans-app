"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfileSection() {
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

    alert("Profile saved.");
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-6">
      <h2 className="text-2xl font-bold mb-2">
  About You
</h2>

<p className="text-gray-600 mb-4">
  What would you like Orbit to call you?
</p>

      <input
  type="text"
  placeholder="Your name"
  maxLength={30}
  value={displayName}
  onChange={(e) => setDisplayName(e.target.value)}
  className="border rounded-xl p-3 w-full mb-2"
/>

<p className="text-sm text-gray-500 mb-4">
  Maximum 30 characters
</p>

      <button
        onClick={saveProfile}
        className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
      >
        Save
      </button>
    </div>
  );
}