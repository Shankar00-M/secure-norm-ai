"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Play, RefreshCw, Terminal } from "lucide-react"
import { Card, Progress } from "./ui"
import { cn } from "@/lib/utils"

const stages = [
  "Establishing SSH/API sessions to 156 devices",
  "Pulling running configurations",
  "Normalizing multi-vendor syntax (Cisco, Fortinet, Palo Alto, Juniper)",
  "Evaluating 833 control rules",
  "Correlating findings against CVE feed",
  "Scoring posture and generating remediation",
]

const logLines = [
  "[00:00] netguard-engine v4.2.1 starting",
  "[00:01] auth: 156 targets · 142 reachable · 14 timeout",
  "[00:02] fetch: core-sw-01 running-config (48.2 KB)",
  "[00:03] parse: FortiOS 7.4 policy tree normalized",
  "[00:04] rule CIS-2.1.3 FAIL core-sw-01 (SNMP community)",
  "[00:05] rule NIST-AC-17 FAIL core-sw-01 (Telnet)",
  "[00:06] ml-model: anomaly score 0.82 on edge-fw-03",
  "[00:07] cve: matched CVE-2024-20353 on IOS-XE 17.9",
  "[00:08] scoring: fleet posture 78/100 (+4.2)",
  "[00:08] done: 327 findings · 18 critical",
]

export function ScanRunner() {
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle")
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== "running") return
    let p = 0
    const timer = setInterval(() => {
      p += Math.random() * 7 + 3
      setProgress(Math.min(100, p))
      setStage(Math.min(stages.length - 1, Math.floor((p / 100) * stages.length)))
      setLogs((prev) => {
        const next = logLines.slice(0, Math.min(logLines.length, Math.ceil((p / 100) * logLines.length)))
        return next
      })
      if (p >= 100) {
        clearInterval(timer)
        setStatus("done")
      }
    }, 420)
    return () => clearInterval(timer)
  }, [status])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [logs])

  function start() {
    setStatus("running")
    setProgress(0)
    setStage(0)
    setLogs([])
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-border/70 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-primary">
                <RefreshCw className={cn("size-4", status === "running" && "animate-spin")} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Configuration Scan Engine</h3>
                <p className="text-xs text-muted-foreground">
                  {status === "idle" && "Ready · 156 devices in scope"}
                  {status === "running" && `Scanning · ${Math.round(progress)}% complete`}
                  {status === "done" && "Completed · 327 findings detected"}
                </p>
              </div>
            </div>
            <button
              onClick={start}
              disabled={status === "running"}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
                status === "running"
                  ? "cursor-not-allowed bg-secondary/60 text-muted-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {status === "done" ? <RefreshCw className="size-3.5" /> : <Play className="size-3.5" />}
              {status === "done" ? "Re-scan" : status === "running" ? "Running…" : "Start scan"}
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Progress</span>
              <span className="font-mono">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="mt-5 space-y-2.5">
            {stages.map((s, i) => {
              const state =
                status === "done" || i < stage ? "done" : i === stage && status === "running" ? "active" : "pending"
              return (
                <div key={s} className="flex items-center gap-2.5 text-xs">
                  {state === "done" ? (
                    <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  ) : state === "active" ? (
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      <span className="size-2 animate-ping rounded-full bg-primary" />
                    </span>
                  ) : (
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      <span className="size-1.5 rounded-full bg-border" />
                    </span>
                  )}
                  <span className={cn(state === "pending" ? "text-muted-foreground/60" : "text-foreground")}>{s}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-[#05080f] p-5">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            <Terminal className="size-3.5" />
            Live engine output
          </div>
          <div
            ref={logRef}
            className="h-[268px] overflow-y-auto scrollbar-thin rounded-lg border border-border/60 bg-black/40 p-3 font-mono text-[11px] leading-relaxed"
          >
            {logs.length === 0 ? (
              <span className="text-muted-foreground/60">$ awaiting scan trigger…</span>
            ) : (
              logs.map((l, i) => (
                <div key={i} className="text-muted-foreground">
                  <span className="text-primary/80">›</span>{" "}
                  <span className={cn(l.includes("FAIL") && "text-[#f0596b]", l.includes("done") && "text-primary")}>
                    {l}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
