"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthSection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    loadUser();
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

      {!user && (
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
        </div>
      )}
    </div>
  );
}