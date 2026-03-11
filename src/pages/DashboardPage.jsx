import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyProgress } from "../api/progress";
import { useFetch } from "../hooks/useFetch";
import XPBar from "../components/ui/XPBar";
import Spinner from "../components/ui/Spinner";

// ── Badge definitions ─────────────────────────────────────────────────────────
const BADGE_DEFS = [
  {
    icon: "🔥", label: "First Login",   desc: "Logged in for the first time",
    check: () => true,
  },
  {
    icon: "⚡", label: "First Byte",    desc: "Completed your first quiz",
    check: (p) => p.length >= 1,
  },
  {
    icon: "🎯", label: "Perfect Quiz",  desc: "Scored 100% on any quiz",
    check: (p) => p.some((r) => r.percentage === 100),
  },
  {
    icon: "📚", label: "5 Bytes Done",  desc: "Completed 5 or more quizzes",
    check: (p) => p.length >= 5,
  },
  {
    icon: "🔑", label: "10 Bytes Done", desc: "Completed 10 or more quizzes",
    check: (p) => p.length >= 10,
  },
  {
    icon: "🌐", label: "API Expert",    desc: "Completed a byte with \"API\" in the title",
    check: (p) => p.some((r) => r.byte?.title?.toLowerCase().includes("api")),
  },
  {
    icon: "🏗️", label: "OOP Master",   desc: "Completed a byte with \"OOP\" or \"Object\" in the title",
    check: (p) => p.some((r) =>
      r.byte?.title?.toLowerCase().includes("oop") ||
      r.byte?.title?.toLowerCase().includes("object")
    ),
  },
  {
    icon: "💯", label: "High Scorer",   desc: "Scored 80%+ on 3 or more quizzes",
    check: (p) => p.filter((r) => r.percentage >= 80).length >= 3,
  },
  {
    icon: "⭐", label: "XP Hunter",     desc: "Earned 100 or more XP",
    check: (_, user) => (user?.xp ?? 0) >= 100,
  },
  {
    icon: "🏆", label: "XP Legend",     desc: "Earned 500 or more XP",
    check: (_, user) => (user?.xp ?? 0) >= 500,
  },
  {
    icon: "🛠", label: "Admin",          desc: "You have admin access",
    check: (_, user) => user?.role === "admin",
  },
  {
    icon: "🚀", label: "Completionist", desc: "Completed 20 or more quizzes",
    check: (p) => p.length >= 20,
  },
];

// ── Badge card ────────────────────────────────────────────────────────────────
function BadgeCard({ badge, earned }) {
  return (
    <div
      title={badge.desc}
      className={`relative text-center py-4 px-2 rounded-xl border transition-all duration-300 group
        ${earned
          ? "bg-accent/10 border-accent/25 opacity-100 hover:-translate-y-1 cursor-default"
          : "bg-bg border-border opacity-35"}`}
    >
      <span className="text-2xl block mb-1.5">{badge.icon}</span>
      <span className={`text-[10px] leading-tight block font-semibold
        ${earned ? "text-accent" : "text-muted"}`}>
        {badge.label}
      </span>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5
                      bg-surface border border-border rounded-lg text-[11px] text-dim
                      whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-200 z-10 shadow-lg">
        {badge.desc}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4
                        border-transparent border-t-border" />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const fetchFn  = useCallback(getMyProgress, []);
  const { data, loading } = useFetch(fetchFn);

  if (!user) return null;

  const progress    = data?.data ?? [];
  const xp          = user.xp ?? 0;
  const level       = Math.floor(xp / 200) + 1;
  const levelXP     = xp % 200;
  const badges      = BADGE_DEFS.map((b) => ({ ...b, earned: b.check(progress, user) }));
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-[90px] pb-16 flex flex-col gap-5">

      {/* ── Profile card ── */}
      <div className="card flex items-center gap-6 flex-wrap animate-fade-up"
        style={{ background: "linear-gradient(135deg,#12121a,#1a1a26)" }}>
        <div className="w-[68px] h-[68px] rounded-full flex items-center justify-center
                        text-2xl font-extrabold text-black flex-shrink-0 animate-glow"
          style={{ background: "linear-gradient(135deg,#00f5a0,#4a9eff)" }}>
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-xl font-extrabold mb-0.5">{user.name}</h2>
          <p className="text-muted text-sm mb-3">{user.email}</p>
          <XPBar xp={levelXP} maxXp={200} level={level} />
        </div>
        <div className="flex gap-7 flex-shrink-0 flex-wrap">
          {[
            { val: xp,              label: "Total XP",    color: "#00f5a0" },
            { val: level,           label: "Level",       color: "#4a9eff" },
            { val: progress.length, label: "Quizzes Done",color: "#a855f7" },
            { val: user.role,       label: "Role",        color: "#ff6b35" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <span className="font-mono text-xl font-bold block" style={{ color: s.color }}>{s.val}</span>
              <span className="text-[11px] text-muted mt-0.5 block">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Badges ── */}
      <div className="card animate-fade-up [animation-delay:70ms]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold">Badges</h3>
          {!loading && (
            <span className="font-mono text-xs text-accent">{earnedCount}/{badges.length} earned</span>
          )}
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-border rounded-full overflow-hidden mb-5">
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${loading ? 0 : (earnedCount / badges.length) * 100}%`,
              background: "linear-gradient(90deg,#00f5a0,#4a9eff)",
            }} />
        </div>
        {loading
          ? <Spinner size={24} />
          : <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {[...badges.filter(b => b.earned), ...badges.filter(b => !b.earned)]
                .map((b) => <BadgeCard key={b.label} badge={b} earned={b.earned} />)}
            </div>
        }
      </div>

      {/* ── Recent activity ── */}
      {!loading && progress.length > 0 && (
        <div className="card animate-fade-up [animation-delay:140ms]">
          <h3 className="text-base font-bold mb-4">Recent Activity</h3>
          {progress.slice(0, 5).map((p) => (
            <div key={p._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {p.percentage === 100 ? "🎯" : p.percentage >= 80 ? "⭐" : p.percentage >= 50 ? "👍" : "📚"}
                </span>
                <div>
                  <p className="text-sm font-semibold">{p.byte?.title ?? "Unknown Byte"}</p>
                  <p className="text-xs text-muted mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold"
                  style={{ color: p.percentage === 100 ? "#00f5a0" : p.percentage >= 80 ? "#4a9eff" : "#94a3b8" }}>
                  {p.percentage}%
                </p>
                <p className="text-xs text-muted">+{p.xpEarned} XP</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Admin card ── */}
      {user.role === "admin" && (
        <div className="card bg-orange/5 border-orange/25 animate-fade-up [animation-delay:210ms]">
          <h3 className="text-orange font-bold mb-2">🛠 Admin Access</h3>
          <p className="text-dim text-sm leading-relaxed">
            Manage bytes and users from the{" "}
            <a href="/admin" className="text-orange underline">Admin Panel</a>.
          </p>
        </div>
      )}
    </div>
  );
}