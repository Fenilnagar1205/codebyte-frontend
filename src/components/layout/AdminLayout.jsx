import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin",         label: "Dashboard",   icon: "📊", end: true },
  { to: "/admin/bytes",   label: "Bytes",        icon: "📦" },
  { to: "/admin/users",   label: "Users",        icon: "👥" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex pt-[60px]">

      {/* ── Sidebar ── */}
      <aside className="fixed top-[60px] left-0 bottom-0 w-[220px] border-r border-border
                        flex flex-col z-40"
        style={{ background: "#0d0d14" }}>

        {/* Admin badge */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-black"
              style={{ background: "linear-gradient(135deg,#ff6b35,#ff9a35)" }}>
              A
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-none">{user?.name}</p>
              <p className="text-[11px] text-orange mt-0.5 font-mono">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                 transition-all duration-200 no-underline
                 ${isActive
                   ? "bg-orange/10 text-orange border border-orange/25"
                   : "text-dim hover:text-white hover:bg-white/5 border border-transparent"}`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-border flex flex-col gap-2">
          <NavLink to="/learn"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                       text-dim hover:text-white hover:bg-white/5 transition-all duration-200 no-underline border border-transparent">
            <span className="text-base">🎓</span> View Site
          </NavLink>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                       text-dim hover:text-orange hover:bg-orange/5 transition-all duration-200
                       bg-transparent border-none text-left w-full"
          >
            <span className="text-base">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 ml-[220px] min-h-full">
        <Outlet />
      </main>
    </div>
  );
}
