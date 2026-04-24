"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import EmailSignupForm from "./EmailSignupForm";
import { track } from "@/lib/analytics";

const POPUP_DELAY_MS = 10000; // 10 seconds

export default function EmailPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check localStorage to see if we should show the popup
    if (typeof window === "undefined") return;

    const isSubscribed = localStorage.getItem("email_subscribed");
    const isDismissed = localStorage.getItem("email_popup_dismissed");

    if (isSubscribed || isDismissed) {
      return; // Don't show popup
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setShouldRender(true);
      track("email_popup_shown", {});
      // Small delay for animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    track("email_popup_dismissed", {});
    setIsVisible(false);
    // Store dismissal in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("email_popup_dismissed", "true");
    }
    // Remove from DOM after animation
    setTimeout(() => {
      setShouldRender(false);
    }, 300);
  };

  const handleSuccess = () => {
    // Close popup after a brief moment to show success
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
      }, 300);
    }, 1500);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-md p-6 sm:p-8
          bg-card border border-border/50 rounded-2xl
          shadow-2xl shadow-[hsl(var(--electric)/0.1)]
          transition-all duration-300
          ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-[hsl(var(--electric))] to-[hsl(var(--fire))] shadow-lg shadow-[hsl(var(--electric)/0.3)]">
            <Zap className="w-6 h-6 text-background" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground mb-2">
            Stay in the Battle!
          </h2>
          <p className="text-sm text-muted-foreground">
            Get notified about new Pokemon stats, battle strategies, and site updates.
          </p>
        </div>

        {/* Form */}
        <EmailSignupForm source="popup" onSuccess={handleSuccess} />

        {/* Footer note */}
        <p className="mt-4 text-xs text-muted-foreground/70 text-center">
          No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
