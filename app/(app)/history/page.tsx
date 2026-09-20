import { Calendar, Cpu, Terminal, User, Zap } from "lucide-react"
import { Card, CardHeader, PageHeader, StatusBadge } from "@/components/dashboard/ui"
import { scanHistory, type ScanRecord } from "@/lib/data"

function triggerMeta(trigger: ScanRecord["trigger"]) {
  switch (trigger) {
    case "Scheduled":
      return { Icon: Calendar, color: "#818cf8" }
    case "Manual":
      return { Icon: User, color: "#2dd4bf" }
    default:
      return { Icon: Terminal, color: "#38bdf8" }
  }
}

function statusTone(status: ScanRecord["status"]) {
  if (status === "Partial") return "warn"
  if (status === "Running") return "info"
  return "teal"
}

export default function HistoryPage() {
  return (
    <>
      <PageHeader
        title="Scan History"
        description="A complete audit trail of every configuration scan executed against your fleet, including scheduled runs, manual audits, and CI-triggered checks."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          <Zap className="size-3.5 text-primary" />
          Retention: 90 days
        </span>
      </PageHeader>

      <Card>
        <CardHeader title="Recent Scans" subtitle="Newest first" icon={<Cpu className="size-4" />} />
        <div className="mt-4 overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Scan ID</th>
                <th className="px-5 py-3 font-medium">Started</th>
                <th className="px-5 py-3 font-medium">Trigger</th>
                <th className="px-5 py-3 font-medium text-right">Devices</th>
                <th className="px-5 py-3 font-medium text-right">Findings</th>
                <th className="px-5 py-3 font-medium text-right">Critical</th>
                <th className="px-5 py-3 font-medium text-right">Duration</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {scanHistory.map((s) => {
                const { Icon, color } = triggerMeta(s.trigger)
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <div className="font-mono text-xs text-foreground">{s.id}</div>
                      <div className="text-[11px] text-muted-foreground">{s.by}</div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted-foreground">{s.started}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                        <Icon className="size-3.5" style={{ color }} />
                        {s.trigger}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs text-foreground">{s.devices}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs text-foreground">{s.findings}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold text-[#f0596b]">
                      {s.critical}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">{s.duration}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={statusTone(s.status) as any}>{s.status}</StatusBadge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
