export type Severity = "critical" | "high" | "medium" | "low"

export type Vendor = "Cisco" | "Fortinet" | "Palo Alto" | "Juniper"

export const severityMeta: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; text: string }
> = {
  critical: {
    label: "Critical",
    color: "var(--critical)",
    bg: "bg-[#f0596b]/12",
    border: "border-[#f0596b]/30",
    text: "text-[#f0596b]",
  },
  high: {
    label: "High",
    color: "var(--high)",
    bg: "bg-[#fb923c]/12",
    border: "border-[#fb923c]/30",
    text: "text-[#fb923c]",
  },
  medium: {
    label: "Medium",
    color: "var(--medium)",
    bg: "bg-[#fbbf24]/12",
    border: "border-[#fbbf24]/30",
    text: "text-[#fbbf24]",
  },
  low: {
    label: "Low",
    color: "var(--low)",
    bg: "bg-[#38bdf8]/12",
    border: "border-[#38bdf8]/30",
    text: "text-[#38bdf8]",
  },
}

export const postureScore = 78
export const postureDelta = 4.2
export const complianceCoverage = 86
export const devicesScanned = 142
export const devicesTotal = 156
export const openFindings = 327
export const findingsDelta = -12

export const severityCounts = {
  critical: 18,
  high: 64,
  medium: 141,
  low: 104,
}

export const riskTrend = [
  { day: "Mar 12", risk: 71, critical: 28, high: 82 },
  { day: "Mar 13", risk: 69, critical: 26, high: 79 },
  { day: "Mar 14", risk: 73, critical: 31, high: 88 },
  { day: "Mar 15", risk: 68, critical: 24, high: 74 },
  { day: "Mar 16", risk: 64, critical: 22, high: 71 },
  { day: "Mar 17", risk: 61, critical: 20, high: 68 },
  { day: "Mar 18", risk: 58, critical: 19, high: 66 },
  { day: "Mar 19", risk: 55, critical: 18, high: 64 },
]

export const complianceTrend = [
  { day: "Mar 12", score: 79 },
  { day: "Mar 13", score: 80 },
  { day: "Mar 14", score: 79 },
  { day: "Mar 15", score: 82 },
  { day: "Mar 16", score: 83 },
  { day: "Mar 17", score: 84 },
  { day: "Mar 18", score: 85 },
  { day: "Mar 19", score: 86 },
]

export const topIssues: {
  id: string
  title: string
  severity: Severity
  count: number
  framework: string
}[] = [
  { id: "NG-1001", title: "Weak SNMP community strings in use", severity: "critical", count: 42, framework: "CIS 2.1.3" },
  { id: "NG-1002", title: "Unencrypted management plane (Telnet enabled)", severity: "critical", count: 31, framework: "NIST AC-17" },
  { id: "NG-1003", title: "Default admin credentials not rotated", severity: "high", count: 28, framework: "PCI DSS 2.1" },
  { id: "NG-1004", title: "TLS 1.0/1.1 permitted on VPN gateways", severity: "high", count: 24, framework: "NIST SC-8" },
  { id: "NG-1005", title: "Overly permissive firewall any-any rule", severity: "high", count: 19, framework: "CIS 6.4" },
  { id: "NG-1006", title: "NTP not authenticated", severity: "medium", count: 17, framework: "CIS 2.3.2" },
  { id: "NG-1007", title: "Logging not forwarded to SIEM", severity: "medium", count: 15, framework: "NIST AU-6" },
]

export type Finding = {
  id: string
  device: string
  vendor: Vendor
  issue: string
  severity: Severity
  framework: string
  status: "Open" | "In Progress" | "Resolved" | "Accepted Risk"
  detected: string
}

