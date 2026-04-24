import posthog from "posthog-js";

type Props = Record<string, unknown>;

export function track(event: string, props?: Props): void {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, props);
  } catch {
    // PostHog may not be initialized yet; drop the event rather than throw.
  }
}
