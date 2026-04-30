import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import CreatePost from "./pages/posts/CreatePost";
import Drafts from "./pages/posts/Drafts";
import ScheduledPosts from "./pages/posts/ScheduledPosts";
import Calendar from "./pages/posts/Calendar";
import Approvals from "./pages/approvals/Approvals";
import Analytics from "./pages/analytics/Analytics";
import AIImages from "./pages/ai/AIImages";
import ConnectedAccounts from "./pages/accounts/ConnectedAccounts";
import Settings from "./pages/settings/Settings";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <p className="text-dark-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="drafts" element={<Drafts />} />
        <Route path="scheduled" element={<ScheduledPosts />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai-images" element={<AIImages />} />
        <Route path="accounts" element={<ConnectedAccounts />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(15, 23, 42, 0.95)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error: { iconTheme: { primary: "#f43f5e", secondary: "#fff" } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
