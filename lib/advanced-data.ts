import type { Severity, Vendor } from "./data"

// ──────────────────────────────────────────────────────────────────────────────
// 1. SECURITY DIGITAL TWIN
// ──────────────────────────────────────────────────────────────────────────────

export type TwinNode = {
  id: string
  label: string
  type: "zone" | "device" | "service" | "policy"
  vendor?: Vendor
  x: number
  y: number
  risk: number
  status: "secure" | "warning" | "critical"
  meta: string
}

export type TwinEdge = {
  from: string
  to: string
  label: string
  trust: "trusted" | "semi-trusted" | "untrusted"
  protocol: string
}

export const twinNodes: TwinNode[] = [
  { id: "internet", label: "Internet", type: "zone", x: 50, y: 80, risk: 90, status: "critical", meta: "Untrusted" },
  { id: "dmz", label: "DMZ Zone", type: "zone", x: 260, y: 80, risk: 55, status: "warning", meta: "Semi-trusted" },
  { id: "inside", label: "Inside Zone", type: "zone", x: 520, y: 80, risk: 22, status: "secure", meta: "Trusted" },
  { id: "mgmt", label: "Mgmt Zone", type: "zone", x: 740, y: 80, risk: 40, status: "warning", meta: "Trusted" },

  { id: "edge-fw", label: "edge-fw-01", type: "device", vendor: "Palo Alto", x: 150, y: 230, risk: 74, status: "critical", meta: "PAN-OS 11.1" },
  { id: "core-sw", label: "core-sw-01", type: "device", vendor: "Cisco", x: 380, y: 230, risk: 82, status: "critical", meta: "IOS-XE 17.9" },
  { id: "dc-fg", label: "dc-fg-02", type: "device", vendor: "Fortinet", x: 580, y: 230, risk: 76, status: "critical", meta: "FortiOS 7.4" },
  { id: "wan-mx", label: "wan-mx-04", type: "device", vendor: "Juniper", x: 740, y: 230, risk: 71, status: "warning", meta: "Junos 23.4" },

  { id: "svc-telnet", label: "Telnet", type: "service", x: 60, y: 370, risk: 95, status: "critical", meta: "Port 23" },
  { id: "svc-ssh", label: "SSHv2", type: "service", x: 170, y: 370, risk: 20, status: "secure", meta: "Port 22" },
  { id: "svc-snmp", label: "SNMPv2c", type: "service", x: 280, y: 370, risk: 88, status: "critical", meta: "UDP 161" },
  { id: "svc-https", label: "HTTPS", type: "service", x: 390, y: 370, risk: 25, status: "secure", meta: "Port 443" },
  { id: "svc-vpn", label: "GlobalProtect", type: "service", x: 500, y: 370, risk: 60, status: "warning", meta: "TLS 1.1" },
  { id: "svc-ntp", label: "NTP", type: "service", x: 610, y: 370, risk: 45, status: "warning", meta: "Unauthenticated" },
  { id: "svc-syslog", label: "Syslog", type: "service", x: 720, y: 370, risk: 30, status: "secure", meta: "UDP 514" },

  { id: "pol-anyany", label: "Any→Any Allow", type: "policy", x: 150, y: 490, risk: 92, status: "critical", meta: "CIS 6.4" },
  { id: "pol-telnet", label: "Telnet Mgmt", type: "policy", x: 320, y: 490, risk: 90, status: "critical", meta: "NIST AC-17" },
  { id: "pol-snmp", label: "SNMP Public", type: "policy", x: 470, y: 490, risk: 85, status: "critical", meta: "CIS 2.1.3" },
  { id: "pol-ssh", label: "SSH Restrict", type: "policy", x: 620, y: 490, risk: 15, status: "secure", meta: "Hardened" },
]

export const twinEdges: TwinEdge[] = [
  { from: "internet", to: "edge-fw", label: "outside", trust: "untrusted", protocol: "IPSec/SSL" },
  { from: "edge-fw", to: "dmz", label: "dmz-in", trust: "semi-trusted", protocol: "TCP/UDP" },
  { from: "dmz", to: "core-sw", label: "trunk", trust: "semi-trusted", protocol: "802.1Q" },
  { from: "core-sw", to: "inside", label: "inside-vlan", trust: "trusted", protocol: "TCP/UDP" },
  { from: "core-sw", to: "mgmt", label: "mgmt-vlan", trust: "trusted", protocol: "TCP 22/443" },
  { from: "dc-fg", to: "inside", label: "inside-route", trust: "trusted", protocol: "TCP/UDP" },
  { from: "wan-mx", to: "edge-fw", label: "wan-uplink", trust: "semi-trusted", protocol: "BGP" },
  { from: "edge-fw", to: "svc-vpn", label: "terminates", trust: "semi-trusted", protocol: "TLS" },
  { from: "core-sw", to: "svc-telnet", label: "exposes", trust: "untrusted", protocol: "TCP 23" },
  { from: "core-sw", to: "svc-ssh", label: "permits", trust: "trusted", protocol: "TCP 22" },
  { from: "wan-mx", to: "svc-snmp", label: "polls", trust: "untrusted", protocol: "UDP 161" },
  { from: "dc-fg", to: "svc-https", label: "serves", trust: "trusted", protocol: "TCP 443" },
  { from: "core-sw", to: "svc-ntp", label: "syncs", trust: "semi-trusted", protocol: "UDP 123" },
  { from: "dc-fg", to: "svc-syslog", label: "forwards", trust: "trusted", protocol: "UDP 514" },
  { from: "pol-anyany", to: "edge-fw", label: "applies to", trust: "untrusted", protocol: "Policy" },
  { from: "pol-telnet", to: "core-sw", label: "applies to", trust: "untrusted", protocol: "Policy" },
  { from: "pol-snmp", to: "wan-mx", label: "applies to", trust: "untrusted", protocol: "Policy" },
  { from: "pol-ssh", to: "dc-fg", label: "applies to", trust: "trusted", protocol: "Policy" },
]

