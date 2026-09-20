import type { Severity, Vendor } from "./data"

// ──────────────────────────────────────────────────────────────────────────────
// 1. AUTONOMOUS ATTACK SIMULATION ENGINE
// ──────────────────────────────────────────────────────────────────────────────

export type SimPhase = "entry" | "vulnerability" | "lateral" | "asset"

export type SimStep = {
  id: string
  phase: SimPhase
  label: string
  detail: string
  findingId: string
  device: string
  vendor: Vendor
  riskContribution: number
  technique: string
}

export type AffectedAsset = {
  name: string
  type: string
  impact: string
  status: "compromised" | "at-risk" | "exposed"
}

export type AttackSimulation = {
  id: string
  name: string
  severity: Severity
  overallRisk: number
  remediatedRisk: number
  blastRadius: number
  affectedAssets: AffectedAsset[]
  exploitedWeaknesses: { weakness: string; findingId: string; severity: Severity }[]
  steps: SimStep[]
  remediation: string
  simulated: true
}

export const attackSimulations: AttackSimulation[] = [
  {
    id: "ASM-001",
    name: "External Breach via Telnet → Core Network Compromise",
    severity: "critical",
    overallRisk: 95,
    remediatedRisk: 28,
    blastRadius: 12,
    simulated: true,
    remediation: "Disable Telnet on core-sw-01, enforce SSHv2, segment management VLAN, and apply VTY ACLs. Reduces blast radius from 12 to 2 assets.",
    affectedAssets: [
      { name: "core-sw-01", type: "Core Switch", impact: "Full admin credential theft", status: "compromised" },
      { name: "core-sw-02", type: "Core Switch", impact: "Lateral access via trunk", status: "compromised" },
      { name: "dc-sw-07", type: "Dist Switch", impact: "VLAN hopping", status: "compromised" },
      { name: "dc-fg-02", type: "Firewall", impact: "Config extraction via trunk", status: "at-risk" },
      { name: "edge-fw-01", type: "Edge Firewall", impact: "Policy modification possible", status: "at-risk" },
      { name: "wan-mx-04", type: "WAN Router", impact: "Route table manipulation", status: "at-risk" },
      { name: "Payroll DB", type: "Database Server", impact: "Data exfiltration risk", status: "exposed" },
      { name: "AD Controller", type: "Domain Controller", impact: "Credential dump risk", status: "exposed" },
      { name: "HR App Server", type: "Application Server", impact: "Service disruption", status: "exposed" },
      { name: "File Server", type: "Storage", impact: "Data access", status: "exposed" },
      { name: "Mail Relay", type: "Email Server", impact: "Email interception", status: "exposed" },
      { name: "VPN Concentrator", type: "VPN Gateway", impact: "Session hijack", status: "exposed" },
    ],
    exploitedWeaknesses: [
      { weakness: "Telnet enabled on management VLAN", findingId: "NG-4821", severity: "critical" },
      { weakness: "Any-any allow rule on outside zone", findingId: "NG-4820", severity: "critical" },
      { weakness: "Weak SNMP community 'public'", findingId: "NG-4815", severity: "critical" },
      { weakness: "Root login over SSH permitted", findingId: "NG-4788", severity: "critical" },
    ],
    steps: [
      {
        id: "s1",
        phase: "entry",
        label: "External adversary breaches edge firewall",
        detail: "Any-any allow rule on edge-fw-01 permits unrestricted traffic from Internet to Inside zone",
        findingId: "NG-4820",
        device: "edge-fw-01",
        vendor: "Palo Alto",
        riskContribution: 30,
        technique: "T1190 — Exploit Public-Facing Application",
      },
      {
        id: "s2",
        phase: "vulnerability",
        label: "Telnet session to core-sw-01 management VLAN",
        detail: "Telnet enabled on VTY lines transmits admin credentials in cleartext. Attacker captures password via packet sniffing.",
        findingId: "NG-4821",
        device: "core-sw-01",
        vendor: "Cisco",
        riskContribution: 25,
        technique: "T1040 — Network Sniffing",
      },
      {
        id: "s3",
        phase: "lateral",
        label: "SNMP config extraction from wan-mx-04",
        detail: "Default community 'public' allows unauthenticated read of full running-config, revealing topology and credentials for lateral movement.",
        findingId: "NG-4815",
        device: "wan-mx-04",
        vendor: "Juniper",
        riskContribution: 20,
        technique: "T1087 — Account Discovery",
      },
      {
        id: "s4",
        phase: "lateral",
        label: "Root SSH login to agg-mx-02",
        detail: "Root login over SSH permitted. Attacker uses extracted credentials to gain root-level access to aggregation router.",
        findingId: "NG-4788",
        device: "agg-mx-02",
        vendor: "Juniper",
        riskContribution: 12,
        technique: "T1078 — Valid Accounts",
      },
      {
        id: "s5",
        phase: "asset",
        label: "Critical asset compromise",
        detail: "Attacker reaches Payroll DB and AD Controller via trunk links. Full data exfiltration and persistent access established.",
        findingId: "NG-4821",
        device: "core-sw-01",
        vendor: "Cisco",
        riskContribution: 8,
        technique: "T1005 — Data from Local System",
      },
    ],
  },
  {
    id: "ASM-002",
    name: "VPN Session Hijack → Internal Lateral Movement",
    severity: "high",
    overallRisk: 78,
    remediatedRisk: 22,
    blastRadius: 6,
    simulated: true,
    remediation: "Disable TLS 1.0/1.1 on GlobalProtect, enforce TLS 1.2+, remove CBC ciphers, and enable HSTS. Reduces blast radius from 6 to 1 asset.",
    affectedAssets: [
      { name: "core-fw-02", type: "VPN Gateway", impact: "Session token interception", status: "compromised" },
      { name: "VPN Client Pool", type: "Remote Clients", impact: "Session hijack", status: "compromised" },
      { name: "Inside Zone", type: "Network Segment", impact: "Unauthorized access", status: "at-risk" },
      { name: "File Server", type: "Storage", impact: "Data access via VPN", status: "at-risk" },
      { name: "Mail Relay", type: "Email Server", impact: "Email interception", status: "exposed" },
      { name: "HR App Server", type: "Application Server", impact: "Service access", status: "exposed" },
    ],
    exploitedWeaknesses: [
      { weakness: "GlobalProtect allows TLS 1.1", findingId: "NG-4790", severity: "high" },
      { weakness: "Admin login without MFA", findingId: "NG-4818", severity: "high" },
    ],
    steps: [
      {
        id: "s1",
        phase: "entry",
        label: "Man-in-the-middle on VPN endpoint",
        detail: "GlobalProtect allows TLS 1.1 which is vulnerable to downgrade attacks. Attacker positions between remote client and VPN gateway.",
        findingId: "NG-4790",
        device: "core-fw-02",
        vendor: "Palo Alto",
        riskContribution: 35,
        technique: "T1557 — Adversary-in-the-Middle",
      },
      {
        id: "s2",
        phase: "vulnerability",
        label: "Session token extraction",
        detail: "Downgraded TLS session allows attacker to intercept VPN session tokens and cookies in cleartext.",
        findingId: "NG-4790",
        device: "core-fw-02",
        vendor: "Palo Alto",
        riskContribution: 25,
        technique: "T1539 — Steal Session Cookies",
      },
      {
        id: "s3",
        phase: "lateral",
        label: "Admin login without MFA on dc-fg-02",
        detail: "Hijacked session provides network reachability to internal firewall. Admin account lacks MFA, allowing brute-force or credential reuse.",
        findingId: "NG-4818",
        device: "dc-fg-02",
        vendor: "Fortinet",
        riskContribution: 10,
        technique: "T1110 — Brute Force",
      },
      {
        id: "s4",
        phase: "asset",
        label: "Internal asset access via VPN tunnel",
        detail: "Attacker uses hijacked VPN session to access internal file servers and mail relay. Data exfiltration via encrypted tunnel.",
        findingId: "NG-4790",
        device: "core-fw-02",
        vendor: "Palo Alto",
        riskContribution: 8,
        technique: "T1048 — Exfiltration Over Alternative Protocol",
      },
    ],
  },
  {
    id: "ASM-003",
    name: "DMZ Compromise → Firewall Policy Manipulation",
    severity: "high",
    overallRisk: 72,
    remediatedRisk: 18,
    blastRadius: 5,
    simulated: true,
    remediation: "Replace any-any rule with explicit zone policies, enforce default deny, and segment DMZ from Inside. Reduces blast radius from 5 to 0 assets.",
    affectedAssets: [
      { name: "edge-fw-01", type: "Edge Firewall", impact: "Policy modification", status: "compromised" },
      { name: "DMZ Web Server", type: "Server", impact: "Web shell deployed", status: "compromised" },
      { name: "Inside Zone", type: "Network Segment", impact: "Direct access from DMZ", status: "at-risk" },
      { name: "AD Controller", type: "Domain Controller", impact: "Credential dump risk", status: "exposed" },
      { name: "Payroll DB", type: "Database", impact: "SQL injection risk", status: "exposed" },
    ],
    exploitedWeaknesses: [
      { weakness: "Any-any allow rule on outside zone", findingId: "NG-4820", severity: "critical" },
      { weakness: "Default admin password on branch-fg-11", findingId: "NG-4809", severity: "high" },
    ],
    steps: [
      {
        id: "s1",
        phase: "entry",
        label: "Web server exploitation via any-any rule",
        detail: "Permissive any-any rule allows direct internet access to DMZ web server. Attacker exploits CVE to deploy web shell.",
        findingId: "NG-4820",
        device: "edge-fw-01",
        vendor: "Palo Alto",
        riskContribution: 30,
        technique: "T1190 — Exploit Public-Facing Application",
      },
      {
        id: "s2",
        phase: "vulnerability",
        label: "Default admin password on branch-fg-11",
        detail: "Compromised DMZ host reaches branch firewall via internal network. Default admin credentials allow full access.",
        findingId: "NG-4809",
        device: "branch-fg-11",
        vendor: "Fortinet",
        riskContribution: 25,
        technique: "T1078 — Valid Accounts (Default)",
      },
      {
        id: "s3",
        phase: "lateral",
        label: "Firewall policy modification",
        detail: "Attacker creates covert allow rule on branch-fg-11 to permit persistent access from external C2 server.",
        findingId: "NG-4809",
        device: "branch-fg-11",
        vendor: "Fortinet",
        riskContribution: 10,
        technique: "T1565 — Transmitted Data Manipulation",
      },
      {
        id: "s4",
        phase: "asset",
        label: "Internal asset access",
        detail: "Covert rule allows attacker to reach AD Controller and Payroll DB from external network. Full data exfiltration path established.",
        findingId: "NG-4820",
        device: "edge-fw-01",
        vendor: "Palo Alto",
        riskContribution: 7,
        technique: "T1020 — Automated Exfiltration",
      },
    ],
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// 2. SECURITY INTENT → POLICY COMPILER
// ──────────────────────────────────────────────────────────────────────────────

export type PolicyCondition = {
  field: string
  operator: string
  value: string
}

export type NormalizedPolicy = {
  id: string
  intent: string
  action: "permit" | "deny"
  source: string
  destination: string
  service: string
  port: string
  protocol: string
  conditions: PolicyCondition[]
  priority: number
  zones: { from: string; to: string }
}

export type VendorPolicy = {
  vendor: Vendor
  osLabel: string
  config: string
  explanation: string
}

export type CompiledPolicy = {
  id: string
  intent: string
  normalized: NormalizedPolicy
  vendorPolicies: VendorPolicy[]
  validationNotes: string
  simulated: true
}

export const intentExamples = [
  "Only HR servers can access the payroll database over HTTPS.",
  "Block all Telnet access to the management network.",
  "Allow VPN clients to reach only the inside zone on ports 443 and 3389.",
  "Deny any traffic from the DMZ to the inside zone except HTTP and HTTPS.",
]

export const compiledPolicies: CompiledPolicy[] = [
  {
    id: "POL-001",
    intent: "Only HR servers can access the payroll database over HTTPS.",
    normalized: {
      id: "POL-001",
      intent: "Only HR servers can access the payroll database over HTTPS.",
      action: "permit",
      source: "HR_SERVERS",
      destination: "PAYROLL_DB",
      service: "HTTPS",
      port: "443",
      protocol: "TCP",
      conditions: [
        { field: "source", operator: "in-group", value: "HR_SERVERS" },
        { field: "destination", operator: "in-group", value: "PAYROLL_DB" },
        { field: "application", operator: "equals", value: "HTTPS" },
        { field: "port", operator: "equals", value: "443" },
      ],
      priority: 100,
      zones: { from: "inside", to: "inside" },
    },
    vendorPolicies: [
      {
        vendor: "Cisco",
        osLabel: "IOS-XE 17.9",
        config: `ip access-list extended HR-TO-PAYROLL
 permit tcp object-group HR_SERVERS object-group PAYROLL_DB eq 443
 deny tcp any object-group PAYROLL_DB eq 443
!
class-map type inspect match-any HR-PAYROLL-CMAP
 match access-group name HR-TO-PAYROLL
!
policy-map type inspect HR-PAYROLL-PMAP
 class type inspect HR-PAYROLL-CMAP
  inspect
 class class-default
  drop`,
        explanation: "Extended ACL permits TCP 443 only from HR_SERVERS group to PAYROLL_DB group. Implicit deny blocks all other sources. Zone-based firewall inspects permitted traffic.",
      },
      {
        vendor: "Fortinet",
        osLabel: "FortiOS 7.4",
        config: `config firewall addrgrp
    edit "HR_SERVERS"
        set member "hr-app-01" "hr-app-02" "hr-web-01"
    next
    edit "PAYROLL_DB"
        set member "payroll-db-01"
    next
end
config firewall policy
    edit 1
        set srcintf "inside"
        set dstintf "inside"
        set srcaddr "HR_SERVERS"
        set dstaddr "PAYROLL_DB"
        set service "HTTPS"
        set action accept
        set schedule "always"
        set logtraffic all
    next
    edit 2
        set srcintf "inside"
        set dstintf "inside"
        set srcaddr "all"
        set dstaddr "PAYROLL_DB"
        set service "HTTPS"
        set action deny
    next
end`,
        explanation: "Address groups define HR servers and payroll DB. Policy 1 permits HTTPS from HR group only. Policy 2 explicitly denies HTTPS from any other source to payroll DB.",
      },
      {
        vendor: "Palo Alto",
        osLabel: "PAN-OS 11.1",
        config: `set address-group HR_SERVERS static [ hr-app-01 hr-app-02 hr-web-01 ]
set address-group PAYROLL_DB static [ payroll-db-01 ]
set security policies from-zone inside to-zone inside
  policy hr-to-payroll-https
    match source HR_SERVERS destination PAYROLL_DB application [ SSL ]
    then permit
  policy deny-other-to-payroll
    match source any destination PAYROLL_DB application [ SSL ]
    then deny`,
        explanation: "Static address groups define HR servers and payroll database. Security policy permits SSL (HTTPS) only from HR_SERVERS to PAYROLL_DB. Catch-all deny blocks all other sources.",
      },
      {
        vendor: "Juniper",
        osLabel: "Junos 23.4",
        config: `set security zones security-zone inside address-book address-set HR_SERVERS hr-app-01
set security zones security-zone inside address-book address-set HR_SERVERS hr-app-02
set security zones security-zone inside address-book address-set PAYROLL_DB payroll-db-01
set security policies from-zone inside to-zone inside policy hr-to-payroll-https
  match source-address HR_SERVERS destination-address PAYROLL_DB application junos-HTTPS
  then permit
set security policies from-zone inside to-zone inside policy deny-other-to-payroll
  match source-address any destination-address PAYROLL_DB application junos-HTTPS
  then reject`,
        explanation: "Address sets define HR servers and payroll DB in the inside zone. Policy permits junos-HTTPS from HR_SERVERS to PAYROLL_DB. Reject policy blocks all other sources from reaching payroll DB over HTTPS.",
      },
    ],
    validationNotes: "Policy validated: source and destination groups must exist before policy activation. Implicit deny at end of ACL ensures no bypass. Logging enabled on all rules for audit trail.",
    simulated: true,
  },
  {
    id: "POL-002",
    intent: "Block all Telnet access to the management network.",
    normalized: {
      id: "POL-002",
      intent: "Block all Telnet access to the management network.",
      action: "deny",
      source: "any",
      destination: "MGMT_NETWORK",
      service: "Telnet",
      port: "23",
      protocol: "TCP",
      conditions: [
        { field: "destination", operator: "in-zone", value: "mgmt" },
        { field: "application", operator: "equals", value: "Telnet" },
        { field: "port", operator: "equals", value: "23" },
      ],
      priority: 50,
      zones: { from: "any", to: "mgmt" },
    },
    vendorPolicies: [
      {
        vendor: "Cisco",
        osLabel: "IOS-XE 17.9",
        config: `ip access-list extended BLOCK-TELNET-MGMT
 deny tcp any object-group MGMT_NETWORK eq 23
 permit ip any any
!
line vty 0 4
 access-class BLOCK-TELNET-MGMT in
 transport input ssh`,
        explanation: "Extended ACL denies TCP 23 (Telnet) to the management network. ACL applied to VTY lines as access-class. SSH remains the only permitted management transport.",
      },
      {
        vendor: "Fortinet",
        osLabel: "FortiOS 7.4",
        config: `config firewall addrgrp
    edit "MGMT_NETWORK"
        set member "mgmt-subnet"
    next
end
config firewall policy
    edit 3
        set srcintf "any"
        set dstintf "mgmt"
        set srcaddr "all"
        set dstaddr "MGMT_NETWORK"
        set service "TELNET"
        set action deny
        set logtraffic all
    next
end`,
        explanation: "Address group defines management network subnet. Policy denies Telnet service from any source to management network. All denied traffic is logged for audit.",
      },
      {
        vendor: "Palo Alto",
        osLabel: "PAN-OS 11.1",
        config: `set address-group MGMT_NETWORK static [ mgmt-subnet ]
set security policies from-zone outside to-zone mgmt
  policy block-telnet-mgmt
    match source any destination MGMT_NETWORK application [ telnet ]
    then deny
set security policies from-zone inside to-zone mgmt
  policy block-telnet-mgmt-inside
    match source any destination MGMT_NETWORK application [ telnet ]
    then deny`,
        explanation: "Address group defines management subnet. Two deny policies block Telnet from both outside and inside zones to the management network. Default deny catches remaining traffic.",
      },
      {
        vendor: "Juniper",
        osLabel: "Junos 23.4",
        config: `set security zones security-zone mgmt address-book address-set MGMT_NETWORK mgmt-subnet
set security policies from-zone outside to-zone mgmt policy block-telnet-mgmt
  match source-address any destination-address MGMT_NETWORK application junos-telnet
  then reject
set security policies from-zone inside to-zone mgmt policy block-telnet-mgmt-inside
  match source-address any destination-address MGMT_NETWORK application junos-telnet
  then reject`,
        explanation: "Address set defines management network. Reject policies block Telnet from outside and inside zones. Reject sends TCP RST to source for faster failure detection.",
      },
    ],
    validationNotes: "Policy validated: Telnet (TCP 23) is denied from all zones to management network. Existing SSH access is preserved. No service disruption to encrypted management protocols.",
    simulated: true,
  },
  {
    id: "POL-003",
    intent: "Allow VPN clients to reach only the inside zone on ports 443 and 3389.",
    normalized: {
      id: "POL-003",
      intent: "Allow VPN clients to reach only the inside zone on ports 443 and 3389.",
      action: "permit",
      source: "VPN_CLIENTS",
      destination: "INSIDE_ZONE",
      service: "HTTPS, RDP",
      port: "443, 3389",
      protocol: "TCP",
      conditions: [
        { field: "source", operator: "in-group", value: "VPN_CLIENTS" },
        { field: "destination", operator: "in-zone", value: "inside" },
        { field: "application", operator: "in-list", value: "HTTPS, RDP" },
        { field: "port", operator: "in-list", value: "443, 3389" },
      ],
      priority: 75,
      zones: { from: "vpn", to: "inside" },
    },
    vendorPolicies: [
      {
        vendor: "Cisco",
        osLabel: "IOS-XE 17.9",
        config: `ip access-list extended VPN-TO-INSIDE
 permit tcp object-group VPN_CLIENTS object-group INSIDE_ZONE eq 443
 permit tcp object-group VPN_CLIENTS object-group INSIDE_ZONE eq 3389
 deny ip object-group VPN_CLIENTS any
!
class-map type inspect match-any VPN-INSIDE-CMAP
 match access-group name VPN-TO-INSIDE
!
policy-map type inspect VPN-INSIDE-PMAP
 class type inspect VPN-INSIDE-CMAP
  pass
 class class-default
  drop`,
        explanation: "ACL permits TCP 443 and 3389 from VPN clients to inside zone only. All other VPN traffic is denied. Zone-based firewall passes permitted traffic and drops everything else.",
      },
      {
        vendor: "Fortinet",
        osLabel: "FortiOS 7.4",
        config: `config firewall addrgrp
    edit "VPN_CLIENTS"
        set member "vpn-pool"
    next
end
config firewall policy
    edit 4
        set srcintf "vpn"
        set dstintf "inside"
        set srcaddr "VPN_CLIENTS"
        set dstaddr "all"
        set service "HTTPS" "RDP"
        set action accept
        set logtraffic all
    next
    edit 5
        set srcintf "vpn"
        set dstintf "any"
        set srcaddr "VPN_CLIENTS"
        set dstaddr "all"
        set service "ALL"
        set action deny
    next
end`,
        explanation: "Address group defines VPN client pool. Policy 4 permits HTTPS and RDP from VPN to inside only. Policy 5 denies all other VPN traffic to any destination.",
      },
      {
        vendor: "Palo Alto",
        osLabel: "PAN-OS 11.1",
        config: `set address-group VPN_CLIENTS static [ vpn-pool ]
set security policies from-zone vpn to-zone inside
  policy vpn-to-inside-web-rdp
    match source VPN_CLIENTS destination any application [ SSL Microsoft-RDP ]
    then permit
  policy deny-vpn-other
    match source VPN_CLIENTS destination any application any
    then deny`,
        explanation: "Address group defines VPN client pool. Security policy permits SSL and Microsoft-RDP from VPN to inside zone. Catch-all deny blocks all other VPN traffic.",
      },
      {
        vendor: "Juniper",
        osLabel: "Junos 23.4",
        config: `set security zones security-zone vpn address-book address-set VPN_CLIENTS vpn-pool
set security policies from-zone vpn to-zone inside policy vpn-to-inside-web-rdp
  match source-address VPN_CLIENTS destination-address any application [ junos-HTTPS junos-RDP ]
  then permit
set security policies from-zone vpn to-zone inside policy deny-vpn-other
  match source-address VPN_CLIENTS destination-address any application any
  then reject`,
        explanation: "Address set defines VPN client pool. Policy permits HTTPS and RDP from VPN to inside. Reject policy blocks all other VPN traffic to inside zone.",
      },
    ],
    validationNotes: "Policy validated: VPN clients restricted to HTTPS (443) and RDP (3389) to inside zone only. All other VPN traffic is denied. No access to DMZ or management zones from VPN.",
    simulated: true,
  },
]

// ──────────────────────────────────────────────────────────────────────────────
// 3. AUTONOMOUS SECURITY REASONING ENGINE
// ──────────────────────────────────────────────────────────────────────────────

export type CorrelatedFinding = {
  findingId: string
  title: string
  severity: Severity
  device: string
  vendor: Vendor
  framework: string
  source: string
}

export type AttackChain = {
  id: string
  name: string
  severity: Severity
  rootCause: string
  findings: CorrelatedFinding[]
  attackImpact: string
  recommendedAction: string
  verification: string
  remediationPriority: number
  estimatedRiskReduction: number
}

export type ReasoningModule = {
  name: string
  source: string
  findingsLinked: number
  status: "correlated" | "analyzed" | "pending"
}

export type DecisionSummary = {
  overallPosture: number
  criticalChains: number
  totalFindings: number
  remediationOrder: { priority: number; action: string; impact: string }[]
  executiveSummary: string
}

export const reasoningModules: ReasoningModule[] = [
  { name: "Configuration Scanner", source: "/scanner", findingsLinked: 12, status: "correlated" },
  { name: "Compliance Mapping", source: "/compliance", findingsLinked: 8, status: "correlated" },
  { name: "Risk Engine", source: "/risk-engine", findingsLinked: 5, status: "analyzed" },
  { name: "Attack Path Explorer", source: "/attack-paths", findingsLinked: 4, status: "analyzed" },
  { name: "Remediation Gate", source: "/remediation-gate", findingsLinked: 4, status: "analyzed" },
  { name: "Evidence Chain", source: "/evidence", findingsLinked: 3, status: "correlated" },
  { name: "Digital Twin", source: "/digital-twin", findingsLinked: 20, status: "correlated" },
  { name: "What-If Simulator", source: "/what-if", findingsLinked: 3, status: "analyzed" },
]

export const attackChains: AttackChain[] = [
  {
    id: "CHAIN-001",
    name: "Cleartext Management Chain",
    severity: "critical",
    rootCause: "Telnet enabled on core-sw-01 management VLAN allows credential interception, which combined with permissive firewall rules and weak SNMP provides a full breach path from internet to critical assets.",
    findings: [
      { findingId: "NG-4821", title: "Telnet enabled on management VLAN", severity: "critical", device: "core-sw-01", vendor: "Cisco", framework: "NIST AC-17", source: "Scanner" },
      { findingId: "NG-4820", title: "Any-any allow rule on outside zone", severity: "critical", device: "edge-fw-01", vendor: "Palo Alto", framework: "CIS 6.4", source: "Scanner" },
      { findingId: "NG-4815", title: "SNMP v2c community 'public'", severity: "critical", device: "wan-mx-04", vendor: "Juniper", framework: "CIS 2.1.3", source: "Scanner" },
      { findingId: "NG-4788", title: "Root login over SSH permitted", severity: "critical", device: "agg-mx-02", vendor: "Juniper", framework: "CIS 5.2.8", source: "Scanner" },
    ],
    attackImpact: "Full network compromise: external attacker can capture admin credentials via Telnet, extract device configs via SNMP, gain root access via SSH, and reach all critical assets including payroll DB and AD controller. Blast radius: 12 assets.",
    recommendedAction: "1. Disable Telnet on core-sw-01 (highest priority — removes entry vector). 2. Replace any-any rule on edge-fw-01 with explicit zone policies. 3. Upgrade SNMP to v3 on wan-mx-04. 4. Disable root SSH login on agg-mx-02.",
    verification: "After remediation: re-scan fleet, verify NIST AC-17 PASS on core-sw-01, CIS 6.4 PASS on edge-fw-01, CIS 2.1.3 PASS on wan-mx-04. Run attack simulation to confirm blast radius reduced from 12 to 2 assets.",
    remediationPriority: 1,
    estimatedRiskReduction: 45,
  },
  {
    id: "CHAIN-002",
    name: "VPN Weakness Chain",
    severity: "high",
    rootCause: "GlobalProtect VPN allows TLS 1.1, enabling session downgrade attacks. Combined with admin accounts lacking MFA, this provides a path to VPN session hijack and internal lateral movement.",
    findings: [
      { findingId: "NG-4790", title: "GlobalProtect allows TLS 1.1", severity: "high", device: "core-fw-02", vendor: "Palo Alto", framework: "NIST SC-8", source: "Scanner" },
      { findingId: "NG-4818", title: "Admin login without MFA", severity: "high", device: "dc-fg-02", vendor: "Fortinet", framework: "PCI DSS 8.3", source: "Scanner" },
    ],
    attackImpact: "VPN session hijack via TLS downgrade, followed by brute-force or credential reuse on MFA-less admin accounts. Attacker gains internal network access via encrypted tunnel, reaching file servers and mail relay. Blast radius: 6 assets.",
    recommendedAction: "1. Disable TLS 1.0/1.1 on GlobalProtect, enforce TLS 1.2+. 2. Enable FortiToken MFA on all admin accounts on dc-fg-02. 3. Remove CBC cipher suites and enable HSTS.",
    verification: "After remediation: verify NIST SC-8 PASS on core-fw-02, PCI DSS 8.3 PASS on dc-fg-02. Run VPN configuration scan to confirm TLS 1.2+ only. Attack simulation confirms blast radius reduced from 6 to 1.",
    remediationPriority: 2,
    estimatedRiskReduction: 25,
  },
  {
    id: "CHAIN-003",
    name: "DMZ Bypass Chain",
    severity: "high",
    rootCause: "Permissive any-any firewall rule allows DMZ hosts to reach internal networks directly, bypassing zone isolation. Combined with default admin credentials on branch firewall, this enables policy manipulation and persistent access.",
    findings: [
      { findingId: "NG-4820", title: "Any-any allow rule on outside zone", severity: "critical", device: "edge-fw-01", vendor: "Palo Alto", framework: "CIS 6.4", source: "Scanner" },
      { findingId: "NG-4809", title: "Default admin password unchanged", severity: "high", device: "branch-fg-11", vendor: "Fortinet", framework: "PCI DSS 2.1", source: "Scanner" },
    ],
    attackImpact: "Compromised DMZ host reaches internal servers via any-any rule. Default credentials on branch firewall allow attacker to insert covert allow rules for persistent C2 access. Blast radius: 5 assets.",
    recommendedAction: "1. Replace any-any rule with explicit zone-based policies on edge-fw-01. 2. Change default admin password on branch-fg-11. 3. Enforce default deny between DMZ and inside zones.",
    verification: "After remediation: verify CIS 6.4 PASS on edge-fw-01, PCI DSS 2.1 PASS on branch-fg-11. Confirm no any-any rules exist in policy set. Attack simulation confirms blast radius reduced from 5 to 0.",
    remediationPriority: 3,
    estimatedRiskReduction: 20,
  },
  {
    id: "CHAIN-004",
    name: "Logging Blind Spot Chain",
    severity: "medium",
    rootCause: "Multiple devices have verbose logging disabled or logs not forwarded to SIEM, creating blind spots that would allow an attacker to operate undetected after initial compromise.",
    findings: [
      { findingId: "NG-4804", title: "Verbose logging disabled", severity: "medium", device: "edge-fw-01", vendor: "Palo Alto", framework: "NIST AU-6", source: "Scanner" },
      { findingId: "NG-4802", title: "NTP peers unauthenticated", severity: "medium", device: "wan-mx-01", vendor: "Juniper", framework: "CIS 2.3.2", source: "Scanner" },
    ],
    attackImpact: "Post-compromise activity goes undetected due to disabled verbose logging. Unauthenticated NTP allows time manipulation, which can invalidate log correlation and tamper with forensic evidence.",
    recommendedAction: "1. Enable verbose logging on edge-fw-01 and forward to SIEM. 2. Configure authenticated NTP on all devices. 3. Verify SIEM ingestion of all device logs.",
    verification: "After remediation: verify NIST AU-6 PASS on edge-fw-01, CIS 2.3.2 PASS on wan-mx-01. Confirm SIEM receives logs from all in-scope devices with correct timestamps.",
    remediationPriority: 4,
    estimatedRiskReduction: 10,
  },
]

export const decisionSummary: DecisionSummary = {
  overallPosture: 78,
  criticalChains: 1,
  totalFindings: 12,
  remediationOrder: [
    { priority: 1, action: "Disable Telnet on core-sw-01 (NG-4821)", impact: "Removes primary entry vector. Risk -25. Blast radius 12→2." },
    { priority: 2, action: "Replace any-any rule on edge-fw-01 (NG-4820)", impact: "Restores boundary protection. Risk -15. Blast radius 5→0." },
    { priority: 3, action: "Upgrade SNMPv2c to v3 on wan-mx-04 (NG-4815)", impact: "Eliminates config disclosure. Risk -10." },
    { priority: 4, action: "Disable root SSH on agg-mx-02 (NG-4788)", impact: "Prevents privilege escalation. Risk -5." },
    { priority: 5, action: "Enforce TLS 1.2+ on core-fw-02 (NG-4790)", impact: "Closes VPN downgrade attack. Risk -8." },
    { priority: 6, action: "Enable MFA on dc-fg-02 (NG-4818)", impact: "Protects admin accounts. Risk -7." },
    { priority: 7, action: "Change default password on branch-fg-11 (NG-4809)", impact: "Removes default credential risk. Risk -5." },
    { priority: 8, action: "Enable verbose logging + SIEM forwarding (NG-4804)", impact: "Restores detection capability. Risk -3." },
  ],
  executiveSummary:
    "SecureNorm AI has correlated 12 findings across 8 analysis modules into 4 attack chains. One critical chain (Cleartext Management) provides a full breach path from internet to critical assets with a blast radius of 12 devices. The root cause is Telnet enabled on core-sw-01 combined with a permissive any-any firewall rule on edge-fw-01. Prioritized remediation of the top 4 findings reduces fleet risk by 55% and eliminates the critical attack chain. Estimated time to safe posture: 2 remediation cycles.",
}
