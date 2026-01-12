'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, Suspense, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Defer PostHog initialization to reduce main thread blocking
let posthogInitialized = false;

function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
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

  useEffect(() => {
    if (!posthogInitialized && typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
        loaded: () => {
          posthogInitialized = true
          setIsReady(true)
        }
      })
    }
  }, [])

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
