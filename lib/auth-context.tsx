"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase, type Profile, type Tenant } from "./supabase-client"

type AuthState = {
  loading: boolean
  session: { user: { id: string; email: string } } | null
  profile: Profile | null
  tenant: Tenant | null
}

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (params: {
    email: string
    password: string
    fullName: string
    companyName: string
    timezone?: string
  }) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function mapAuthError(message: string | undefined, flow: "signin" | "signup"): string | null {
  if (!message) return null
  const lower = message.toLowerCase()

  if (
    lower.includes("failed to fetch") ||
    lower.includes("load failed") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("fetch")
  ) {
    return "Cannot reach SecureNorm authentication. Check NEXT_PUBLIC_SUPABASE_URL (https://foygjkrmnofenscwwam.supabase.co), NEXT_PUBLIC_SUPABASE_ANON_KEY, and that this Supabase project is active."
  }
  if (lower.includes("invalid login") || lower.includes("invalid credentials") || lower.includes("invalid email or password")) {
    return "Invalid email or password."
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email before signing in."
  }
  if (
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already exists")
  ) {
    return "This email is already registered. Sign in instead."
  }
  if (lower.includes("signup is disabled")) {
    return "Registration is currently disabled in Supabase Auth settings."
  }
  if (lower.includes("password")) {
    return message
  }
  if (flow === "signup" && (lower.includes("database") || lower.includes("row-level") || lower.includes("rls"))) {
    return "Account was created but company/profile setup failed. Check the existing tenant trigger and database policies."
  }
  return message
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    profile: null,
    tenant: null,
  })

  async function loadProfile(userId: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    let tenant: Tenant | null = null
    if (profile) {
      const { data: t } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", profile.tenant_id)
        .maybeSingle()
      tenant = t as Tenant | null
    }

    setState({ loading: false, session: { user: { id: userId, email: profile?.email ?? "" } }, profile: profile as Profile | null, tenant })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user.id)
      } else {
        setState({ loading: false, session: null, profile: null, tenant: null })
      }
    }).catch(() => {
      setState({ loading: false, session: null, profile: null, tenant: null })
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      ;(async () => {
        if (event === "SIGNED_OUT" || !session?.user) {
          setState({ loading: false, session: null, profile: null, tenant: null })
          return
        }
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await loadProfile(session.user.id)
          await supabase.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", session.user.id)
        }
      })()
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: mapAuthError(error?.message, "signin") }
    } catch (err) {
      return { error: mapAuthError(err instanceof Error ? err.message : String(err), "signin") }
    }
  }

  async function signUp(params: {
    email: string
    password: string
    fullName: string
    companyName: string
    timezone?: string
  }) {
    try {
      const { error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            company_name: params.companyName,
            timezone: params.timezone ?? "UTC",
          },
        },
      })
      return { error: mapAuthError(error?.message, "signup") }
    } catch (err) {
      return { error: mapAuthError(err instanceof Error ? err.message : String(err), "signup") }
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut()
    } finally {
      setState({ loading: false, session: null, profile: null, tenant: null })
    }
  }

  async function refreshProfile() {
    if (state.session?.user.id) {
      await loadProfile(state.session.user.id)
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
