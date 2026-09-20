import { Waypoints } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { AttackPathExplorer } from "@/components/dashboard/attack-path-explorer"

export default function AttackPathsPage() {
  return (
    <>
      <PageHeader
        title="Attack-Path Explorer"
        description="Interactive visualization of how an adversary could chain misconfigurations into a full attack path — from source through zones, rules, and services to destination impact."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#f0596b]/30 bg-[#f0596b]/10 px-3 py-2 text-xs text-[#f0596b]">
          <Waypoints className="size-3.5" />
          4 active paths
        </span>
      </PageHeader>
      <AttackPathExplorer />
    </>
  )
}
