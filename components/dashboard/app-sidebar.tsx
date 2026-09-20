"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Brain,
 FileText,
  GitBranch,
  History,
  LayoutDashboard,
  Network,
  ScanLine,
  Settings,
  Shield,
  ShieldCheck,
  Spline,
  Waypoints,
  Wrench,
  X,
  Boxes,
  Crosshair,
  FlaskConical,
  Workflow,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { section: "Operations", items: [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/scanner", label: "Configuration Scanner", icon: ScanLine },
    { href: "/compliance", label: "Compliance", icon: ShieldCheck },
  ]},
  { section: "Advanced Analysis", items: [
    { href: "/digital-twin", label: "Digital Twin", icon: Boxes },
    { href: "/what-if", label: "What-If Simulator", icon: FlaskConical },
    { href: "/attack-paths", label: "Attack-Path Explorer", icon: Waypoints },
    { href: "/risk-engine", label: "Explainable Risk Engine", icon: Spline },
  ]},
  { section: "Response", items: [
    { href: "/remediation", label: "Remediation", icon: Wrench },
    { href: "/remediation-gate", label: "Safe Remediation Gate", icon: GitBranch },
    { href: "/evidence", label: "Evidence Chain", icon: ShieldCheck },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/history", label: "Scan History", icon: History },
  ]},
  { section: "Master Intelligence", items: [
    { href: "/attack-simulation", label: "Attack Simulation Engine", icon: Crosshair },
    { href: "/policy-compiler", label: "Intent → Policy Compiler", icon: Workflow },
    { href: "/reasoning", label: "Security Reasoning Engine", icon: Brain },
  ]},
  { section: "System", items: [
    { href: "/vendor-learning", label: "Vendor Learning", icon: Network },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
]

export function AppSidebar({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#0e9488] shadow-[0_0_20px_-4px_var(--primary)]">
              <Shield className="size-5 text-[#05201d]" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-sidebar-foreground">
                SecureNorm <span className="text-primary">AI</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Security Auditor
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-thin px-3 py-5">
          {nav.map((group) => (
            <div key={group.section}>
              <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      {active ? (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                      ) : null}
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Live monitoring active
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Activity className="size-3.5" />
              Next scan in 4h 12m
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
