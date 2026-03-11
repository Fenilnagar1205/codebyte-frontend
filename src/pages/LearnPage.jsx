import { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBytes } from "../api/bytes";
import { useFetch } from "../hooks/useFetch";
import Spinner from "../components/ui/Spinner";
import ErrorBox from "../components/ui/ErrorBox";

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const SORT_OPTIONS  = [
  { value: "newest",   label: "Newest" },
  { value: "az",       label: "A → Z" },
  { value: "xp",       label: "Most XP" },
  { value: "questions",label: "Most Questions" },
];

const DIFF_COLORS = {
  Beginner:     { bg: "bg-accent/10",  border: "border-accent/25",  text: "text-accent" },
  Intermediate: { bg: "bg-blue/10",    border: "border-blue/25",    text: "text-blue" },
  Advanced:     { bg: "bg-orange/10",  border: "border-orange/25",  text: "text-orange" },
};

const DIFF_ICONS = { Beginner: "🌱", Intermediate: "🔥", Advanced: "⚡" };

export default function LearnPage() {
  const navigate = useNavigate();
  const fetchFn  = useCallback(getAllBytes, []);
  const { data, loading, error, refetch } = useFetch(fetchFn);
  const allBytes = data?.data ?? [];

  const [search,     setSearch]     = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category,   setCategory]   = useState("All");
  const [status,     setStatus]     = useState("All");   // All / Done / Not Done
  const [sort,       setSort]       = useState("newest");

  // Derive unique categories from bytes
  const categories = useMemo(() => {
    const cats = [...new Set(allBytes.map((b) => b.category).filter(Boolean))];
    return ["All", ...cats.sort()];
  }, [allBytes]);

  // Apply filters + sort
  const bytes = useMemo(() => {
    let result = [...allBytes];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.content?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
      );
    }

    // Difficulty
    if (difficulty !== "All")
      result = result.filter((b) => (b.difficulty ?? "Beginner") === difficulty);

    // Category
    if (category !== "All")
      result = result.filter((b) => b.category === category);

    // Status
    if (status === "Done")     result = result.filter((b) => b.completed);
    if (status === "Not Done") result = result.filter((b) => !b.completed);

    // Sort
    if (sort === "az")        result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "xp")        result.sort((a, b) => (b.xpReward ?? 10) - (a.xpReward ?? 10));
    if (sort === "questions")  result.sort((a, b) => (b.quiz?.questions?.length ?? 0) - (a.quiz?.questions?.length ?? 0));
    if (sort === "newest")    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [allBytes, search, difficulty, category, status, sort]);

  const hasFilters = search || difficulty !== "All" || category !== "All" || status !== "All" || sort !== "newest";

  const clearFilters = () => {
    setSearch(""); setDifficulty("All");
    setCategory("All"); setStatus("All"); setSort("newest");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-[90px] pb-16">

      {/* ── Header ── */}
      <div className="mb-6 animate-fade-up">
        <h1 className="text-3xl font-extrabold mb-1">
          Browse <span className="text-accent">Bytes</span>
        </h1>
        <p className="text-muted text-[15px]">
          Pick a byte, learn the concept, then prove it with a quiz.
        </p>
      </div>

      {/* ── Search & Filters ── */}
      <div className="card mb-6 flex flex-col gap-4 animate-fade-up [animation-delay:60ms]">

        {/* Search bar */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-base">🔍</span>
          <input
            placeholder="Search bytes by title, content or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted
                         hover:text-white bg-transparent border-none text-lg leading-none"
            >×</button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">

          {/* Difficulty pills */}
          <div className="flex gap-1.5 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <button key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                  ${difficulty === d
                    ? "bg-accent text-black border-accent"
                    : "bg-transparent text-muted border-border hover:border-accent/50 hover:text-white"}`}
              >
                {d === "All" ? "All Levels" : `${DIFF_ICONS[d]} ${d}`}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-border hidden sm:block" />

          {/* Status pills */}
          <div className="flex gap-1.5">
            {["All", "Done", "Not Done"].map((s) => (
              <button key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                  ${status === s
                    ? "bg-accent text-black border-accent"
                    : "bg-transparent text-muted border-border hover:border-accent/50 hover:text-white"}`}
              >
                {s === "Done" ? "✓ Done" : s === "Not Done" ? "○ Not Done" : "All Status"}
              </button>
            ))}
          </div>

          {/* Category + Sort — pushed right */}
          <div className="flex gap-2 ml-auto flex-wrap">
            {categories.length > 2 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-auto px-3 py-2 text-xs rounded-lg"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                ))}
              </select>
            )}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-auto px-3 py-2 text-xs rounded-lg"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filter summary + clear */}
        {hasFilters && (
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-xs text-muted">
              Showing <span className="text-white font-semibold">{bytes.length}</span> of{" "}
              <span className="text-white font-semibold">{allBytes.length}</span> bytes
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-orange hover:underline bg-transparent border-none"
            >
              Clear filters ×
            </button>
          </div>
        )}
      </div>

      <ErrorBox message={error} onRetry={refetch} />
      {loading && <Spinner />}

      {/* Empty states */}
      {!loading && allBytes.length === 0 && (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-3">📭</p>
          <p>No bytes yet — an admin needs to create some first!</p>
        </div>
      )}

      {!loading && allBytes.length > 0 && bytes.length === 0 && (
        <div className="text-center py-16 text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="mb-3">No bytes match your filters.</p>
          <button onClick={clearFilters}
            className="text-accent text-sm font-semibold hover:underline bg-transparent border-none">
            Clear filters
          </button>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bytes.map((b, i) => {
          const dc = DIFF_COLORS[b.difficulty] ?? DIFF_COLORS.Beginner;
          return (
            <div
              key={b._id}
              onClick={() => navigate(`/byte/${b._id}`)}
              className="card cursor-pointer hover:border-accent/40 hover:-translate-y-1
                         transition-all duration-200 animate-fade-up flex flex-col"
              style={{ animationDelay: `${Math.min(i, 5) * 50}ms` }}
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{DIFF_ICONS[b.difficulty] ?? "📦"}</span>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {b.completed && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full
                                     bg-accent/10 text-accent border border-accent/20">
                      ✓ Done
                    </span>
                  )}
                  {b.difficulty && (
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border
                                      ${dc.bg} ${dc.border} ${dc.text}`}>
                      {b.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-base mb-1.5">{b.title}</h3>

              {b.category && b.category !== "General" && (
                <span className="text-[11px] text-muted mb-2 font-mono">#{b.category}</span>
              )}

              <p className="text-muted text-[13px] leading-relaxed mb-4 flex-1">
                {b.content?.slice(0, 85)}{b.content?.length > 85 ? "…" : ""}
              </p>

              <div className="flex justify-between items-center pt-3 border-t border-border mt-auto">
                <div className="flex gap-3">
                  <span className="font-mono text-[11px] text-muted">
                    {b.quiz?.questions?.length ?? 0} Qs
                  </span>
                  <span className="font-mono text-[11px] text-accent">
                    +{(b.xpReward ?? 10) * (b.quiz?.questions?.length ?? 1)} XP
                  </span>
                </div>
                <span className="text-blue text-[13px] font-semibold">Read →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}