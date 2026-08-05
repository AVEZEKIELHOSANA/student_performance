'use client';

// Landing page for the Student Performance Prediction platform.
// Uses useState for the mobile nav toggle, hence 'use client'.
// Swap PRODUCT_NAME / REPO_URL below, and move the Google Fonts <link>
// tags into your root layout.tsx <head> (or next/font) for production.

import { useState } from 'react';
import Link from 'next/link';
import {
  FaChartLine,
  FaBullseye,
  FaLightbulb,
  FaUsers,
  FaUserShield,
  FaFileDownload,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCogs,
  FaCheckCircle,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaGithub,
} from 'react-icons/fa';

const PRODUCT_NAME = 'GradeSight';
const REPO_URL = '#'; // TODO: add your GitHub repo URL

const displayFont = { fontFamily: "'Space Grotesk', sans-serif" };
const monoFont = { fontFamily: "'IBM Plex Mono', monospace" };

function Logomark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 30 L16 20 L22 24 L31 11"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 10.5 L31.5 10.5 L31.5 17"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="30" r="2" fill="currentColor" />
      <circle cx="31" cy="11" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function Eyebrow({ children, className = 'text-[#1a2a6c]/70' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-semibold tracking-[0.14em] uppercase ${className}`} style={monoFont}>
      {children}
    </p>
  );
}

const sectionLinks = [
  { href: '#about', label: 'About' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#impact', label: 'Impact' },
];

const features = [
  {
    icon: FaChartLine,
    title: 'Personalized Prediction',
    desc: 'A predicted letter grade, GPA range, and confidence score generated from 29 academic, lifestyle, and contextual inputs.',
  },
  {
    icon: FaBullseye,
    title: 'What-If Simulator',
    desc: 'Set a target GPA and get a concrete roadmap of exactly which habits to change, and by how much, to reach it.',
  },
  {
    icon: FaLightbulb,
    title: 'Actionable Recommendations',
    desc: 'Every prediction comes with prioritized, specific next steps instead of a bare score.',
  },
  {
    icon: FaUsers,
    title: 'Student Support and Intervention',
    desc: 'Instructors schedule support sessions and track student progress.',
  },
  
  {
    icon: FaFileDownload,
    title: 'Exportable Reports',
    desc: 'Download any prediction or cohort report as a PDF or CSV for advising sessions and records.',
  },
];

const roles = [
  {
    icon: FaUserGraduate,
    title: 'Student',
    items: [
      'Personalized prediction dashboard',
      'GPA range, status & probability breakdown',
      'What-If simulator & prediction history',
    ],
  },
  {
    icon: FaChalkboardTeacher,
    title: 'Instructor',
    items: [
      'Class-wide batch prediction via CSV upload',
      'At-risk roster with flags & notes',
      'Cohort performance distribution charts',
    ],
  },
  
];

const steps = [
  {
    title: 'Share your details',
    desc: '29 guided fields covering academics, daily habits, and home environment — about five minutes.',
  },
  {
    title: 'Get an instant prediction',
    desc: 'A predicted letter grade, GPA range, and confidence score, generated in under two seconds.',
  },
  {
    title: 'Follow the recommendations',
    desc: 'Specific, prioritized actions drawn from whatever is actually holding the prediction down.',
  },
  {
    title: 'Track it all semester',
    desc: 'Prediction history and instructor check-ins keep the plan on course as things change.',
  },
];

const techPills = ['Python', 'scikit-learn', 'FastAPI', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'SMOTE'];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-[#1a2a6c]">
            <Logomark className="w-7 h-7" />
            <span className="text-lg font-bold tracking-tight" style={displayFont}>
              {PRODUCT_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {sectionLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-[#1a2a6c] transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#1a2a6c] transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-[#1a2a6c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#142058] transition-colors"
            >
              Get started
            </Link>
          </div>

          <button
            className="md:hidden text-slate-700 p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4">
            {sectionLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-slate-600 hover:text-[#1a2a6c]"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="bg-[#1a2a6c] text-white text-sm font-semibold px-4 py-2 rounded-lg text-center"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#EEF3FF] to-white pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Prediction Model</Eyebrow>
            <h1
              className="mt-4 text-4xl md:text-5xl font-bold leading-[1.1] text-[#101833]"
              style={displayFont}
            >
              Catch academic risk before the transcript does.
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
              {PRODUCT_NAME} predicts a student&apos;s likely grade months before final exams, using academic,
              lifestyle, and mental health signals, then tells them exactly what to change.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a2a6c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#142058] transition-colors"
              >
                Get started <FaArrowRight size={14} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-[#1a2a6c]/25 text-[#1a2a6c] px-6 py-3 rounded-lg font-semibold hover:bg-[#1a2a6c]/5 transition-colors"
              >
                See how it works
              </a>
            </div>
            
          </div>

          {/* Signature element: prediction preview card */}
          <div className="relative flex justify-center">
            <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#1a2a6c]/10 to-[#E3A548]/15 blur-3xl -z-10" />
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sample Prediction</p>
                <span className="text-xs font-semibold bg-[#E3A548]/10 text-[#946618] px-2.5 py-1 rounded-full">
                  Instant
                </span>
              </div>

              <div className="mt-5 flex items-center gap-5">
                <div className="w-20 h-20 rounded-full border-4 border-[#1F9D65]/20 flex items-center justify-center shrink-0">
                  <span className="text-4xl font-bold text-[#1F9D65]" style={displayFont}>
                    A
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">GPA Range</p>
                  <p className="text-lg font-semibold text-slate-900">3.50 &ndash; 4.00</p>
                  <p className="text-sm text-slate-500 mt-1">Confidence 80%</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                {[
                  { label: 'A', pct: 80, color: '#1F9D65' },
                  { label: 'B', pct: 15, color: '#1a2a6c' },
                  { label: 'C', pct: 3, color: '#94a3b8' },
                  { label: 'D', pct: 1, color: '#cbd5e1' },
                  { label: 'Fail', pct: 1, color: '#D6455B' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="text-xs w-8 text-slate-500" style={monoFont}>
                      {row.label}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-2 rounded-full" style={{ width: `${row.pct}%`, backgroundColor: row.color }} />
                    </div>
                    <span className="text-xs w-9 text-right text-slate-500" style={monoFont}>
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">Illustrative example based on real model output.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-[#10193F] py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-2 gap-8 text-center">
          {[
            { value: '74.5%', label: 'Prediction accuracy' },
            { value: 'ML', label: 'Model' },
           
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl md:text-4xl font-bold text-[#E3A548]" style={displayFont}>
                {s.value}
              </p>
              <p className="text-sm text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / PROBLEM */}
      <section id="about" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Eyebrow>The Problem</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#101833]" style={displayFont}>
              Academic risk is usually caught too late.
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Most institutions rely on exam results to notice a student is struggling, by which point there is
              little room left to intervene. Existing prediction research rarely accounts for the realities of
              higher education in Cameroon, where electricity access, internet connectivity, serious pschological health challenges and family financial
              pressure meaningfully shape academic outcomes.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              {PRODUCT_NAME} was built to close that gap: a predictive model trained on academic indicators
              alongside life and mental features, deployed as a tool students and instructors can
              actually use.
            </p>
            
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Without early prediction</p>
              <p className="mt-2 text-slate-600">
                Struggling students are identified only after failing an exam, when options for support are
                already limited.
              </p>
            </div>
            <div className="flex justify-center text-slate-300">
              <FaArrowRight className="rotate-90" size={16} />
            </div>
            <div className="bg-[#1a2a6c] text-white rounded-xl p-5 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#E3A548]">With {PRODUCT_NAME}</p>
              <p className="mt-2 text-white/90">
                Risk is flagged from day one using academic and contextual signals, while there is still time to
                act.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#F7F9FF] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <Eyebrow>Features</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#101833]" style={displayFont}>
              Everything needed to act early
            </h2>
            <p className="mt-4 text-slate-600">From a single prediction to a full semester of tracking.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-full bg-[#1a2a6c]/8 flex items-center justify-center text-[#1a2a6c] mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <Eyebrow>Who It&apos;s For</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#101833]" style={displayFont}>
              Built for every seat at the table
            </h2>
            <p className="mt-4 text-slate-600">Three roles, three focused experiences, one shared model.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="bg-[#F7F9FF] rounded-2xl p-6 border border-slate-100">
                  <div className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1a2a6c] mb-4">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3">{r.title}</h3>
                  <ul className="space-y-2">
                    {r.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <FaCheckCircle className="text-[#1a2a6c]/60 shrink-0 mt-0.5" size={13} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#F7F9FF] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#101833]" style={displayFont}>
              From input to intervention in four steps
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-4 gap-10 relative">
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-slate-300 -z-0" />
            {steps.map((s, i) => (
              <div key={s.title} className="relative flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full bg-[#1a2a6c] text-white flex items-center justify-center font-bold text-lg ring-4 ring-[#F7F9FF] relative z-10"
                  style={displayFont}
                >
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECH / METHODOLOGY */}
      <section className="bg-[#10193F] py-20 md:py-28 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Eyebrow className="text-[#E3A548]">Under the Hood</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold" style={displayFont}>
              Built on a rigorous ML pipeline
            </h2>
            <p className="mt-5 text-white/70 leading-relaxed">
              Developed using the CRISP-DM framework within an Agile sprint structure. 
            </p>
          </div>
          <div className="flex flex-wrap gap-3 content-start">
            {techPills.map((t) => (
              <span
                key={t}
                className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm text-white/90"
                style={monoFont}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT / RESULTS */}
      <section id="impact" className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <Eyebrow>Results</Eyebrow>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#101833]" style={displayFont}>
              Outperforming the benchmark
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-[#F7F9FF] rounded-2xl p-8 border border-slate-100">
              <p className="text-sm font-semibold text-slate-500 mb-6">Accuracy vs. published benchmark</p>
              <div className="space-y-5">
                
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-900 font-medium">{PRODUCT_NAME} (this study)</span>
                    <span className="text-[#1a2a6c] font-bold" style={monoFont}>74.5%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-3 rounded-full bg-[#1a2a6c]" style={{ width: '74.5%' }} />
                  </div>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-500">
                +5.8 percentage points over the most directly comparable published study, using the same
                algorithm.
              </p>
            </div>

            <div className="bg-[#1a2a6c] text-white rounded-2xl p-8 flex flex-col justify-center gap-6">
              <div>
                <p className="text-4xl font-bold text-[#E3A548]" style={displayFont}>57.14%</p>
                <p className="text-sm text-white/85 mt-2">
                  Fail-class recall, the only one of four models tested that actually caught at-risk students.
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-[#1a2a6c] to-[#0B1230] py-20 text-center text-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold" style={displayFont}>
            Ready to see your own prediction?
          </h2>
          <p className="mt-4 text-white/70">
            Create a free account and get a personalized grade prediction in minutes.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 bg-[#E3A548] text-[#1a2a6c] font-semibold px-8 py-3 rounded-lg hover:brightness-105 transition-all"
          >
            Create free account <FaArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B1230] text-white/70 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 text-white">
              <Logomark className="w-7 h-7" />
              <span className="text-lg font-bold" style={displayFont}>
                {PRODUCT_NAME}
              </span>
            </div>
            <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
              A machine learning early-warning system for student academic performance, built as a B.Eng
              Computer Engineering capstone.
            </p>
            <p className="mt-4 text-xs text-white/40">
              Dept. of Computer Engineering &middot; Faculty of Engineering and Technology &middot; University of
              Buea
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-4">Product</p>
            <div className="flex flex-col gap-3 text-sm">
              {sectionLinks.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-4">Access</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/login" className="hover:text-white transition-colors">
                Student sign in
              </Link>
              <Link href="/instructor" className="hover:text-white transition-colors">
                Instructor dashboard
              </Link>
              
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40 mb-4">Project</p>
            <div className="flex flex-col gap-3 text-sm">
              <a href={REPO_URL} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <FaGithub size={14} /> View source
              </a>
              
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} {PRODUCT_NAME}. All rights reserved.</p>
          <p>Built with Next.js, FastAPI &amp; PostgreSQL.</p>
        </div>
      </footer>
    </main>
  );
}
