import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // Always wait for auth to finish loading before making any redirect decision
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-border border-t-orange
                        animate-spin-fast mx-auto mb-3" />
        <p className="text-muted text-sm">Verifying access…</p>
      </div>
    </div>
  );

  if (!user)                 return <Navigate to="/auth"  replace />;
  if (user.role !== "admin") return <Navigate to="/learn" replace />;

  return children;
}