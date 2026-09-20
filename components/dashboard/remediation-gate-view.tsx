"use client"

import { useState } from "react"
import { GitBranch, Check, X, ArrowRight, FileCheck, ShieldCheck, CircleAlert as AlertCircle, Download, RotateCcw } from "lucide-react"
import { Card, CardHeader, SeverityBadge, StatusBadge } from "./ui"
import { gateItems, type GateItem, type GateStage } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

const stageOrder: GateStage[] = ["proposed", "validated", "impact-checked", "approved", "applied", "verified"]

const stageLabels: Record<GateStage, string> = {
  proposed: "Proposed",
  validated: "Syntax Validated",
  "impact-checked": "Impact Checked",
  approved: "Approved",
  applied: "Applied",
  verified: "Verified",
}

const stageIcons: Record<GateStage, typeof Check> = {
  proposed: AlertCircle,
  validated: FileCheck,
  "impact-checked": ShieldCheck,
  approved: Check,
  applied: GitBranch,
  verified: Check,
}

function StageTracker({ currentStage }: { currentStage: GateStage }) {
  const currentIdx = stageOrder.indexOf(currentStage)
  return (
    <div className="flex items-center gap-1">
      {stageOrder.map((stage, i) => {
        const isDone = i <= currentIdx
        const isCurrent = i === currentIdx
        const Icon = stageIcons[stage]
        return (
          <div key={stage} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border transition",
                  isDone
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 text-muted-foreground",
                  isCurrent && "ring-2 ring-primary/30",
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <span className={cn("text-[9px] font-medium uppercase tracking-wider", isDone ? "text-primary" : "text-muted-foreground/60")}>
                {stageLabels[stage]}
              </span>
            </div>
            {i < stageOrder.length - 1 && (
              <div className={cn("mx-1 h-0.5 flex-1 rounded-full", i < currentIdx ? "bg-primary" : "bg-border")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function CodeBlock({ label, code, tone }: { label: string; code: string; tone: "before" | "after" | "rollback" }) {
  const colors = {
    before: "border-[#f0596b]/20 bg-[#f0596b]/5 text-[#f0596b]",
    after: "border-primary/20 bg-primary/5 text-primary",
    rollback: "border-[#fbbf24]/20 bg-[#fbbf24]/5 text-[#fbbf24]",
  }
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border/60 bg-[#05080f]">
      <div className={cn("border-b px-3 py-2 text-[11px] font-medium uppercase tracking-wider", colors[tone])}>
        {label}
      </div>
      <pre className="overflow-x-auto scrollbar-thin p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function RemediationGateView() {
  const [selectedId, setSelectedId] = useState(gateItems[0].id)
  const [items, setItems] = useState(gateItems)
  const selected = items.find((g) => g.id === selectedId)!

  function advanceStage(id: string) {
    setItems((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g
        const idx = stageOrder.indexOf(g.stage)
        if (idx >= stageOrder.length - 1) return g
        const next = stageOrder[idx + 1]
        const updates: Partial<GateItem> = { stage: next }
        if (next === "approved") {
          updates.approver = "a.sharma"
          updates.approvedAt = "Mar 19, 2026 · " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        }
        if (next === "verified") {
          updates.verified = true
          updates.verificationResult = "Re-scan completed. Finding remediated successfully."
        }
        return { ...g, ...updates }
      }),
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
      <div className="space-y-2">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <GitBranch className="size-3.5" />
          Remediation Queue
        </div>
        {items.map((g) => {
          const active = g.id === selectedId
          return (
            <button
              key={g.id}
              onClick={() => setSelectedId(g.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{g.findingId}</span>
                <SeverityBadge severity={g.severity} />
              </div>
              <p className="mt-2 text-sm font-medium leading-snug text-foreground">{g.title}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{g.device}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>{g.vendor}</span>
              </div>
              <div className="mt-2">
                <StatusBadge tone={g.stage === "verified" ? "teal" : g.stage === "approved" || g.stage === "applied" ? "info" : "warn"}>
                  {stageLabels[g.stage]}
                </StatusBadge>
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
              <span>{selected.device}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{selected.vendor}</span>
              <span className="size-1 rounded-full bg-border" />
              <span className="rounded border border-border/70 bg-secondary/40 px-1.5 py-0.5 font-mono text-[10px]">{selected.framework}</span>
            </div>
          </div>
          <button
            onClick={() => advanceStage(selected.id)}
            disabled={selected.stage === "verified"}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
              selected.stage === "verified"
                ? "cursor-default border border-primary/30 bg-primary/10 text-primary"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {selected.stage === "verified" ? <Check className="size-3.5" /> : <ArrowRight className="size-3.5" />}
            {selected.stage === "verified" ? "Completed" : `Advance to ${stageLabels[stageOrder[stageOrder.indexOf(selected.stage) + 1]]}`}
          </button>
        </div>

        <div className="py-5">
          <StageTracker currentStage={selected.stage} />
        </div>

        <div className="grid grid-cols-1 gap-3 border-b border-border/60 pb-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <FileCheck className="size-3.5" />
              Syntax Validation
            </div>
            <div className="mt-2 flex items-center gap-2">
              {selected.syntaxValid ? (
                <span className="inline-flex items-center gap-1 text-sm text-primary">
                  <Check className="size-4" /> Passed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-[#fbbf24]">
                  <AlertCircle className="size-4" /> Pending
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{selected.syntaxReport}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              Impact Assessment
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{selected.impactReport}</p>
            {selected.approver && (
              <div className="mt-2 border-t border-border/50 pt-2 text-xs">
                <span className="text-muted-foreground">Approved by </span>
                <span className="font-medium text-foreground">{selected.approver}</span>
                {selected.approvedAt && <span className="text-muted-foreground"> · {selected.approvedAt}</span>}
              </div>
            )}
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

        <div className="py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rollback Configuration</h3>
          <CodeBlock label="Rollback (revert)" code={selected.rollbackConfig} tone="rollback" />
        </div>

        {selected.verified && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <Check className="size-4 shrink-0 text-primary" />
            <p className="text-xs text-primary">
              <span className="font-semibold">Verification complete.</span> {selected.verificationResult}
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary">
            <Download className="size-3.5" />
            Export fix
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-secondary">
            <RotateCcw className="size-3.5" />
            View rollback
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
          <AlertCircle className="size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Safe mode.</span> In this prototype, remediation is exported as a corrected configuration file for manual deployment. No real device connections are made.
          </p>
        </div>
      </Card>
    </div>
  )
}
