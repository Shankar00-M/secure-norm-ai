"use client"

import { useEffect, useState } from "react"
import { getTimezone, formatTime, formatDate } from "@/lib/datetime"

// Live clock hook: returns the current Date, updating every second.
// Cleans up the interval on unmount.
export function useLiveClock(intervalMs = 1000): Date {
  const [now, setNow] = useState<Date>(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

// Convenience: returns formatted time + date strings that update every second
export function useLiveClockDisplay(intervalMs = 1000): {
  time: string
  date: string
  timezone: string
} {
  const now = useLiveClock(intervalMs)
  return {
    time: formatTime(now),
    date: formatDate(now),
    timezone: getTimezone(),
  }
}
