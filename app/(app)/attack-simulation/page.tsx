import { Crosshair } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { AttackSimulationView } from "@/components/dashboard/attack-simulation-view"

export default function AttackSimulationPage() {
  return (
    <>
      <PageHeader
        title="Autonomous Attack Simulation Engine"
        description="Simulate full attack paths using existing scanner findings. Model entry points, vulnerabilities, lateral movement, and critical asset impact — with blast radius and risk before/after remediation."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#f0596b]/30 bg-[#f0596b]/10 px-3 py-2 text-xs text-[#f0596b]">
          <Crosshair className="size-3.5" />
          3 simulations ready
        </span>
      </PageHeader>
      <AttackSimulationView />
    </>
  )
}
