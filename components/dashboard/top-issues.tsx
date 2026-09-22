"use client"

import { SeverityBadge } from "./ui"
import { useAppData } from "@/lib/use-app-data"
import type { Severity } from "@/lib/data"

export function TopIssues() {
  const { findings } = useAppData()

  // Group by issue title to find recurring patterns
  const issueMap: Record<string, { title: string; severity: string; framework: string; count: number }> = {}
  findings.forEach((f) => {
    const key = f.issue
    if (!issueMap[key]) {
      issueMap[key] = { title: f.issue, severity: f.severity, framework: f.framework, count: 0 }
    }
    issueMap[key].count++
  })

  const topIssues = Object.values(issueMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)

  if (topIssues.length === 0) {
    return (
      <div className="px-5 py-8 text-center">
        <p className="text-xs text-muted-foreground">No recurring issues detected.</p>
      </div>
    )
  }

  const max = Math.max(...topIssues.map((i) => i.count))

  return (
    <div className="divide-y divide-border/50">
      {topIssues.map((issue, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium text-foreground">{issue.title}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <SeverityBadge severity={issue.severity as Severity} />
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
