import { Server, ShieldCheck, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, Progress } from "./ui"
import {
  complianceCoverage,
  devicesScanned,
  devicesTotal,
  findingsDelta,
  openFindings,
  postureDelta,
  postureScore,
} from "@/lib/data"
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
      {typeof value === "number" && Math.abs(value) < 10 ? "" : ""}
    </span>
  )
}

export function StatCards() {
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
          <div className="ml-auto">
            <Delta value={postureDelta} />
          </div>
        </div>
        <Progress value={postureScore} className="mt-3" />
        <p className="mt-2 text-[11px] text-muted-foreground">Weighted across 6 frameworks</p>
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
          <div className="ml-auto">
            <Delta value={2.1} />
          </div>
        </div>
        <Progress value={complianceCoverage} color="#38bdf8" className="mt-3" />
        <p className="mt-2 text-[11px] text-muted-foreground">711 of 833 controls passing</p>
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
        <Progress value={(devicesScanned / devicesTotal) * 100} color="#818cf8" className="mt-3" />
        <p className="mt-2 text-[11px] text-muted-foreground">14 devices unreachable</p>
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
          <div className="ml-auto">
            <Delta value={findingsDelta} invert />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="h-1.5 flex-[18] rounded-full bg-[#f0596b]" />
          <span className="h-1.5 flex-[64] rounded-full bg-[#fb923c]" />
          <span className="h-1.5 flex-[141] rounded-full bg-[#fbbf24]" />
          <span className="h-1.5 flex-[104] rounded-full bg-[#38bdf8]" />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">18 critical need attention</p>
      </Card>
    </div>
  )
}
