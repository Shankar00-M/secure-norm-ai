import { PageHeader } from "@/components/dashboard/ui"
import { SettingsView } from "@/components/dashboard/settings-view"

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure scan schedules, active compliance frameworks, integrations, and notification preferences for your SecureNorm workspace."
      />
      <SettingsView />
    </>
  )
}
