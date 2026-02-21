import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MOCK_CREDENTIALS } from "@/data/mockData";
import { FileText } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>FileCRM</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Manage your files<br />and customers,<br />all in one place.
          </h1>
          <p className="text-lg opacity-80 max-w-md">
            A modern CRM with secure file management, role-based access, and seamless collaboration.
          </p>
        </div>
        <p className="text-sm opacity-60">© 2024 FileCRM. All rights reserved.</p>
      </div>

      {/* Right login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 lg:hidden mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>FileCRM</span>
            </div>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
            <div className="w-full rounded-lg bg-muted p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Demo credentials:</p>
              <p>Admin: {MOCK_CREDENTIALS.admin.email} / {MOCK_CREDENTIALS.admin.password}</p>
              <p>Customer: {MOCK_CREDENTIALS.customer.email} / {MOCK_CREDENTIALS.customer.password}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
