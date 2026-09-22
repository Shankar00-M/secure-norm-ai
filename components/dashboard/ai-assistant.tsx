"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, X, Send, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useAppData } from "@/lib/use-app-data"
import { cn } from "@/lib/utils"

type Message = { role: "user" | "assistant"; content: string }

export function AIAssistant() {
  const { profile, tenant } = useAuth()
  const { devices, findings, scans, remediations, postureScore, severityCounts } = useAppData()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const criticalFindings = findings.filter((f) => f.severity === "critical")
  const highFindings = findings.filter((f) => f.severity === "high")
  const openFindings = findings.filter((f) => f.status === "Open")
  const inProgressFindings = findings.filter((f) => f.status === "In Progress")
  const completedScans = scans.filter((s) => s.status === "completed")
  const proposedRemediations = remediations.filter((r) => r.stage === "Proposed" || r.stage === "Syntax Validated")

  function generateResponse(question: string): string {
    const q = question.toLowerCase()

    if (q.includes("critical") && (q.includes("finding") || q.includes("issue") || q.includes("vuln"))) {
      if (criticalFindings.length === 0) return "You currently have no critical findings. Your fleet is in good shape."
      const list = criticalFindings.slice(0, 5).map((f) => `• ${f.issue} on ${f.device_name} (${f.vendor}) — ${f.framework}`).join("\n")
      return `You have ${criticalFindings.length} critical finding${criticalFindings.length > 1 ? "s" : ""}:\n\n${list}\n\nThese should be prioritized for remediation.`
    }

    if (q.includes("posture") || q.includes("score") || q.includes("why") && q.includes("78")) {
      const factors: string[] = []
      if (criticalFindings.length > 0) factors.push(`${criticalFindings.length} critical findings (each reduces posture by ~2-3 points)`)
      if (highFindings.length > 0) factors.push(`${highFindings.length} high findings (each reduces ~1-2 points)`)
      if (openFindings.length > 0) factors.push(`${openFindings.length} unresolved open findings`)
      const offlineDevices = devices.filter((d) => !d.online)
      if (offlineDevices.length > 0) factors.push(`${offlineDevices.length} unreachable devices`)
      return `Your security posture is ${postureScore}/100. Key factors:\n\n${factors.map((f) => `• ${f}`).join("\n")}\n\nResolving critical findings and bringing offline devices back into scope will improve your score the fastest.`
    }

    if (q.includes("fix first") || q.includes("priorit") || q.includes("should i fix") || q.includes("what should")) {
      if (criticalFindings.length > 0) {
        const top = criticalFindings[0]
        return `Start with: "${top.issue}" on ${top.device_name} (${top.vendor}).\n\nSeverity: Critical\nFramework: ${top.framework}\n${top.remediation ? `Recommended fix: ${top.remediation}` : "No automated remediation available yet — propose one via the Remediation module."}\n\nFixing this will improve your posture by an estimated 2-3 points.`
      }
      if (highFindings.length > 0) {
        const top = highFindings[0]
        return `Your highest priority is: "${top.issue}" on ${top.device_name}.\n\nSeverity: High\nFramework: ${top.framework}\n${top.remediation ? `Recommended fix: ${top.remediation}` : ""}`
      }
      return "No critical or high findings to prioritize. Your fleet looks healthy."
    }

    if (q.includes("device") && (q.includes("affect") || q.includes("impact"))) {
      const byVendor: Record<string, number> = {}
      findings.forEach((f) => { byVendor[f.vendor] = (byVendor[f.vendor] ?? 0) + 1 })
      const list = Object.entries(byVendor).map(([v, c]) => `• ${v}: ${c} finding${c > 1 ? "s" : ""}`).join("\n")
      return `Findings by vendor:\n\n${list}\n\nTotal devices: ${devices.length} (${devices.filter((d) => d.online).length} online, ${devices.filter((d) => !d.online).length} offline)`
    }

    if (q.includes("compliance") || q.includes("control") || q.includes("framework")) {
      const byFramework: Record<string, number> = {}
      findings.forEach((f) => { byFramework[f.framework] = (byFramework[f.framework] ?? 0) + 1 })
      const list = Object.entries(byFramework).map(([fw, c]) => `• ${fw}: ${c} failing control${c > 1 ? "s" : ""}`).join("\n")
      return `Compliance status:\n\nPosture: ${postureScore}/100\n\nFailing controls by framework:\n${list}\n\n${openFindings.length} open findings need remediation to improve compliance.`
    }

    if (q.includes("remediation") || q.includes("fix") || q.includes("resolve")) {
      const pending = remediations.filter((r) => !r.verified && r.stage !== "Rejected" && r.stage !== "Cancelled")
      return `Remediation status:\n\n• ${pending.length} pending remediation${pending.length !== 1 ? "s" : ""}\n• ${proposedRemediations.length} awaiting approval in the Safe Remediation Gate\n• ${remediations.filter((r) => r.verified).length} verified/complete\n\nVisit the Safe Remediation Gate to approve or reject proposed fixes.`
    }

    if (q.includes("scan") || q.includes("last scan") || q.includes("history")) {
      const lastScan = completedScans[0]
      if (lastScan) {
        return `Last scan: ${lastScan.device_count} devices scanned, ${lastScan.finding_count} findings detected, posture ${lastScan.posture_score}/100.\n\nTotal scans: ${scans.length}. Visit Scan History for the full timeline.`
      }
      return `No completed scans yet. Run a scan from the Configuration Scanner or the Overview page to get started.`
    }

    if (q.includes("summary") || q.includes("status") || q.includes("overview") || q.includes("today")) {
      return `Security Summary for ${tenant?.name ?? "your workspace"}:\n\n• Posture: ${postureScore}/100\n• Devices: ${devices.length} (${devices.filter((d) => d.online).length} online)\n• Findings: ${findings.length} total (${severityCounts.critical} critical, ${severityCounts.high} high, ${severityCounts.medium} medium, ${severityCounts.low} low)\n• Open: ${openFindings.length} | In Progress: ${inProgressFindings.length}\n• Remediations: ${remediations.filter((r) => r.verified).length} verified, ${proposedRemediations.length} pending approval\n• Scans: ${scans.length} (${completedScans.length} completed)\n\nPriority: ${criticalFindings.length > 0 ? `Address ${criticalFindings.length} critical findings first.` : "No critical findings — maintain current posture."}`
    }

    if (q.includes("telnet")) {
      const telnetFindings = findings.filter((f) => f.issue.toLowerCase().includes("telnet") || f.evidence?.toLowerCase().includes("telnet"))
      if (telnetFindings.length > 0) {
        const f = telnetFindings[0]
        return `Telnet finding on ${f.device_name} (${f.vendor}):\n\nIssue: ${f.issue}\nEvidence: ${f.evidence ?? "N/A"}\nFramework: ${f.framework}\nSeverity: ${f.severity}\n\nTelnet transmits credentials in cleartext. Remediation: disable telnet and enforce SSH v2 only. Use the Safe Remediation Gate to apply this fix.`
      }
      return "No Telnet-related findings detected in the current scan results."
    }

    if (q.includes("any-any") || q.includes("any any") || q.includes("firewall rule")) {
      const anyFindings = findings.filter((f) => f.issue.toLowerCase().includes("any") || f.evidence?.toLowerCase().includes("any"))
      if (anyFindings.length > 0) {
        const f = anyFindings[0]
        return `Any-Any firewall rule finding on ${f.device_name}:\n\n${f.issue}\nEvidence: ${f.evidence ?? "N/A"}\n\nAny-Any permit rules allow all traffic between zones, which violates least-privilege. Use the What-If Simulator to see the impact of replacing this rule, then remediate via the Safe Remediation Gate.`
      }
      return "No Any-Any firewall rule findings detected."
    }

    if (q.includes("attack path") || q.includes("attack")) {
      return `Attack Path analysis is based on your ${findings.length} findings and ${devices.length} devices. Visit the Attack-Path Explorer to see entry points, lateral movement paths, and critical assets at risk. The Security Reasoning Engine can correlate findings into attack chains.`
    }

    if (q.includes("safest") || q.includes("best remediation")) {
      const verified = remediations.filter((r) => r.verified)
      if (verified.length > 0) {
        return `The safest remediations are those that have been verified through the full gate workflow. You have ${verified.length} verified remediation${verified.length > 1 ? "s" : ""}. Always prefer fixes with rollback configurations and high confidence scores.`
      }
      return "For safest remediation: use the Safe Remediation Gate which validates syntax, checks impact, and requires human approval before applying. Each fix includes a rollback configuration."
    }

    if (q.includes("what if") || q.includes("simulate") || q.includes("what happens")) {
      return `The What-If Simulator lets you test configuration changes before applying them. You can simulate: disabling Telnet, replacing Any-Any rules, upgrading SNMPv2c to SNMPv3, restricting management access, and more. Each simulation recalculates findings, risk, and compliance impact. Visit the What-If Simulator page.`
    }

    return `I can help with: critical findings, security posture, compliance status, remediation priorities, scan results, device analysis, attack paths, and security summaries. Try asking:\n\n• "What are my critical findings?"\n• "Why is my posture ${postureScore}?"\n• "Which vulnerability should I fix first?"\n• "Summarize today's security status"\n• "What compliance controls are failing?"`
  }

  async function handleSend() {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: question }])
    setLoading(true)
    // Simulate thinking time for UX
    await new Promise((r) => setTimeout(r, 400))
    const response = generateResponse(question)
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
    setLoading(false)
  }

  const suggestions = [
    "What are my critical findings?",
    "Summarize today's security status",
    "Which vulnerability should I fix first?",
    "What compliance controls are failing?",
  ]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15 sm:flex"
      >
        <Sparkles className="size-3.5" />
        Ask SecureNorm AI
      </button>
      <button
        onClick={() => setOpen(true)}
        className="flex size-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition hover:bg-primary/15 sm:hidden"
        aria-label="Ask SecureNorm AI"
      >
        <Sparkles className="size-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="flex h-[85vh] w-full max-w-2xl flex-col rounded-t-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-md sm:h-[600px] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#0e9488]">
                  <Sparkles className="size-4 text-[#05201d]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">SecureNorm AI Assistant</h2>
                  <p className="text-[10px] text-muted-foreground">Powered by your live workspace data</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="size-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Ask about your security posture</p>
                    <p className="mt-1 text-xs text-muted-foreground">I analyze your live findings, devices, scans, and remediations.</p>
                  </div>
                  <div className="grid w-full max-w-md grid-cols-1 gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setInput(s); }}
                        className="rounded-lg border border-border/70 bg-secondary/30 px-3 py-2 text-left text-xs text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "border border-border/70 bg-secondary/40 text-foreground",
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-3.5 py-2.5">
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Analyzing…</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about findings, posture, compliance, remediation…"
                  className="h-9 flex-1 rounded-lg border border-border/80 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
