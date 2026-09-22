// Configuration Security Scanner Engine
// Analyzes raw configuration text from network devices and detects security issues.
// Supports Cisco IOS/IOS-XE, Fortinet FortiOS, Palo Alto PAN-OS, and Juniper Junos.

export type ScanFinding = {
  device: string
  vendor: string
  severity: "critical" | "high" | "medium" | "low"
  issue: string
  framework: string
  control: string
  evidence: string
  remediation: string
}

export type ScanResult = {
  findings: ScanFinding[]
  deviceCount: number
  postureScore: number
  vendor: string
  hostname: string
}

function detectVendor(config: string): string {
  const lower = config.toLowerCase()
  if (lower.includes("line vty") || lower.includes("ip ssh") || lower.includes("cisco") || lower.includes("ios-xe") || lower.includes("hostname ") && lower.includes("!")) return "Cisco"
  if (lower.includes("config system") || lower.includes("fortios") || lower.includes("fortigate") || lower.includes("set srcintf")) return "Fortinet"
  if (lower.includes("set security policies") || lower.includes("from-zone") || lower.includes("pan-os") || lower.includes("palo alto")) return "Palo Alto"
  if (lower.includes("snmp {") || lower.includes("set interfaces") || lower.includes("junos") || lower.includes("family inet")) return "Juniper"
  return "Unknown"
}

function detectHostname(config: string): string {
  // Cisco: "hostname core-sw-01"
  const ciscoMatch = config.match(/^hostname\s+(\S+)/m)
  if (ciscoMatch) return ciscoMatch[1]
  // Fortinet: "set hostname ..."
  const fortiMatch = config.match(/set hostname\s+(\S+)/i)
  if (fortiMatch) return fortiMatch[1]
  // Juniper: "host-name ..."
  const junosMatch = config.match(/host-name\s+(\S+)/)
  if (junosMatch) return junosMatch[1]
  // Palo Alto: deviceconfig system > set hostname
  const paloMatch = config.match(/set hostname\s+(\S+)/i)
  if (paloMatch) return paloMatch[1]
  return "unknown-device"
}

