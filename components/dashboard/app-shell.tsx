"use client"

import { useState, type ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"
import { TopBar } from "./top-bar"
import { AppFooter } from "./app-footer"

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background bg-grid">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px] space-y-6">{children}</div>
        </main>
        <AppFooter />
      </div>
    </div>
  )
}
