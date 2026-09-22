"use client"

import { Server, ShieldCheck, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, Progress } from "./ui"
import { useAppData } from "@/lib/use-app-data"
import { relativeFromISO } from "@/lib/datetime"
import { cn } from "@/lib/utils"

function Delta({ value, invert = false }: { value: number; invert?: boolean }) {
  const positive = value >= 0
  const good = invert ? !positive : positive
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
        good ? "bg-primary/10 text-primary" : "bg-[#f0596b]/10 text-[#f0596b]",
      )}
    >
      <Icon className="size-3" />
      {positive ? "+" : ""}
      {value}
    </span>
  )
}

export function StatCards() {
  const { postureScore, complianceCoverage, devices, findings, severityCounts, lastScan } = useAppData()

  const devicesScanned = devices.length
  const devicesTotal = devices.length
  const openFindings = findings.filter((f) => f.status === "Open").length
  const criticalCount = severityCounts.critical
  const highCount = severityCounts.high
  const mediumCount = severityCounts.medium
  const lowCount = severityCounts.low

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Security Posture
          </span>
          <ShieldCheck className="size-4 text-primary" />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-mono text-3xl font-semibold text-foreground">{postureScore}</span>
          <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
        </div>
        <Progress value={postureScore} className="mt-3" />
        <p className="mt-2 text-[11px] text-muted-foreground">
          {lastScan ? `Last scan ${relativeFromISO(lastScan.completed_at ?? lastScan.started_at)}` : "No scans yet"}
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Compliance Coverage
          </span>
          <ShieldCheck className="size-4 text-[#38bdf8]" />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-mono text-3xl font-semibold text-foreground">{complianceCoverage}%</span>
        </div>
        <Progress value={complianceCoverage} color="#38bdf8" className="mt-3" />
        <p className="mt-2 text-[11px] text-muted-foreground">
          {findings.filter((f) => f.status === "Resolved").length} of {findings.length} findings resolved
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Devices Scanned
          </span>
          <Server className="size-4 text-[#818cf8]" />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-mono text-3xl font-semibold text-foreground">{devicesScanned}</span>
          <span className="pb-1 text-sm text-muted-foreground">/ {devicesTotal}</span>
        </div>
        <Progress value={devicesTotal > 0 ? (devicesScanned / devicesTotal) * 100 : 0} color="#818cf8" className="mt-3" />
        <p className="mt-2 text-[11px] text-muted-foreground">
          {devices.filter((d) => !d.online).length} devices offline
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Open Findings
          </span>
          <AlertTriangle className="size-4 text-[#fb923c]" />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-mono text-3xl font-semibold text-foreground">{openFindings}</span>
        </div>
        {openFindings > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-1.5 flex-[1] rounded-full bg-[#f0596b]" style={{ flexGrow: criticalCount }} />
            <span className="h-1.5 flex-[1] rounded-full bg-[#fb923c]" style={{ flexGrow: highCount }} />
            <span className="h-1.5 flex-[1] rounded-full bg-[#fbbf24]" style={{ flexGrow: mediumCount }} />
            <span className="h-1.5 flex-[1] rounded-full bg-[#38bdf8]" style={{ flexGrow: lowCount }} />
          </div>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">{criticalCount} critical need attention</p>
      </Card>
    </div>
  )
}
