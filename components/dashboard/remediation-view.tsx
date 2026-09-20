"use client"

import { useState } from "react"
import { Check, Copy, Sparkles, Wrench, ArrowRight, ShieldCheck } from "lucide-react"
import { Card, SeverityBadge } from "./ui"
import { remediationItems } from "@/lib/data"
import { cn } from "@/lib/utils"

function CodeBlock({
  label,
  code,
  tone,
}: {
  label: string
  code: string
  tone: "before" | "after"
}) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border/60 bg-[#05080f]">
      <div
        className={cn(
          "flex items-center justify-between border-b px-3 py-2 text-[11px] font-medium uppercase tracking-wider",
          tone === "before"
            ? "border-[#f0596b]/20 bg-[#f0596b]/5 text-[#f0596b]"
            : "border-primary/20 bg-primary/5 text-primary",
        )}
      >
        <span>{label}</span>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto scrollbar-thin p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function RemediationView() {
  const [selectedId, setSelectedId] = useState(remediationItems[0].id)
  const [applied, setApplied] = useState<string[]>([])
  const selected = remediationItems.find((r) => r.id === selectedId)!
  const isApplied = applied.includes(selected.id)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      <div className="space-y-2">
        {remediationItems.map((item) => {
          const active = item.id === selectedId
          return (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition",
                active
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{item.id}</span>
                <SeverityBadge severity={item.severity} />
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">{item.issue}</p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{item.device}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>{item.vendor}</span>
              </div>
              {applied.includes(item.id) ? (
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary">
                  <Check className="size-3" /> Fix applied
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <Card className="flex flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">{selected.issue}</h2>
              <SeverityBadge severity={selected.severity} />
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{selected.id}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{selected.device}</span>
              <span className="size-1 rounded-full bg-border" />
              <span>{selected.vendor}</span>
              <span className="size-1 rounded-full bg-border" />
              <span className="rounded border border-border/70 bg-secondary/40 px-1.5 py-0.5 font-mono text-[10px]">
                {selected.framework}
              </span>
            </div>
          </div>
          <button
            onClick={() => setApplied((prev) => (prev.includes(selected.id) ? prev : [...prev, selected.id]))}
            disabled={isApplied}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
              isApplied
                ? "cursor-default border border-primary/30 bg-primary/10 text-primary"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {isApplied ? <Check className="size-3.5" /> : <Wrench className="size-3.5" />}
            {isApplied ? "Fix applied" : "Apply fix"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 border-b border-border/60 py-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Sparkles className="size-4 text-primary" />
            <div>
              <div className="font-mono text-lg font-semibold text-foreground">{selected.confidence}%</div>
              <div className="text-[11px] text-muted-foreground">AI confidence</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3">
            <ShieldCheck className="size-4 text-[#38bdf8]" />
            <div>
              <div className="text-sm font-semibold text-foreground">Auto-generated</div>
              <div className="text-[11px] text-muted-foreground">Vendor-native syntax</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3">
            <Wrench className="size-4 text-[#fbbf24]" />
            <div>
              <div className="text-sm font-semibold text-foreground">{selected.steps.length} steps</div>
              <div className="text-[11px] text-muted-foreground">In remediation plan</div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Impact</p>
          <p className="mt-1.5 text-sm text-foreground">{selected.impact}</p>
        </div>

        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          <CodeBlock label="Current (vulnerable)" code={selected.before} tone="before" />
          <ArrowRight className="mx-auto size-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />
          <CodeBlock label="Remediated" code={selected.after} tone="after" />
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Remediation plan</p>
          <ol className="mt-3 space-y-2">
            {selected.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-[10px] text-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </div>
  )
}
