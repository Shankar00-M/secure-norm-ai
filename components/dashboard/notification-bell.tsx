"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react"
import { supabase, type Notification } from "@/lib/supabase-client"
import { useAuth } from "@/lib/auth-context"
import { relativeFromISO } from "@/lib/datetime"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const { profile, tenant } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tenant) return
    loadNotifications()
    const interval = setInterval(loadNotifications, 15000)
    return () => clearInterval(interval)
  }, [tenant])

  async function loadNotifications() {
    if (!tenant) return
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false })
      .limit(50)
    setNotifications(data ?? [])
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const unreadCount = notifications.filter((n) => !n.read).length

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  async function markAllRead() {
    if (!tenant) return
    const unread = notifications.filter((n) => !n.read)
    for (const n of unread) {
      await supabase.from("notifications").update({ read: true }).eq("id", n.id)
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  async function clearNotification(id: string) {
    await supabase.from("notifications").delete().eq("id", id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex size-9 items-center justify-center rounded-lg border border-border/80 bg-secondary/40 text-muted-foreground transition hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#f0596b] text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-xl border border-border/80 bg-popover/95 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-md bg-[#f0596b]/15 px-1.5 py-0.5 text-[10px] font-medium text-[#f0596b]">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllRead}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto mb-2 size-6 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No notifications yet</p>
                <p className="mt-1 text-[11px] text-muted-foreground/60">Events like scans, findings, and remediations will appear here.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "group flex gap-3 border-b border-border/50 px-4 py-3 transition hover:bg-secondary/30",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <div className={cn("mt-1 size-2 shrink-0 rounded-full", !n.read ? "bg-primary" : "bg-transparent")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-foreground">{n.title}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{relativeFromISO(n.created_at)}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{n.message}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      {!n.read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80"
                        >
                          <Check className="size-3" /> Mark read
                        </button>
                      )}
                      <button
                        onClick={() => clearNotification(n.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground opacity-0 transition hover:text-[#f0596b] group-hover:opacity-100"
                      >
                        <Trash2 className="size-3" /> Clear
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
