"use client"

import { useState } from "react"
import { Boxes, Info, ShieldAlert, ShieldCheck, Shield } from "lucide-react"
import { Card, CardHeader, StatusBadge } from "./ui"
import { twinNodes, twinEdges, type TwinNode } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

const typeMeta: Record<TwinNode["type"], { color: string; label: string }> = {
  zone: { color: "#818cf8", label: "Zone" },
  device: { color: "#2dd4bf", label: "Device" },
  service: { color: "#38bdf8", label: "Service" },
  policy: { color: "#fbbf24", label: "Policy" },
}

const statusColor: Record<TwinNode["status"], string> = {
  secure: "#2dd4bf",
  warning: "#fbbf24",
  critical: "#f0596b",
}

export function DigitalTwinView() {
  const [selected, setSelected] = useState<TwinNode | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const connectedEdges = (id: string) =>
    twinEdges.filter((e) => e.from === id || e.to === id)

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
      <Card className="overflow-hidden">
        <CardHeader
          title="Security Digital Twin"
          subtitle="Live model of zones, devices, services, and trust relationships"
          icon={<Boxes className="size-4" />}
          action={
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {Object.entries(typeMeta).map(([key, meta]) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  {meta.label}
                </span>
              ))}
            </div>
          }
        />
        <div className="relative bg-[#05080f] p-4">
          <svg viewBox="0 0 820 560" className="w-full" style={{ minHeight: 420 }}>
            <defs>
              <pattern id="twinGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff06" strokeWidth="1" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="820" height="560" fill="url(#twinGrid)" />

            {/* Edges */}
            {twinEdges.map((edge, i) => {
              const from = twinNodes.find((n) => n.id === edge.from)!
              const to = twinNodes.find((n) => n.id === edge.to)!
              const isActive = hovered === edge.from || hovered === edge.to || selected?.id === edge.from || selected?.id === edge.to
              const trustColor = edge.trust === "trusted" ? "#2dd4bf" : edge.trust === "semi-trusted" ? "#fbbf24" : "#f0596b"
              return (
                <g key={i}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={trustColor}
                    strokeWidth={isActive ? 2 : 1}
                    strokeOpacity={isActive ? 0.8 : 0.3}
                    strokeDasharray={edge.trust === "untrusted" ? "4 3" : "none"}
                  />
                  {isActive && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 4}
                      fill={trustColor}
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {twinNodes.map((node) => {
              const meta = typeMeta[node.type]
              const sc = statusColor[node.status]
              const isSelected = selected?.id === node.id
              const isHovered = hovered === node.id
              const radius = node.type === "zone" ? 28 : node.type === "device" ? 22 : 16
              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(node)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle cx={node.x} cy={node.y} r={radius + 6} fill="none" stroke={sc} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="3 2" />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={`${sc}18`}
                    stroke={sc}
                    strokeWidth={isHovered || isSelected ? 2 : 1.2}
                    filter={isHovered || isSelected ? "url(#glow)" : undefined}
                  />
                  <circle cx={node.x} cy={node.y} r={5} fill={sc} />
                  <text
                    x={node.x}
                    y={node.y + radius + 14}
                    fill="#e6edf5"
                    fontSize="10"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                  {node.type === "device" && (
                    <text
                      x={node.x}
                      y={node.y + radius + 26}
                      fill="#8494ab"
                      fontSize="8"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {node.meta}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground">Twin Summary</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total entities</span>
              <span className="font-mono text-sm font-semibold text-foreground">{twinNodes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Trust relationships</span>
              <span className="font-mono text-sm font-semibold text-foreground">{twinEdges.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Critical entities</span>
              <span className="font-mono text-sm font-semibold text-[#f0596b]">
                {twinNodes.filter((n) => n.status === "critical").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Secure entities</span>
              <span className="font-mono text-sm font-semibold text-primary">
                {twinNodes.filter((n) => n.status === "secure").length}
              </span>
            </div>
          </div>
          <div className="mt-4 border-t border-border/50 pt-4">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Info className="size-3" />
              Click any node to inspect its properties and connections.
            </div>
          </div>
        </Card>

        {selected ? (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{selected.label}</h3>
              <StatusBadge tone={selected.status === "critical" ? "danger" : selected.status === "warning" ? "warn" : "teal"}>
                {selected.status}
              </StatusBadge>
            </div>
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground">{typeMeta[selected.type].label}</span>
              </div>
              {selected.vendor && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Vendor</span>
                  <span className="text-foreground">{selected.vendor}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Meta</span>
                <span className="font-mono text-foreground">{selected.meta}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Risk score</span>
                <span className="font-mono font-semibold" style={{ color: statusColor[selected.status] }}>
                  {selected.risk}
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-border/50 pt-4">
              <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Connections</div>
              <div className="space-y-1.5">
                {connectedEdges(selected.id).map((e, i) => {
                  const other = e.from === selected.id ? e.to : e.from
                  const otherNode = twinNodes.find((n) => n.id === other)!
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: e.trust === "trusted" ? "#2dd4bf" : e.trust === "semi-trusted" ? "#fbbf24" : "#f0596b" }}
                      />
                      <span className="text-muted-foreground">{e.label}</span>
                      <span className="text-muted-foreground/50">→</span>
                      <span className="text-foreground">{otherNode.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <Shield className="size-8 text-muted-foreground/40" />
            <p className="mt-3 text-xs text-muted-foreground">Select a node to inspect its security properties and trust relationships.</p>
          </Card>
        )}

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldAlert className="size-4 text-[#f0596b]" />
            Critical Paths
          </h3>
          <div className="mt-3 space-y-2">
            {twinNodes.filter((n) => n.status === "critical").map((n) => (
              <div key={n.id} className="flex items-center gap-2 rounded-lg border border-[#f0596b]/20 bg-[#f0596b]/5 px-3 py-2 text-xs">
                <ShieldAlert className="size-3.5 shrink-0 text-[#f0596b]" />
                <span className="text-foreground">{n.label}</span>
                <span className="ml-auto font-mono text-[#f0596b]">{n.risk}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
