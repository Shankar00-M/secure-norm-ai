import { CheckCircle2, AlertTriangle, Download, ShieldCheck } from "lucide-react"
import { Card, CardHeader, PageHeader, Progress, StatusBadge } from "@/components/dashboard/ui"
import { ComplianceSparkline } from "@/components/dashboard/charts"
import { complianceFrameworks, complianceTrend, complianceCoverage } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function CompliancePage() {
  const totalControls = complianceFrameworks.reduce((s, f) => s + f.controls, 0)
  const totalPassed = complianceFrameworks.reduce((s, f) => s + f.passed, 0)
  const totalFailed = complianceFrameworks.reduce((s, f) => s + f.failed, 0)

  return (
    <>
      <PageHeader
        title="Compliance"
        description="Continuous mapping of device configurations to regulatory and industry control frameworks. Coverage is recalculated after every scan."
      >
        <button className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary">
          <Download className="size-3.5" />
          Attestation report
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <CardHeader
            title="Overall Coverage"
            subtitle="Weighted across all frameworks"
            icon={<ShieldCheck className="size-4" />}
            className="p-0"
          />
          <div className="mt-4 flex items-end gap-2">
            <span className="font-mono text-4xl font-semibold text-primary">{complianceCoverage}%</span>
            <span className="pb-1.5 text-xs text-primary">+2.1 this week</span>
          </div>
          <div className="mt-3">
            <ComplianceSparkline data={complianceTrend} />
          </div>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Controls Passing</span>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-mono text-4xl font-semibold text-foreground">{totalPassed}</span>
            <span className="pb-1.5 text-sm text-muted-foreground">/ {totalControls}</span>
          </div>
          <Progress value={(totalPassed / totalControls) * 100} className="mt-4" />
          <p className="mt-2 text-[11px] text-muted-foreground">Across 6 active frameworks</p>
        </Card>

        <Card className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Controls Failing</span>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-mono text-4xl font-semibold text-[#f0596b]">{totalFailed}</span>
            <span className="pb-1.5 text-sm text-muted-foreground">need remediation</span>
          </div>
          <Progress value={(totalFailed / totalControls) * 100} color="#f0596b" className="mt-4" />
          <p className="mt-2 text-[11px] text-muted-foreground">32 mapped to open findings</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Framework Coverage" subtitle="Control-level compliance by standard" />
        <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden bg-border/50 md:grid-cols-2">
          {complianceFrameworks.map((f) => {
            const attention = f.status === "Attention"
            return (
              <div key={f.name} className="bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{f.name}</h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {f.controls} controls · {f.passed} passed · {f.failed} failed
                    </p>
                  </div>
                  <StatusBadge tone={attention ? "warn" : "teal"}>
                    {attention ? <AlertTriangle className="size-3" /> : <CheckCircle2 className="size-3" />}
                    {f.status}
                  </StatusBadge>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Progress
                    value={f.coverage}
                    color={attention ? "#fbbf24" : "#2dd4bf"}
                    className="flex-1"
                  />
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold",
                      attention ? "text-[#fbbf24]" : "text-primary",
                    )}
                  >
                    {f.coverage}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </>
  )
}
