"use client"

import { useState } from "react"
import {
  GitBranch,
  Check,
  X,
  ArrowRight,
  FileCheck,
  ShieldCheck,
  CircleAlert as AlertCircle,
  Download,
  RotateCcw,
  Ban,
  Play,
  Search,
} from "lucide-react"
import { Card, CardHeader, SeverityBadge, StatusBadge } from "./ui"
import { gateItems, type GateItem, type GateStage } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

const forwardStages: GateStage[] = [
  "proposed",
  "validated",
  "impact-checked",
  "approved",
  "applied",
  "verified",
]

const stageLabels: Record<GateStage, string> = {
  proposed: "Proposed",
  validated: "Syntax Validated",
  "impact-checked": "Impact Checked",
  approved: "Approved",
  applied: "Applied",
  verified: "Verified",
  rejected: "Rejected",
  cancelled: "Cancelled",
}

const stageIcons: Record<GateStage, typeof Check> = {
  proposed: AlertCircle,
  validated: FileCheck,
  "impact-checked": ShieldCheck,
  approved: Check,
  applied: GitBranch,
  verified: Check,
  rejected: X,
  cancelled: Ban,
}

function isTerminal(stage: GateStage) {
  return stage === "rejected" || stage === "cancelled"
}

function stageTone(stage: GateStage): "teal" | "info" | "warn" | "danger" | "muted" {
  if (stage === "verified") return "teal"
  if (stage === "applied") return "info"
  if (stage === "approved") return "info"
  if (stage === "rejected") return "danger"
  if (stage === "cancelled") return "muted"
  return "warn"
}

