import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminCreateByte, adminUpdateByte, adminGetByte } from "../../api/admin";
import { useFetch } from "../../hooks/useFetch";
import Button from "../../components/ui/Button";
import ErrorBox from "../../components/ui/ErrorBox";
import Spinner from "../../components/ui/Spinner";

// ── Empty question template ────────────────────────────────────────────────────
const emptyQuestion = () => ({
  _tempId: Math.random().toString(36).slice(2),
  question: "",
  options: ["", "", "", ""],
  correctOption: 0,
});

export default function AdminByteForm() {
  const { id }   = useParams();           // present on edit, absent on create
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  // Fetch existing byte when editing
  const fetchFn = useCallback(() => (isEdit ? adminGetByte(id) : Promise.resolve(null)), [id, isEdit]);
  const { data: existing, loading: fetching } = useFetch(fetchFn);

  const [form, setForm] = useState({
    title:      "",
    content:    "",
    xpReward:   10,
    difficulty: "Beginner",
    category:   "",
    questions:  [emptyQuestion()],
  });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (!isEdit || !existing?.data) return;
    const b = existing.data;
    setForm({
      title:      b.title      ?? "",
      content:    b.content    ?? "",
      xpReward:   b.xpReward   ?? 10,
      difficulty: b.difficulty ?? "Beginner",
      category:   b.category   ?? "",
      questions:  b.quiz?.questions?.length
        ? b.quiz.questions.map((q) => ({
            _tempId:       q._id ?? Math.random().toString(36).slice(2),
            question:      q.question,
            options:       [...q.options],
            correctOption: q.correctOption ?? 0,
          }))
        : [emptyQuestion()],
    });
  }, [existing, isEdit]);

  // ── Form helpers ──────────────────────────────────────────────────────────
  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const setQuestion = (idx, key, value) =>
    setForm((f) => {
      const qs = [...f.questions];
      qs[idx] = { ...qs[idx], [key]: value };
      return { ...f, questions: qs };
    });

  const setOption = (qIdx, oIdx, value) =>
    setForm((f) => {
      const qs = [...f.questions];
      const opts = [...qs[qIdx].options];
      opts[oIdx] = value;
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...f, questions: qs };
    });

  const addQuestion    = () => setForm((f) => ({ ...f, questions: [...f.questions, emptyQuestion()] }));
  const removeQuestion = (idx) =>
    setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError(""); setSuccess("");

    if (!form.title.trim())   { setError("Title is required.");   return; }
    if (!form.content.trim()) { setError("Content is required."); return; }

    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.question.trim()) { setError(`Question ${i + 1} text is required.`); return; }
      if (q.options.some((o) => !o.trim())) {
        setError(`All options in question ${i + 1} must be filled.`); return;
      }
    }

    const payload = {
      title:      form.title.trim(),
      content:    form.content.trim(),
      xpReward:   Number(form.xpReward) || 10,
      difficulty: form.difficulty,
      category:   form.category.trim() || "General",
      quiz: {
        questions: form.questions.map(({ question, options, correctOption }) => ({
          question,
          options,
          correctOption: Number(correctOption),
        })),
      },
    };

    setSaving(true);
    try {
      if (isEdit) {
        await adminUpdateByte(id, payload);
        setSuccess("Byte updated successfully!");
      } else {
        await adminCreateByte(payload);
        setSuccess("Byte created! Redirecting…");
        // Reset form so difficulty/fields don't flash back to defaults visually
        setForm({ title: "", content: "", xpReward: 10, difficulty: payload.difficulty, category: payload.category, questions: [emptyQuestion()] });
        setTimeout(() => navigate("/admin/bytes"), 1200);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return <Spinner />;

  return (
    <div className="p-8 max-w-3xl">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-fade-up">
        <button
          onClick={() => navigate("/admin/bytes")}
          className="text-muted hover:text-accent text-sm bg-transparent border-none transition-colors">
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-extrabold">
            {isEdit ? "Edit" : "Create"} <span className="text-orange">Byte</span>
          </h1>
          <p className="text-muted text-sm mt-0.5">
            {isEdit ? "Update the byte content and quiz." : "Fill in the content and quiz questions."}
          </p>
        </div>
      </div>

      <ErrorBox message={error} />

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-accent/10
                        border border-accent/30 rounded-xl text-accent text-sm font-semibold">
          ✓ {success}
        </div>
      )}

      {/* ── Basic info ── */}
      <div className="card mb-5 animate-fade-up [animation-delay:60ms]">
        <h2 className="font-bold text-sm text-muted uppercase tracking-wider mb-4">Byte Info</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="input-label">Title *</label>
            <input placeholder="e.g. Variables & Data Types"
              value={form.title} onChange={setField("title")} />
          </div>
          <div>
            <label className="input-label">Content *</label>
            <textarea
              placeholder="Write the lesson content here. Use newlines for paragraphs."
              value={form.content}
              onChange={setField("content")}
              rows={6}
              className="resize-y"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Difficulty</label>
              <select value={form.difficulty} onChange={setField("difficulty")}>
                <option value="Beginner">🌱 Beginner</option>
                <option value="Intermediate">🔥 Intermediate</option>
                <option value="Advanced">⚡ Advanced</option>
              </select>
            </div>
            <div>
              <label className="input-label">Category</label>
              <input placeholder="e.g. JavaScript, Git, OOP"
                value={form.category} onChange={setField("category")} />
            </div>
            <div>
              <label className="input-label">XP per correct answer</label>
              <input type="number" min={1} max={100}
                value={form.xpReward} onChange={setField("xpReward")} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quiz questions ── */}
      <div className="flex flex-col gap-4 mb-6">
        {form.questions.map((q, qi) => (
          <div key={q._tempId}
            className="card animate-fade-up"
            style={{ animationDelay: `${80 + qi * 40}ms` }}>

            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">
                Question <span className="text-orange">{qi + 1}</span>
              </h3>
              {form.questions.length > 1 && (
                <button onClick={() => removeQuestion(qi)}
                  className="text-xs text-muted hover:text-orange transition-colors
                             bg-transparent border-none">
                  Remove
                </button>
              )}
            </div>

            {/* Question text */}
            <div className="mb-4">
              <label className="input-label">Question *</label>
              <input placeholder="Type your question here…"
                value={q.question}
                onChange={(e) => setQuestion(qi, "question", e.target.value)} />
            </div>

            {/* Options */}
            <div className="mb-4">
              <label className="input-label mb-2 block">Options * — click the circle to mark as correct</label>
              <div className="flex flex-col gap-2.5">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-3">
                    {/* Correct option selector */}
                    <button
                      type="button"
                      onClick={() => setQuestion(qi, "correctOption", oi)}
                      className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center
                                  justify-center transition-all duration-200 bg-transparent
                                  ${q.correctOption === oi
                                    ? "border-accent bg-accent/20 text-accent"
                                    : "border-border text-muted hover:border-accent/50"}`}
                      title="Mark as correct"
                    >
                      {q.correctOption === oi
                        ? <span className="text-[10px] font-bold">✓</span>
                        : <span className="font-mono text-[11px]">{String.fromCharCode(65 + oi)}</span>
                      }
                    </button>
                    <input
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      value={opt}
                      onChange={(e) => setOption(qi, oi, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">
                ✓ Correct answer: Option <span className="text-accent font-semibold">
                  {String.fromCharCode(65 + q.correctOption)}
                </span>
              </p>
            </div>
          </div>
        ))}

        {/* Add question button */}
        <button
          onClick={addQuestion}
          className="w-full py-3 border border-dashed border-border rounded-xl text-sm
                     font-semibold text-muted hover:border-accent/50 hover:text-accent
                     transition-all duration-200 bg-transparent"
        >
          + Add Question
        </button>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => navigate("/admin/bytes")}>Cancel</Button>
        <Button glow onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Byte"}
        </Button>
      </div>
    </div>
  );
}