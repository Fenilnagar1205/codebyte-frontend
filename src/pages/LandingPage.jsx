import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const WORDS    = ["Variables", "Loops", "Functions", "Arrays", "APIs", "Git", "Recursion", "OOP"];
const STATS    = [
  { val: "120+", label: "Bytes Available", icon: "⚡" },
  { val: "50K+", label: "Learners",        icon: "👾" },
  { val: "4.9★", label: "Avg Rating",      icon: "🏆" },
];
const FEATURES = [
  { icon: "⚡", title: "Bite-Sized Bytes",  desc: "Each lesson is focused and short — no fluff, just the core concept." },
  { icon: "🎯", title: "Instant Quizzes",   desc: "Test your understanding right after reading with targeted questions." },
  { icon: "🏆", title: "Earn XP & Level Up", desc: "Every correct answer earns XP. Track your progress as you grow." },
];

export default function LandingPage() {
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWi((i) => (i + 1) % WORDS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen pt-[60px]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20
                        rounded-full px-4 py-1.5 mb-8 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse2" />
          <span className="font-mono text-xs text-accent">Learn coding, one byte at a time</span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(38px,7vw,72px)] font-extrabold leading-[1.05] mb-6
                       animate-fade-up [animation-delay:70ms]">
          Master{" "}
          <span className="animate-shimmer"
            style={{
              background: "linear-gradient(90deg,#00f5a0,#4a9eff)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            {WORDS[wi]}
          </span>
          <br />in bite-sized bytes
        </h1>

        {/* Sub */}
        <p className="text-lg text-dim max-w-lg mx-auto mb-10 leading-relaxed
                      animate-fade-up [animation-delay:140ms]">
          Structured micro-lessons + instant quizzes + XP rewards.
          Build real skills without the overwhelm.
        </p>

        {/* CTAs */}
        <div className="flex gap-3 justify-center flex-wrap animate-fade-up [animation-delay:210ms]">
          <Link to="/auth"
            className="px-9 py-3.5 bg-accent text-black font-bold text-base rounded-lg
                       transition-all duration-200 hover:brightness-110 hover:-translate-y-px
                       animate-glow">
            Start Learning Free →
          </Link>
          <Link to="/learn"
            className="px-8 py-3.5 border border-border text-white font-semibold text-base
                       rounded-lg transition-all duration-200 hover:border-accent hover:text-accent">
            Browse Bytes
          </Link>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-8 mb-20
                          grid grid-cols-1 sm:grid-cols-3 gap-4
                          animate-fade-up [animation-delay:280ms]">
        {STATS.map((s) => (
          <div key={s.label}
            className="card text-center hover:border-accent/30 transition-colors duration-200">
            <span className="text-3xl block mb-2">{s.icon}</span>
            <span className="font-mono text-3xl font-bold text-accent block">{s.val}</span>
            <span className="text-muted text-sm mt-1 block">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-8 mb-24
                          grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title}
            className="card hover:border-accent/30 hover:-translate-y-1
                       transition-all duration-200">
            <span className="text-4xl block mb-4">{f.icon}</span>
            <h3 className="text-base font-bold mb-2">{f.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="text-center px-8 py-20 border-t border-border">
        <h2 className="text-3xl font-extrabold mb-3">Ready to level up?</h2>
        <p className="text-muted text-base mb-8">Join thousands of developers learning with CodeByte.</p>
        <Link to="/auth"
          className="inline-block px-10 py-4 bg-accent text-black font-bold text-base
                     rounded-lg transition-all duration-200 hover:brightness-110 animate-glow">
          Get Started — It&apos;s Free
        </Link>
      </section>
    </div>
  );
}
