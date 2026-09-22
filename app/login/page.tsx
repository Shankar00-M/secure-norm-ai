"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }
    setLoading(true)
    const { error: authError } = await signIn(email, password)
    setLoading(false)
    if (authError) {
      setError(authError)
    } else {
      router.replace("/")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#0e9488] shadow-[0_0_30px_-6px_var(--primary)]">
            <Shield className="size-6 text-[#05201d]" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              SecureNorm <span className="text-primary">AI</span>
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">Network Security Compliance Auditor</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card/70 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground">Sign in to your workspace</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter your company credentials to access the dashboard.</p>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[#f0596b]/30 bg-[#f0596b]/10 px-3 py-2.5 text-sm text-[#f0596b]">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Company Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="h-10 w-full rounded-lg border border-border/80 bg-secondary/40 px-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg border border-border/80 bg-secondary/40 px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-3.5 rounded border-border accent-primary"
                />
                Remember session
              </label>
              <button type="button" className="text-xs text-primary hover:text-primary/80">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            No account yet?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary/80">
              Register your company
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
