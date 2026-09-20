import { Activity, AlertTriangle, Download, Play, Radar } from "lucide-react"
import { Card, CardHeader, PageHeader, StatusBadge } from "@/components/dashboard/ui"
import { StatCards } from "@/components/dashboard/stat-cards"
import { VendorCards } from "@/components/dashboard/vendor-cards"
import { FindingsTable } from "@/components/dashboard/findings-table"
import { TopIssues } from "@/components/dashboard/top-issues"
import { RiskTrendChart, SeverityDonut } from "@/components/dashboard/charts"
import { riskTrend, severityCounts } from "@/lib/data"

const donutData = [
  { name: "Critical", value: severityCounts.critical, color: "#f0596b" },
  { name: "High", value: severityCounts.high, color: "#fb923c" },
  { name: "Medium", value: severityCounts.medium, color: "#fbbf24" },
  { name: "Low", value: severityCounts.low, color: "#38bdf8" },
]

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        title="Security Overview"
        description="AI-driven configuration analysis across your multi-vendor network fleet. Last full scan completed 12 minutes ago."
      >
        <StatusBadge tone="teal">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          All systems monitored
        </StatusBadge>
        <button className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary">
          <Download className="size-3.5" />
          Export
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
          <Play className="size-3.5" />
          Run scan
        </button>
      </PageHeader>

      <StatCards />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Risk Index Trend"
            subtitle="Aggregate exposure over the last 8 scans"
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
            <RiskTrendChart data={riskTrend} />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Findings by Severity"
            subtitle="327 open across fleet"
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
