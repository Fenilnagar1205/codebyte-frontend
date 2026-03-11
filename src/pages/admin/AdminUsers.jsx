import { useCallback, useState } from "react";
import { adminGetAllUsers, adminDeleteUser } from "../../api/admin";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/ui/Spinner";
import ErrorBox from "../../components/ui/ErrorBox";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const fetchFn = useCallback(adminGetAllUsers, []);
  const { data, loading, error, refetch } = useFetch(fetchFn);
  const [deleting, setDeleting]     = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [search, setSearch]         = useState("");

  const allUsers = data?.data ?? [];
  const users = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id, name) => {
    if (id === me?._id || id === me?.id) {
      setDeleteError("You cannot delete your own account."); return;
    }
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id); setDeleteError("");
    try {
      await adminDeleteUser(id);
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
            Manage <span className="text-orange">Users</span>
          </h1>
          <p className="text-muted text-sm">{allUsers.length} registered users</p>
        </div>
        {/* Search */}
        <div className="relative w-64">
          <input
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 py-2 text-sm"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
        </div>
      </div>

      <ErrorBox message={error || deleteError} onRetry={refetch} />
      {loading && <Spinner />}

      {!loading && users.length === 0 && (
        <div className="card text-center py-16">
          <p className="text-3xl mb-3">👥</p>
          <p className="text-muted">
            {search ? "No users match your search." : "No users registered yet."}
          </p>
        </div>
      )}

      {/* Users table */}
      {users.length > 0 && (
        <div className="card p-0 overflow-hidden animate-fade-up [animation-delay:60ms]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">XP</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u._id === me?._id || u._id === me?.id;
                return (
                  <tr key={u._id}
                    className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center
                                        text-xs font-bold text-black flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#00f5a0,#4a9eff)" }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {u.name} {isMe && <span className="text-xs text-muted">(you)</span>}
                          </p>
                          <p className="text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-mono text-xs px-2.5 py-1 rounded-full
                        ${u.role === "admin"
                          ? "bg-orange/10 text-orange border border-orange/20"
                          : "bg-accent/10 text-accent border border-accent/20"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-dim">{u.xp ?? 0} XP</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!isMe && (
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={deleting === u._id}
                          className="px-3 py-1.5 text-xs font-semibold text-dim border border-border
                                     rounded-lg hover:border-orange hover:text-orange transition-all
                                     duration-200 bg-transparent disabled:opacity-50"
                        >
                          {deleting === u._id ? "…" : "Delete"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
