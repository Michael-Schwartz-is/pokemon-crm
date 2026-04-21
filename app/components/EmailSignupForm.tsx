"use client";

import { useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Mail, Loader2, Check } from "lucide-react";

interface EmailSignupFormProps {
  source: "popup" | "footer";
  compact?: boolean;
  onSuccess?: () => void;
}

export default function EmailSignupForm({
  source,
  compact = false,
  onSuccess,
}: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const posthog = usePostHog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      // Identify the person by email so they're queryable as a Person in PostHog,
      // then capture the signup event with context.
      posthog?.identify(email, { email, source });
      posthog?.capture("email_signup", {
        email,
        source,
        page: typeof window !== "undefined" ? window.location.pathname : "",
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("email_subscribed", "true");
      }

      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 ${compact ? "text-sm" : ""}`}>
        <div className="p-1.5 rounded-full bg-green-500/20">
          <Check className="w-4 h-4 text-green-500" />
        </div>
        <span className="text-green-500 font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "w-full" : "w-full max-w-sm"}>
      <div className={`flex ${compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"} gap-2`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            className={`
              w-full pl-10 pr-4 rounded-xl border border-border/50 bg-secondary/50 
              text-foreground placeholder:text-muted-foreground/60
              focus:outline-none focus:border-[hsl(var(--electric)/0.5)] focus:ring-2 focus:ring-[hsl(var(--electric)/0.1)]
              transition-all duration-200
              ${compact ? "py-2 text-sm" : "py-2.5"}
            `}
            disabled={status === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`
            px-4 rounded-xl font-semibold
            bg-gradient-to-r from-[hsl(var(--electric))] to-[hsl(var(--fire))]
            text-background hover:opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${compact ? "py-2 text-sm" : "py-2.5"}
          `}
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}
    </form>
  );
}