function StageTracker({ currentStage }: { currentStage: GateStage }) {
  const currentIdx = forwardStages.indexOf(currentStage)
  const terminal = isTerminal(currentStage)
  const stopIdx = terminal ? currentIdx : forwardStages.length - 1

  return (
    <div className="flex items-center gap-1">
      {forwardStages.map((stage, i) => {
        const isDone = terminal ? i < currentIdx : i <= currentIdx
        const isCurrent = i === currentIdx
        const Icon = stageIcons[stage]
        const isBlocked = terminal && i > currentIdx
        return (
          <div key={stage} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border transition",
                  isBlocked
                    ? "border-border/40 bg-secondary/20 text-muted-foreground/30"
                    : isDone
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground",
                  isCurrent && !terminal && "ring-2 ring-primary/30",
                  isCurrent && terminal && "ring-2 ring-[#f0596b]/30",
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <span
                className={cn(
                  "text-[9px] font-medium uppercase tracking-wider",
                  isBlocked
                    ? "text-muted-foreground/30"
                    : isDone
                      ? "text-primary"
                      : "text-muted-foreground/60",
                )}
              >
                {stageLabels[stage]}
              </span>
            </div>
            {i < forwardStages.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1 rounded-full",
                  isBlocked
                    ? "bg-border/30"
                    : i < (terminal ? currentIdx : currentIdx)
                      ? "bg-primary"
                      : "bg-border",
                )}
              />
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

function ReasonInput({
  label,
  placeholder,
  onConfirm,
  onCancel,
  confirmLabel,
  confirmTone,
}: {
  label: string
  placeholder: string
  onConfirm: (reason: string) => void
  onCancel: () => void
  confirmLabel: string
  confirmTone: "danger" | "muted"
}) {
  const [reason, setReason] = useState("")
  return (
    <div className="mt-4 rounded-lg border border-border/60 bg-secondary/30 p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-lg border border-border/80 bg-secondary/40 p-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => onConfirm(reason.trim() || "No reason provided")}
          disabled={!reason.trim()}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
            confirmTone === "danger"
              ? "bg-[#f0596b] text-white hover:bg-[#f0596b]/90"
              : "bg-secondary text-foreground hover:bg-secondary/80",
          )}
        >
          {confirmTone === "danger" ? <X className="size-3.5" /> : <Ban className="size-3.5" />}
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export function RemediationGateView() {
  const [selectedId, setSelectedId] = useState(gateItems[0].id)
  const [items, setItems] = useState(gateItems)
  const [showReject, setShowReject] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const selected = items.find((g) => g.id === selectedId)!

  function nowStamp() {
    return "Sep 21, 2026 · " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  function updateItem(id: string, updates: Partial<GateItem>) {
    setItems((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)))
  }

  function advance(id: string) {
    const item = items.find((g) => g.id === id)
    if (!item || isTerminal(item.stage)) return
    const idx = forwardStages.indexOf(item.stage)
    if (idx >= forwardStages.length - 1) return
    const next = forwardStages[idx + 1]
    const updates: Partial<GateItem> = { stage: next }
    if (next === "approved") {
      updates.approver = "a.sharma"
      updates.approvedAt = nowStamp()
    }
    if (next === "applied") {
      updates.verificationResult = "Applied — awaiting verification re-scan."
    }
    if (next === "verified") {
      updates.verified = true
      updates.verificationResult = "Re-scan completed. Finding remediated successfully. Control now PASS."
    }
    updateItem(id, updates)
  }

  function approve(id: string) {
    updateItem(id, {
      stage: "approved",
      approver: "a.sharma",
      approvedAt: nowStamp(),
    })
  }

  function reject(id: string, reason: string) {
    updateItem(id, {
      stage: "rejected",
      rejectedBy: "a.sharma",
      rejectedAt: nowStamp(),
      rejectionReason: reason,
      approver: null,
      approvedAt: null,
      verified: false,
    })
    setShowReject(false)
  }

  function cancel(id: string, reason: string) {
    updateItem(id, {
      stage: "cancelled",
      cancelledBy: "a.sharma",
      cancelledAt: nowStamp(),
      cancellationReason: reason,
      approver: null,
      approvedAt: null,
      verified: false,
    })
    setShowCancel(false)
  }

  function apply(id: string) {
    updateItem(id, { stage: "applied", verificationResult: "Applied — awaiting verification re-scan." })
  }

  function verify(id: string) {
    updateItem(id, {
      stage: "verified",
      verified: true,
      verificationResult: "Re-scan completed. Finding remediated successfully. Control now PASS.",
    })
  }

  const terminal = isTerminal(selected.stage)
  const currentIdx = forwardStages.indexOf(selected.stage)

  // Determine which action buttons to show
  function renderActions() {
    if (terminal) return null

    if (showReject) {
      return (
        <ReasonInput
          label="Rejection reason"
          placeholder="Explain why this remediation is being rejected…"
          onConfirm={(r) => reject(selected.id, r)}
          onCancel={() => setShowReject(false)}
          confirmLabel="Confirm reject"
          confirmTone="danger"
        />
      )
    }

    if (showCancel) {
      return (
        <ReasonInput
          label="Cancellation reason"
          placeholder="Explain why this remediation is being cancelled…"
          onConfirm={(r) => cancel(selected.id, r)}
          onCancel={() => setShowCancel(false)}
          confirmLabel="Confirm cancel"
          confirmTone="muted"
        />
      )
    }

    const buttons: React.ReactNode[] = []

    if (selected.stage === "proposed") {
      buttons.push(
        <button key="validate" onClick={() => advance(selected.id)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
          <FileCheck className="size-3.5" /> Validate syntax
        </button>,
      )
    }

    if (selected.stage === "validated") {
      buttons.push(
        <button key="impact" onClick={() => advance(selected.id)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
          <ShieldCheck className="size-3.5" /> Check impact
        </button>,
      )
    }

    if (selected.stage === "impact-checked") {
      buttons.push(
        <button key="approve" onClick={() => approve(selected.id)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
          <Check className="size-3.5" /> Approve
        </button>,
        <button key="reject" onClick={() => setShowReject(true)} className="inline-flex items-center gap-2 rounded-lg border border-[#f0596b]/40 bg-[#f0596b]/10 px-3 py-2 text-xs font-semibold text-[#f0596b] transition hover:bg-[#f0596b]/20">
          <X className="size-3.5" /> Reject
        </button>,
      )
    }

    if (selected.stage === "approved") {
      buttons.push(
        <button key="apply" onClick={() => apply(selected.id)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
          <Play className="size-3.5" /> Apply fix
        </button>,
      )
    }

    if (selected.stage === "applied") {
      buttons.push(
        <button key="verify" onClick={() => verify(selected.id)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
          <Check className="size-3.5" /> Run verification
        </button>,
      )
    }

    // Cancel is available at any non-terminal stage except verified
    if (selected.stage !== "verified") {
      buttons.push(
        <button key="cancel" onClick={() => setShowCancel(true)} className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground">
          <Ban className="size-3.5" /> Cancel
        </button>,
      )
    }

    return <div className="flex flex-wrap items-center gap-2">{buttons}</div>
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
              onClick={() => {
                setSelectedId(g.id)
                setShowReject(false)
                setShowCancel(false)
              }}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active
                  ? isTerminal(g.stage)
                    ? "border-[#f0596b]/40 bg-[#f0596b]/5"
                    : "border-primary/40 bg-primary/5"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
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
                <StatusBadge tone={stageTone(g.stage)}>{stageLabels[g.stage]}</StatusBadge>
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
          <StatusBadge tone={stageTone(selected.stage)}>
            {stageLabels[selected.stage]}
          </StatusBadge>
        </div>

        {/* Stage tracker */}
        <div className="py-5">
          {terminal ? (
            <div className="space-y-3">
              <StageTracker currentStage={selected.stage} />
              <div
                className={cn(
                  "flex items-start gap-2.5 rounded-lg border p-4",
                  selected.stage === "rejected"
                    ? "border-[#f0596b]/30 bg-[#f0596b]/10"
                    : "border-border/60 bg-secondary/30",
                )}
              >
                {selected.stage === "rejected" ? (
                  <X className="size-4 shrink-0 text-[#f0596b]" />
                ) : (
                  <Ban className="size-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className={cn("text-xs font-semibold uppercase tracking-wider", selected.stage === "rejected" ? "text-[#f0596b]" : "text-muted-foreground")}>
                    {selected.stage === "rejected" ? "Remediation Rejected" : "Remediation Cancelled"}
                  </div>
                  {selected.stage === "rejected" && (
                    <>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span>Rejected by <span className="font-medium text-foreground">{selected.rejectedBy}</span></span>
                        <span className="size-1 rounded-full bg-border" />
                        <span>{selected.rejectedAt}</span>
                      </div>
                      <div className="text-xs text-foreground">
                        <span className="text-muted-foreground">Reason: </span>{selected.rejectionReason}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Applied: <span className="font-medium text-[#f0596b]">No</span>
                      </div>
                    </>
                  )}
                  {selected.stage === "cancelled" && (
                    <>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span>Cancelled by <span className="font-medium text-foreground">{selected.cancelledBy}</span></span>
                        <span className="size-1 rounded-full bg-border" />
                        <span>{selected.cancelledAt}</span>
                      </div>
                      <div className="text-xs text-foreground">
                        <span className="text-muted-foreground">Reason: </span>{selected.cancellationReason}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Applied: <span className="font-medium text-muted-foreground">No</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <StageTracker currentStage={selected.stage} />
          )}
        </div>

        {/* Syntax + Impact panels */}
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

        {/* Config diff */}
        <div className="py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configuration Diff</h3>
          <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
            <CodeBlock label="Before (vulnerable)" code={selected.beforeConfig} tone="before" />
            <ArrowRight className="mx-auto size-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />
            <CodeBlock label="After (remediated)" code={selected.afterConfig} tone="after" />
          </div>
        </div>

        {/* Rollback */}
        <div className="py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rollback Configuration</h3>
          <CodeBlock label="Rollback (revert)" code={selected.rollbackConfig} tone="rollback" />
        </div>

        {/* Verification result */}
        {selected.stage === "verified" && selected.verified && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <Check className="size-4 shrink-0 text-primary" />
            <p className="text-xs text-primary">
              <span className="font-semibold">Verification complete.</span> {selected.verificationResult}
            </p>
          </div>
        )}

        {selected.stage === "applied" && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#38bdf8]/20 bg-[#38bdf8]/5 px-4 py-3">
            <AlertCircle className="size-4 shrink-0 text-[#38bdf8]" />
            <p className="text-xs text-[#38bdf8]">
              <span className="font-semibold">Applied — pending verification.</span> {selected.verificationResult}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4">
          {renderActions()}
        </div>

        {/* Export / rollback buttons */}
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

        {/* Safe mode notice */}
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
