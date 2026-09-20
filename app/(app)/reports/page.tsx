import { Download, FileText, FileSpreadsheet, FileCode, Plus, Calendar } from "lucide-react"
import { Card, CardHeader, PageHeader } from "@/components/dashboard/ui"
import { reports } from "@/lib/data"
import { cn } from "@/lib/utils"

function formatIcon(format: string) {
  if (format === "XLSX") return { Icon: FileSpreadsheet, color: "#2dd4bf" }
  if (format === "CSV") return { Icon: FileCode, color: "#38bdf8" }
  return { Icon: FileText, color: "#f0596b" }
}

const templates = [
  { name: "Executive Summary", desc: "High-level posture for leadership", cadence: "Monthly" },
  { name: "Compliance Attestation", desc: "Per-framework control evidence", cadence: "Quarterly" },
  { name: "Findings Digest", desc: "All open findings with remediation", cadence: "Weekly" },
]

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate, schedule, and download audit-ready security and compliance reports across your network fleet."
      >
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
          <Plus className="size-3.5" />
          Generate report
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.name} className="group cursor-pointer p-5 transition hover:border-primary/40">
            <div className="flex items-center justify-between">
              <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-primary">
                <FileText className="size-4" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                <Calendar className="size-3" />
                {t.cadence}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">{t.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Generated Reports" subtitle="Recently produced documents" />
        <div className="mt-2 divide-y divide-border/50">
          {reports.map((r) => {
            const { Icon, color } = formatIcon(r.format)
            return (
              <div
                key={r.id}
                className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/40"
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60"
                  style={{ backgroundColor: `${color}12`, color }}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{r.title}</span>
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                        "border-border/70 bg-secondary/40 text-muted-foreground",
                      )}
                    >
                      {r.format}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                    <span className="font-mono">{r.id}</span>
                    <span className="size-1 rounded-full bg-border" />
                    <span>{r.framework}</span>
                    <span className="size-1 rounded-full bg-border" />
                    <span>{r.period}</span>
                    <span className="size-1 rounded-full bg-border" />
                    <span>{r.size}</span>
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-xs text-foreground">{r.generated}</div>
                  <div className="text-[11px] text-muted-foreground">{r.author}</div>
                </div>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/40 px-2.5 py-1.5 text-xs font-medium text-foreground opacity-0 transition group-hover:opacity-100 hover:bg-secondary">
                  <Download className="size-3.5" />
                  Download
                </button>
              </div>
            )
          })}
        </div>
      </Card>
    </>
  )
}