export function scanConfiguration(config: string): ScanResult {
  const vendor = detectVendor(config)
  const hostname = detectHostname(config)
  const findings: ScanFinding[] = []
  const lower = config.toLowerCase()

  // 1. Telnet detection
  if (lower.includes("telnet")) {
    if (lower.includes("transport input telnet") || lower.includes("telnet server enable") || lower.includes("set telnet") || lower.match(/telnet\s+(enable|server)/)) {
      const evidence = config.split("\n").filter((l) => l.toLowerCase().includes("telnet")).join("\n").trim()
      findings.push({
        device: hostname,
        vendor,
        severity: "critical",
        issue: "Telnet enabled — management traffic transmitted in cleartext",
        framework: "NIST 800-53",
        control: "AC-17 — Encrypted remote access",
        evidence: evidence.slice(0, 200),
        remediation: "Disable Telnet and enforce SSHv2 as the only management transport protocol.",
      })
    }
  }

  // 2. SNMP v2c with public/private community
  if (lower.includes("snmp") && (lower.includes("community public") || lower.includes("community private") || lower.includes("community \"public\""))) {
    const evidence = config.split("\n").filter((l) => l.toLowerCase().includes("snmp") || l.toLowerCase().includes("community")).join("\n").trim()
    findings.push({
      device: hostname,
      vendor,
      severity: "critical",
      issue: "SNMPv2c with default community string 'public' or 'private' detected",
      framework: "CIS Benchmark v8",
      control: "2.1.3 — SNMP community strings must not be default",
      evidence: evidence.slice(0, 200),
      remediation: "Remove SNMPv2c communities and provision SNMPv3 with SHA authentication and AES-128 privacy.",
    })
  }

  // 3. SNMP v2c (any community — not just public)
  if (lower.includes("snmp") && lower.includes("community") && !lower.includes("v3") && !lower.includes("usm")) {
    const evidence = config.split("\n").filter((l) => l.toLowerCase().includes("snmp") || l.toLowerCase().includes("community")).join("\n").trim()
    findings.push({
      device: hostname,
      vendor,
      severity: "high",
      issue: "SNMPv2c in use — no SNMPv3 authentication or encryption",
      framework: "CIS Benchmark v8",
      control: "2.1.3 — Use SNMPv3 with authentication and privacy",
      evidence: evidence.slice(0, 200),
      remediation: "Upgrade to SNMPv3 with SHA authentication and AES-128 privacy. Remove all v2c community strings.",
    })
  }

  // 4. Any-Any firewall rules
  if (lower.includes("any") && (lower.includes("source") || lower.includes("source-address")) && (lower.includes("destination") || lower.includes("destination-address")) && lower.includes("permit")) {
    const evidence = config.split("\n").filter((l) => l.toLowerCase().includes("any") && (l.toLowerCase().includes("permit") || l.toLowerCase().includes("source") || l.toLowerCase().includes("destination"))).join("\n").trim()
    findings.push({
      device: hostname,
      vendor,
      severity: "critical",
      issue: "Permissive any-any firewall rule detected — no traffic filtering",
      framework: "CIS Benchmark v8",
      control: "6.4 — Restrict traffic to required ports and destinations",
      evidence: evidence.slice(0, 200),
      remediation: "Replace any-any permit rules with explicit zone-based policies using address groups and service groups. Add a default deny rule.",
    })
  }

  // 5. SSH v1 or no SSH v2
  if (lower.includes("ssh") && !lower.includes("ssh version 2") && !lower.includes("ssh version 2") && !lower.includes("ssh-version") && (lower.includes("no ip ssh") || lower.includes("ssh v1") || lower.includes("protocol 1"))) {
    findings.push({
      device: hostname,
      vendor,
      severity: "high",
      issue: "SSH version 1 permitted — vulnerable to downgrade attacks",
      framework: "NIST 800-53",
      control: "SC-8 — Transmission confidentiality",
      evidence: "SSH v1 or no SSHv2 enforcement detected",
      remediation: "Enable SSH version 2 only: 'ip ssh version 2' (Cisco) or equivalent. Disable SSH v1 fallback.",
    })
  }

  // 6. Weak/default credentials indicators
  if (lower.includes("password 7") || lower.includes("password 0") || lower.includes("default") && lower.includes("password") || lower.includes("admin") && lower.includes("password") && lower.includes("enc")) {
    findings.push({
      device: hostname,
      vendor,
      severity: "high",
      issue: "Weak or default credential indicators detected",
      framework: "PCI DSS 4.0",
      control: "2.1 — Remove default passwords and use strong cryptography",
      evidence: "Type 7 reversible password encryption or default credential pattern detected",
      remediation: "Use Type 5 (MD5) or better password hashing. Rotate all default credentials. Enable AAA with TACACS+/RADIUS.",
    })
  }

  // 7. No MFA / two-factor
  if ((lower.includes("admin") || lower.includes("management")) && !lower.includes("two-factor") && !lower.includes("mfa") && !lower.includes("2fa") && !lower.includes("fortitoken") && vendor === "Fortinet") {
    findings.push({
      device: hostname,
      vendor,
      severity: "high",
      issue: "Administrator account without multi-factor authentication",
      framework: "PCI DSS 4.0",
      control: "8.3 — All non-console admin access requires MFA",
      evidence: "No 'set two-factor' directive found in admin configuration",
      remediation: "Enable FortiToken or RADIUS-based two-factor authentication for all administrator accounts.",
    })
  }

  // 8. TLS 1.0/1.1
  if (lower.includes("tls") && (lower.includes("1.0") || lower.includes("1.1")) || lower.includes("ssl") && (lower.includes("v3") || lower.includes("tls1.0") || lower.includes("tls1.1"))) {
    findings.push({
      device: hostname,
      vendor,
      severity: "high",
      issue: "Weak TLS version (1.0 or 1.1) permitted — vulnerable to downgrade attacks",
      framework: "NIST 800-53",
      control: "SC-8 — Transmission confidentiality and integrity",
      evidence: "TLS 1.0 or 1.1 configuration detected",
      remediation: "Set minimum TLS version to 1.2. Prefer TLS 1.3. Remove CBC cipher suites and enable HSTS.",
    })
  }

  // 9. Logging disabled or not forwarded
  if (!lower.includes("logging") || (lower.includes("no logging") || lower.includes("logging disabled"))) {
    findings.push({
      device: hostname,
      vendor,
      severity: "medium",
      issue: "Logging not configured or disabled — security events not captured",
      framework: "NIST 800-53",
      control: "AU-6 — Audit record review and reporting",
      evidence: "No logging configuration found or logging explicitly disabled",
      remediation: "Enable verbose logging and forward to a SIEM. Configure NTP for accurate timestamps.",
    })
  }

  // 10. NTP unauthenticated
  if (lower.includes("ntp") && !lower.includes("authentication-key") && !lower.includes("ntp authenticate")) {
    findings.push({
      device: hostname,
      vendor,
      severity: "medium",
      issue: "NTP without authentication — susceptible to time manipulation attacks",
      framework: "CIS Benchmark v8",
      control: "2.3.2 — Authenticate NTP peers",
      evidence: "NTP configuration without authentication detected",
      remediation: "Configure authenticated NTP using SHA or MD5 keys. Restrict NTP to trusted peers only.",
    })
  }

  // 11. Root login over SSH
  if (lower.includes("permit-root-login") || lower.includes("root login") || (lower.includes("root") && lower.includes("ssh") && lower.includes("permit"))) {
    findings.push({
      device: hostname,
      vendor,
      severity: "critical",
      issue: "Root login over SSH permitted — privilege escalation risk",
      framework: "CIS Benchmark v8",
      control: "5.2.8 — Restrict root SSH access",
      evidence: "Root SSH login permitted in configuration",
      remediation: "Set 'PermitRootLogin no' in SSH configuration. Use sudo for privileged operations with individual accounts.",
    })
  }

  // 12. Disabled logging / verbose
  if (lower.includes("no logging console") && !lower.includes("logging monitor") && !lower.includes("logging trap")) {
    findings.push({
      device: hostname,
      vendor,
      severity: "low",
      issue: "Verbose logging disabled — reduced audit trail visibility",
      framework: "NIST 800-53",
      control: "AU-6 — Audit record review",
      evidence: "Logging console disabled without trap/monitor configuration",
      remediation: "Enable logging trap informational and forward to syslog server. Keep console logging disabled for performance but ensure SIEM forwarding.",
    })
  }

  // Calculate posture score: start at 100, subtract per finding
  const postureScore = Math.max(0, 100 - findings.reduce((sum, f) => {
    switch (f.severity) {
      case "critical": return sum + 8
      case "high": return sum + 4
      case "medium": return sum + 2
      case "low": return sum + 1
      default: return sum
    }
  }, 0))

  return {
    findings,
    deviceCount: 1,
    postureScore,
    vendor,
    hostname,
  }
}

