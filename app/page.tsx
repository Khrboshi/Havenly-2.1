export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[var(--brand-bg)]">

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden">
        {/* Background Decorative Shape */}
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute right-[-300px] top-[-200px] w-[700px] h-[700px] rounded-full 
            bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)]
            blur-[140px] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column – Text */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-semibold text-[var(--brand-text)] leading-tight mb-6">
              A calmer mind  
              <span className="text-[var(--brand-primary-dark)]"> starts here</span>.
            </h1>

            <p className="text-lg text-slate-600 max-w-lg mb-8">
              Havenly helps you slow down, reflect gently, and feel lighter in just
              a few minutes a day. Beautifully simple. Scientifically grounded.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/magic-login"
                className="px-6 py-3 rounded-lg text-white text-center font-medium
                  bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)]
                  shadow-lg shadow-emerald-200/40 hover:shadow-emerald-200/60 transition"
              >
                Start Journaling Free
              </a>

              <a
                href="/about"
                className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 
                  text-center font-medium hover:bg-white transition"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Column – Illustration */}
          <div className="flex justify-center">
            <div className="w-[85%] max-w-md">
              <img
                src="/hero-illustration.png"
                alt="Havenly Hero"
                className="w-full drop-shadow-xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">

          <div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--brand-primary-dark)]">Gentle Reflection</h3>
            <p className="text-slate-600">Write only what feels right. No pressure. No judgment.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--brand-primary-dark)]">Your Space</h3>
            <p className="text-slate-600">Beautifully clean design that keeps you grounded and focused.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--brand-primary-dark)]">Premium Insights</h3>
            <p className="text-slate-600">Upgrade anytime to unlock patterns, moods, and deeper analytics.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
