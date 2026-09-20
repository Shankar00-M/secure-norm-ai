"use client"

import { useState } from "react"
import { Workflow, ArrowRight, Check, Info, Sparkles, Send, Copy } from "lucide-react"
import { Card, CardHeader, StatusBadge } from "./ui"
import { compiledPolicies, intentExamples, type CompiledPolicy, type VendorPolicy } from "@/lib/master-data"
import { cn } from "@/lib/utils"

const vendorColors: Record<string, string> = {
  Cisco: "#1ba0d7",
  Fortinet: "#ee3124",
  "Palo Alto": "#fa582d",
  Juniper: "#84bd00",
}

function NormalizedPolicyView({ policy }: { policy: CompiledPolicy["normalized"] }) {
  return (
    <div className="rounded-lg border border-border/60 bg-[#05080f] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-primary">Normalized Security Policy</span>
        <span className="rounded border border-border/70 bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          Priority {policy.priority}
        </span>
      </div>
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted-foreground">action</span>
          <span className={cn("font-semibold", policy.action === "permit" ? "text-primary" : "text-[#f0596b]")}>
            {policy.action.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted-foreground">source</span>
          <span className="text-foreground">{policy.source}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted-foreground">destination</span>
          <span className="text-foreground">{policy.destination}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted-foreground">service</span>
          <span className="text-foreground">{policy.service}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted-foreground">port</span>
          <span className="text-foreground">{policy.port}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted-foreground">protocol</span>
          <span className="text-foreground">{policy.protocol}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-24 shrink-0 text-muted-foreground">zones</span>
          <span className="text-foreground">{policy.zones.from} → {policy.zones.to}</span>
        </div>
      </div>
      <div className="mt-3 border-t border-border/50 pt-3">
        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Conditions</div>
        <div className="space-y-1">
          {policy.conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="text-foreground">{c.field}</span>
              <span className="text-primary">{c.operator}</span>
              <span className="text-foreground">{c.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VendorConfigCard({ vp }: { vp: VendorPolicy }) {
  const [copied, setCopied] = useState(false)
  const color = vendorColors[vp.vendor] || "#2dd4bf"
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-[#05080f]">
      <div
        className="flex items-center justify-between border-b px-3 py-2"
        style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
      >
        <div className="flex items-center gap-2">
          <span className="rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold" style={{ borderColor: `${color}50`, color }}>
            {vp.vendor}
          </span>
          <span className="text-[11px] text-muted-foreground">{vp.osLabel}</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(vp.config)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto scrollbar-thin p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        <code>{vp.config}</code>
      </pre>
      <div className="border-t border-border/50 px-3 py-2">
        <p className="text-[11px] leading-relaxed text-muted-foreground">{vp.explanation}</p>
      </div>
    </div>
  )
}

export function PolicyCompilerView() {
  const [intent, setIntent] = useState(compiledPolicies[0].intent)
  const [compiled, setCompiled] = useState<CompiledPolicy | null>(compiledPolicies[0])
  const [compiling, setCompiling] = useState(false)

  function compile() {
    setCompiling(true)
    setTimeout(() => {
      const match = compiledPolicies.find((p) => p.intent === intent)
      setCompiled(match || compiledPolicies[0])
      setCompiling(false)
    }, 600)
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Workflow className="size-4 text-primary" />
          Security Intent Input
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter a natural-language security intent. SecureNorm will compile it into a normalized policy and generate vendor-specific configurations.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-border/80 bg-secondary/40 p-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              placeholder="e.g. Only HR servers can access the payroll database over HTTPS."
            />
          </div>
          <button
            onClick={compile}
            disabled={compiling}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition",
              compiling
                ? "cursor-wait border border-primary/30 bg-primary/10 text-primary"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {compiling ? <Sparkles className="size-3.5 animate-pulse" /> : <Send className="size-3.5" />}
            {compiling ? "Compiling…" : "Compile policy"}
          </button>
        </div>
        <div className="mt-3">
          <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Example intents</div>
          <div className="flex flex-wrap gap-1.5">
            {intentExamples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setIntent(ex)}
                className="rounded-lg border border-border/70 bg-secondary/30 px-2.5 py-1.5 text-left text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {ex.length > 50 ? ex.slice(0, 50) + "…" : ex}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {compiled && (
        <>
          <div className="flex items-center gap-3 px-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{compiled.id}</span>
                <span className="size-1 rounded-full bg-border" />
                <span>Intent compiled</span>
              </div>
              <p className="mt-0.5 text-sm font-medium text-foreground">{compiled.intent}</p>
            </div>
            <StatusBadge tone="teal">
              <Check className="size-3" />
              Compiled
            </StatusBadge>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
            <div className="space-y-4">
              <Card>
                <CardHeader title="Normalized Policy" subtitle="Vendor-agnostic intermediate representation" />
                <div className="p-5">
                  <NormalizedPolicyView policy={compiled.normalized} />
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-start gap-2.5">
                  <Info className="size-4 shrink-0 text-[#38bdf8]" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#38bdf8]">Validation Notes</div>
                    <p className="mt-1 text-xs text-foreground">{compiled.validationNotes}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ArrowRight className="size-4 text-primary" />
                Vendor-Specific Configurations
              </div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {compiled.vendorPolicies.map((vp, i) => (
                  <VendorConfigCard key={i} vp={vp} />
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-4 py-3">
                <Info className="size-4 shrink-0 text-[#fbbf24]" />
                <p className="text-xs text-[#fbbf24]">
                  <span className="font-semibold">Simulated output.</span> Generated configurations are demo compilations based on pattern matching of the security intent. They must be reviewed by a network engineer before deployment to any device.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
