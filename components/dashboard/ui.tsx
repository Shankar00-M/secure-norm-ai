import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { severityMeta, type Severity } from "@/lib/data"

export function Card({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card/70 backdrop-blur-sm",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.02)_inset,0_20px_40px_-24px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  className,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5", className)}>
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg border border-border/70 bg-secondary/60 text-primary">
            {icon}
          </div>
        ) : null}
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = severityMeta[severity]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        meta.bg,
        meta.border,
        meta.text,
      )}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  )
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "teal" | "warn" | "danger" | "muted" | "info"
}) {
  const tones: Record<string, string> = {
    neutral: "border-border/80 bg-secondary/60 text-secondary-foreground",
    teal: "border-primary/30 bg-primary/10 text-primary",
    warn: "border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24]",
    danger: "border-[#f0596b]/30 bg-[#f0596b]/10 text-[#f0596b]",
    muted: "border-border/60 bg-transparent text-muted-foreground",
    info: "border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8]",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function Progress({
  value,
  className,
  color = "var(--primary)",
}: {
  value: number
  className?: string
  color?: string
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary/70", className)}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  )
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground text-pretty">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  )
}
