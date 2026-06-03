"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthSection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  
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

    alert("Check your email for confirmation.");
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

setUser(user);

window.location.href = "/app";
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6">
        Authentication Test
      </h2>
      {user && (
  <div className="flex items-center justify-between mb-4">
    <p className="text-green-600">
      Signed in as: {user.email}
    </p>

    <button
      onClick={async () => {
        await supabase.auth.signOut();
        setUser(null);
      }}
      className="bg-red-500 text-white px-4 py-2 rounded-xl"
    >
      Logout
    </button>
  </div>
)}

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
            Sign Up
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