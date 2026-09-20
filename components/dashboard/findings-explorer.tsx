"use client"

import { useMemo, useState } from "react"
import { Filter, Search } from "lucide-react"
import { Card, CardHeader } from "./ui"
import { FindingsTable } from "./findings-table"
import { findings, severityMeta, type Severity } from "@/lib/data"
import { cn } from "@/lib/utils"

const severities: (Severity | "all")[] = ["all", "critical", "high", "medium", "low"]

export function FindingsExplorer() {
  const [active, setActive] = useState<Severity | "all">("all")
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    return findings.filter((f) => {
      const matchesSeverity = active === "all" || f.severity === active
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        f.issue.toLowerCase().includes(q) ||
        f.device.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.framework.toLowerCase().includes(q)
      return matchesSeverity && matchesQuery
    })
  }, [active, query])

  return (
    <Card>
      <CardHeader
        title="Findings Explorer"
        subtitle={`${rows.length} results across the current scan`}
        icon={<Filter className="size-4" />}
      />
      <div className="flex flex-col gap-3 px-5 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {severities.map((s) => {
            const isActive = active === s
            const count =
              s === "all" ? findings.length : findings.filter((f) => f.severity === s).length
            return (
              <button
                key={s}
                onClick={() => setActive(s)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium capitalize transition",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground",
                )}
              >
                {s !== "all" ? (
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: severityMeta[s as Severity].color }}
                  />
                ) : null}
                {s}
                <span className="font-mono text-[10px] text-muted-foreground">{count}</span>
              </button>
            )
          })}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter findings…"
            className="h-9 w-full rounded-lg border border-border/80 bg-secondary/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>
      <div className="mt-4">
        {rows.length > 0 ? (
          <FindingsTable rows={rows} />
        ) : (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No findings match your filters.
          </div>
        )}
      </div>
    </Card>
  )
}
