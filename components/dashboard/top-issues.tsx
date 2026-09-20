import { SeverityBadge } from "./ui"
import { topIssues } from "@/lib/data"

export function TopIssues() {
  const max = Math.max(...topIssues.map((i) => i.count))
  return (
    <div className="divide-y divide-border/50">
      {topIssues.map((issue) => (
        <div key={issue.id} className="flex items-center gap-4 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">{issue.title}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <SeverityBadge severity={issue.severity} />
              <span className="font-mono text-[11px] text-muted-foreground">{issue.framework}</span>
            </div>
          </div>
          <div className="flex w-28 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(issue.count / max) * 100}%` }}
              />
            </div>
            <span className="w-7 text-right font-mono text-xs text-foreground">{issue.count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
