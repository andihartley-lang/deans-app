"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Toast from "@/components/Toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [linkError, setLinkError] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  }, [showToast]);

  function triggerToast(message: string) {
    setToastMessage(message);
    setShowToast(true);
  }

  async function savePassword() {
    if (password !== confirmPassword) {
      triggerToast("Passwords don't match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLinkError(true);
      return;
    }

    setDone(true);
  }

  return (
    <main className="min-h-screen bg-[#f3f4f8] flex items-center justify-center p-6">
      <Toast message={toastMessage} show={showToast} />

      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        {linkError ? (
          <>
            <h2 className="text-3xl font-bold mb-2">Link expired</h2>
            <p className="text-gray-600 mb-6">
              This reset link has expired or already been used. Please request a new one from the sign-in page.
            </p>
            <Link
              href="/auth?view=forgot"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl inline-block"
            >
              Request a new link
            </Link>
          </>
        ) : done ? (
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
