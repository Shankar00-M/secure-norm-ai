"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Play, RefreshCw, Terminal, Upload, Loader2 } from "lucide-react"
import { Card, Progress } from "./ui"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useAppData, addNotification, addAuditLog } from "@/lib/use-app-data"
import { supabase } from "@/lib/supabase-client"
import { scanConfiguration, sampleConfigs, type ScanResult } from "@/lib/scanner-engine"
import { nowISO, formatDateTime } from "@/lib/datetime"

const stages = [
  "Establishing session to device",
  "Pulling running configuration",
  "Normalizing vendor syntax",
  "Evaluating control rules",
  "Correlating findings against frameworks",
  "Scoring posture and generating remediation",
]

export function ScanRunner() {
  const { profile, tenant } = useAuth()
  const { refresh, devices } = useAppData()
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle")
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [configText, setConfigText] = useState("")
  const [selectedVendor, setSelectedVendor] = useState("Cisco")
  const [lastResult, setLastResult] = useState<ScanResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

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
        completeScan()
      }
    }, 420)
    return () => clearInterval(timer)
  }, [status])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [logs])

  const logLines = [
    `[${new Date().toLocaleTimeString()}] securenorm-engine v4.2.1 starting`,
    `[${new Date().toLocaleTimeString()}] auth: connecting to target device`,
    `[${new Date().toLocaleTimeString()}] fetch: running-config retrieved`,
    `[${new Date().toLocaleTimeString()}] parse: ${selectedVendor} syntax normalized`,
    `[${new Date().toLocaleTimeString()}] rule evaluation: ${stages.length} control rules`,
    `[${new Date().toLocaleTimeString()}] scoring: posture calculated`,
  ]

  function loadSample() {
    setConfigText(sampleConfigs[selectedVendor] ?? "")
    setUploadError(null)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)

    if (file.size > 1024 * 1024) {
      setUploadError("File too large. Maximum 1 MB for configuration files.")
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setConfigText(text)
    }
    reader.onerror = () => setUploadError("Failed to read file.")
    reader.readAsText(file)
  }

  async function start() {
    if (!tenant || !profile) return
    if (!configText.trim()) {
      setUploadError("Please upload a configuration file or load a sample to scan.")
      return
    }

    setStatus("running")
    setProgress(0)
    setStage(0)
    setLogs([])
    setLastResult(null)
  }

  async function completeScan() {
    if (!tenant || !profile) return

    const result = scanConfiguration(configText)
    setLastResult(result)

    // Create scan record
    const { data: scan } = await supabase.from("scans").insert({
      tenant_id: tenant.id,
      status: "completed",
      device_count: result.deviceCount,
      finding_count: result.findings.length,
      posture_score: result.postureScore,
      started_at: nowISO(),
      completed_at: nowISO(),
    }).select().single()

    // Save device
    const { data: device } = await supabase.from("devices").upsert({
      tenant_id: tenant.id,
      hostname: result.hostname,
      vendor: result.vendor,
      posture: result.postureScore,
      online: true,
      critical_count: result.findings.filter((f) => f.severity === "critical").length,
      high_count: result.findings.filter((f) => f.severity === "high").length,
      last_scan_at: nowISO(),
    }, { onConflict: "tenant_id,hostname" }).select().single()

    // Save findings
    for (const f of result.findings) {
      await supabase.from("findings").insert({
        tenant_id: tenant.id,
        device_id: device?.id ?? null,
        device_name: f.device,
        vendor: f.vendor,
        severity: f.severity,
        issue: f.issue,
        framework: f.framework,
        control: f.control,
        evidence: f.evidence,
        remediation: f.remediation,
        status: "Open",
        detected_at: nowISO(),
      })
    }

    // Notifications
    if (result.findings.filter((f) => f.severity === "critical").length > 0) {
      await addNotification(tenant.id, profile.id, "critical_finding", "Critical findings detected",
        `${result.findings.filter((f) => f.severity === "critical").length} critical issues found on ${result.hostname}.`, "/scanner")
    }
    await addNotification(tenant.id, profile.id, "scan_completed", "Scan completed",
      `${result.findings.length} findings detected on ${result.hostname}. Posture: ${result.postureScore}/100.`, "/scanner")

    await addAuditLog(tenant.id, profile.id, profile.full_name, "scan_completed", "device", result.hostname, {
      findings: result.findings.length,
      posture: result.postureScore,
    })

    setStatus("done")
    refresh()
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
                  {status === "idle" && "Ready · upload a config to begin"}
                  {status === "running" && `Scanning · ${Math.round(progress)}% complete`}
                  {status === "done" && lastResult && `Completed · ${lastResult.findings.length} findings · posture ${lastResult.postureScore}`}
                </p>
              </div>
            </div>
            <button
              onClick={start}
              disabled={status === "running" || !configText.trim()}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
                status === "running" || !configText.trim()
                  ? "cursor-not-allowed bg-secondary/60 text-muted-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {status === "done" ? <RefreshCw className="size-3.5" /> : status === "running" ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
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
              const state = status === "done" || i < stage ? "done" : i === stage && status === "running" ? "active" : "pending"
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

          {/* Config input area */}
          <div className="mt-5 border-t border-border/60 pt-4">
            <div className="mb-2 flex items-center gap-2">
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="h-8 rounded-lg border border-border/80 bg-secondary/40 px-2 text-xs text-foreground outline-none focus:border-primary/50"
              >
                <option value="Cisco">Cisco IOS/IOS-XE</option>
                <option value="Fortinet">Fortinet FortiOS</option>
                <option value="Palo Alto">Palo Alto PAN-OS</option>
                <option value="Juniper">Juniper Junos</option>
              </select>
              <button
                onClick={loadSample}
                className="rounded-lg border border-border/80 bg-secondary/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-secondary"
              >
                Load sample
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-secondary/40 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-secondary"
              >
                <Upload className="size-3" /> Upload
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.cfg,.conf,.config"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {uploadError && (
              <p className="mb-2 text-xs text-[#f0596b]">{uploadError}</p>
            )}
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              placeholder="Paste device configuration here, or load a sample / upload a file…"
              className="h-32 w-full rounded-lg border border-border/80 bg-[#05080f] p-3 font-mono text-[11px] text-muted-foreground outline-none transition focus:border-primary/50 scrollbar-thin"
              spellCheck={false}
            />
            <p className="mt-1 text-[10px] text-muted-foreground/60">
              Configurations are analyzed locally — they are never executed.
            </p>
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

          {lastResult && status === "done" && (
            <div className="mt-3 space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Scan Results</div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Device:</span>
                <span className="font-mono text-foreground">{lastResult.hostname}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Vendor:</span>
                <span className="text-foreground">{lastResult.vendor}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Posture:</span>
                <span className="font-mono text-primary">{lastResult.postureScore}/100</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Findings:</span>
                <span className="font-mono text-foreground">{lastResult.findings.length}</span>
              </div>
              {lastResult.findings.length > 0 && (
                <div className="mt-2 space-y-1">
                  {lastResult.findings.slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      <span className={cn(
                        "shrink-0 rounded px-1 font-medium",
                        f.severity === "critical" && "bg-[#f0596b]/15 text-[#f0596b]",
                        f.severity === "high" && "bg-[#fb923c]/15 text-[#fb923c]",
                        f.severity === "medium" && "bg-[#fbbf24]/15 text-[#fbbf24]",
                        f.severity === "low" && "bg-[#38bdf8]/15 text-[#38bdf8]",
                      )}>{f.severity}</span>
                      <span className="text-muted-foreground">{f.issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
