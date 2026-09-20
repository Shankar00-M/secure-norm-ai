"use client"

import { useState } from "react"
import { ArrowRight, CircleCheck as CheckCircle2, FlaskConical, Info, Circle as XCircle, Zap } from "lucide-react"
import { Card, CardHeader, Progress, SeverityBadge, StatusBadge } from "./ui"
import { simulationScenarios, type SimulationScenario } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

function RiskGauge({ before, after }: { before: number; after: number }) {
  const diff = before - after
  return (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <div className="font-mono text-2xl font-semibold text-[#f0596b]">{before}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Before</div>
      </div>
      <ArrowRight className="size-5 text-muted-foreground" />
      <div className="text-center">
        <div className="font-mono text-2xl font-semibold text-primary">{after}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">After</div>
      </div>
      <div className="ml-auto rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-center">
        <div className="font-mono text-lg font-semibold text-primary">-{diff}</div>
        <div className="text-[10px] uppercase tracking-wider text-primary">Risk drop</div>
      </div>
    </div>
  )
}

function CodeBlock({ label, code, tone }: { label: string; code: string; tone: "before" | "after" }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border/60 bg-[#05080f]">
      <div
        className={cn(
          "border-b px-3 py-2 text-[11px] font-medium uppercase tracking-wider",
          tone === "before"
            ? "border-[#f0596b]/20 bg-[#f0596b]/5 text-[#f0596b]"
            : "border-primary/20 bg-primary/5 text-primary",
        )}
      >
        {label}
      </div>
      <pre className="overflow-x-auto scrollbar-thin p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function WhatIfSimulator() {
  const [selectedId, setSelectedId] = useState(simulationScenarios[0].id)
  const [run, setRun] = useState(false)
  const selected = simulationScenarios.find((s) => s.id === selectedId)!

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <FlaskConical className="size-3.5" />
          Scenarios
        </div>
        {simulationScenarios.map((s) => {
          const active = s.id === selectedId
          return (
            <button
              key={s.id}
              onClick={() => { setSelectedId(s.id); setRun(false) }}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{s.id}</span>
                <span className="rounded border border-border/70 bg-secondary/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {s.vendor}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{s.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{s.device}</p>
            </button>
          )
        })}
      </div>

      <Card className="flex flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
            <p className="mt-1 max-w-2xl text-xs text-muted-foreground">{selected.description}</p>
          </div>
          <button
            onClick={() => setRun(true)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
              run ? "border border-primary/30 bg-primary/10 text-primary" : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Zap className="size-3.5" />
            {run ? "Simulated" : "Run simulation"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 border-b border-border/60 py-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
            <div className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">Risk Score</div>
            <RiskGauge before={selected.beforeRisk} after={selected.afterRisk} />
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
            <div className="mb-3 text-[11px] uppercase tracking-wider text-muted-foreground">Compliance Impact</div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-mono text-2xl font-semibold text-[#fbbf24]">{selected.beforeCompliance}%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Before</div>
              </div>
              <ArrowRight className="size-5 text-muted-foreground" />
              <div className="text-center">
                <div className="font-mono text-2xl font-semibold text-primary">{selected.afterCompliance}%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">After</div>
              </div>
              <div className="ml-auto rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-center">
                <div className="font-mono text-lg font-semibold text-primary">+{selected.afterCompliance - selected.beforeCompliance}%</div>
                <div className="text-[10px] uppercase tracking-wider text-primary">Coverage</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-border/60 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Affected Rules</h3>
          <div className="space-y-2">
            {selected.affectedRules.map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground">{r.rule}</div>
                  <div className="text-[11px] text-muted-foreground">{r.framework}</div>
                </div>
                <div className="flex items-center gap-2">
                  {r.before === "Fail" ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#f0596b]/30 bg-[#f0596b]/10 px-2 py-0.5 text-[11px] text-[#f0596b]">
                      <XCircle className="size-3" /> Fail
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                      <CheckCircle2 className="size-3" /> Pass
                    </span>
                  )}
                  <ArrowRight className="size-3 text-muted-foreground" />
                  {r.after === "Pass" ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                      <CheckCircle2 className="size-3" /> Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#f0596b]/30 bg-[#f0596b]/10 px-2 py-0.5 text-[11px] text-[#f0596b]">
                      <XCircle className="size-3" /> Fail
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-border/60 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exposure Delta</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {selected.exposureDelta.map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 px-3 py-2">
                <span className="text-xs text-muted-foreground">{d.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#f0596b]">{d.before}</span>
                  <ArrowRight className="size-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-primary">{d.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configuration Diff</h3>
          <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
            <CodeBlock label="Before (vulnerable)" code={selected.beforeConfig} tone="before" />
            <ArrowRight className="mx-auto size-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />
            <CodeBlock label="After (remediated)" code={selected.afterConfig} tone="after" />
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-4 py-3">
          <Info className="size-4 shrink-0 text-[#fbbf24]" />
          <p className="text-xs text-[#fbbf24]">
            <span className="font-semibold">Simulated result.</span> These metrics are computed from deterministic local analysis of the proposed configuration change. No device connections are made and no real network state is modified.
          </p>
        </div>
      </Card>
    </div>
  )
}
