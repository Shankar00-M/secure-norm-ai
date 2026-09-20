import { FlaskConical } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { WhatIfSimulator } from "@/components/dashboard/what-if-simulator"

export default function WhatIfPage() {
  return (
    <>
      <PageHeader
        title="What-If Security Simulator"
        description="Propose a configuration change and preview its impact on risk score, compliance coverage, affected rules, and exposure — before touching any device."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-3 py-2 text-xs text-[#fbbf24]">
          <FlaskConical className="size-3.5" />
          Simulated results
        </span>
      </PageHeader>
      <WhatIfSimulator />
    </>
  )
}
