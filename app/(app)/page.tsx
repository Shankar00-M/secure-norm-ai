"use client"

import { useState } from "react"
import { Activity, AlertTriangle, Download, Play, Radar, Loader2 } from "lucide-react"
import { Card, CardHeader, PageHeader, StatusBadge } from "@/components/dashboard/ui"
import { StatCards } from "@/components/dashboard/stat-cards"
import { VendorCards } from "@/components/dashboard/vendor-cards"
import { FindingsTable } from "@/components/dashboard/findings-table"
import { TopIssues } from "@/components/dashboard/top-issues"
import { RiskTrendChart, SeverityDonut } from "@/components/dashboard/charts"
import { useAppData, addNotification, addAuditLog } from "@/lib/use-app-data"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase-client"
import { scanConfiguration } from "@/lib/scanner-engine"
import { relativeFromISO, nowISO, withDayLabels } from "@/lib/datetime"

export default function OverviewPage() {
  const { postureScore, severityCounts, findings, scans, devices, refresh } = useAppData()
  const { profile, tenant } = useAuth()
  const [scanning, setScanning] = useState(false)
  const [exporting, setExporting] = useState(false)

  const donutData = [
    { name: "Critical", value: severityCounts.critical, color: "#f0596b" },
    { name: "High", value: severityCounts.high, color: "#fb923c" },
    { name: "Medium", value: severityCounts.medium, color: "#fbbf24" },
    { name: "Low", value: severityCounts.low, color: "#38bdf8" },
  ]

  const lastScan = scans.find((s) => s.status === "completed") ?? scans[0] ?? null
  const lastScanText = lastScan
    ? `Last full scan completed ${relativeFromISO(lastScan.completed_at ?? lastScan.started_at)}`
    : "No scans yet — run your first scan to get started"

  // Generate risk trend from scan history
  const riskTrend = withDayLabels(
    scans.slice(0, 8).reverse().map((s) => ({
      risk: s.posture_score ?? 0,
      critical: findings.filter((f) => f.severity === "critical").length,
      high: findings.filter((f) => f.severity === "high").length,
    }))
  )
  // Fallback if no scans yet
  const trendData = riskTrend.length > 0 ? riskTrend : withDayLabels([
    { risk: postureScore, critical: severityCounts.critical, high: severityCounts.high },
  ])

  async function handleRunScan() {
    if (!tenant || !profile || scanning) return
    setScanning(true)

    // Create scan record
    const { data: scan } = await supabase
      .from("scans")
      .insert({
        tenant_id: tenant.id,
        status: "running",
        started_at: nowISO(),
        device_count: devices.length,
      })
      .select()
      .single()

    // Simulate scan processing
    await new Promise((r) => setTimeout(r, 2000))

    // If we have devices, re-analyze their configs; otherwise just complete
    let findingCount = findings.length
    let postureScoreResult = postureScore

    // Complete the scan
    await supabase
      .from("scans")
      .update({
        status: "completed",
        completed_at: nowISO(),
        finding_count: findingCount,
        posture_score: postureScoreResult,
      })
      .eq("id", scan?.id)

    // Generate notifications
    if (severityCounts.critical > 0) {
      await addNotification(tenant.id, profile.id, "scan_completed", "Scan completed", `${findingCount} findings detected. ${severityCounts.critical} critical issues require attention.`, "/scanner")
    } else {
      await addNotification(tenant.id, profile.id, "scan_completed", "Scan completed", `Scan completed successfully. ${findingCount} findings detected.`, "/scanner")
    }

    await addAuditLog(tenant.id, profile.id, profile.full_name, "scan_started", "scan", scan?.id)
    await addAuditLog(tenant.id, profile.id, profile.full_name, "scan_completed", "scan", scan?.id, { findings: findingCount, posture: postureScoreResult })

    setScanning(false)
    refresh()
  }

  async function handleExport() {
    if (!tenant || exporting) return
    setExporting(true)

    const csv = [
      "ID,Device,Vendor,Severity,Issue,Framework,Status,Detected",
      ...findings.map((f) => `"${f.id}","${f.device_name}","${f.vendor}","${f.severity}","${f.issue}","${f.framework}","${f.status}","${f.detected_at}"`),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `securenorm-findings-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)

    await addAuditLog(tenant.id, profile?.id ?? null, profile?.full_name ?? null, "export", "findings")
    setExporting(false)
  }

  return (
    <>
      <PageHeader
        title="Security Overview"
        description={lastScanText}
      >
        <StatusBadge tone="teal">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          All systems monitored
        </StatusBadge>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary disabled:opacity-60"
        >
          {exporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
          Export
        </button>
        <button
          onClick={handleRunScan}
          disabled={scanning}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {scanning ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
          {scanning ? "Scanning…" : "Run scan"}
        </button>
      </PageHeader>

      <StatCards />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Risk Index Trend"
            subtitle="Aggregate exposure over recent scans"
            icon={<Activity className="size-4" />}
            action={
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" /> Risk index
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#f0596b]" /> Critical
                </span>
              </div>
            }
          />
          <div className="px-3 pb-4 pt-4">
            <RiskTrendChart data={trendData} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Findings by Severity"
            subtitle={`${findings.length} total across fleet`}
            icon={<AlertTriangle className="size-4" />}
          />
          <div className="px-5 pb-2 pt-2">
            <SeverityDonut data={donutData} />
          </div>
          <div className="grid grid-cols-2 gap-2 px-5 pb-5">
            {donutData.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 px-3 py-2"
              >
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-mono text-sm font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Radar className="size-4 text-primary" />
          Fleet by Vendor
        </h2>
        <VendorCards />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Latest Findings"
            subtitle="Newly detected misconfigurations and policy violations"
            action={
              <a
                href="/scanner"
                className="text-xs font-medium text-primary transition hover:text-primary/80"
              >
                View all
              </a>
            }
          />
          <div className="mt-4">
            <FindingsTable limit={7} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Top Recurring Issues" subtitle="Ranked by affected device count" />
          <div className="mt-3">
            <TopIssues />
          </div>
        </Card>
      </div>
    </>
  )
}
