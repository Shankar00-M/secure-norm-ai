import { Brain } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { ReasoningEngineView } from "@/components/dashboard/reasoning-engine-view"

export default function ReasoningPage() {
  return (
    <>
      <PageHeader
        title="Autonomous Security Reasoning Engine"
        description="Master correlation dashboard that links findings across all SecureNorm modules — scanner, compliance, risk engine, attack paths, remediation gate, evidence chain, digital twin, and what-if simulator — into attack chains with root-cause analysis and prioritized remediation."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          <Brain className="size-3.5" />
          8 modules correlated
        </span>
      </PageHeader>
      <ReasoningEngineView />
    </>
  )
}