// ──────────────────────────────────────────────────────────────────────────────
// 2. WHAT-IF SECURITY SIMULATOR
// ──────────────────────────────────────────────────────────────────────────────

export type SimulationScenario = {
  id: string
  name: string
  device: string
  vendor: Vendor
  description: string
  beforeRisk: number
  afterRisk: number
  beforeCompliance: number
  afterCompliance: number
  affectedRules: { rule: string; framework: string; before: "Pass" | "Fail"; after: "Pass" | "Fail" }[]
  affectedServices: { service: string; before: string; after: string }[]
  exposureDelta: { metric: string; before: string; after: string; improvement: boolean }[]
  beforeConfig: string
  afterConfig: string
  simulated: true
}

export const simulationScenarios: SimulationScenario[] = [
  {
    id: "SIM-001",
    name: "Disable Telnet on core-sw-01",
    device: "core-sw-01",
    vendor: "Cisco",
    description: "Remove Telnet as a management transport and enforce SSHv2 only on all VTY lines.",
    beforeRisk: 82,
    afterRisk: 41,
    beforeCompliance: 84,
    afterCompliance: 92,
    affectedRules: [
      { rule: "NIST AC-17 — Encrypted management", framework: "NIST 800-53", before: "Fail", after: "Pass" },
      { rule: "CIS 4.1 — Restrict management protocols", framework: "CIS v8", before: "Fail", after: "Pass" },
      { rule: "PCI 2.2 — Secure configuration", framework: "PCI DSS 4.0", before: "Fail", after: "Pass" },
      { rule: "ISO A.8.2 — Privileged access", framework: "ISO 27001", before: "Pass", after: "Pass" },
    ],
    affectedServices: [
      { service: "Telnet (TCP 23)", before: "Open on mgmt VLAN", after: "Closed" },
      { service: "SSH (TCP 22)", before: "Optional", after: "Enforced (v2 only)" },
    ],
    exposureDelta: [
      { metric: "Cleartext credential exposure", before: "High", after: "None", improvement: true },
      { metric: "Attack surface (mgmt plane)", before: "2 protocols", after: "1 protocol", improvement: true },
      { metric: "Compliance controls passing", before: "711/833", after: "714/833", improvement: true },
      { metric: "Risk index", before: "82", after: "41", improvement: true },
    ],
    beforeConfig: `line vty 0 4
 transport input telnet ssh
 password 7 08701E1D5D4C
 login
!
no ip ssh version 2`,
    afterConfig: `line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0
!
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3`,
    simulated: true,
  },
  {
    id: "SIM-002",
    name: "Remove Any→Any firewall rule on edge-fw-01",
    device: "edge-fw-01",
    vendor: "Palo Alto",
    description: "Replace the permissive any-any allow rule with explicit zone-based policies.",
    beforeRisk: 74,
    afterRisk: 38,
    beforeCompliance: 79,
    afterCompliance: 88,
    affectedRules: [
      { rule: "CIS 6.4 — Restrict traffic to required ports", framework: "CIS v8", before: "Fail", after: "Pass" },
      { rule: "NIST SC-7 — Boundary protection", framework: "NIST 800-53", before: "Fail", after: "Pass" },
      { rule: "PCI 1.2 — Restrict inbound/outbound traffic", framework: "PCI DSS 4.0", before: "Fail", after: "Pass" },
      { rule: "ISO A.13.1 — Network controls", framework: "ISO 27001", before: "Pass", after: "Pass" },
    ],
    affectedServices: [
      { service: "Outside→Inside", before: "Any-Any Allow", after: "Explicit deny + allow" },
      { service: "Outside→DMZ", before: "Any-Any Allow", after: "HTTP/HTTPS only" },
    ],
    exposureDelta: [
      { metric: "Lateral movement risk", before: "High", after: "Low", improvement: true },
      { metric: "Open ports (outside)", before: "All", after: "80, 443", improvement: true },
      { metric: "Compliance controls passing", before: "711/833", after: "714/833", improvement: true },
      { metric: "Risk index", before: "74", after: "38", improvement: true },
    ],
    beforeConfig: `set security policies from-zone Outside to-zone Inside
  policy any-allow {
      match {
          source-address any;
          destination-address any;
          application any;
      }
      then { permit; }
  }`,
    afterConfig: `set security policies from-zone Outside to-zone Inside
  policy web-only {
      match {
          source-address any;
          destination-address [ web-servers ];
          application [ junos-HTTP junos-HTTPS ];
      }
      then { permit; }
  }
  policy deny-rest {
      match { ... }
      then { reject; }
  }`,
    simulated: true,
  },
  {
    id: "SIM-003",
    name: "Upgrade SNMPv2c to SNMPv3 on wan-mx-04",
    device: "wan-mx-04",
    vendor: "Juniper",
    description: "Remove default community 'public' and provision authenticated SNMPv3.",
    beforeRisk: 71,
    afterRisk: 33,
    beforeCompliance: 82,
    afterCompliance: 90,
    affectedRules: [
      { rule: "CIS 2.1.3 — SNMP community strings", framework: "CIS v8", before: "Fail", after: "Pass" },
      { rule: "NIST AC-17 — Remote access", framework: "NIST 800-53", before: "Fail", after: "Pass" },
      { rule: "PCI 2.1 — Default passwords/strings", framework: "PCI DSS 4.0", before: "Fail", after: "Pass" },
    ],
    affectedServices: [
      { service: "SNMPv2c (UDP 161)", before: "Community 'public'", after: "Removed" },
      { service: "SNMPv3 (UDP 161)", before: "Not configured", after: "SHA + AES-128" },
    ],
    exposureDelta: [
      { metric: "Information disclosure", before: "High", after: "None", improvement: true },
      { metric: "Authentication for polling", before: "None", after: "SHA", improvement: true },
      { metric: "Compliance controls passing", before: "711/833", after: "714/833", improvement: true },
      { metric: "Risk index", before: "71", after: "33", improvement: true },
    ],
    beforeConfig: `snmp {
    community public {
        authorization read-only;
    }
}`,
    afterConfig: `snmp {
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
    simulated: true,
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// 3. ATTACK-PATH EXPLORER
// ──────────────────────────────────────────────────────────────────────────────

export type AttackPathStep = {
  id: string
  kind: "source" | "zone" | "rule" | "destination" | "service"
  label: string
  detail: string
  risk: number
}

export type AttackPath = {
  id: string
  name: string
  severity: Severity
  riskScore: number
  steps: AttackPathStep[]
  why: string
  findingId: string
  mitigation: string
}

export const attackPaths: AttackPath[] = [
  {
    id: "AP-001",
    name: "External Telnet → Credential Theft → Lateral Movement",
    severity: "critical",
    riskScore: 95,
    findingId: "NG-4821",
    why: "Telnet transmits credentials in cleartext. An attacker on the management VLAN can sniff admin passwords, authenticate to core-sw-01, and pivot to internal segments via trunk links.",
    mitigation: "Disable Telnet, enforce SSHv2, segment management VLAN, and enable port-security on access ports.",
    steps: [
      { id: "s1", kind: "source", label: "Internet attacker", detail: "External adversary with network reachability", risk: 90 },
      { id: "s2", kind: "zone", label: "DMZ Zone", detail: "Semi-trusted, exposed via outside zone", risk: 55 },
      { id: "s3", kind: "rule", label: "Any→Any Allow (edge-fw-01)", detail: "CIS 6.4 violation — no explicit deny", risk: 92 },
      { id: "s4", kind: "destination", label: "core-sw-01", detail: "Cisco IOS-XE 17.9, Telnet enabled on mgmt VLAN", risk: 82 },
      { id: "s5", kind: "service", label: "Telnet (TCP 23)", detail: "Cleartext protocol, NIST AC-17 violation", risk: 95 },
      { id: "s6", kind: "destination", label: "Inside Zone", detail: "Trunk link allows VLAN hopping after credential theft", risk: 70 },
    ],
  },
  {
    id: "AP-002",
    name: "SNMP Public → Config Disclosure → Device Takeover",
    severity: "critical",
    riskScore: 88,
    findingId: "NG-4815",
    why: "SNMPv2c with community 'public' allows unauthenticated read of the full running-config, including credentials and topology. An attacker can extract admin hashes and crack them offline.",
    mitigation: "Remove SNMPv2c, provision SNMPv3 with SHA/AES-128, and restrict polling to the NMS subnet only.",
    steps: [
      { id: "s1", kind: "source", label: "Internal adversary", detail: "Any host with reachability to UDP 161", risk: 75 },
      { id: "s2", kind: "zone", label: "Inside Zone", detail: "Trusted zone but SNMP is unrestricted", risk: 40 },
      { id: "s3", kind: "rule", label: "SNMP Public (wan-mx-04)", detail: "CIS 2.1.3 — default community string", risk: 85 },
      { id: "s4", kind: "service", label: "SNMPv2c (UDP 161)", detail: "Read-only with 'public' community", risk: 88 },
      { id: "s5", kind: "destination", label: "wan-mx-04", detail: "Juniper Junos 23.4, full config readable", risk: 80 },
      { id: "s6", kind: "destination", label: "Credential exfiltration", detail: "Admin hashes extracted for offline cracking", risk: 85 },
    ],
  },
  {
    id: "AP-003",
    name: "Permissive Firewall → DMZ Bypass → Internal Access",
    severity: "high",
    riskScore: 78,
    findingId: "NG-4820",
    why: "An any-any allow rule on the outside zone permits traffic to reach internal servers directly, bypassing the DMZ isolation model. This enables lateral movement from compromised DMZ hosts.",
    mitigation: "Replace any-any with explicit allow rules, enforce default deny, and segment DMZ from Inside.",
    steps: [
      { id: "s1", kind: "source", label: "Compromised DMZ host", detail: "Web server exploited via CVE", risk: 70 },
      { id: "s2", kind: "zone", label: "DMZ Zone", detail: "Semi-trusted, should not reach Inside directly", risk: 55 },
      { id: "s3", kind: "rule", label: "Any→Any Allow (edge-fw-01)", detail: "No zone-based filtering, CIS 6.4 fail", risk: 92 },
      { id: "s4", kind: "destination", label: "Inside Zone", detail: "Internal servers reachable", risk: 65 },
      { id: "s5", kind: "service", label: "SMB / RDP", detail: "Internal services exposed to DMZ", risk: 72 },
      { id: "s6", kind: "destination", label: "Domain Controller", detail: "Credential theft via SMB relay", risk: 78 },
    ],
  },
  {
    id: "AP-004",
    name: "Weak VPN TLS → MitM → Session Hijack",
    severity: "high",
    riskScore: 72,
    findingId: "NG-4790",
    why: "GlobalProtect allows TLS 1.1, which is vulnerable to downgrade attacks. A man-in-the-middle attacker can intercept VPN session tokens and hijack authenticated sessions.",
    mitigation: "Disable TLS 1.0/1.1, enforce TLS 1.2+ with strong cipher suites, and enable HSTS.",
    steps: [
      { id: "s1", kind: "source", label: "Network MitM attacker", detail: "ARP spoofing or rogue AP", risk: 60 },
      { id: "s2", kind: "zone", label: "Outside Zone", detail: "VPN endpoint exposed to internet", risk: 50 },
      { id: "s3", kind: "rule", label: "TLS 1.1 permitted (core-fw-02)", detail: "NIST SC-8 violation", risk: 65 },
      { id: "s4", kind: "service", label: "GlobalProtect VPN", detail: "TLS 1.1 downgrade allowed", risk: 72 },
      { id: "s5", kind: "destination", label: "VPN session token", detail: "Intercepted in downgrade attack", risk: 70 },
      { id: "s6", kind: "destination", label: "Internal network", detail: "Attacker enters via hijacked VPN session", risk: 72 },
    ],
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// 4. EXPLAINABLE AI RISK ENGINE
// ──────────────────────────────────────────────────────────────────────────────

export type RiskExplanation = {
  findingId: string
  title: string
  severity: Severity
  riskScore: number
  detected: string
  whyItMatters: string
  potentialImpact: string
  evidence: string[]
  recommendedAction: string
  complianceControl: string
  confidence: number
  factors: { name: string; weight: number; contribution: string }[]
}

export const riskExplanations: RiskExplanation[] = [
  {
    findingId: "NG-4821",
    title: "Telnet enabled on management VLAN",
    severity: "critical",
    riskScore: 95,
    detected: "Transport input on VTY lines includes 'telnet' on core-sw-01",
    whyItMatters: "Telnet transmits all data including credentials in cleartext. Any device on the management VLAN can capture admin passwords with a packet sniffer.",
    potentialImpact: "Credential theft → unauthorized admin access → configuration changes → full device compromise → lateral movement across the network.",
    evidence: [
      "line vty 0 4 → transport input telnet ssh",
      "password 7 08701E1D5D4C (Type 7 reversible encryption)",
      "no ip ssh version 2 (SSHv1 permitted)",
      "No ACL restricting source addresses to VTY lines",
    ],
    recommendedAction: "Remove 'telnet' from transport input, enforce 'ssh' only, enable SSHv2, and apply a management ACL.",
    complianceControl: "NIST 800-53 AC-17 — Remote access shall use encrypted protocols",
    confidence: 98,
    factors: [
      { name: "Cleartext protocol", weight: 35, contribution: "Credentials exposed to interception" },
      { name: "Weak password encryption", weight: 20, contribution: "Type 7 cipher is trivially reversible" },
      { name: "No source restriction", weight: 20, contribution: "Any IP can attempt login" },
      { name: "SSHv1 fallback", weight: 20, contribution: "Downgrade attack surface" },
    ],
  },
  {
    findingId: "NG-4815",
    title: "SNMP v2c community 'public'",
    severity: "critical",
    riskScore: 88,
    detected: "SNMP community string 'public' with read-only authorization on wan-mx-04",
    whyItMatters: "The default community 'public' is universally known. Any attacker with UDP 161 reachability can read the full device configuration, including topology, interfaces, and credential hashes.",
    potentialImpact: "Configuration disclosure → credential extraction → offline cracking → device takeover → persistent access.",
    evidence: [
      "snmp { community public { authorization read-only; } }",
      "No SNMP ACL restricting source addresses",
      "UDP 161 reachable from Inside zone",
      "Running-config includes admin password hashes",
    ],
    recommendedAction: "Remove SNMPv2c communities, provision SNMPv3 with SHA auth and AES-128 privacy, and restrict polling to the NMS subnet.",
    complianceControl: "CIS Benchmark v8 2.1.3 — SNMP community strings must not be default",
    confidence: 95,
    factors: [
      { name: "Default community string", weight: 40, contribution: "Universally known credential" },
      { name: "Config readability", weight: 25, contribution: "Full running-config accessible" },
      { name: "No source ACL", weight: 20, contribution: "Any host can poll" },
      { name: "No encryption", weight: 15, contribution: "Data in cleartext" },
    ],
  },
  {
    findingId: "NG-4820",
    title: "Any-any allow rule on outside zone",
    severity: "critical",
    riskScore: 92,
    detected: "Security policy from-zone Outside to-zone Inside with source any, destination any, application any on edge-fw-01",
    whyItMatters: "A permissive any-any rule permits all traffic from the internet to internal networks, eliminating the firewall's purpose as a boundary control.",
    potentialImpact: "Direct external access to internal servers → exploitation of internal services → data exfiltration → ransomware deployment.",
    evidence: [
      "policy any-allow { match { source-address any; destination-address any; application any; } }",
      "No explicit deny rule after the allow",
      "No address-group or service-group restrictions",
      "Rule position: first in policy list (highest priority)",
    ],
    recommendedAction: "Replace with explicit zone-based policies, define address/service groups, and add a default deny rule.",
    complianceControl: "CIS Benchmark v8 6.4 — Traffic shall be restricted to required ports and destinations",
    confidence: 99,
    factors: [
      { name: "Any-any match", weight: 45, contribution: "No filtering whatsoever" },
      { name: "Cross-zone (Outside→Inside)", weight: 30, contribution: "Internet reaches internal network" },
      { name: "No default deny", weight: 15, contribution: "Implicit permit behavior" },
      { name: "Rule priority", weight: 10, contribution: "Evaluated first, shadows all other rules" },
    ],
  },
  {
    findingId: "NG-4818",
    title: "Admin login without MFA",
    severity: "high",
    riskScore: 75,
    detected: "System admin 'admin' on dc-fg-02 has no two-factor authentication configured",
    whyItMatters: "A single stolen or guessed password grants full administrative control of the firewall. Privileged accounts without MFA are a primary target for credential-based attacks.",
    potentialImpact: "Unauthorized admin access → firewall policy changes → covert rule insertion → persistent backdoor → traffic interception.",
    evidence: [
      'config system admin → edit "admin" → set password ENC xxxx',
      "No 'set two-factor' directive present",
      "accprofile set to 'super_admin' (full privileges)",
      "No trusted-host restriction on admin access",
    ],
    recommendedAction: "Enable FortiToken two-factor for all admin accounts, bind a hardware/mobile token, and restrict trusted hosts.",
    complianceControl: "PCI DSS 4.0 8.3 — All non-console admin access requires multi-factor authentication",
    confidence: 92,
    factors: [
      { name: "No MFA", weight: 40, contribution: "Single factor only" },
      { name: "Super_admin profile", weight: 25, contribution: "Full privileges on compromise" },
      { name: "No trusted-host limit", weight: 20, contribution: "Login from any IP" },
      { name: "Reversible password", weight: 15, contribution: "FortiOS ENC is recoverable" },
    ],
  },
  {
    findingId: "NG-4790",
    title: "GlobalProtect allows TLS 1.1",
    severity: "high",
    riskScore: 72,
    detected: "TLS version configuration on core-fw-02 GlobalProtect gateway permits TLS 1.1",
    whyItMatters: "TLS 1.1 has known vulnerabilities including BEAST and POODLE variants. A man-in-the-middle attacker can downgrade the connection and intercept session data.",
    potentialImpact: "Session token interception → VPN session hijack → unauthorized internal network access → lateral movement.",
    evidence: [
      "GlobalProtect gateway config: set tls-version min 1.0",
      "No HSTS header on VPN portal",
      "Cipher suite includes CBC-mode (vulnerable to POODLE)",
      "No TLS 1.3 enforcement",
    ],
    recommendedAction: "Set minimum TLS version to 1.2, prefer TLS 1.3, remove CBC ciphers, and enable HSTS.",
    complianceControl: "NIST 800-53 SC-8 — Transmission confidentiality and integrity",
    confidence: 90,
    factors: [
      { name: "TLS 1.1 permitted", weight: 35, contribution: "Known downgrade vulnerabilities" },
      { name: "CBC cipher suites", weight: 25, contribution: "POODLE attack surface" },
      { name: "No HSTS", weight: 20, contribution: "First-visit downgrade possible" },
      { name: "No TLS 1.3", weight: 20, contribution: "Missing modern protections" },
    ],
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// 5. UNKNOWN VENDOR LEARNING
// ──────────────────────────────────────────────────────────────────────────────

export type VendorMapping = {
  id: string
  vendorName: string
  rawSyntax: string
  normalizedConcept: string
  securityRule: string
  complianceControl: string
  confidence: number
  reviewStatus: "Pending" | "Reviewed" | "Approved" | "Rejected"
  mappedBy: string
  mappedAt: string
  notes: string
}

export const vendorMappings: VendorMapping[] = [
  {
    id: "VM-001",
    vendorName: "Arista EOS",
    rawSyntax: "management ssh ip access-group MGMT-ACL",
    normalizedConcept: "SSH management access restriction",
    securityRule: "Management plane access control — restrict SSH to authorized subnets",
    complianceControl: "CIS 4.1 — Restrict management protocols",
    confidence: 89,
    reviewStatus: "Approved",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 18, 2026",
    notes: "Syntax maps cleanly to Cisco 'ip access-group' pattern. High confidence.",
  },
  {
    id: "VM-002",
    vendorName: "Arista EOS",
    rawSyntax: "snmp-server community public RO",
    normalizedConcept: "SNMPv2c read-only community",
    securityRule: "SNMP community string check — flag default 'public'",
    complianceControl: "CIS 2.1.3 — SNMP community strings",
    confidence: 94,
    reviewStatus: "Approved",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 18, 2026",
    notes: "Identical to Cisco syntax. Auto-mapped with high confidence.",
  },
  {
    id: "VM-003",
    vendorName: "Check Point GAIA",
    rawSyntax: "set snmp community public read-only",
    normalizedConcept: "SNMPv2c read-only community",
    securityRule: "SNMP community string check — flag default 'public'",
    complianceControl: "CIS 2.1.3 — SNMP community strings",
    confidence: 82,
    reviewStatus: "Reviewed",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 17, 2026",
    notes: "Syntax differs from Cisco/Juniper but semantic match is strong. Reviewed by analyst.",
  },
  {
    id: "VM-004",
    vendorName: "Check Point GAIA",
    rawSyntax: "set ssh server allow-groups admins",
    normalizedConcept: "SSH group-based access restriction",
    securityRule: "Management plane access control — restrict SSH to admin group",
    complianceControl: "NIST AC-17 — Remote access control",
    confidence: 76,
    reviewStatus: "Pending",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 19, 2026",
    notes: "Group-based restriction maps to role-based access. Awaiting human review.",
  },
  {
    id: "VM-005",
    vendorName: "Huawei VRP",
    rawSyntax: "telnet server enable",
    normalizedConcept: "Telnet service enabled",
    securityRule: "Management protocol check — flag Telnet as insecure",
    complianceControl: "NIST AC-17 — Encrypted management",
    confidence: 91,
    reviewStatus: "Approved",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 16, 2026",
    notes: "Direct semantic match. Telnet enabled = insecure management.",
  },
  {
    id: "VM-006",
    vendorName: "Huawei VRP",
    rawSyntax: "acl number 2000 rule permit source any",
    normalizedConcept: "Permissive access control rule",
    securityRule: "Firewall rule check — flag any-source permit",
    complianceControl: "CIS 6.4 — Restrict traffic to required ports",
    confidence: 79,
    reviewStatus: "Pending",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 19, 2026",
    notes: "'source any' maps to permissive rule. Context-dependent — needs review.",
  },
  {
    id: "VM-007",
    vendorName: "HP ArubaOS-CX",
    rawSyntax: "aaa authentication ssh login local",
    normalizedConcept: "SSH local authentication",
    securityRule: "Management authentication — local user database",
    complianceControl: "NIST IA-2 — Authentication",
    confidence: 84,
    reviewStatus: "Reviewed",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 17, 2026",
    notes: "Maps to Cisco 'login local' pattern. Recommend AAA server for production.",
  },
  {
    id: "VM-008",
    vendorName: "HP ArubaOS-CX",
    rawSyntax: "no ip route 0.0.0.0/0 null0",
    normalizedConcept: "Default route null0 (blackhole)",
    securityRule: "Routing security — null route for anti-spoofing",
    complianceControl: "NIST SC-7 — Boundary protection",
    confidence: 68,
    reviewStatus: "Rejected",
    mappedBy: "SecureNorm AI",
    mappedAt: "Mar 15, 2026",
    notes: "Syntax is valid but context is anti-spoofing, not a finding. Rejected by analyst.",
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// 6. SAFE REMEDIATION GATE
// ──────────────────────────────────────────────────────────────────────────────

export type GateStage = "proposed" | "validated" | "impact-checked" | "approved" | "applied" | "verified" | "rejected" | "cancelled"

export type GateItem = {
  id: string
  findingId: string
  title: string
  device: string
  vendor: Vendor
  severity: Severity
  framework: string
  stage: GateStage
  syntaxValid: boolean
  syntaxReport: string
  impactReport: string
  approver: string | null
  approvedAt: string | null
  beforeConfig: string
  afterConfig: string
  rollbackConfig: string
  verified: boolean
  verificationResult: string
  rejectedBy: string | null
  rejectedAt: string | null
  rejectionReason: string | null
  cancelledBy: string | null
  cancelledAt: string | null
  cancellationReason: string | null
}

export const gateItems: GateItem[] = [
  {
    id: "GATE-001",
    findingId: "NG-4821",
    title: "Disable Telnet, enforce SSHv2 on core-sw-01",
    device: "core-sw-01",
    vendor: "Cisco",
    severity: "critical",
    framework: "NIST AC-17",
    stage: "proposed",
    syntaxValid: true,
    syntaxReport: "Syntax validated against Cisco IOS-XE 17.9 parser. 0 errors, 0 warnings. All commands recognized.",
    impactReport: "Impact: Low. Removes cleartext management protocol. No production services depend on Telnet. SSH access preserved. 3 VTY lines affected.",
    approver: null,
    approvedAt: null,
    beforeConfig: `line vty 0 4
 transport input telnet ssh
 password 7 08701E1D5D4C
 login`,
    afterConfig: `line vty 0 4
 transport input ssh
 login local
 exec-timeout 5 0
!
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3`,
    rollbackConfig: `no ip ssh version 2
line vty 0 4
 transport input telnet ssh
 password 7 08701E1D5D4C
 login
 no exec-timeout`,
    verified: false,
    verificationResult: "Pending — not yet applied.",
    rejectedBy: null,
    rejectedAt: null,
    rejectionReason: null,
    cancelledBy: null,
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: "GATE-002",
    findingId: "NG-4815",
    title: "Upgrade SNMPv2c to SNMPv3 on wan-mx-04",
    device: "wan-mx-04",
    vendor: "Juniper",
    severity: "critical",
    framework: "CIS 2.1.3",
    stage: "validated",
    syntaxValid: true,
    syntaxReport: "Syntax validated against Junos 23.4 parser. 0 errors. SNMPv3 USM user configuration recognized.",
    impactReport: "Impact: Medium. Removes SNMPv2c polling. NMS must be reconfigured to use SNMPv3 credentials. Brief monitoring gap expected during cutover.",
    approver: null,
    approvedAt: null,
    beforeConfig: `snmp {
    community public {
        authorization read-only;
    }
}`,
    afterConfig: `snmp {
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
    rollbackConfig: `delete snmp v3
set snmp community public authorization read-only`,
    verified: false,
    verificationResult: "Pending — not yet applied.",
    rejectedBy: null,
    rejectedAt: null,
    rejectionReason: null,
    cancelledBy: null,
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: "GATE-003",
    findingId: "NG-4820",
    title: "Replace any-any rule with explicit policies on edge-fw-01",
    device: "edge-fw-01",
    vendor: "Palo Alto",
    severity: "critical",
    framework: "CIS 6.4",
    stage: "impact-checked",
    syntaxValid: true,
    syntaxReport: "Syntax validated against PAN-OS 11.1 parser. 0 errors. Zone-based policy structure recognized.",
    impactReport: "Impact: High. Removes blanket permit. All existing flows must be documented and explicitly allowed. Risk of service interruption if address-groups are incomplete. Recommend maintenance window.",
    approver: null,
    approvedAt: null,
    beforeConfig: `set security policies from-zone Outside to-zone Inside
  policy any-allow {
      match { source-address any; destination-address any; application any; }
      then { permit; }
  }`,
    afterConfig: `set security policies from-zone Outside to-zone Inside
  policy web-only {
      match { source-address any; destination-address [ web-servers ]; application [ HTTP HTTPS ]; }
      then { permit; }
  }
  policy deny-rest {
      match { source-address any; destination-address any; application any; }
      then { reject; }
  }`,
    rollbackConfig: `delete security policies from-zone Outside to-zone Inside policy deny-rest
set security policies from-zone Outside to-zone Inside policy any-allow
  match { source-address any; destination-address any; application any; }
  then { permit; }`,
    verified: false,
    verificationResult: "Pending — not yet applied.",
    rejectedBy: null,
    rejectedAt: null,
    rejectionReason: null,
    cancelledBy: null,
    cancelledAt: null,
    cancellationReason: null,
  },
  {
    id: "GATE-004",
    findingId: "NG-4818",
    title: "Enable MFA for admin on dc-fg-02",
    device: "dc-fg-02",
    vendor: "Fortinet",
    severity: "high",
    framework: "PCI DSS 8.3",
    stage: "proposed",
    syntaxValid: false,
    syntaxReport: "Syntax check pending. FortiToken serial must be provisioned before validation can complete.",
    impactReport: "Impact assessment pending. All admin sessions will require token after change. Ensure tokens are enrolled before applying.",
    approver: null,
    approvedAt: null,
    beforeConfig: `config system admin
    edit "admin"
        set accprofile "super_admin"
        set password ENC xxxx
    next
end`,
    afterConfig: `config system admin
    edit "admin"
        set accprofile "super_admin"
        set two-factor fortitoken
        set fortitoken "FTKMOB0000000000"
        set email-to "soc@corp.example"
    next
end`,
    rollbackConfig: `config system admin
    edit "admin"
        unset two-factor
        unset fortitoken
        unset email-to
    next
end`,
    verified: false,
    verificationResult: "Pending — not yet applied.",
    rejectedBy: null,
    rejectedAt: null,
    rejectionReason: null,
    cancelledBy: null,
    cancelledAt: null,
    cancellationReason: null,
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// 7. COMPLIANCE EVIDENCE CHAIN
// ──────────────────────────────────────────────────────────────────────────────

export type EvidenceStep = {
  step: number
  label: string
  detail: string
  timestamp: string
  status: "collected" | "normalized" | "detected" | "mapped" | "remediated" | "verified"
  data: string
}

export type EvidenceChain = {
  id: string
  findingId: string
  framework: string
  control: string
  device: string
  vendor: Vendor
  severity: Severity
  status: "Open" | "In Progress" | "Remediated" | "Verified"
  steps: EvidenceStep[]
}

export const evidenceChains: EvidenceChain[] = [
  {
    id: "EV-001",
    findingId: "NG-4821",
    framework: "NIST 800-53",
    control: "AC-17 — Remote access encryption",
    device: "core-sw-01",
    vendor: "Cisco",
    severity: "critical",
    status: "Verified",
    steps: [
      {
        step: 1,
        label: "Raw Configuration Collected",
        detail: "Running-config extracted via SSH session to core-sw-01",
        timestamp: "Mar 19, 2026 · 06:01:14",
        status: "collected",
        data: `line vty 0 4
 transport input telnet ssh
 password 7 08701E1D5D4C
 login
!
no ip ssh version 2`,
      },
      {
        step: 2,
        label: "Syntax Normalized",
        detail: "Cisco IOS-XE config normalized to SecureNorm intermediate representation",
        timestamp: "Mar 19, 2026 · 06:01:22",
        status: "normalized",
        data: `normalized:
  entity: vty_lines
  transport: [telnet, ssh]
  password_encryption: type7
  ssh_version: undefined (defaults to v1)
  source_acl: none`,
      },
      {
        step: 3,
        label: "Detection Rule Evaluated",
        detail: "Rule NIST-AC-17-001: 'Management transport must not include cleartext protocols'",
        timestamp: "Mar 19, 2026 · 06:01:28",
        status: "detected",
        data: `rule: NIST-AC-17-001
condition: 'telnet' in transport_inputs
result: FAIL
evidence: transport input telnet ssh`,
      },
      {
        step: 4,
        label: "Control Mapping",
        detail: "Finding mapped to NIST 800-53 Rev.5 AC-17 (a)",
        timestamp: "Mar 19, 2026 · 06:01:31",
        status: "mapped",
        data: `framework: NIST 800-53 Rev.5
control: AC-17 (a) — Remote access uses encrypted protocols
requirement: FIPS 140-2 validated encryption
finding_id: NG-4821`,
      },
      {
        step: 5,
        label: "Remediation Generated",
        detail: "SecureNorm AI generated vendor-native fix with 98% confidence",
        timestamp: "Mar 19, 2026 · 06:01:36",
        status: "remediated",
        data: `fix_id: REM-4821
confidence: 98%
changes:
  - remove 'telnet' from transport input
  - set 'transport input ssh'
  - enable 'ip ssh version 2'
  - set 'exec-timeout 5 0'`,
      },
      {
        step: 6,
        label: "Verification Re-scan",
        detail: "Post-remediation scan confirms NIST AC-17 now PASS on core-sw-01",
        timestamp: "Mar 19, 2026 · 09:22:08",
        status: "verified",
        data: `scan_id: SCAN-20260319-05
device: core-sw-01
rule: NIST-AC-17-001
result: PASS
telnet_detected: false
ssh_version: 2
risk_delta: -41`,
      },
    ],
  },
  {
    id: "EV-002",
    findingId: "NG-4815",
    framework: "CIS Benchmark v8",
    control: "2.1.3 — SNMP community strings",
    device: "wan-mx-04",
    vendor: "Juniper",
    severity: "critical",
    status: "Remediated",
    steps: [
      {
        step: 1,
        label: "Raw Configuration Collected",
        detail: "Running-config extracted via NETCONF session to wan-mx-04",
        timestamp: "Mar 19, 2026 · 06:01:18",
        status: "collected",
        data: `snmp {
    community public {
        authorization read-only;
    }
}`,
      },
      {
        step: 2,
        label: "Syntax Normalized",
        detail: "Junos 23.4 config normalized to SecureNorm intermediate representation",
        timestamp: "Mar 19, 2026 · 06:01:25",
        status: "normalized",
        data: `normalized:
  entity: snmp_community
  community: public
  authorization: read-only
  version: v2c
  source_acl: none`,
      },
      {
        step: 3,
        label: "Detection Rule Evaluated",
        detail: "Rule CIS-2.1.3-001: 'SNMP community must not be default'",
        timestamp: "Mar 19, 2026 · 06:01:30",
        status: "detected",
        data: `rule: CIS-2.1.3-001
condition: community in ['public', 'private']
result: FAIL
evidence: community public`,
      },
      {
        step: 4,
        label: "Control Mapping",
        detail: "Finding mapped to CIS Benchmark v8 2.1.3",
        timestamp: "Mar 19, 2026 · 06:01:33",
        status: "mapped",
        data: `framework: CIS Benchmark v8
control: 2.1.3 — SNMP community strings
requirement: No default community strings
finding_id: NG-4815`,
      },
      {
        step: 5,
        label: "Remediation Generated",
        detail: "SecureNorm AI generated SNMPv3 replacement with 95% confidence",
        timestamp: "Mar 19, 2026 · 06:01:38",
        status: "remediated",
        data: `fix_id: REM-4815
confidence: 95%
changes:
  - remove community 'public'
  - provision SNMPv3 USM user
  - set SHA auth + AES-128 privacy
  - restrict polling to NMS subnet`,
      },
      {
        step: 6,
        label: "Verification Re-scan",
        detail: "Awaiting post-remediation verification scan",
        timestamp: "Pending",
        status: "verified",
        data: `scan_id: pending
status: not yet verified`,
      },
    ],
  },
  {
    id: "EV-003",
    findingId: "NG-4820",
    framework: "CIS Benchmark v8",
    control: "6.4 — Restrict traffic to required ports",
    device: "edge-fw-01",
    vendor: "Palo Alto",
    severity: "critical",
    status: "In Progress",
    steps: [
      {
        step: 1,
        label: "Raw Configuration Collected",
        detail: "Running-config extracted via API session to edge-fw-01",
        timestamp: "Mar 19, 2026 · 06:01:12",
        status: "collected",
        data: `set security policies from-zone Outside to-zone Inside
  policy any-allow {
      match { source-address any; destination-address any; application any; }
      then { permit; }
  }`,
      },
      {
        step: 2,
        label: "Syntax Normalized",
        detail: "PAN-OS 11.1 config normalized to SecureNorm intermediate representation",
        timestamp: "Mar 19, 2026 · 06:01:20",
        status: "normalized",
        data: `normalized:
  entity: security_policy
  from_zone: Outside
  to_zone: Inside
  source: any
  destination: any
  application: any
  action: permit`,
      },
      {
        step: 3,
        label: "Detection Rule Evaluated",
        detail: "Rule CIS-6.4-001: 'No any-any permit rules across zones'",
        timestamp: "Mar 19, 2026 · 06:01:26",
        status: "detected",
        data: `rule: CIS-6.4-001
condition: source == any AND destination == any AND action == permit
result: FAIL
evidence: any-allow policy Outside→Inside`,
      },
      {
        step: 4,
        label: "Control Mapping",
        detail: "Finding mapped to CIS Benchmark v8 6.4 and NIST SC-7",
        timestamp: "Mar 19, 2026 · 06:01:29",
        status: "mapped",
        data: `framework: CIS Benchmark v8
control: 6.4 — Restrict traffic
secondary: NIST SC-7 — Boundary protection
finding_id: NG-4820`,
      },
      {
        step: 5,
        label: "Remediation Generated",
        detail: "SecureNorm AI generated zone-based policy replacement with 99% confidence",
        timestamp: "Mar 19, 2026 · 06:01:35",
        status: "remediated",
        data: `fix_id: REM-4820
confidence: 99%
changes:
  - replace any-allow with web-only policy
  - add explicit deny-rest policy
  - define address-group web-servers
  - restrict application to HTTP/HTTPS`,
      },
      {
        step: 6,
        label: "Verification Re-scan",
        detail: "Remediation pending approval — verification not started",
        timestamp: "Pending",
        status: "verified",
        data: `scan_id: pending
status: awaiting gate approval`,
      },
    ],
  },
]
