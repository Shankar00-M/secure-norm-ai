import { Brain } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { RiskEngineView } from "@/components/dashboard/risk-engine-view"

export default function RiskEnginePage() {
  return (
    <>
      <PageHeader
        title="Explainable AI Risk Engine"
        description="For every finding, SecureNorm breaks down what was detected, why it matters, the potential impact, risk factors, evidence, and recommended action — with full transparency into how the risk score is computed."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          <Brain className="size-3.5" />
          Deterministic local logic
        </span>
      </PageHeader>
      <RiskEngineView />
    </>
  )
}
