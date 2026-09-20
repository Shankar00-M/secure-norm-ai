"use client"

import { useState } from "react"
import { Bell, CalendarClock, Cpu, Plug, ShieldCheck } from "lucide-react"
import { Card, CardHeader } from "./ui"
import { cn } from "@/lib/utils"

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-secondary",
      )}
    >
      <span
        className={cn(
          "inline-block size-3.5 rounded-full bg-white transition-transform",
          checked ? "translate-x-4" : "translate-x-1",
        )}
      />
    </button>
  )
}

function Row({
  title,
  desc,
  children,
}: {
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 px-5 py-4 last:border-0">
      <div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
      {children}
    </div>
  )
}

const initialFrameworks = [
  { name: "CIS Benchmark v8", on: true },
  { name: "NIST 800-53 Rev.5", on: true },
  { name: "PCI DSS 4.0", on: true },
  { name: "ISO 27001:2022", on: true },
  { name: "HIPAA Security Rule", on: false },
  { name: "SOC 2 Type II", on: true },
]

const integrations = [
  { name: "Splunk SIEM", desc: "Forward findings as CIM events", connected: true },
  { name: "ServiceNow", desc: "Auto-create remediation tickets", connected: true },
  { name: "Slack", desc: "Critical finding alerts to #soc", connected: true },
  { name: "PagerDuty", desc: "Escalate unresolved criticals", connected: false },
]

export function SettingsView() {
  const [autoScan, setAutoScan] = useState(true)
  const [driftAlerts, setDriftAlerts] = useState(true)
  const [autoRemediate, setAutoRemediate] = useState(false)
  const [cadence, setCadence] = useState("12h")
  const [frameworks, setFrameworks] = useState(initialFrameworks)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyCritical, setNotifyCritical] = useState(true)
  const [notifyWeekly, setNotifyWeekly] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader
          title="Scan Configuration"
          subtitle="Control how and when SecureNorm audits your fleet"
          icon={<CalendarClock className="size-4" />}
        />
        <div className="mt-3">
          <Row title="Automated scanning" desc="Run scheduled scans across all in-scope devices">
            <Toggle checked={autoScan} onChange={setAutoScan} />
          </Row>
          <div className="flex items-center justify-between gap-4 border-b border-border/50 px-5 py-4">
            <div>
              <div className="text-sm font-medium text-foreground">Scan cadence</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Interval between scheduled scans</div>
            </div>
            <div className="flex items-center gap-1.5">
              {["6h", "12h", "24h", "Weekly"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCadence(c)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                    cadence === c
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Row title="Configuration drift alerts" desc="Notify when a device deviates from its approved baseline">
            <Toggle checked={driftAlerts} onChange={setDriftAlerts} />
          </Row>
          <Row title="Auto-apply low-risk fixes" desc="Let SecureNorm remediate low-severity issues automatically">
            <Toggle checked={autoRemediate} onChange={setAutoRemediate} />
          </Row>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Active Frameworks"
          subtitle="Standards evaluated on every scan"
          icon={<ShieldCheck className="size-4" />}
        />
        <div className="mt-3">
          {frameworks.map((f, i) => (
            <Row key={f.name} title={f.name} desc={f.on ? "Included in scoring" : "Excluded"}>
              <Toggle
                checked={f.on}
                onChange={(v) =>
                  setFrameworks((prev) => prev.map((x, idx) => (idx === i ? { ...x, on: v } : x)))
                }
              />
            </Row>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Integrations"
          subtitle="Connected SOC and ITSM tooling"
          icon={<Plug className="size-4" />}
        />
        <div className="mt-3">
          {integrations.map((it) => (
            <div
              key={it.name}
              className="flex items-center justify-between gap-4 border-b border-border/50 px-5 py-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 text-muted-foreground">
                  <Cpu className="size-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{it.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{it.desc}</div>
                </div>
              </div>
              <button
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                  it.connected
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/80 bg-secondary/40 text-foreground hover:bg-secondary",
                )}
              >
                {it.connected ? "Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader
          title="Notifications"
          subtitle="How your team is alerted"
          icon={<Bell className="size-4" />}
        />
        <div className="mt-3">
          <Row title="Email notifications" desc="Send finding summaries to the SOC distribution list">
            <Toggle checked={notifyEmail} onChange={setNotifyEmail} />
          </Row>
          <Row title="Critical finding push" desc="Immediate alert when a critical issue is detected">
            <Toggle checked={notifyCritical} onChange={setNotifyCritical} />
          </Row>
          <Row title="Weekly digest" desc="Rollup of posture and remediation progress every Monday">
            <Toggle checked={notifyWeekly} onChange={setNotifyWeekly} />
          </Row>
        </div>
      </Card>
    </div>
  )
}
