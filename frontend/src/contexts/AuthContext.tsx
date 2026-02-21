import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types";
import { authService } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("auth_token", response.token);
    localStorage.setItem("auth_user", JSON.stringify(response.user));
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await authService.register({ email, password, firstName, lastName });
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem("auth_token", response.token);
    localStorage.setItem("auth_user", JSON.stringify(response.user));
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
    localStorage.setItem("auth_user", JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout, hasRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
