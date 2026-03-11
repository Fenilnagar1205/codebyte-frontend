import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getByteById, submitQuiz } from "../api/bytes";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ErrorBox from "../components/ui/ErrorBox";

// ── Results ───────────────────────────────────────────────────────────────────
function Results({ result, total, onRetry, onLearn }) {
  const pct = result?.percentage ?? 0;
  return (
    <div className="min-h-screen pt-[60px] flex items-center justify-center px-4 py-16">
      <div className="card w-full max-w-[480px] text-center animate-fade-up">
        <div className="text-5xl mb-4 animate-float">{pct >= 75 ? "🏆" : pct >= 50 ? "👍" : "📚"}</div>
        <h2 className="text-2xl font-extrabold mb-2">Quiz Complete!</h2>
        <p className="text-muted mb-6">{result.score} / {total} correct · {pct}%</p>

        {/* Stat row */}
        <div className="flex justify-around items-center bg-bg border border-border
                        rounded-xl px-6 py-4 mb-7">
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-accent block">+{result.xpEarned ?? 0}</span>
            <span className="text-xs text-muted mt-1 block">XP Earned</span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-blue block">{pct}%</span>
            <span className="text-xs text-muted mt-1 block">Accuracy</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onLearn}>← Back to Bytes</Button>
          <Button fullWidth onClick={onRetry}>Retry Quiz</Button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { addXP } = useAuth();

  const fetchFn = useCallback(() => getByteById(id), [id]);
  const { data, loading, error: fetchError, refetch } = useFetch(fetchFn);

  const [qi, setQi]         = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers]   = useState([]);
  const [done, setDone]         = useState(false);
  const [result, setResult]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const reset = () => {
    setQi(0); setSelected(null); setAnswered(false);
    setAnswers([]); setDone(false); setResult(null); setSubmitError("");
  };

  if (loading || submitting) return <Spinner />;
  if (fetchError) return (
    <div className="max-w-xl mx-auto px-6 pt-[90px]">
      <ErrorBox message={fetchError} onRetry={refetch} />
    </div>
  );

  const byte      = data?.data;
  const questions = byte?.quiz?.questions ?? [];

  if (done) return (
    <Results result={result} total={questions.length} onRetry={reset} onLearn={() => navigate("/learn")} />
  );

  const q = questions[qi];
  if (!q) return null;

  const choose = (idx) => {
    if (answered) return;
    setSelected(idx); setAnswered(true);
  };

  const next = async () => {
    const newAnswers = [...answers, { questionId: q._id, selectedOption: selected }];
    setAnswers(newAnswers);

    if (qi + 1 < questions.length) {
      setQi((i) => i + 1); setSelected(null); setAnswered(false);
    } else {
      setSubmitting(true); setSubmitError("");
      try {
        const res = await submitQuiz(byte._id, newAnswers);
        if (res.xpEarned) addXP(res.xpEarned);
        setResult(res);
      } catch (err) {
        setSubmitError(err.message);
        setResult({ score: 0, percentage: 0, xpEarned: 0 });
      } finally {
        setSubmitting(false);
        setDone(true);
      }
    }
  };

  const progress = (qi / questions.length) * 100;

  return (
    <div className="max-w-[620px] mx-auto px-6 pt-[90px] pb-16">

      {/* Progress */}
      <div className="mb-7 animate-fade-up">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-xs text-accent">
            Question {qi + 1} of {questions.length}
          </span>
          <span className="font-mono text-xs text-muted">{byte?.title}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div key={qi} className="card mb-4 animate-fade-up">
        <h3 className="text-[19px] font-bold leading-[1.55] mb-6">{q.question}</h3>

        <div className="flex flex-col gap-2.5">
          {q.options.map((opt, i) => {
            const chosen = answered && i === selected;
            return (
              <button key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border
                            font-semibold text-[15px] text-left transition-all duration-200
                            disabled:cursor-default
                            ${chosen
                              ? "bg-blue/10 border-blue text-blue"
                              : "bg-bg border-border text-dim hover:border-accent/40 hover:text-accent"
                            }`}>
                <span className={`w-[26px] h-[26px] rounded-full border flex items-center
                                  justify-center font-mono text-xs flex-shrink-0 transition-all duration-200
                                  ${chosen ? "bg-blue border-blue text-white" : "border-border text-dim"}`}>
                  {chosen ? "●" : String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Locked notice */}
      {answered && (
        <div className="px-4 py-3 bg-blue/10 border border-blue/30 rounded-xl
                        text-blue text-sm font-semibold mb-4 animate-fade-up">
          Answer locked in — results shown after all questions.
        </div>
      )}

      <ErrorBox message={submitError} />

      {answered && (
        <Button fullWidth onClick={next}>
          {qi + 1 < questions.length ? "Next Question →" : "Submit Quiz 🏆"}
        </Button>
      )}
    </div>
  );
}
