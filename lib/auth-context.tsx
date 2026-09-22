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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signUp(params: {
    email: string
    password: string
    fullName: string
    companyName: string
    timezone?: string
  }) {
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
    return { error: error?.message ?? null }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setState({ loading: false, session: null, profile: null, tenant: null })
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
