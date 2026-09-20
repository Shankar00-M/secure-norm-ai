"use client"

import { useState } from "react"
import { Waypoints, ShieldAlert, Info, ArrowRight, Lightbulb } from "lucide-react"
import { Card, CardHeader, SeverityBadge, StatusBadge } from "./ui"
import { attackPaths, type AttackPath, type AttackPathStep } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

const stepColors: Record<AttackPathStep["kind"], string> = {
  source: "#f0596b",
  zone: "#818cf8",
  rule: "#fbbf24",
  destination: "#38bdf8",
  service: "#2dd4bf",
}

const stepLabels: Record<AttackPathStep["kind"], string> = {
  source: "Source",
  zone: "Zone",
  rule: "Rule",
  destination: "Destination",
  service: "Service",
}

function PathFlow({ steps, selectedIndex }: { steps: AttackPathStep[]; selectedIndex: number | null }) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, i) => {
        const color = stepColors[step.kind]
        const isSelected = selectedIndex === i
        return (
          <div key={step.id}>
            <div
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 transition",
                isSelected ? "border-primary/40 bg-primary/5" : "border-border/60 bg-secondary/30",
              )}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold"
                style={{ borderColor: `${color}50`, backgroundColor: `${color}15`, color }}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded border border-border/70 bg-secondary/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {stepLabels[step.kind]}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step.label}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{step.detail}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-sm font-semibold" style={{ color }}>
                  {step.risk}
                </div>
                <div className="text-[10px] text-muted-foreground">risk</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowRight className="size-4 rotate-90 text-muted-foreground/40" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function AttackPathExplorer() {
  const [selectedId, setSelectedId] = useState(attackPaths[0].id)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const selected = attackPaths.find((p) => p.id === selectedId)!

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Waypoints className="size-3.5" />
          Attack Paths
        </div>
        {attackPaths.map((p) => {
          const active = p.id === selectedId
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{p.id}</span>
                <SeverityBadge severity={p.severity} />
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-foreground">{p.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${p.riskScore}%`,
                      backgroundColor: p.severity === "critical" ? "#f0596b" : "#fb923c",
                    }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold text-foreground">{p.riskScore}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
                <SeverityBadge severity={selected.severity} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{selected.id}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>Finding {selected.findingId}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>Risk score {selected.riskScore}/100</span>
              </div>
            </div>
            <StatusBadge tone={selected.severity === "critical" ? "danger" : "warn"}>
              <ShieldAlert className="size-3" />
              {selected.severity === "critical" ? "Critical path" : "High risk path"}
            </StatusBadge>
          </div>

          <div className="mt-4 rounded-lg border border-[#f0596b]/20 bg-[#f0596b]/5 p-4">
            <div className="flex items-start gap-2.5">
              <Info className="size-4 shrink-0 text-[#f0596b]" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#f0596b]">Why this path is risky</div>
                <p className="mt-1 text-sm text-foreground">{selected.why}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="size-4 shrink-0 text-primary" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">Recommended mitigation</div>
                <p className="mt-1 text-sm text-foreground">{selected.mitigation}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Path Visualization"
            subtitle={`${selected.steps.length} steps from source to impact`}
            icon={<Waypoints className="size-4" />}
          />
          <div className="p-5">
            <PathFlow steps={selected.steps} selectedIndex={hoveredStep} />
          </div>
        </Card>
      </div>
    </div>
  )
}
