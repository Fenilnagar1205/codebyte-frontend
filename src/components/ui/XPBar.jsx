export default function XPBar({ xp = 0, maxXp = 200, level = 1 }) {
  const pct = Math.min((xp / maxXp) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-accent min-w-[54px]">LVL {level}</span>
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#00f5a0,#4a9eff)",
            boxShadow: "0 0 8px rgba(0,245,160,0.4)",
          }}
        />
      </div>
      <span className="font-mono text-[11px] text-muted min-w-[72px] text-right">
        {xp}/{maxXp} XP
      </span>
    </div>
  );
}
