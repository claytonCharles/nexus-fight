import { Navigate, Route, Routes } from "react-router";
import Home from "@/pages/home";
import Students from "@/pages/students";
import StudentDetails from "@/pages/student-details";
import NotFound from "@/pages/not-found";
import AppLayout from "@/layouts/app-layout";
import AuthPage from "@/pages/auth";
import { useAuth } from "@/contexts/auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname + window.location.search }} />;
  }

  return <>{children}</>;
}

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}