export const findings: Finding[] = [
  { id: "NG-4821", device: "core-sw-01", vendor: "Cisco", issue: "Telnet enabled on management VLAN", severity: "critical", framework: "NIST AC-17", status: "Open", detected: "2h ago" },
  { id: "NG-4820", device: "edge-fw-03", vendor: "Palo Alto", issue: "Any-any allow rule on outside zone", severity: "critical", framework: "CIS 6.4", status: "In Progress", detected: "3h ago" },
  { id: "NG-4818", device: "dc-fg-02", vendor: "Fortinet", issue: "Admin login without MFA", severity: "high", framework: "PCI DSS 8.3", status: "Open", detected: "5h ago" },
  { id: "NG-4815", device: "wan-mx-04", vendor: "Juniper", issue: "SNMP v2c community 'public'", severity: "critical", framework: "CIS 2.1.3", status: "Open", detected: "6h ago" },
  { id: "NG-4811", device: "core-sw-02", vendor: "Cisco", issue: "TLS 1.0 permitted on HTTPS mgmt", severity: "high", framework: "NIST SC-8", status: "Open", detected: "8h ago" },
  { id: "NG-4809", device: "branch-fg-11", vendor: "Fortinet", issue: "Default admin password unchanged", severity: "high", framework: "PCI DSS 2.1", status: "In Progress", detected: "11h ago" },
  { id: "NG-4804", device: "edge-fw-01", vendor: "Palo Alto", issue: "Verbose logging disabled", severity: "medium", framework: "NIST AU-6", status: "Open", detected: "14h ago" },
  { id: "NG-4802", device: "wan-mx-01", vendor: "Juniper", issue: "NTP peers unauthenticated", severity: "medium", framework: "CIS 2.3.2", status: "Open", detected: "16h ago" },
  { id: "NG-4799", device: "dc-sw-07", vendor: "Cisco", issue: "Unused open ports on trunk", severity: "low", framework: "CIS 1.1.4", status: "Resolved", detected: "1d ago" },
  { id: "NG-4795", device: "dmz-fg-05", vendor: "Fortinet", issue: "Session timeout > 30 min", severity: "low", framework: "PCI DSS 8.1.8", status: "Accepted Risk", detected: "1d ago" },
  { id: "NG-4790", device: "core-fw-02", vendor: "Palo Alto", issue: "GlobalProtect allows TLS 1.1", severity: "high", framework: "NIST SC-8", status: "Open", detected: "2d ago" },
  { id: "NG-4788", device: "agg-mx-02", vendor: "Juniper", issue: "Root login over SSH permitted", severity: "critical", framework: "CIS 5.2.8", status: "Open", detected: "2d ago" },
]

export type Device = {
  vendor: Vendor
  count: number
  posture: number
  critical: number
  high: number
  online: number
  osLabel: string
  lastScan: string
}

export const devices: Device[] = [
  { vendor: "Cisco", count: 58, posture: 82, critical: 6, high: 21, online: 56, osLabel: "IOS-XE 17.9", lastScan: "12 min ago" },
  { vendor: "Fortinet", count: 41, posture: 76, critical: 5, high: 18, online: 40, osLabel: "FortiOS 7.4", lastScan: "9 min ago" },
  { vendor: "Palo Alto", count: 27, posture: 74, critical: 4, high: 15, online: 27, osLabel: "PAN-OS 11.1", lastScan: "18 min ago" },
  { vendor: "Juniper", count: 30, posture: 71, critical: 3, high: 10, online: 28, osLabel: "Junos 23.4", lastScan: "22 min ago" },
]

export const complianceFrameworks = [
  { name: "CIS Benchmark v8", coverage: 88, controls: 214, passed: 188, failed: 26, status: "In Compliance" },
  { name: "NIST 800-53 Rev.5", coverage: 84, controls: 189, passed: 159, failed: 30, status: "In Compliance" },
  { name: "PCI DSS 4.0", coverage: 79, controls: 142, passed: 112, failed: 30, status: "Attention" },
  { name: "ISO 27001:2022", coverage: 91, controls: 114, passed: 104, failed: 10, status: "In Compliance" },
  { name: "HIPAA Security Rule", coverage: 82, controls: 78, passed: 64, failed: 14, status: "Attention" },
  { name: "SOC 2 Type II", coverage: 87, controls: 96, passed: 84, failed: 12, status: "In Compliance" },
]

export type ScanRecord = {
  id: string
  started: string
  duration: string
  devices: number
  findings: number
  critical: number
  trigger: "Scheduled" | "Manual" | "API"
  status: "Completed" | "Completed" | "Partial" | "Running"
  by: string
}

export const scanHistory: ScanRecord[] = [
  { id: "SCAN-20260319-04", started: "Mar 19, 2026 · 06:00", duration: "8m 42s", devices: 142, findings: 327, critical: 18, trigger: "Scheduled", status: "Completed", by: "netguard-cron" },
  { id: "SCAN-20260318-03", started: "Mar 18, 2026 · 18:00", duration: "9m 05s", devices: 141, findings: 341, critical: 19, trigger: "Scheduled", status: "Completed", by: "netguard-cron" },
  { id: "SCAN-20260318-02", started: "Mar 18, 2026 · 14:22", duration: "3m 11s", devices: 41, findings: 96, critical: 5, trigger: "Manual", status: "Completed", by: "a.sharma" },
  { id: "SCAN-20260318-01", started: "Mar 18, 2026 · 06:00", duration: "8m 58s", devices: 140, findings: 352, critical: 21, trigger: "Scheduled", status: "Completed", by: "netguard-cron" },
  { id: "SCAN-20260317-05", started: "Mar 17, 2026 · 21:40", duration: "1m 47s", devices: 12, findings: 28, critical: 2, trigger: "API", status: "Completed", by: "ci-pipeline" },
  { id: "SCAN-20260317-04", started: "Mar 17, 2026 · 06:00", duration: "10m 12s", devices: 138, findings: 368, critical: 22, trigger: "Scheduled", status: "Partial", by: "netguard-cron" },
  { id: "SCAN-20260316-03", started: "Mar 16, 2026 · 06:00", duration: "9m 30s", devices: 136, findings: 379, critical: 24, trigger: "Scheduled", status: "Completed", by: "netguard-cron" },
]

