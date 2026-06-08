"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthSection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");

  const [authView, setAuthView] = useState<"credentials" | "forgot" | "forgotSent">("credentials");
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "forgot") {
      setAuthView("forgot");
    }
  }, []);

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email to verify your account.");
  }

  async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      user_id: user.id,
    });
  }

  setUser(user);

  window.location.href = "/app";
}

  async function sendResetLink() {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setAuthView("forgotSent");
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold mb-2">
        Welcome to Orbit
      </h2>

      <p className="text-gray-600 mb-6">
        Sign in or create an account to continue.
      </p>

      <h2 className="text-3xl font-bold mb-2">
  Account
</h2>

<p className="text-gray-600 mb-6">
  Manage your Orbit account.
</p>

      {!user && authView === "credentials" && (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-xl p-3 w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-xl p-3 w-full"
          />

          <div className="flex gap-4">
            <button
              onClick={signUp}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
            >
              Create Account
            </button>

            <button
              onClick={signIn}
              className="bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              Sign In
            </button>
          </div>

          <button
            onClick={() => setAuthView("forgot")}
            className="text-indigo-600 text-sm hover:underline"
          >
            Forgot your password?
          </button>
        </div>
      )}

      {!user && authView === "forgot" && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          <input
            type="email"
            placeholder="Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="border rounded-xl p-3 w-full"
          />

          <div className="flex items-center gap-4">
            <button
              onClick={sendResetLink}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
            >
              Send reset link
            </button>

            <button
              onClick={() => setAuthView("credentials")}
              className="text-gray-500 text-sm hover:underline"
            >
              Back to sign in
            </button>
          </div>
        </div>
      )}

      {!user && authView === "forgotSent" && (
        <div className="space-y-4">
          <p className="text-gray-600">
            Check your email for a link to reset your password.
          </p>

          <button
            onClick={() => setAuthView("credentials")}
            className="text-indigo-600 text-sm hover:underline"
          >
            Back to sign in
          </button>
        </div>
      )}
    </div>
  );
}