import { useState, useEffect, useMemo } from 'react'
import { BREAKPOINTS } from '@/shared/constants/config'

export function useMediaQuery(query: string): boolean {
  const mediaQuery = useMemo(() => window.matchMedia(query), [query])
  const [matches, setMatches] = useState(mediaQuery.matches)

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener('change', listener)

    return () => mediaQuery.removeEventListener('change', listener)
  }, [mediaQuery])

  return matches
}

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.tablet - 1}px)`)
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`
  )
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`)
}
