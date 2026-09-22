"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase, type Device, type Finding, type Scan, type Notification, type Settings, type AuditLog, type Remediation, type Report } from "./supabase-client"
import { useAuth } from "./auth-context"

export type AppData = {
  loading: boolean
  refreshing: boolean
  devices: Device[]
  findings: Finding[]
  scans: Scan[]
  remediations: Remediation[]
  reports: Report[]
  notifications: Notification[]
  settings: Settings | null
  auditLogs: AuditLog[]
  postureScore: number
  complianceCoverage: number
  severityCounts: { critical: number; high: number; medium: number; low: number }
  lastScan: Scan | null
}

const emptyData: AppData = {
  loading: true,
  refreshing: false,
  devices: [],
  findings: [],
  scans: [],
  remediations: [],
  reports: [],
  notifications: [],
  settings: null,
  auditLogs: [],
  postureScore: 0,
  complianceCoverage: 0,
  severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
  lastScan: null,
}

export function useAppData() {
  const { profile, tenant } = useAuth()
  const [data, setData] = useState<AppData>(emptyData)

  const loadAll = useCallback(async (showRefreshing = false) => {
    if (!tenant) {
      setData({ ...emptyData, loading: false })
      return
    }
    setData((prev) => ({ ...prev, refreshing: showRefreshing }))

    const [devs, finds, scns, rems, reps, notifs, sets, logs] = await Promise.all([
      supabase.from("devices").select("*").eq("tenant_id", tenant.id).order("created_at", { ascending: true }),
      supabase.from("findings").select("*").eq("tenant_id", tenant.id).order("detected_at", { ascending: false }),
      supabase.from("scans").select("*").eq("tenant_id", tenant.id).order("started_at", { ascending: false }),
      supabase.from("remediations").select("*").eq("tenant_id", tenant.id).order("created_at", { ascending: false }),
      supabase.from("reports").select("*").eq("tenant_id", tenant.id).order("generated_at", { ascending: false }),
      supabase.from("notifications").select("*").eq("tenant_id", tenant.id).order("created_at", { ascending: false }),
      supabase.from("settings").select("*").eq("tenant_id", tenant.id).maybeSingle(),
      supabase.from("audit_logs").select("*").eq("tenant_id", tenant.id).order("created_at", { ascending: false }).limit(100),
    ])

    const devices = devs.data ?? []
    const findings = finds.data ?? []
    const scans = scns.data ?? []
    const remediations = rems.data ?? []
    const reports = reps.data ?? []
    const notifications = notifs.data ?? []
    const settings = sets.data as Settings | null
    const auditLogs = logs.data ?? []

    const severityCounts = {
      critical: findings.filter((f) => f.severity === "critical").length,
      high: findings.filter((f) => f.severity === "high").length,
      medium: findings.filter((f) => f.severity === "medium").length,
      low: findings.filter((f) => f.severity === "low").length,
    }

    const completedScans = scans.filter((s) => s.status === "completed" && s.posture_score !== null)
    const postureScore = completedScans.length > 0
      ? completedScans[0].posture_score!
      : devices.length > 0
        ? Math.round(devices.reduce((sum, d) => sum + d.posture, 0) / devices.length)
        : 0

    const complianceCoverage = postureScore

    const lastScan = scans.find((s) => s.status === "completed") ?? scans[0] ?? null

    setData({
      loading: false,
      refreshing: false,
      devices,
      findings,
      scans,
      remediations,
      reports,
      notifications,
      settings,
      auditLogs,
      postureScore,
      complianceCoverage,
      severityCounts,
      lastScan,
    })
  }, [tenant])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return { ...data, refresh: () => loadAll(true) }
}

export async function addNotification(tenantId: string, userId: string | null, type: string, title: string, message: string, link?: string) {
  await supabase.from("notifications").insert({
    tenant_id: tenantId,
    user_id: userId,
    type,
    title,
    message,
    link: link ?? null,
  })
}

export async function addAuditLog(tenantId: string, userId: string | null, userName: string | null, action: string, entity?: string, entity_id?: string, details?: Record<string, unknown>) {
  await supabase.from("audit_logs").insert({
    tenant_id: tenantId,
    user_id: userId,
    user_name: userName,
    action,
    entity: entity ?? null,
    entity_id: entity_id ?? null,
    details: details ?? null,
  })
}
