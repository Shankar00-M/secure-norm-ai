import { Shield } from "lucide-react"

export function AppFooter() {
  return (
    <footer className="border-t border-border/70 bg-sidebar/50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#0e9488]">
                <Shield className="size-4 text-[#05201d]" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground">
                  SecureNorm <span className="text-primary">AI</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Security Auditor
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              AI-Driven Multi-Vendor Network Security Compliance Auditor
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                Team
              </div>
              <div className="mt-2 text-sm font-medium text-foreground">Team B</div>
              <div className="mt-2 space-y-1">
                {["Mohit", "Shivam", "Ashutosh", "Ashish", "Ayesha", "Shweta"].map((m) => (
                  <div key={m} className="text-xs text-muted-foreground">
                    {m}{m === "Shivam" ? " — Developer" : ""}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                Institution
              </div>
              <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
                NES Ratnam College of<br />Arts, Science &amp; Commerce
              </div>
            </div>

            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                Event
              </div>
              <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Smart India Hackathon 2026
              </div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
                SIH26155
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/50 pt-4 sm:flex-row">
          <p className="text-[11px] text-muted-foreground">
            © 2026 SecureNorm AI · Team B · NES Ratnam College
          </p>
          <p className="text-[11px] text-muted-foreground">
            Built for Smart India Hackathon 2026 · Problem ID SIH26155
          </p>
        </div>
      </div>
    </footer>
  )
}
