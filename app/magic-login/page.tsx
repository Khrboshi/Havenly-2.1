// app/magic-login/page.tsx
import { sendMagicLink } from "./sendMagicLinkAction";

type MagicLoginPageProps = {
  searchParams?: {
    redirectedFrom?: string;
  };
};

export default function MagicLoginPage({ searchParams }: MagicLoginPageProps) {
  const redirectTo = searchParams?.redirectedFrom || "/dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      {/* MAIN CONTENT CENTERED */}
      <main className="flex flex-grow items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-hvn-card bg-hvn-bg-elevated/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.85)] backdrop-blur-sm">
          <h1 className="text-center text-2xl font-semibold text-hvn-text-primary">
            Sign in to Havenly
          </h1>

          <p className="mt-2 text-center text-sm text-hvn-text-muted">
            We will send you a secure one-time login link.
          </p>

          <form action={sendMagicLink} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-hvn-text-secondary"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-xl border border-hvn-subtle/60 bg-hvn-bg-soft/80 px-3 py-2 text-sm text-hvn-text-primary outline-none transition placeholder:text-hvn-text-muted focus:border-hvn-accent-mint focus:ring-2 focus:ring-hvn-accent-mint/70"
                placeholder="you@example.com"
              />

              <input type="hidden" name="redirectTo" value={redirectTo} />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-hvn-accent-mint px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/25 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hvn-accent-mint focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Send Magic Link
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-hvn-text-muted">
            You will be redirected to{" "}
            <span className="font-semibold text-hvn-text-secondary">
              {redirectTo}
            </span>{" "}
            after signing in.
          </p>
        </div>
      </main>
      {/* FOOTER is handled by RootLayout */}
    </div>
  );
}
