import { useCallback } from "react";
import { Link } from "react-router-dom";
import { adminGetAllBytes, adminGetAllUsers } from "../../api/admin";
import { useFetch } from "../../hooks/useFetch";
import Spinner from "../../components/ui/Spinner";
import ErrorBox from "../../components/ui/ErrorBox";

function StatCard({ icon, label, value, color, to }) {
  const inner = (
    <div className={`card hover:border-${color}/40 hover:-translate-y-0.5
                     transition-all duration-200 cursor-pointer`}
      style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="font-mono text-xs px-2 py-1 rounded-full"
          style={{ background: `${color}18`, color }}>
          live
        </span>
      </div>
      <p className="font-mono text-3xl font-bold mb-1" style={{ color }}>{value}</p>
      <p className="text-muted text-sm">{label}</p>
    </div>
  );
  return to ? <Link to={to} className="no-underline">{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const bytesFn = useCallback(adminGetAllBytes, []);
  const usersFn = useCallback(adminGetAllUsers, []);
  const { data: bytesData, loading: bl, error: be } = useFetch(bytesFn);
  const { data: usersData, loading: ul, error: ue } = useFetch(usersFn);

  const bytes = bytesData?.data ?? [];
  const users = usersData?.data ?? [];
  const totalXP = users.reduce((sum, u) => sum + (u.xp ?? 0), 0);

  if (bl || ul) return <Spinner />;

  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-extrabold mb-1">
          Admin <span className="text-orange">Dashboard</span>
        </h1>
        <p className="text-muted text-sm">Overview of your CodeByte platform.</p>
      </div>

      <ErrorBox message={be || ue} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up [animation-delay:60ms]">
        <StatCard icon="📦" label="Total Bytes"   value={bytes.length} color="#00f5a0" to="/admin/bytes" />
        <StatCard icon="👥" label="Total Users"   value={users.length} color="#4a9eff" to="/admin/users" />
        <StatCard icon="⚡" label="Total XP Given" value={totalXP}     color="#a855f7" />
        <StatCard icon="✅" label="Completed"
          value={users.reduce((s, u) => s + (u.completedBytes ?? 0), 0)}
          color="#ff6b35" />
      </div>

      {/* Recent bytes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card animate-fade-up [animation-delay:120ms]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base">Recent Bytes</h2>
            <Link to="/admin/bytes"
              className="text-xs text-accent font-semibold no-underline hover:underline">
              View all →
            </Link>
          </div>
          {bytes.length === 0
            ? <p className="text-muted text-sm text-center py-6">No bytes yet.</p>
            : bytes.slice(0, 5).map((b) => (
              <div key={b._id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold">{b.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {b.quiz?.questions?.length ?? 0} questions
                  </p>
                </div>
                <Link to={`/admin/bytes/edit/${b._id}`}
                  className="text-xs text-dim hover:text-accent no-underline transition-colors">
                  Edit →
                </Link>
              </div>
            ))
          }
        </div>

        {/* Recent users */}
        <div className="card animate-fade-up [animation-delay:180ms]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base">Recent Users</h2>
            <Link to="/admin/users"
              className="text-xs text-accent font-semibold no-underline hover:underline">
              View all →
            </Link>
          </div>
          {users.length === 0
            ? <p className="text-muted text-sm text-center py-6">No users yet.</p>
            : users.slice(0, 5).map((u) => (
              <div key={u._id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center
                                  text-xs font-bold text-black flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#00f5a0,#4a9eff)" }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{u.name}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </div>
                </div>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-full
                  ${u.role === "admin"
                    ? "bg-orange/10 text-orange"
                    : "bg-accent/10 text-accent"}`}>
                  {u.role}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
