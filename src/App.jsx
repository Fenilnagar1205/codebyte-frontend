import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";

import LandingPage    from "./pages/LandingPage";
import AuthPage       from "./pages/AuthPage";
import LearnPage      from "./pages/LearnPage";
import BytePage       from "./pages/BytePage";
import QuizPage       from "./pages/QuizPage";
import DashboardPage  from "./pages/DashboardPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBytes     from "./pages/admin/AdminBytes";
import AdminByteForm  from "./pages/admin/AdminByteForm";
import AdminUsers     from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"     element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected user routes */}
        <Route path="/learn"      element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
        <Route path="/byte/:id"   element={<ProtectedRoute><BytePage /></ProtectedRoute>} />
        <Route path="/quiz/:id"   element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        {/* Admin routes — AdminRoute guard is the layout itself */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index               element={<AdminDashboard />} />
          <Route path="bytes"        element={<AdminBytes />} />
          <Route path="bytes/create" element={<AdminByteForm />} />
          <Route path="bytes/edit/:id" element={<AdminByteForm />} />
          <Route path="users"        element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}