import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetAllBytes, adminDeleteByte } from "../../api/admin";
import { useFetch } from "../../hooks/useFetch";
import Spinner from "../../components/ui/Spinner";
import ErrorBox from "../../components/ui/ErrorBox";
import Button from "../../components/ui/Button";

export default function AdminBytes() {
  const fetchFn = useCallback(adminGetAllBytes, []);
  const { data, loading, error, refetch } = useFetch(fetchFn);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const bytes = data?.data ?? [];

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id); setDeleteError("");
    try {
      await adminDeleteByte(id);
      refetch();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-up">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">
            Manage <span className="text-orange">Bytes</span>
          </h1>
          <p className="text-muted text-sm">{bytes.length} bytes total</p>
        </div>
        <Link to="/admin/bytes/create">
          <Button>+ Create Byte</Button>
        </Link>
      </div>

      <ErrorBox message={error || deleteError} onRetry={refetch} />
      {loading && <Spinner />}

      {!loading && bytes.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-muted mb-4">No bytes yet. Create your first one!</p>
          <Link to="/admin/bytes/create"><Button>+ Create Byte</Button></Link>
        </div>
      )}

      {/* Bytes table */}
      {bytes.length > 0 && (
        <div className="card p-0 overflow-hidden animate-fade-up [animation-delay:60ms]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Title</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Questions</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">XP Reward</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {bytes.map((b, i) => (
                <tr key={b._id}
                  className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-sm">{b.title}</p>
                    <p className="text-xs text-muted mt-0.5 max-w-[260px] truncate">{b.content}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-mono text-xs px-2 py-1 rounded-full
                      ${b.difficulty === "Beginner" ? "bg-accent/10 text-accent" :
                        b.difficulty === "Intermediate" ? "bg-blue/10 text-blue" :
                        "bg-orange/10 text-orange"}`}>
                      {b.difficulty ?? "Beginner"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-dim font-mono">
                    {b.category ?? "General"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm text-accent">
                      {b.quiz?.questions?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm text-dim">
                      {b.xpReward ?? 10} / correct
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/admin/bytes/edit/${b._id}`}
                        className="px-3 py-1.5 text-xs font-semibold text-dim border border-border
                                   rounded-lg hover:border-accent hover:text-accent transition-all
                                   duration-200 no-underline">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(b._id, b.title)}
                        disabled={deleting === b._id}
                        className="px-3 py-1.5 text-xs font-semibold text-dim border border-border
                                   rounded-lg hover:border-orange hover:text-orange transition-all
                                   duration-200 bg-transparent disabled:opacity-50"
                      >
                        {deleting === b._id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}