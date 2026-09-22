"use client"

import { useState, type ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"
import { TopBar } from "./top-bar"
import { AppFooter } from "./app-footer"
import { useAppData } from "@/lib/use-app-data"
import { useAuth } from "@/lib/auth-context"
import { addNotification, addAuditLog } from "@/lib/use-app-data"
import { nowISO } from "@/lib/datetime"

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { refresh, refreshing } = useAppData()
  const { profile, tenant } = useAuth()

  async function handleRefresh() {
    await refresh()
    if (tenant && profile) {
      await addAuditLog(tenant.id, profile.id, profile.full_name, "data_refresh", "dashboard")
    }
  }

  return (
    <div className="flex min-h-screen bg-background bg-grid">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setSidebarOpen(true)} onRefresh={handleRefresh} refreshing={refreshing} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
        </main>
        <AppFooter />
      </div>
    </div>
  )
}
