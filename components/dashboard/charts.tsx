"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const axisStyle = { fill: "#8494ab", fontSize: 11 }

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border/80 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {label ? <div className="mb-1 font-medium text-foreground">{label}</div> : null}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-mono font-medium text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function RiskTrendChart({ data }: { data: { day: string; risk: number; critical: number; high: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="critFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0596b" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#f0596b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c2740" vertical={false} />
          <XAxis dataKey="day" tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="risk"
            name="Risk index"
            stroke="#2dd4bf"
            strokeWidth={2}
            fill="url(#riskFill)"
          />
          <Area
            type="monotone"
            dataKey="critical"
            name="Critical"
            stroke="#f0596b"
            strokeWidth={2}
            fill="url(#critFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ComplianceSparkline({ data }: { data: { day: string; score: number }[] }) {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="compFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={2} fill="url(#compFill)" />
          <Tooltip content={<ChartTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SeverityDonut({
  data,
}: {
  data: { name: string; value: number; color: string }[]
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div className="relative h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-3xl font-semibold text-foreground">{total}</span>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Findings</span>
      </div>
    </div>
  )
}

export function PostureGauge({ score }: { score: number }) {
  const radius = 70
  const stroke = 12
  const normalized = radius - stroke / 2
  const circumference = normalized * 2 * Math.PI
  const arc = circumference * 0.75
  const offset = arc - (score / 100) * arc
  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[135deg]">
        <circle
          cx="80"
          cy="80"
          r={normalized}
          fill="none"
          stroke="#1c2740"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx="80"
          cy="80"
          r={normalized}
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 6px rgba(45,212,191,0.5))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-semibold text-foreground">{score}</span>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}
