"use client"

import { Calendar, Cpu, User, Zap } from "lucide-react"
import { Card, CardHeader, PageHeader, StatusBadge } from "@/components/dashboard/ui"
import { useAppData } from "@/lib/use-app-data"
import { formatDateTime, relativeFromISO, formatDuration } from "@/lib/datetime"

export default function HistoryPage() {
  const { scans } = useAppData()

  return (
    <>
      <PageHeader
        title="Scan History"
        description="A complete audit trail of every configuration scan executed against your fleet."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          <Zap className="size-3.5 text-primary" />
          {scans.length} scans recorded
        </span>
      </PageHeader>

      <Card>
        <CardHeader title="Recent Scans" subtitle="Newest first" icon={<Cpu className="size-4" />} />
        <div className="mt-4 overflow-x-auto scrollbar-thin">
          {scans.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Cpu className="mx-auto mb-2 size-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No scans yet.</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Run a scan from the Configuration Scanner to see it here.</p>
            </div>
          ) : (
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Scan ID</th>
                  <th className="px-5 py-3 font-medium">Started</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium text-right">Devices</th>
                  <th className="px-5 py-3 font-medium text-right">Findings</th>
                  <th className="px-5 py-3 font-medium text-right">Posture</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((s) => {
                  const duration = s.completed_at && s.started_at
                    ? formatDuration(new Date(s.completed_at).getTime() - new Date(s.started_at).getTime())
                    : "—"
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/40"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="font-mono text-xs text-foreground">{s.id.slice(0, 12).toUpperCase()}</div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted-foreground">
                        {formatDateTime(s.started_at)}
                        <div className="text-[10px] text-muted-foreground/60">{relativeFromISO(s.started_at)}</div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono text-xs text-muted-foreground">
                        {duration}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs text-foreground">{s.device_count}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs text-foreground">{s.finding_count}</td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold text-primary">
                        {s.posture_score ?? "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge tone={s.status === "completed" ? "teal" : s.status === "running" ? "info" : "warn"}>
                          {s.status === "completed" ? "Completed" : s.status === "running" ? "Running" : s.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </>
  )
}
