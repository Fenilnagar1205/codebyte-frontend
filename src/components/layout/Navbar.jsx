// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center
//                     justify-between px-8 border-b border-border"
//       style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(18px)" }}>

//       {/* Logo */}
//       <Link to="/" className="flex items-center gap-1 font-extrabold text-[18px] text-white no-underline">
//         <span className="font-mono text-accent text-[18px]">{"<"}</span>
//         code<span className="text-accent">byte</span>
//       </Link>

//       {user ? (
//         <div className="flex items-center gap-1.5">
//           <NavLink to="/learn"
//             className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
//             Learn
//           </NavLink>
//           <NavLink to="/dashboard"
//             className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
//             Profile
//           </NavLink>

//           {/* XP pill */}
//           <div className="xp-pill">
//             <div className="w-7 h-7 rounded-full flex items-center justify-center
//                             font-bold text-[13px] text-black"
//               style={{ background: "linear-gradient(135deg,#00f5a0,#4a9eff)" }}>
//               {user.name?.[0]?.toUpperCase()}
//             </div>
//             <span className="font-mono text-xs text-accent">{user.xp ?? 0} XP</span>
//           </div>

//           <button
//             onClick={() => { logout(); navigate("/"); }}
//             className="ml-1 px-3.5 py-1.5 text-[13px] font-semibold text-muted
//                        border border-border rounded-lg bg-transparent
//                        transition-all duration-200 hover:border-orange hover:text-orange"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <div className="flex items-center gap-2.5">
//           <Link to="/auth"
//             className="px-5 py-2 text-sm font-semibold text-white border border-border
//                        rounded-lg transition-all duration-200 hover:border-accent hover:text-accent">
//             Log in
//           </Link>
//           <Link to="/auth"
//             className="px-5 py-2 text-sm font-bold text-black bg-accent rounded-lg
//                        transition-all duration-200 hover:brightness-110">
//             Sign up
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // DEBUG — remove once working
  console.log("NAVBAR USER:", JSON.stringify(user));

  const isAdmin = user?.role === "admin";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center
                    justify-between px-8 border-b border-border"
      style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(18px)" }}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-1 font-extrabold text-[18px] text-white no-underline">
        <span className="font-mono text-accent text-[18px]">{"<"}</span>
        code<span className="text-accent">byte</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-1.5">
          <NavLink to="/learn"
            className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            Learn
          </NavLink>
          <NavLink to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            Profile
          </NavLink>

          {/* Admin panel link — always visible if isAdmin */}
          {isAdmin && (
            <NavLink to="/admin"
              className={({ isActive }) =>
                `nav-link border ${isActive
                  ? "bg-orange/10 border-orange/30 text-orange"
                  : "border-orange/20 text-orange hover:bg-orange/10"}`
              }>
              🛠 Admin
            </NavLink>
          )}

          {/* XP pill */}
          <div className="xp-pill">
            <div className="w-7 h-7 rounded-full flex items-center justify-center
                            font-bold text-[13px] text-black"
              style={{ background: "linear-gradient(135deg,#00f5a0,#4a9eff)" }}>
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="font-mono text-xs text-accent">{user.xp ?? 0} XP</span>
          </div>

          <button
            onClick={() => { logout(); navigate("/"); }}
            className="ml-1 px-3.5 py-1.5 text-[13px] font-semibold text-muted
                       border border-border rounded-lg bg-transparent
                       transition-all duration-200 hover:border-orange hover:text-orange"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <Link to="/auth"
            className="px-5 py-2 text-sm font-semibold text-white border border-border
                       rounded-lg transition-all duration-200 hover:border-accent hover:text-accent">
            Log in
          </Link>
          <Link to="/auth"
            className="px-5 py-2 text-sm font-bold text-black bg-accent rounded-lg
                       transition-all duration-200 hover:brightness-110">
            Sign up
          </Link>
        </div>
      )}
    </nav>
  );
}