// Sample configurations for each vendor — used when no config is uploaded
export const sampleConfigs: Record<string, string> = {
  Cisco: `hostname core-sw-01
!
version 17.9
!
line vty 0 4
 transport input telnet ssh
 password 7 08701E1D5D4C
 login
!
no ip ssh version 2
!
snmp-server community public RO
!
no logging console
!
ntp server 10.0.0.1
!`,
  Fortinet: `config system global
    set hostname dc-fg-02
end
config system admin
    edit "admin"
        set accprofile "super_admin"
        set password ENC xxxx
    next
end
config system snmp-community
    edit 1
        set community-name "public"
    next
end
config log syslogd setting
    set status disable
end`,
  "Palo Alto": `set deviceconfig system hostname edge-fw-01
set security policies from-zone Outside to-zone inside
  policy any-allow {
      match {
          source-address any;
          destination-address any;
          application any;
      }
      then { permit; }
  }
set network protocol-helper ssl min-tls-version 1.0
set deviceconfig system log-config-servers 0
`,
  Juniper: `system {
    host-name wan-mx-04;
}
snmp {
    community public {
        authorization read-only;
    }
}
system {
    services {
        ssh {
            root-login allow;
            protocol-version [ v1 v2 ];
        }
    }
}
ntp {
    server 10.0.0.1;
}`,
}
