import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Tenant = {
  id: string
  name: string
  owner_name: string
  logo_url: string | null
  created_at: string
}

export type Profile = {
  id: string
  tenant_id: string
  email: string
  full_name: string
  role: string
  phone: string | null
  timezone: string
  avatar_url: string | null
  last_login_at: string | null
  created_at: string
}

export type Device = {
  id: string
  tenant_id: string
  hostname: string
  vendor: string
  os_label: string | null
  ip_address: string | null
  device_type: string | null
  posture: number
  online: boolean
  critical_count: number
  high_count: number
  last_scan_at: string | null
  created_at: string
}

export type Finding = {
  id: string
  tenant_id: string
  device_id: string | null
  device_name: string
  vendor: string
  severity: string
  issue: string
  framework: string
  control: string | null
  evidence: string | null
  remediation: string | null
  status: string
  detected_at: string
  created_at: string
}

export type Scan = {
  id: string
  tenant_id: string
  status: string
  device_count: number
  finding_count: number
  posture_score: number | null
  started_at: string
  completed_at: string | null
  created_at: string
}

export type Remediation = {
  id: string
  tenant_id: string
  finding_id: string | null
  device_name: string
  vendor: string
  severity: string
  issue: string
  framework: string
  stage: string
  before_config: string | null
  after_config: string | null
  rollback_config: string | null
  confidence: number | null
  approved_by: string | null
  approved_at: string | null
  rejected_by: string | null
  rejected_at: string | null
  rejection_reason: string | null
  cancelled_by: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  verified: boolean
  verification_result: string | null
  created_at: string
}

export type Report = {
  id: string
  tenant_id: string
  title: string
  type: string
  format: string
  report_data: Record<string, unknown> | null
  generated_at: string
  created_at: string
}

export type Notification = {
  id: string
  tenant_id: string
  user_id: string | null
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  created_at: string
}

export type AuditLog = {
  id: string
  tenant_id: string
  user_id: string | null
  user_name: string | null
  action: string
  entity: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  created_at: string
}

export type Settings = {
  id: string
  tenant_id: string
  automated_scanning: boolean
  scan_cadence: string
  drift_alerts: boolean
  auto_apply_low_risk: boolean
  active_frameworks: string[]
  integrations: Record<string, unknown>
  notification_prefs: Record<string, unknown>
  updated_at: string
}

export type Simulation = {
  id: string
  tenant_id: string
  type: string
  scenario: string
  result: Record<string, unknown> | null
  created_at: string
}

export type EvidenceChainRow = {
  id: string
  tenant_id: string
  finding_id: string
  framework: string
  control: string
  device_name: string
  vendor: string
  severity: string
  status: string
  steps: unknown[]
  created_at: string
}
