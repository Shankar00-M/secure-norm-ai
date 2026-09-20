"use client"

import { Bell, Menu, RefreshCw, Search, Sparkles } from "lucide-react"

export function TopBar({ onMenu }: { onMenu?: () => void }) {
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
          placeholder="Search devices, findings, CVEs, controls…"
          className="h-9 w-full rounded-lg border border-border/80 bg-secondary/40 pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary/50 focus:bg-secondary/70 focus:ring-2 focus:ring-primary/15"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="hidden items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15 sm:flex">
          <Sparkles className="size-3.5" />
          Ask SecureNorm AI
        </button>
        <button
          className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground transition hover:text-foreground"
          aria-label="Run scan"
        >
          <RefreshCw className="size-4" />
        </button>
        <button
          className="relative flex size-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground transition hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#f0596b]" />
        </button>
        <div className="ml-1 flex items-center gap-2.5 rounded-lg border border-border/80 bg-secondary/40 py-1 pl-1 pr-3">
          <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#0e9488] text-xs font-semibold text-[#05201d]">
            AS
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-xs font-medium text-foreground">A. Sharma</div>
            <div className="text-[10px] text-muted-foreground">SOC Analyst</div>
          </div>
        </div>
      </div>
    </header>
  )
}
