import type { ReactNode } from "react"
import { AppShell } from "@/components/dashboard/app-shell"
import { AuthGate } from "@/components/auth-gate"

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AuthGate><AppShell>{children}</AppShell></AuthGate>
}
