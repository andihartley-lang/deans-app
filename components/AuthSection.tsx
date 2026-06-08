"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputClasses =
  "bg-white/10 border border-white/20 rounded-xl p-3 w-full text-white placeholder-indigo-300 focus:outline-none focus:border-white/40 transition";

const primaryButtonClasses =
  "bg-yellow-400 text-black font-semibold px-6 py-3 rounded-2xl hover:bg-yellow-300 transition w-full";

const quietLinkClasses = "text-sm text-indigo-300 hover:text-white transition";

export default function AuthSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  const [authView, setAuthView] = useState<"signin" | "signup" | "forgot" | "forgotSent">("signin");
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
    const view = searchParams.get("view");

    if (view === "signup") {
      setAuthView("signup");
    } else if (view === "forgot") {
      setAuthView("forgot");
    } else {
      setAuthView("signin");
    }
  }, [searchParams]);

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
    <div className="w-full max-w-md">
      {!user && authView === "signin" && (
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-indigo-100 mb-6">Sign in to your Orbit</p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />

            <button onClick={signIn} className={primaryButtonClasses}>
              Sign In
            </button>

            <button
              onClick={() => router.push("/auth?view=forgot")}
              className={quietLinkClasses}
            >
              Forgot your password?
            </button>
          </div>

          <button
            onClick={() => router.push("/auth?view=signup")}
            className={`mt-8 block ${quietLinkClasses}`}
          >
            New to Orbit? Create a free account
          </button>
        </div>
      )}

      {!user && authView === "signup" && (
        <div>
          <h1 className="text-3xl font-bold mb-2">Create your Orbit</h1>
          <p className="text-indigo-100 mb-6">Free to start. No credit card needed.</p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
            />

            <button onClick={signUp} className={primaryButtonClasses}>
              Create Free Account
            </button>
          </div>

          <button
            onClick={() => router.push("/auth?view=signin")}
            className={`mt-8 block ${quietLinkClasses}`}
          >
            Already have an account? Sign in
          </button>
        </div>
      )}

      {!user && authView === "forgot" && (
        <div>
          <p className="text-indigo-100 mb-6">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className={inputClasses}
            />

            <button onClick={sendResetLink} className={primaryButtonClasses}>
              Send reset link
            </button>

            <button
              onClick={() => router.push("/auth?view=signin")}
              className={quietLinkClasses}
            >
              Back to sign in
            </button>
          </div>
        </div>
      )}

      {!user && authView === "forgotSent" && (
        <div className="space-y-4">
          <p className="text-indigo-100">
            Check your email for a link to reset your password.
          </p>

          <button
            onClick={() => router.push("/auth?view=signin")}
            className={quietLinkClasses}
          >
            Back to sign in
          </button>
        </div>
      )}
    </div>
  );
}
