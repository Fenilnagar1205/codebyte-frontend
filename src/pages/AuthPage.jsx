import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login, getMe } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import ErrorBox from "../components/ui/ErrorBox";

// Eye icons as inline SVG
const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function AuthPage() {
  const [mode, setMode]         = useState("login");
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const { login: ctxLogin } = useAuth();
  const navigate = useNavigate();

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Email and password are required."); return; }
    if (mode === "signup" && !form.name) { setError("Please enter your name."); return; }

    setLoading(true);
    try {
      if (mode === "signup") await register(form.name, form.email, form.password);
      const data = await login(form.email, form.password);
      // Store token first so getMe() can use it, then fetch fresh user from DB
      ctxLogin(data.token, data.user);
      const fresh = await getMe();
      ctxLogin(data.token, fresh.user);
      navigate(fresh.user?.role === "admin" ? "/admin" : "/learn");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-[60px] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] animate-fade-up">

        {/* Top gradient bar */}
        <div className="h-[3px] rounded-t-xl"
          style={{ background: "linear-gradient(90deg,#00f5a0,#4a9eff)" }} />

        <div className="bg-surface border border-border border-t-0 rounded-b-2xl p-9">

          <h2 className="text-2xl font-extrabold mb-1">
            {mode === "login" ? "Welcome back" : "Join CodeByte"}
          </h2>
          <p className="text-muted text-sm mb-7">
            {mode === "login" ? "Log in to continue your streak 🔥" : "Start your coding journey today ⚡"}
          </p>

          {/* Toggle */}
          <div className="flex bg-bg border border-border rounded-xl p-1 mb-7">
            {["login", "signup"].map((m) => (
              <button key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 border-none
                  ${mode === m
                    ? "bg-accent text-black"
                    : "bg-transparent text-muted hover:text-white"}`}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4 mb-2">
            {mode === "signup" && (
              <div>
                <label className="input-label">Name</label>
                <input placeholder="Your name" value={form.name} onChange={set("name")} autoComplete="off" />
              </div>
            )}
            <div>
              <label className="input-label">Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} autoComplete="email" />
            </div>
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors duration-200 bg-transparent border-none p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>
          </div>

          <ErrorBox message={error} />

          <Button fullWidth glow onClick={handleSubmit} disabled={loading} className="mt-2">
            {loading ? "Loading…" : mode === "login" ? "Log In →" : "Create Account →"}
          </Button>
        </div>
      </div>
    </div>
  );
}