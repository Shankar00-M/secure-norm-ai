"use client"

import { Cpu, Wifi } from "lucide-react"
import { Card, Progress } from "./ui"
import { useAppData } from "@/lib/use-app-data"
import { relativeFromISO } from "@/lib/datetime"
import { cn } from "@/lib/utils"

const vendorMeta: Record<string, { color: string; mark: string; tint: string }> = {
  Cisco: { color: "#1ba0d7", mark: "cisco", tint: "from-[#1ba0d7]/20" },
  Fortinet: { color: "#ee3124", mark: "FTNT", tint: "from-[#ee3124]/20" },
  "Palo Alto": { color: "#fa582d", mark: "PANW", tint: "from-[#fa582d]/20" },
  Juniper: { color: "#84bd00", mark: "JNPR", tint: "from-[#84bd00]/20" },
  Unknown: { color: "#8494ab", mark: "UNK", tint: "from-[#8494ab]/20" },
}

export function VendorCards() {
  const { devices } = useAppData()

  if (devices.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card/70 p-8 text-center">
        <p className="text-sm text-muted-foreground">No devices discovered yet.</p>
        <p className="mt-1 text-xs text-muted-foreground/60">Run a scan to populate your fleet inventory.</p>
      </div>
    )
  }

  // Group by vendor
  const byVendor: Record<string, typeof devices> = {}
  devices.forEach((d) => {
    if (!byVendor[d.vendor]) byVendor[d.vendor] = []
    byVendor[d.vendor].push(d)
  })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {Object.entries(byVendor).map(([vendor, devs]) => {
      const meta = vendorMeta[vendor] ?? vendorMeta.Unknown
      const count = devs.length
      const online = devs.filter((d) => d.online).length
      const critical = devs.reduce((s, d) => s + d.critical_count, 0)
      const high = devs.reduce((s, d) => s + d.high_count, 0)
      const posture = count > 0 ? Math.round(devs.reduce((s, d) => s + d.posture, 0) / count) : 0
      const lastScan = devs.map((d) => d.last_scan_at).filter(Boolean).sort().reverse()[0]
      const osLabel = devs[0]?.os_label ?? "—"
      return (
        <Card key={vendor} className="group overflow-hidden">
          <div className={cn("relative bg-gradient-to-b to-transparent p-5", meta.tint)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-lg border text-xs font-bold uppercase tracking-tight"
                  style={{
                    borderColor: `${meta.color}55`,
                    backgroundColor: `${meta.color}18`,
                    color: meta.color,
                  }}
                >
                  {vendor.slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{vendor}</div>
                  <div className="text-[11px] text-muted-foreground">{osLabel}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-primary">
                <Wifi className="size-3.5" />
                {online}/{count}
              </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Cpu className="size-3.5" /> {count} devices
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  Scanned {lastScan ? relativeFromISO(lastScan) : "never"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-semibold text-foreground">{posture}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Posture</div>
              </div>
            </div>

            <Progress value={posture} color={meta.color} className="mt-3" />

            <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-md border border-[#f0596b]/30 bg-[#f0596b]/10 px-1.5 py-0.5 text-[#f0596b]">
                {critical} critical
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-[#fb923c]/30 bg-[#fb923c]/10 px-1.5 py-0.5 text-[#fb923c]">
                {high} high
              </span>
            </div>
          </div>
        </Card>
      )
    })}
    </div>
  )
}
