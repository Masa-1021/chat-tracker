import { useState, useEffect, useMemo } from 'react'

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
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}
