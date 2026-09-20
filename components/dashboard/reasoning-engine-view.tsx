"use client"

import { useState } from "react"
import {
  Brain,
  Link2,
  ShieldAlert,
  Lightbulb,
  CheckCheck,
  Crosshair,
  TrendingDown,
  ArrowRight,
  FileSearch,
  Network,
  Layers,
  Info,
} from "lucide-react"
import { Card, CardHeader, SeverityBadge, StatusBadge, Progress } from "./ui"
import {
  attackChains,
  reasoningModules,
  decisionSummary,
  type AttackChain,
} from "@/lib/master-data"
import { cn } from "@/lib/utils"

function ReasoningFlow({ chain }: { chain: AttackChain }) {
  const steps = [
    { label: "Finding", icon: FileSearch, color: "#38bdf8", content: `${chain.findings.length} correlated findings detected by scanner` },
    { label: "Relationship", icon: Link2, color: "#818cf8", content: chain.rootCause },
    { label: "Attack Impact", icon: Crosshair, color: "#f0596b", content: chain.attackImpact },
    { label: "Recommended Action", icon: Lightbulb, color: "#fbbf24", content: chain.recommendedAction },
    { label: "Verification", icon: CheckCheck, color: "#2dd4bf", content: chain.verification },
  ]
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const Icon = step.icon
        const isLast = i === steps.length - 1
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-full border-2"
                style={{ borderColor: `${step.color}50`, backgroundColor: `${step.color}15`, color: step.color }}
              >
                <Icon className="size-4" />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border" />}
            </div>
            <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-5")}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: step.color }}>
                {step.label}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground">{step.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ReasoningEngineView() {
  const [selectedId, setSelectedId] = useState(attackChains[0].id)
  const selected = attackChains.find((c) => c.id === selectedId)!

  return (
    <div className="space-y-4">
      {/* Executive Decision Summary */}
      <Card className="overflow-hidden">
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent p-5">
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Security Decision Summary</h2>
            <StatusBadge tone="teal">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              AI correlated
            </StatusBadge>
          </div>
          <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground">{decisionSummary.executiveSummary}</p>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border/50 lg:grid-cols-4">
          <div className="bg-card p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <ShieldAlert className="size-3.5" />
              Overall Posture
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-foreground">{decisionSummary.overallPosture}</div>
            <Progress value={decisionSummary.overallPosture} className="mt-2" />
          </div>
          <div className="bg-card p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <Crosshair className="size-3.5" />
              Critical Chains
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-[#f0596b]">{decisionSummary.criticalChains}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">require immediate action</p>
          </div>
          <div className="bg-card p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <FileSearch className="size-3.5" />
              Total Findings
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-foreground">{decisionSummary.totalFindings}</div>
            <p className="mt-1 text-[11px] text-muted-foreground">across 8 modules</p>
          </div>
          <div className="bg-card p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              <TrendingDown className="size-3.5" />
              Risk Reduction
            </div>
            <div className="mt-2 font-mono text-3xl font-semibold text-primary">55%</div>
            <p className="mt-1 text-[11px] text-muted-foreground">if top 4 fixed</p>
          </div>
        </div>

        <div className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Layers className="size-3.5" />
            Prioritized Remediation Order
          </h3>
          <div className="space-y-1.5">
            {decisionSummary.remediationOrder.map((item) => (
              <div key={item.priority} className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-xs font-semibold text-primary">
                  {item.priority}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{item.action}</div>
                  <div className="text-[11px] text-muted-foreground">{item.impact}</div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Module Correlation Map */}
      <Card>
        <CardHeader
          title="Module Correlation"
          subtitle="Findings linked across all SecureNorm analysis modules"
          icon={<Network className="size-4" />}
        />
        <div className="grid grid-cols-2 gap-px overflow-hidden bg-border/50 p-5 pt-0 sm:grid-cols-4">
          {reasoningModules.map((m) => {
            const tone = m.status === "correlated" ? "teal" : m.status === "analyzed" ? "info" : "warn"
          return (
              <div key={m.name} className="bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-medium text-foreground">{m.name}</span>
                  <StatusBadge tone={tone as any}>{m.status}</StatusBadge>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Link2 className="size-3" />
                  <span className="font-mono">{m.findingsLinked}</span>
                  <span>findings linked</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Attack Chains */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Crosshair className="size-3.5" />
            Correlated Attack Chains
          </div>
          {attackChains.map((c) => {
            const active = c.id === selectedId
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition",
                  active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                  <SeverityBadge severity={c.severity} />
                </div>
                <p className="mt-2 text-sm font-medium leading-snug text-foreground">{c.name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded border border-border/70 bg-secondary/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    P{c.remediationPriority}
                  </span>
                  <span className="text-[11px] text-primary">-{c.estimatedRiskReduction}% risk</span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground">{c.findings.length} findings</span>
                </div>
              </button>
            )
          })}
        </div>

        <Card className="flex flex-col p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
                <SeverityBadge severity={selected.severity} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{selected.id}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>Priority {selected.remediationPriority}</span>
                <span className="size-1 rounded-full bg-border" />
                <span className="text-primary">-{selected.estimatedRiskReduction}% risk reduction</span>
              </div>
            </div>
          </div>

          {/* Correlated Findings */}
          <div className="border-b border-border/60 py-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <FileSearch className="size-3.5" />
              Correlated Findings
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {selected.findings.map((f) => (
                <div key={f.findingId} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{f.findingId}</span>
                    <SeverityBadge severity={f.severity} />
                  </div>
                  <p className="mt-1.5 text-sm text-foreground">{f.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{f.device}</span>
                    <span className="size-1 rounded-full bg-border" />
                    <span>{f.vendor}</span>
                    <span className="size-1 rounded-full bg-border" />
                    <span>{f.framework}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reasoning Flow */}
          <div className="py-4">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Brain className="size-3.5" />
              Reasoning: Finding → Relationship → Impact → Action → Verification
            </h3>
            <ReasoningFlow chain={selected} />
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
            <Info className="size-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Correlation engine.</span> SecureNorm correlates findings across all analysis modules using deterministic relationship rules. Root causes are identified by tracing shared devices, zones, and trust paths. No external AI API is used.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
