"use client"

import { useState } from "react"
import { Crosshair, ShieldAlert, Zap, TrendingDown, Server, ArrowRight, Info, Play, RotateCcw } from "lucide-react"
import { Card, CardHeader, SeverityBadge, StatusBadge, Progress } from "./ui"
import { attackSimulations, type AttackSimulation, type SimPhase } from "@/lib/master-data"
import { cn } from "@/lib/utils"

const phaseMeta: Record<SimPhase, { color: string; label: string }> = {
  entry: { color: "#f0596b", label: "Entry Point" },
  vulnerability: { color: "#fb923c", label: "Vulnerability" },
  lateral: { color: "#fbbf24", label: "Lateral Movement" },
  asset: { color: "#818cf8", label: "Critical Asset" },
}

const assetStatusMeta: Record<string, { color: string; label: string }> = {
  compromised: { color: "#f0596b", label: "Compromised" },
  "at-risk": { color: "#fbbf24", label: "At Risk" },
  exposed: { color: "#fb923c", label: "Exposed" },
}

function SimulationFlow({ sim }: { sim: AttackSimulation }) {
  return (
    <div className="flex flex-col gap-2">
      {sim.steps.map((step, i) => {
        const meta = phaseMeta[step.phase]
        return (
          <div key={step.id}>
            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/30 p-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-semibold"
                style={{ borderColor: `${meta.color}50`, backgroundColor: `${meta.color}15`, color: meta.color }}
              >
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                    style={{ borderColor: `${meta.color}40`, backgroundColor: `${meta.color}10`, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step.label}</span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{step.detail}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="font-mono">{step.findingId}</span>
                  <span className="size-1 rounded-full bg-border" />
                  <span>{step.device}</span>
                  <span className="size-1 rounded-full bg-border" />
                  <span className="font-mono">{step.technique}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-sm font-semibold" style={{ color: meta.color }}>
                  +{step.riskContribution}
                </div>
                <div className="text-[10px] text-muted-foreground">risk</div>
              </div>
            </div>
            {i < sim.steps.length - 1 && (
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

function BlastRadiusViz({ sim }: { sim: AttackSimulation }) {
  const max = sim.affectedAssets.length
  const compromised = sim.affectedAssets.filter((a) => a.status === "compromised").length
  const atRisk = sim.affectedAssets.filter((a) => a.status === "at-risk").length
  const exposed = sim.affectedAssets.filter((a) => a.status === "exposed").length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-1">
          <span className="h-2 rounded-l-full bg-[#f0596b]" style={{ width: `${(compromised / max) * 100}%` }} />
          <span className="h-2 bg-[#fbbf24]" style={{ width: `${(atRisk / max) * 100}%` }} />
          <span className="h-2 rounded-r-full bg-[#fb923c]" style={{ width: `${(exposed / max) * 100}%` }} />
        </div>
        <span className="font-mono text-sm font-semibold text-foreground">{max}</span>
        <span className="text-xs text-muted-foreground">assets</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-[#f0596b]/20 bg-[#f0596b]/5 px-3 py-2 text-center">
          <div className="font-mono text-lg font-semibold text-[#f0596b]">{compromised}</div>
          <div className="text-[10px] uppercase tracking-wider text-[#f0596b]">Compromised</div>
        </div>
        <div className="rounded-lg border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-3 py-2 text-center">
          <div className="font-mono text-lg font-semibold text-[#fbbf24]">{atRisk}</div>
          <div className="text-[10px] uppercase tracking-wider text-[#fbbf24]">At Risk</div>
        </div>
        <div className="rounded-lg border border-[#fb923c]/20 bg-[#fb923c]/5 px-3 py-2 text-center">
          <div className="font-mono text-lg font-semibold text-[#fb923c]">{exposed}</div>
          <div className="text-[10px] uppercase tracking-wider text-[#fb923c]">Exposed</div>
        </div>
      </div>
    </div>
  )
}

export function AttackSimulationView() {
  const [selectedId, setSelectedId] = useState(attackSimulations[0].id)
  const [simulated, setSimulated] = useState(false)
  const selected = attackSimulations.find((s) => s.id === selectedId)!

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Crosshair className="size-3.5" />
          Simulations
        </div>
        {attackSimulations.map((s) => {
          const active = s.id === selectedId
          return (
            <button
              key={s.id}
              onClick={() => { setSelectedId(s.id); setSimulated(false) }}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{s.id}</span>
                <SeverityBadge severity={s.severity} />
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-foreground">{s.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.overallRisk}%`, backgroundColor: s.severity === "critical" ? "#f0596b" : "#fb923c" }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold text-foreground">{s.overallRisk}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
                <SeverityBadge severity={selected.severity} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{selected.id}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>{selected.steps.length} attack phases</span>
                <span className="size-1 rounded-full bg-border" />
                <span>{selected.affectedAssets.length} affected assets</span>
              </div>
            </div>
            <button
              onClick={() => setSimulated(true)}
              disabled={simulated}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
                simulated
                  ? "cursor-default border border-primary/30 bg-primary/10 text-primary"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {simulated ? <RotateCcw className="size-3.5" /> : <Play className="size-3.5" />}
              {simulated ? "Simulated" : "Run simulation"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-3">
            <div className="rounded-lg border border-[#f0596b]/20 bg-[#f0596b]/5 p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#f0596b]">
                <ShieldAlert className="size-3.5" />
                Current Risk
              </div>
              <div className="mt-2 font-mono text-3xl font-semibold text-[#f0596b]">{selected.overallRisk}</div>
              <Progress value={selected.overallRisk} color="#f0596b" className="mt-2" />
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary">
                <TrendingDown className="size-3.5" />
                After Remediation
              </div>
              <div className="mt-2 font-mono text-3xl font-semibold text-primary">{selected.remediatedRisk}</div>
              <Progress value={selected.remediatedRisk} color="#2dd4bf" className="mt-2" />
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Server className="size-3.5" />
                Blast Radius
              </div>
              <div className="mt-2 font-mono text-3xl font-semibold text-foreground">{selected.blastRadius}</div>
              <p className="mt-1 text-[11px] text-muted-foreground">assets in scope</p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Attack Path Simulation"
            subtitle="Entry → Vulnerability → Lateral Movement → Critical Asset"
            icon={<Zap className="size-4" />}
          />
          <div className="p-5">
            <SimulationFlow sim={selected} />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader title="Blast Radius" subtitle="Affected assets by impact level" icon={<Server className="size-4" />} />
            <div className="p-5">
              <BlastRadiusViz sim={selected} />
              <div className="mt-4 space-y-1.5">
                {selected.affectedAssets.map((a, i) => {
                  const meta = assetStatusMeta[a.status]
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
                      <span className="size-2 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">{a.name}</span>
                      <span className="hidden text-xs text-muted-foreground sm:block">{a.type}</span>
                      <span className="shrink-0 text-xs" style={{ color: meta.color }}>{meta.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Exploited Weaknesses" subtitle="Findings chained into this attack" icon={<ShieldAlert className="size-4" />} />
            <div className="p-5">
              <div className="space-y-2">
                {selected.exploitedWeaknesses.map((w, i) => (
                  <div key={i} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{w.findingId}</span>
                      <SeverityBadge severity={w.severity} />
                    </div>
                    <p className="mt-1.5 text-sm text-foreground">{w.weakness}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-2.5">
                  <Info className="size-4 shrink-0 text-primary" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">Remediation Impact</div>
                    <p className="mt-1 text-sm text-foreground">{selected.remediation}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-4 py-3">
          <Info className="size-4 shrink-0 text-[#fbbf24]" />
          <p className="text-xs text-[#fbbf24]">
            <span className="font-semibold">Simulated attack.</span> This simulation uses deterministic local analysis of existing scanner findings to model potential attack paths. No real network connections are made and no live systems are tested.
          </p>
        </div>
      </div>
    </div>
  )
}
