import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="bg-gradient-to-r from-[#1a2a6c] to-[#2d4373] text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center text-white font-bold">SP</div>
            <div>
              <h1 className="text-lg font-semibold">Student Performance</h1>
              <p className="text-xs text-white/90">Prediction & Early Warning</p>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-white/90 hover:text-white text-sm">Sign in</Link>
            <Link href="/register" className="ml-2 bg-white text-[#1a2a6c] px-4 py-1.5 rounded-md text-sm font-medium hover:opacity-90">Create account</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a2a6c] leading-tight">Make informed decisions with early academic insights</h2>
          <p className="mt-4 text-gray-600 text-lg max-w-xl">Predict student outcomes, identify at-risk learners early, and deliver targeted interventions — all in one place.</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="inline-flex items-center gap-2 bg-[#1a2a6c] text-white px-6 py-3 rounded-lg shadow hover:bg-[#162048]">
              Get Started
            </Link>
            <Link href="/instructor" className="inline-flex items-center gap-2 border border-[#1a2a6c] text-[#1a2a6c] px-5 py-3 rounded-lg hover:bg-[#f6f8ff]">
              Instructor Dashboard
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e6eefc]">
              <p className="text-sm text-gray-500">Students monitored</p>
              <p className="text-2xl font-bold text-[#1a2a6c] mt-2">1,280</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e6eefc]">
              <p className="text-sm text-gray-500">Predicted pass rate</p>
              <p className="text-2xl font-bold text-[#1a2a6c] mt-2">78%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e6eefc]">
              <p className="text-sm text-gray-500">Cohorts</p>
              <p className="text-2xl font-bold text-[#1a2a6c] mt-2">8</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <div className="w-full max-w-md bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-[#e6eefc]">
            <img src="/globe.svg" alt="Illustration" className="w-full h-48 object-contain" />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Visualize trends, drill into cohorts, and export reports</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-semibold text-[#1a2a6c] text-center">Key Features</h3>
          <p className="text-center text-gray-600 mt-2">Everything instructors need to support student success</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6eefc]">
              <h4 className="font-semibold text-[#1a2a6c]">Early Warning</h4>
              <p className="text-sm text-gray-600 mt-2">Automated risk detection flags students who need attention, with probability scores and notes.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6eefc]">
              <h4 className="font-semibold text-[#1a2a6c]">Cohort Insights</h4>
              <p className="text-sm text-gray-600 mt-2">Compare performance across cohorts and track progress toward goals.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-[#e6eefc]">
              <h4 className="font-semibold text-[#1a2a6c]">Actionable Reports</h4>
              <p className="text-sm text-gray-600 mt-2">Export reports and recommended interventions for advisors and program managers.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Student Performance — Built for UB</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#1a2a6c] hover:underline">Sign in</Link>
            <Link href="/register" className="text-sm text-[#1a2a6c] hover:underline">Register</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}