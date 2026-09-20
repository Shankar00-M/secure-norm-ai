import { GitBranch } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { RemediationGateView } from "@/components/dashboard/remediation-gate-view"

export default function RemediationGatePage() {
  return (
    <>
      <PageHeader
        title="Safe Remediation Gate"
        description="A staged approval workflow for every fix: proposed → syntax validated → impact checked → human approval → applied → verified. Includes rollback configuration and before/after diffs."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          <GitBranch className="size-3.5" />
          4 fixes in pipeline
        </span>
      </PageHeader>
      <RemediationGateView />
    </>
  )
}
