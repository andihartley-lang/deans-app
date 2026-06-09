import Link from "next/link";
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="text-2xl font-semibold">Orbit</div>

        <Link
  href="/auth?view=signin"
  className="rounded-xl border border-white/20 px-5 py-2 hover:bg-white/10 transition"
>
  Sign In
</Link>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-2 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              A calm place to manage life admin.
            </h1>

            <p className="mt-4 text-xl text-indigo-100 max-w-xl">
              Orbit helps you keep track of life's small but important tasks
              without stress, guilt or overwhelm.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
  href="/auth?view=signup"
  className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-2xl hover:bg-yellow-300 transition"
>
  Create New Account
</Link>

              <Link
  href="/auth?view=signin"
  className="border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/10 transition"
>
  Sign In
</Link>
            </div>

            <Link
  href="/auth?view=forgot"
  className="mt-3 inline-block text-sm text-indigo-200 hover:text-white hover:underline transition"
>
  Forgot your password?
</Link>
          </div>

          <div className="space-y-3">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              ⚙️ MOT due in 10 days
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              🦷 Dentist appointment tomorrow
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              🏠 Home insurance renewal in 14 days
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              🐕 Dog medication today
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              🍞 Buy bread
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Why Orbit exists</h2>

        <p className="text-indigo-100 leading-8 text-lg">
          "My dad started forgetting things. Not big things at first,
          appointments, renewals, the small admin that quietly holds life
          together. Every app we tried was too complicated, too alarming, or
          made him feel like a patient. So I built Orbit instead."
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Capture</h3>
            <p className="text-indigo-100">
              Just type what needs doing. Orbit helps organise it automatically.
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Remember</h3>
            <p className="text-indigo-100">
              See what matters next without feeling overwhelmed.
            </p>
          </div>

          <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2">Stay Independent</h3>
            <p className="text-indigo-100">
              Designed to support independence, not create dependency.
            </p>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 py-6 flex justify-center gap-6 border-t border-white/10">
        <Link href="/terms" className="text-sm text-indigo-300 hover:text-white transition">
          Terms of Service
        </Link>
        <Link href="/privacy" className="text-sm text-indigo-300 hover:text-white transition">
          Privacy Policy
        </Link>
      </footer>
    </main>
  );
}
