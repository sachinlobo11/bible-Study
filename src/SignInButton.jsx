import { useAuth } from "./context/AuthContext";
import React from "react"
export default function SignInButton() {
  const { user, supabase } = useAuth();

  async function signIn() {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex gap-2">
      {user ? (
        <>
          <span className="text-sm">Hi, {user.email}</span>
          <button
            onClick={signOut}
            className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={signIn}
          className="px-3 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
