import { ChevronRight } from "lucide-react"
import { SeverityBadge, StatusBadge } from "./ui"
import { findings, type Finding } from "@/lib/data"
import { cn } from "@/lib/utils"

function statusTone(status: Finding["status"]) {
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

export function FindingsTable({ rows = findings, limit }: { rows?: Finding[]; limit?: number }) {
  const data = limit ? rows.slice(0, limit) : rows
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
          {data.map((f) => (
            <tr
              key={f.id}
              className="group border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/40"
            >
              <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-muted-foreground">{f.id}</td>
              <td className="whitespace-nowrap px-5 py-3.5">
                <div className="font-medium text-foreground">{f.device}</div>
                <div className="text-[11px] text-muted-foreground">{f.vendor}</div>
              </td>
              <td className="px-5 py-3.5 text-foreground">{f.issue}</td>
              <td className="px-5 py-3.5">
                <SeverityBadge severity={f.severity} />
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
                {f.detected}
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
