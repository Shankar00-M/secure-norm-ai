"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, RefreshCw, Search, Clock, Loader2, Check, AlertCircle } from "lucide-react"
import { useLiveClockDisplay } from "@/lib/use-live-clock"
import { useAuth } from "@/lib/auth-context"
import { NotificationBell } from "./notification-bell"
import { AIAssistant } from "./ai-assistant"
import { cn } from "@/lib/utils"

export function TopBar({ onMenu, onRefresh, refreshing }: { onMenu?: () => void; onRefresh?: () => void; refreshing?: boolean }) {
  const { time, date, timezone } = useLiveClockDisplay()
  const { profile, tenant, signOut } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const profileRef = useRef<HTMLDivElement>(null)
  const initials = (profile?.full_name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [profileOpen])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search devices, findings, CVEs, controls…"
          className="h-9 w-full rounded-lg border border-border/80 bg-secondary/40 pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary/50 focus:bg-secondary/70 focus:ring-2 focus:ring-primary/15"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <AIAssistant />
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Refresh data"
          title="Refresh all data"
        >
          {refreshing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        </button>
        <NotificationBell />
        <div className="hidden items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 md:flex">
          <Clock className="size-3.5 text-primary" />
          <div className="leading-tight">
            <div className="font-mono text-xs font-medium tabular-nums text-foreground">{time}</div>
            <div className="text-[10px] text-muted-foreground">{date} · {timezone}</div>
          </div>
        </div>
        <div ref={profileRef} className="relative ml-1">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 rounded-lg border border-border/80 bg-secondary/40 py-1 pl-1 pr-3 transition hover:border-primary/40"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-7 rounded-md object-cover" />
            ) : (
              <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#0e9488] text-xs font-semibold text-[#05201d]">
                {initials}
              </div>
            )}
            <div className="hidden leading-tight sm:block">
              <div className="text-xs font-medium text-foreground">{profile?.full_name ?? "—"}</div>
              <div className="text-[10px] text-muted-foreground">{profile?.role ?? "—"}</div>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-border/80 bg-popover/95 shadow-2xl backdrop-blur-md">
              <div className="border-b border-border/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="size-9 rounded-lg object-cover" />
                  ) : (
                    <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#0e9488] text-sm font-semibold text-[#05201d]">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{profile?.full_name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{profile?.email}</div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground">{tenant?.name}</div>
              </div>
              <div className="px-2 py-2">
                <a href="/settings" className="block rounded-md px-3 py-2 text-xs text-foreground transition hover:bg-secondary" onClick={() => setProfileOpen(false)}>
                  Settings
                </a>
                <button
                  onClick={() => { signOut(); setProfileOpen(false) }}
                  className="block w-full rounded-md px-3 py-2 text-left text-xs text-[#f0596b] transition hover:bg-[#f0596b]/10"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
