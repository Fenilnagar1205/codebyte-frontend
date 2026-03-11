import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getByteById } from "../api/bytes";
import { useFetch } from "../hooks/useFetch";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import ErrorBox from "../components/ui/ErrorBox";

export default function BytePage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const fetchFn  = useCallback(() => getByteById(id), [id]);
  const { data, loading, error, refetch } = useFetch(fetchFn);

  if (loading) return <Spinner />;
  if (error)   return (
    <div className="max-w-3xl mx-auto px-6 pt-[90px]">
      <ErrorBox message={error} onRetry={refetch} />
    </div>
  );

  const byte = data?.data;
  const alreadyAttempted = data?.alreadyAttempted;
  if (!byte) return null;

  const paragraphs = byte.content?.split("\n").filter(Boolean) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-6 pt-[90px] pb-16">

      {/* Back */}
      <button
        onClick={() => navigate("/learn")}
        className="flex items-center gap-1.5 text-muted text-sm mb-6
                   bg-transparent border-none hover:text-accent transition-colors duration-200">
        ← Back to Bytes
      </button>

      {/* Content card */}
      <div className="card mb-5 animate-fade-up">
        <h1 className="text-2xl font-extrabold mb-5">{byte.title}</h1>
        <div className="h-px bg-border mb-5" />
        <div className="flex flex-col gap-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base text-dim leading-[1.85]">{p}</p>
          ))}
        </div>
      </div>

      {/* Quiz CTA */}
      <div className="card flex items-center justify-between gap-5 flex-wrap animate-fade-up [animation-delay:70ms]">
        <div>
          <h3 className="font-bold text-base mb-1">Ready for the quiz?</h3>
          <p className="text-muted text-[13px]">
            {byte.quiz?.questions?.length ?? 0} questions · Earn XP for each correct answer
          </p>
          {alreadyAttempted && (
            <p className="text-orange text-[13px] mt-1">⚠ You&apos;ve already attempted this quiz.</p>
          )}
        </div>
        <Button glow onClick={() => navigate(`/quiz/${byte._id}`)}>
          {alreadyAttempted ? "Retry Quiz" : "Take Quiz ⚡"}
        </Button>
      </div>
    </div>
  );
}
