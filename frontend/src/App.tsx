import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminFiles from "@/pages/admin/Files";
import CustomerDashboard from "@/pages/customer/Dashboard";
import CustomerFiles from "@/pages/customer/Files";
import CustomerProfile from "@/pages/customer/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function RootRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin routes */}
            <Route element={<ProtectedRoute role="ADMIN"><AppLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/files" element={<AdminFiles />} />
            </Route>

            {/* Customer routes */}
            <Route element={<ProtectedRoute role="CUSTOMER"><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/dashboard/files" element={<CustomerFiles />} />
              <Route path="/dashboard/profile" element={<CustomerProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
