import { Workflow } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { PolicyCompilerView } from "@/components/dashboard/policy-compiler-view"

export default function PolicyCompilerPage() {
  return (
    <>
      <PageHeader
        title="Security Intent → Policy Compiler"
        description="Enter a natural-language security intent and SecureNorm compiles it into a normalized policy, then generates equivalent vendor-specific configurations for Cisco, Fortinet, Palo Alto, and Juniper."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
          <Workflow className="size-3.5" />
          4 vendors supported
        </span>
      </PageHeader>
      <PolicyCompilerView />
    </>
  )
}
