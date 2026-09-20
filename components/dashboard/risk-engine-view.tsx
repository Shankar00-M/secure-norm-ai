"use client"

import { useState } from "react"
import { Spline, Brain, ShieldCheck, TriangleAlert as AlertTriangle, Lightbulb, FileSearch, Target, TrendingUp } from "lucide-react"
import { Card, CardHeader, Progress, SeverityBadge } from "./ui"
import { riskExplanations, type RiskExplanation } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

function FactorBar({ name, weight, contribution }: { name: string; weight: number; contribution: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground">{name}</span>
        <span className="font-mono text-muted-foreground">{weight}%</span>
      </div>
      <Progress value={weight} className="mt-1.5" />
      <p className="mt-1 text-[11px] text-muted-foreground">{contribution}</p>
    </div>
  )
}

function Section({ icon, title, children, tone = "default" }: { icon: React.ReactNode; title: string; children: React.ReactNode; tone?: "default" | "danger" | "primary" }) {
  const colors = {
    default: "border-border/60 bg-secondary/30",
    danger: "border-[#f0596b]/20 bg-[#f0596b]/5",
    primary: "border-primary/20 bg-primary/5",
  }
  return (
    <div className={cn("rounded-lg border p-4", colors[tone])}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}

export function RiskEngineView() {
  const [selectedId, setSelectedId] = useState(riskExplanations[0].findingId)
  const selected = riskExplanations.find((r) => r.findingId === selectedId)!

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Brain className="size-3.5" />
          Explained Findings
        </div>
        {riskExplanations.map((r) => {
          const active = r.findingId === selectedId
          return (
            <button
              key={r.findingId}
              onClick={() => setSelectedId(r.findingId)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{r.findingId}</span>
                <SeverityBadge severity={r.severity} />
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-foreground">{r.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${r.riskScore}%`, backgroundColor: r.riskScore > 80 ? "#f0596b" : r.riskScore > 60 ? "#fb923c" : "#fbbf24" }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold text-foreground">{r.riskScore}</span>
              </div>
            </button>
          )
        })}
      </div>

      <Card className="flex flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">{selected.title}</h2>
              <SeverityBadge severity={selected.severity} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{selected.findingId}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>Risk score {selected.riskScore}/100</span>
              <span className="size-1 rounded-full bg-border" />
              <span className="flex items-center gap-1"><Spline className="size-3" /> {selected.confidence}% confidence</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
            <div className="text-center">
              <div className="font-mono text-2xl font-semibold text-primary">{selected.riskScore}</div>
              <div className="text-[10px] uppercase tracking-wider text-primary">Risk</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
          <Section icon={<FileSearch className="size-3.5" />} title="What was detected">
            <p className="text-sm text-foreground">{selected.detected}</p>
          </Section>
          <Section icon={<AlertTriangle className="size-3.5 text-[#f0596b]" />} title="Why it matters" tone="danger">
            <p className="text-sm text-foreground">{selected.whyItMatters}</p>
          </Section>
        </div>

        <div className="border-t border-border/60 py-4">
          <Section icon={<Target className="size-3.5 text-[#fb923c]" />} title="Potential security impact">
            <p className="text-sm text-foreground">{selected.potentialImpact}</p>
          </Section>
        </div>

        <div className="border-t border-border/60 py-4">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="size-3.5" />
            Risk Factor Breakdown
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {selected.factors.map((f, i) => (
              <FactorBar key={i} {...f} />
            ))}
          </div>
        </div>

        <div className="border-t border-border/60 py-4">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileSearch className="size-3.5" />
            Evidence
          </h3>
          <div className="space-y-1.5">
            {selected.evidence.map((e, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg border border-border/60 bg-[#05080f] px-3 py-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <code className="font-mono text-[11px] leading-relaxed text-muted-foreground">{e}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-border/60 py-4 sm:grid-cols-2">
          <Section icon={<Lightbulb className="size-3.5 text-primary" />} title="Recommended action" tone="primary">
            <p className="text-sm text-foreground">{selected.recommendedAction}</p>
          </Section>
          <Section icon={<ShieldCheck className="size-3.5 text-[#38bdf8]" />} title="Related compliance control">
            <p className="text-sm text-foreground">{selected.complianceControl}</p>
          </Section>
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
          <Brain className="size-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Explainable AI.</span> These explanations are generated by deterministic local analysis rules — no external AI API is used. Each risk factor contributes a weighted portion of the total risk score.
          </p>
        </div>
      </Card>
    </div>
  )
}
