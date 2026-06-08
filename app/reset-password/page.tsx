"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);

  async function savePassword() {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
      return;
    }

    setDone(true);
  }

  return (
    <main className="min-h-screen bg-[#f3f4f8] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        {done ? (
          <>
            <h2 className="text-3xl font-bold mb-6">Your password has been updated.</h2>
            <button
              onClick={() => {
                window.location.href = "/app";
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
            >
              Continue to Orbit
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-2">Choose a new password</h2>
            <p className="text-gray-600 mb-6">
              Enter and confirm your new password below.
            </p>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-xl p-3 w-full"
              />

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border rounded-xl p-3 w-full"
              />

              <button
                onClick={savePassword}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
