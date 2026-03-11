import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";
import { setToken, clearToken, getToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  // Start as true so routes never render before we've checked the token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    // Token exists — fetch fresh user from DB (always has correct role)
    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => {
        // Token is invalid/expired — clear it
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const addXP = (amount) =>
    setUser((u) => u ? { ...u, xp: (u.xp ?? 0) + amount } : u);

  // Don't render anything until we know the auth state
  // This prevents any route from rendering with a stale null user
  if (loading) return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0a0a0f"
    }}>
      <div style={{
        width: 36, height: 36,
        borderRadius: "50%",
        border: "3px solid #1e1e2e",
        borderTopColor: "#00f5a0",
        animation: "spin 0.7s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, addXP }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);