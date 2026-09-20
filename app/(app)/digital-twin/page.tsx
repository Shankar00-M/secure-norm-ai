import { Boxes } from "lucide-react"
import { PageHeader } from "@/components/dashboard/ui"
import { DigitalTwinView } from "@/components/dashboard/digital-twin-view"

export default function DigitalTwinPage() {
  return (
    <>
      <PageHeader
        title="Security Digital Twin"
        description="A live visual model of your scanned environment — zones, devices, services, policies, and trust relationships rendered as an interactive graph."
      >
        <span className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
          <Boxes className="size-3.5 text-primary" />
          {20} entities modeled
        </span>
      </PageHeader>
      <DigitalTwinView />
    </>
  )
}
