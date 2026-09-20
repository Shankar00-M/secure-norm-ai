import { Clock, Filter, Server, ShieldCheck, Zap } from "lucide-react"
import { Card, PageHeader } from "@/components/dashboard/ui"
import { ScanRunner } from "@/components/dashboard/scan-runner"
import { FindingsExplorer } from "@/components/dashboard/findings-explorer"

const scopeStats = [
  { label: "In scope", value: "156", sub: "devices", icon: Server, color: "#818cf8" },
  { label: "Control rules", value: "833", sub: "evaluated", icon: ShieldCheck, color: "#2dd4bf" },
  { label: "Avg scan time", value: "8m", sub: "42s", icon: Clock, color: "#38bdf8" },
  { label: "Detection rate", value: "99.4%", sub: "coverage", icon: Zap, color: "#fbbf24" },
]

export default function ScannerPage() {
  return (
    <>
      <PageHeader
        title="Configuration Scanner"
        description="Run agentless configuration audits against your network fleet. SecureNorm AI normalizes each vendor's syntax and evaluates it against your enabled control frameworks."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          <Filter className="size-3.5" />
          6 frameworks enabled
        </span>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {scopeStats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${s.color}18`, color: s.color }}
                >
                  <Icon className="size-4" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xl font-semibold text-foreground">{s.value}</span>
                    <span className="text-xs text-muted-foreground">{s.sub}</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <ScanRunner />

      <FindingsExplorer />
    </>
  )
}
