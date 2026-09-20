import { Network } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { VendorLearningView } from "@/components/dashboard/vendor-learning-view"

export default function VendorLearningPage() {
  return (
    <>
      <PageHeader
        title="Unknown Vendor Learning"
        description="Map configuration syntax from unsupported or new vendors to normalized security concepts. Each mapping carries a confidence score and human-review status before it enters the rule engine."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          <Network className="size-3.5 text-primary" />
          4 vendors in learning
        </span>
      </PageHeader>
      <VendorLearningView />
    </>
  )
}
