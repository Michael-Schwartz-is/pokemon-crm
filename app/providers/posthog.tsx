'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, Suspense, useState, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Defer PostHog initialization to reduce main thread blocking
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
      posthog.capture('$pageview', {
        $current_url: url,
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
      // Disable session recording by default to reduce main thread work
      disable_session_recording: true,
      // Disable automatic property collection to speed up init
      autocapture: false,
      loaded: () => {
        posthogInitialized = true
        setIsReady(true)
      }
    })
  }, [])

  useEffect(() => {
    // Use requestIdleCallback to defer PostHog init until browser is idle
    // This prevents blocking the main thread during critical rendering
    if (typeof window !== 'undefined' && !posthogInitialized) {
      if ('requestIdleCallback' in window) {
        // Defer to idle time with a 3 second timeout fallback
        const idleId = window.requestIdleCallback(initPostHog, { timeout: 3000 })
        return () => window.cancelIdleCallback(idleId)
      } else {
        // Fallback for Safari: use setTimeout with longer delay
        const timeoutId = setTimeout(initPostHog, 2000)
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
