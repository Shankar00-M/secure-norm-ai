import { Sparkles } from "lucide-react"
import { PageHeader, StatusBadge } from "@/components/dashboard/ui"
import { RemediationView } from "@/components/dashboard/remediation-view"

export default function RemediationPage() {
  return (
    <>
      <PageHeader
        title="AI Remediation"
        description="SecureNorm AI generates vendor-native configuration fixes for every detected issue. Review the before/after diff, then apply or export the remediation."
      >
        <StatusBadge tone="teal">
          <Sparkles className="size-3" />
          18 critical fixes ready
        </StatusBadge>
      </PageHeader>

      <RemediationView />
    </>
  )
}
