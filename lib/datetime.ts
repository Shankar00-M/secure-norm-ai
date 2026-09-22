// Centralized date/time utility for SecureNorm AI.
// All timestamps are stored internally as ISO 8601 strings.
// Display formatting uses the user's real local timezone from the browser.

export function getTimezone(): string {
  if (typeof Intl !== "undefined") {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
      // fall through
    }
  }
  return "UTC"
}

// Format an ISO string (or Date) into a short date+time display: "Sep 21, 2026 · 14:32"
export function formatDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—"
  const d = typeof iso === "string" ? new Date(iso) : iso
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleString("en-US", {
    timeZone: getTimezone(),
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format an ISO string into a time-only display: "14:32:05"
export function formatTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—"
  const d = typeof iso === "string" ? new Date(iso) : iso
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleTimeString("en-US", {
    timeZone: getTimezone(),
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

// Format an ISO string into a date-only display: "Sep 21, 2026"
export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—"
  const d = typeof iso === "string" ? new Date(iso) : iso
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", {
    timeZone: getTimezone(),
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Return the current time as an ISO 8601 string
export function nowISO(): string {
  return new Date().toISOString()
}

// Return a past time as ISO 8601, offset from now by the given milliseconds
export function agoISO(msAgo: number): string {
  return new Date(Date.now() - msAgo).toISOString()
}

// Generate a short relative-time label from an ISO timestamp: "2h ago", "3d ago", "12 min ago"
export function relativeFromISO(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "—"
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  const wk = Math.floor(day / 7)
  if (wk < 5) return `${wk}w ago`
  return formatDate(iso)
}

// Generate an array of N day labels ending today, for trend charts.
// Returns labels like "Sep 15", "Sep 16", … "Sep 21"
export function dayLabels(count: number): string[] {
  const labels: string[] = []
  const tz = getTimezone()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    labels.push(
      d.toLocaleDateString("en-US", { timeZone: tz, month: "short", day: "numeric" }),
    )
  }
  return labels
}

// Generate an array of {day, ...} trend entries with real dates.
// Pass the data values array (oldest first) and it will attach real day labels.
export function withDayLabels<T extends Record<string, unknown>>(
  values: Omit<T, "day">[],
): (T & { day: string })[] {
  const labels = dayLabels(values.length)
  return values.map((v, i) => ({ ...v, day: labels[i] }) as T & { day: string })
}

// Format a duration in milliseconds as "8m 42s" or "1m 47s"
export function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}m ${String(s).padStart(2, "0")}s`
}
