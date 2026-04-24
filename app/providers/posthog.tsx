'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, Suspense, useState, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

let posthogInitialized = false;

function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthogInitialized) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      // Classify route so it's easy to segment in PostHog without regex.
      const segs = pathname.split('/').filter(Boolean)
      let route_kind: string = 'other'
      if (pathname === '/') route_kind = 'home'
      else if (segs[0] === 'pokemon' && segs.length === 2) route_kind = 'pokemon_detail'
      else if (segs[0] === 'pokemon' && segs.length === 3) route_kind = 'comparison'
      else if (segs[0] === 'types') route_kind = 'types'
      else if (segs[0] === 'generations') route_kind = 'generations'
      else if (segs[0] === 'roles') route_kind = 'roles'
      else if (segs[0] === 'rarity') route_kind = 'rarity'
      else if (segs[0] === 'popular') route_kind = 'popular'
      else if (segs[0] === 'compare') route_kind = 'compare'

      posthog.capture('$pageview', {
        $current_url: url,
        route_kind,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(posthogInitialized)

  const initPostHog = useCallback(() => {
    if (posthogInitialized || typeof window === 'undefined') return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      // Autocapture clicks/inputs/submits so we get coverage without
      // wiring handlers everywhere.
      autocapture: true,
      // Session recording stays off at the client level.
      // To enable with sampling (free tier is 5k/mo), flip this to false
      // and configure sample rate in PostHog project settings → Session replay.
      disable_session_recording: true,
      loaded: (ph) => {
        posthogInitialized = true

        // Acquisition properties — set once so later visits don't overwrite.
        try {
          const params = new URLSearchParams(window.location.search)
          const utm: Record<string, string> = {}
          ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
            const v = params.get(k)
            if (v) utm[k] = v
          })
          const setOnce: Record<string, unknown> = {
            initial_referrer: document.referrer || '$direct',
            initial_referring_domain: document.referrer ? new URL(document.referrer).hostname : '$direct',
            initial_pathname: window.location.pathname,
            ...utm,
          }
          ph.setPersonPropertiesForFlags?.(setOnce)
          ph.register_once(setOnce)
        } catch {
          // Best-effort; never block app boot on analytics.
        }

        setIsReady(true)
      }
    })
  }, [])

  useEffect(() => {
    // Init shortly after mount. Earlier than before (was 3s idle timeout / 2s setTimeout)
    // so we don't lose bouncers who leave within ~2s. Still deferred to avoid blocking TTI.
    if (typeof window !== 'undefined' && !posthogInitialized) {
      if ('requestIdleCallback' in window) {
        const idleId = window.requestIdleCallback(initPostHog, { timeout: 800 })
        return () => window.cancelIdleCallback(idleId)
      } else {
        const timeoutId = setTimeout(initPostHog, 500)
        return () => clearTimeout(timeoutId)
      }
    }
  }, [initPostHog])

  return (
    <PostHogProvider client={posthog}>
      {isReady && (
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
      )}
      {children}
    </PostHogProvider>
  )
}
