"use client"

import { useState } from "react"
import { Network, Check, X, Search, Plus, Info } from "lucide-react"
import { Card, CardHeader, StatusBadge, Progress } from "./ui"
import { vendorMappings, type VendorMapping } from "@/lib/advanced-data"
import { cn } from "@/lib/utils"

const reviewTone: Record<VendorMapping["reviewStatus"], "teal" | "info" | "warn" | "danger"> = {
  Approved: "teal",
  Reviewed: "info",
  Pending: "warn",
  Rejected: "danger",
}

const reviewIcon: Record<VendorMapping["reviewStatus"], typeof Check> = {
  Approved: Check,
  Reviewed: Check,
  Pending: Info,
  Rejected: X,
}

function MappingRow({ mapping, onClick, active }: { mapping: VendorMapping; onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition",
        active ? "border-primary/40 bg-primary/5" : "border-border/70 bg-card/60 hover:border-border hover:bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted-foreground">{mapping.id}</span>
        <StatusBadge tone={reviewTone[mapping.reviewStatus]}>
          {mapping.reviewStatus}
        </StatusBadge>
      </div>
      <p className="mt-2 font-mono text-xs text-foreground">{mapping.rawSyntax}</p>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
        <span>{mapping.vendorName}</span>
        <span className="size-1 rounded-full bg-border" />
        <span>{mapping.normalizedConcept}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
          <div
            className="h-full rounded-full"
            style={{ width: `${mapping.confidence}%`, backgroundColor: mapping.confidence > 80 ? "#2dd4bf" : mapping.confidence > 60 ? "#fbbf24" : "#f0596b" }}
          />
        </div>
        <span className="font-mono text-xs font-semibold text-foreground">{mapping.confidence}%</span>
      </div>
    </button>
  )
}

export function VendorLearningView() {
  const [selectedId, setSelectedId] = useState(vendorMappings[0].id)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const selected = vendorMappings.find((m) => m.id === selectedId)!

  const filtered = vendorMappings.filter((m) => {
    const q = query.trim().toLowerCase()
    const matchesQuery = !q ||
      m.vendorName.toLowerCase().includes(q) ||
      m.rawSyntax.toLowerCase().includes(q) ||
      m.normalizedConcept.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || m.reviewStatus === statusFilter
    return matchesQuery && matchesStatus
  })

  const stats = {
    total: vendorMappings.length,
    approved: vendorMappings.filter((m) => m.reviewStatus === "Approved").length,
    pending: vendorMappings.filter((m) => m.reviewStatus === "Pending").length,
    rejected: vendorMappings.filter((m) => m.reviewStatus === "Rejected").length,
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Mappings</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-foreground">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Approved</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-primary">{stats.approved}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Pending Review</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-[#fbbf24]">{stats.pending}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Rejected</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-[#f0596b]">{stats.rejected}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader
            title="Vendor Normalization Mappings"
            subtitle="Unknown configuration syntax mapped to normalized security concepts"
            icon={<Network className="size-4" />}
          />
          <div className="flex flex-col gap-3 px-5 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {["all", "Approved", "Reviewed", "Pending", "Rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                    statusFilter === s
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/70 bg-secondary/30 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter mappings…"
                className="h-9 w-full rounded-lg border border-border/80 bg-secondary/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 p-5 pt-0 sm:grid-cols-2">
            {filtered.length > 0 ? (
              filtered.map((m) => (
                <MappingRow key={m.id} mapping={m} active={m.id === selectedId} onClick={() => setSelectedId(m.id)} />
              ))
            ) : (
              <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">No mappings match your filters.</div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Mapping Detail</h3>
            <StatusBadge tone={reviewTone[selected.reviewStatus]}>
              {selected.reviewStatus}
            </StatusBadge>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Vendor</div>
              <div className="mt-0.5 text-sm font-medium text-foreground">{selected.vendorName}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Raw Syntax</div>
              <div className="mt-1 overflow-x-auto scrollbar-thin rounded-lg border border-border/60 bg-[#05080f] p-3">
                <code className="font-mono text-[11px] leading-relaxed text-foreground">{selected.rawSyntax}</code>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Normalized Concept</div>
              <div className="mt-0.5 flex items-center gap-2 text-sm text-foreground">
                <Plus className="size-3 text-muted-foreground" />
                {selected.normalizedConcept}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Security Rule</div>
              <div className="mt-0.5 text-sm text-foreground">{selected.securityRule}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Compliance Control</div>
              <div className="mt-0.5 text-sm text-foreground">{selected.complianceControl}</div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="uppercase tracking-wider text-muted-foreground">Confidence</span>
                <span className="font-mono font-semibold text-foreground">{selected.confidence}%</span>
              </div>
              <Progress value={selected.confidence} color={selected.confidence > 80 ? "#2dd4bf" : selected.confidence > 60 ? "#fbbf24" : "#f0596b"} />
            </div>
            <div className="border-t border-border/50 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mapped by</span>
                <span className="text-foreground">{selected.mappedBy}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Mapped at</span>
                <span className="text-foreground">{selected.mappedAt}</span>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Analyst Notes</div>
              <p className="mt-1 text-xs text-foreground">{selected.notes}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-4 py-3">
            <Info className="size-4 shrink-0 text-[#fbbf24]" />
            <p className="text-xs text-[#fbbf24]">
              <span className="font-semibold">Pattern-based mapping.</span> SecureNorm uses deterministic pattern matching to map unknown vendor syntax to normalized security concepts. Confidence reflects syntactic and semantic similarity — not machine learning.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
