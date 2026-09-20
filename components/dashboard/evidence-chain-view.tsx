"use client"

import { useState } from "react"
import { ShieldCheck, Check, Clock, ArrowRight, FileSearch, GitBranch, Target, Wrench, CheckCheck } from "lucide-react"
import { Card, CardHeader, SeverityBadge, StatusBadge } from "./ui"
import { evidenceChains, type EvidenceChain, type EvidenceStep } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

const stepIcons: Record<EvidenceStep["status"], typeof Check> = {
  collected: FileSearch,
  normalized: GitBranch,
  detected: Target,
  mapped: ShieldCheck,
  remediated: Wrench,
  verified: CheckCheck,
}

const stepColors: Record<EvidenceStep["status"], string> = {
  collected: "#38bdf8",
  normalized: "#818cf8",
  detected: "#f0596b",
  mapped: "#fbbf24",
  remediated: "#fb923c",
  verified: "#2dd4bf",
}

function chainTone(status: EvidenceChain["status"]) {
  if (status === "Verified") return "teal"
  if (status === "Remediated") return "info"
  if (status === "In Progress") return "warn"
  return "danger"
}

export function EvidenceChainView() {
  const [selectedId, setSelectedId] = useState(evidenceChains[0].id)
  const [expandedStep, setExpandedStep] = useState<number | null>(0)
  const selected = evidenceChains.find((e) => e.id === selectedId)!

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Evidence Chains
        </div>
        {evidenceChains.map((e) => {
          const active = e.id === selectedId
          return (
            <button
              key={e.id}
              onClick={() => { setSelectedId(e.id); setExpandedStep(0) }}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{e.id}</span>
                <StatusBadge tone={chainTone(e.status)}>{e.status}</StatusBadge>
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-foreground">{e.control}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <SeverityBadge severity={e.severity} />
                <span>{e.device}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>{e.vendor}</span>
              </div>
            </button>
          )
        })}
      </div>

      <Card className="flex flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">{selected.control}</h2>
              <SeverityBadge severity={selected.severity} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{selected.id}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{selected.framework}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>Finding {selected.findingId}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{selected.device}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{selected.vendor}</span>
            </div>
          </div>
          <StatusBadge tone={chainTone(selected.status)}>
            {selected.status}
          </StatusBadge>
        </div>

        <div className="py-4">
          <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <GitBranch className="size-3.5" />
            Evidence Trail
          </h3>
          <div className="space-y-0">
            {selected.steps.map((step, i) => {
              const Icon = stepIcons[step.status]
              const color = stepColors[step.status]
              const isExpanded = expandedStep === i
              const isLast = i === selected.steps.length - 1
              return (
                <div key={step.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : i)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition hover:scale-110"
                      style={{ borderColor: `${color}50`, backgroundColor: `${color}15`, color }}
                    >
                      <Icon className="size-4" />
                    </button>
                    {!isLast && <div className="w-0.5 flex-1 bg-border" />}
                  </div>
                  <div className={cn("min-w-0 flex-1 pb-4", isLast && "pb-0")}>
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : i)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            <span className="font-mono text-[11px] text-muted-foreground">Step {step.step}.</span> {step.label}
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{step.detail}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="size-3" />
                            {step.timestamp}
                          </span>
                        </div>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="mt-2 overflow-x-auto scrollbar-thin rounded-lg border border-border/60 bg-[#05080f] p-3">
                        <pre className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                          <code>{step.data}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-2 border-t border-border/60 pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Framework</div>
              <div className="mt-1 text-sm font-medium text-foreground">{selected.framework}</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Control</div>
              <div className="mt-1 text-sm font-medium text-foreground">{selected.control}</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Chain Status</div>
              <div className="mt-1">
                <StatusBadge tone={chainTone(selected.status)}>{selected.status}</StatusBadge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <p className="text-xs text-primary">
            <span className="font-semibold">Auditor-ready.</span> Each step is timestamped and tamper-evident. This chain provides a complete evidence trail from raw configuration to verified remediation, suitable for compliance audits.
          </p>
        </div>
      </Card>
    </div>
  )
}
