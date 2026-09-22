"use client"

import { ChevronRight } from "lucide-react"
import { SeverityBadge, StatusBadge } from "./ui"
import { useAppData } from "@/lib/use-app-data"
import { relativeFromISO } from "@/lib/datetime"
import { cn } from "@/lib/utils"
import type { Severity } from "@/lib/data"

function statusTone(status: string) {
  switch (status) {
    case "Open":
      return "danger"
    case "In Progress":
      return "warn"
    case "Resolved":
      return "teal"
    default:
      return "muted"
  }
}

export function FindingsTable({ limit }: { limit?: number }) {
  const { findings } = useAppData()
  const data = limit ? findings.slice(0, limit) : findings

  if (data.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <p className="text-sm text-muted-foreground">No findings detected yet.</p>
        <p className="mt-1 text-xs text-muted-foreground/60">Run a scan from the Configuration Scanner to detect security issues.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/70 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-3 font-medium">ID</th>
            <th className="px-5 py-3 font-medium">Device</th>
            <th className="px-5 py-3 font-medium">Finding</th>
            <th className="px-5 py-3 font-medium">Severity</th>
            <th className="px-5 py-3 font-medium">Framework</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Detected</th>
            <th className="w-10 px-2 py-3" />
          </tr>
        </thead>
        <tbody>
          {data.map((f, i) => (
            <tr
              key={f.id}
              className="group border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/40"
            >
              <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted-foreground">
                {f.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <div className="font-medium text-foreground">{f.device_name}</div>
                <div className="text-[11px] text-muted-foreground">{f.vendor}</div>
              </td>
              <td className="px-5 py-3.5 text-foreground">{f.issue}</td>
              <td className="px-5 py-3.5">
                <SeverityBadge severity={f.severity as Severity} />
              </td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <span className="rounded-md border border-border/70 bg-secondary/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  {f.framework}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <StatusBadge tone={statusTone(f.status) as any}>{f.status}</StatusBadge>
              </td>
              <td className="whitespace-nowrap px-5 py-3.5 text-right text-xs text-muted-foreground">
                {relativeFromISO(f.detected_at)}
              </td>
              <td className="px-2 py-3.5">
                <ChevronRight
                  className={cn(
                    "size-4 text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-foreground",
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
