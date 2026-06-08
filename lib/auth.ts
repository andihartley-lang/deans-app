// Supabase puts `type=recovery` in the URL hash when a user lands here from a
// password reset email (using the default implicit grant flow). The recovery
// session looks like a normal login to `getUser()`, so callers must check the
// URL *before* deciding to send an already-authenticated user into the app.
export function isPasswordRecoveryLink() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.hash.slice(1));
  return params.get("type") === "recovery";
}
