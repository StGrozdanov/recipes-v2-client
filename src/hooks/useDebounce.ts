import { useEffect, useState } from "react"

/**
 * Debounce input hook with customisable delay
 * @argument value generic value to be debounced
 * @argument delay customisable delay in ms. Defaults to 400ms
*/
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 400)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}