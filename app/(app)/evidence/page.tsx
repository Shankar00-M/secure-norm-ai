import { ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { EvidenceChainView } from "@/components/dashboard/evidence-chain-view"

export default function EvidencePage() {
  return (
    <>
      <PageHeader
        title="Compliance Evidence Chain"
        description="For each compliance finding, a tamper-evident trail from raw configuration → normalized rule → detection → control mapping → recommended fix → verification. Auditor-ready with timestamps and status."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          <ShieldCheck className="size-3.5" />
          3 active chains
        </span>
      </PageHeader>
      <EvidenceChainView />
    </>
  )
}
