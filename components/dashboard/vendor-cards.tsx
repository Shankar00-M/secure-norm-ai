import { Cpu, Wifi } from "lucide-react"
import { Card, Progress } from "./ui"
import { devices, type Vendor } from "@/lib/data"
import { cn } from "@/lib/utils"

const vendorMeta: Record<Vendor, { color: string; mark: string; tint: string }> = {
  Cisco: { color: "#1ba0d7", mark: "cisco", tint: "from-[#1ba0d7]/20" },
  Fortinet: { color: "#ee3124", mark: "FTNT", tint: "from-[#ee3124]/20" },
  "Palo Alto": { color: "#fa582d", mark: "PANW", tint: "from-[#fa582d]/20" },
  Juniper: { color: "#84bd00", mark: "JNPR", tint: "from-[#84bd00]/20" },
}

export function VendorCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {devices.map((d) => {
        const meta = vendorMeta[d.vendor]
        return (
          <Card key={d.vendor} className="group overflow-hidden">
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
                    {d.vendor.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{d.vendor}</div>
                    <div className="text-[11px] text-muted-foreground">{d.osLabel}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-primary">
                  <Wifi className="size-3.5" />
                  {d.online}/{d.count}
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Cpu className="size-3.5" /> {d.count} devices
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">Scanned {d.lastScan}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-semibold text-foreground">{d.posture}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Posture</div>
                </div>
              </div>

              <Progress value={d.posture} color={meta.color} className="mt-3" />

              <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-md border border-[#f0596b]/30 bg-[#f0596b]/10 px-1.5 py-0.5 text-[#f0596b]">
                  {d.critical} critical
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-[#fb923c]/30 bg-[#fb923c]/10 px-1.5 py-0.5 text-[#fb923c]">
                  {d.high} high
                </span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