export const reports = [
  { id: "RPT-2026-014", title: "Executive Security Posture Summary", framework: "All Frameworks", period: "Mar 2026", format: "PDF", size: "2.4 MB", generated: "Mar 19, 2026", author: "SecureNorm AI" },
  { id: "RPT-2026-013", title: "PCI DSS 4.0 Compliance Attestation", framework: "PCI DSS 4.0", period: "Q1 2026", format: "PDF", size: "5.1 MB", generated: "Mar 18, 2026", author: "SecureNorm AI" },
  { id: "RPT-2026-012", title: "Cisco Fleet Hardening Report", framework: "CIS Benchmark", period: "Mar 2026", format: "XLSX", size: "1.2 MB", generated: "Mar 17, 2026", author: "a.sharma" },
  { id: "RPT-2026-011", title: "NIST 800-53 Control Gap Analysis", framework: "NIST 800-53", period: "Q1 2026", format: "PDF", size: "3.8 MB", generated: "Mar 15, 2026", author: "SecureNorm AI" },
  { id: "RPT-2026-010", title: "Weekly Findings Digest", framework: "All Frameworks", period: "Week 11", format: "CSV", size: "684 KB", generated: "Mar 14, 2026", author: "netguard-cron" },
  { id: "RPT-2026-009", title: "Fortinet VPN Encryption Audit", framework: "NIST SC-8", period: "Mar 2026", format: "PDF", size: "1.9 MB", generated: "Mar 12, 2026", author: "SecureNorm AI" },
]

export const remediationItems: {
  id: string
  device: string
  vendor: Vendor
  issue: string
  severity: Severity
  framework: string
  confidence: number
  impact: string
  before: string
  after: string
  steps: string[]
}[] = [
  {
    id: "NG-4821",
    device: "core-sw-01",
    vendor: "Cisco",
    issue: "Telnet enabled on management VLAN",
    severity: "critical",
    framework: "NIST AC-17",
    confidence: 98,
    impact: "Management traffic transmitted in cleartext, exposing credentials to interception.",
    before: `line vty 0 4
 transport input telnet ssh
 password 7 08701E1D5D4C
 login
!
no ip ssh version 2`,
    after: `line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0
!
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3`,
    steps: [
      "Disable Telnet transport on all VTY lines",
      "Enforce SSHv2 as the only management protocol",
      "Set an idle exec-timeout of 5 minutes",
      "Migrate to local AAA-backed authentication",
    ],
  },
  {
    id: "NG-4815",
    device: "wan-mx-04",
    vendor: "Juniper",
    issue: "SNMP v2c community 'public'",
    severity: "critical",
    framework: "CIS 2.1.3",
    confidence: 95,
    impact: "Default community string allows unauthenticated read of device topology and config.",
    before: `snmp {
    community public {
        authorization read-only;
    }
}`,
    after: `snmp {
    v3 {
        usm {
            local-engine {
                user netguard-mon {
                    authentication-sha {
                        authentication-key "$9$hidden";
                    }
                    privacy-aes128 {
                        privacy-key "$9$hidden";
                    }
                }
            }
        }
    }
}`,
    steps: [
      "Remove all SNMP v2c community definitions",
      "Provision SNMPv3 with SHA auth and AES-128 privacy",
      "Restrict polling to the NMS management subnet",
    ],
  },
  {
    id: "NG-4818",
    device: "dc-fg-02",
    vendor: "Fortinet",
    issue: "Admin login without MFA",
    severity: "high",
    framework: "PCI DSS 8.3",
    confidence: 92,
    impact: "Privileged administrator accounts lack a second authentication factor.",
    before: `config system admin
    edit "admin"
        set accprofile "super_admin"
        set password ENC xxxx
    next
end`,
    after: `config system admin
    edit "admin"
        set accprofile "super_admin"
        set two-factor fortitoken
        set fortitoken "FTKMOB0000000000"
        set email-to "soc@corp.example"
    next
end`,
    steps: [
      "Enable FortiToken-based two-factor for all admins",
      "Bind a hardware/mobile token to each account",
      "Require MFA challenge on every admin session",
    ],
  },
]
