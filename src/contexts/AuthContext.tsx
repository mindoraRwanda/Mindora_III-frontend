"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, setAccessToken } from "@/lib/api";

interface User {
  userId: string;
  email: string;
  role: "PATIENT" | "THERAPIST" | "ADMIN";
}

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// The Auth Service's /login and /refresh only ever return { accessToken } —
// there is no `user` field on that response. Identity claims (userId/email/role)
// live in the JWT payload itself, so decode them from there instead of expecting
// the server to send a separate user object.
function userFromAccessToken(token: string): User {
  const payload = token.split(".")[1];
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const decoded = JSON.parse(atob(base64));
  return { userId: decoded.sub, email: decoded.email, role: decoded.role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((token: string | null) => {
    setTokenState(token);
    setAccessToken(token); // sync to in-memory store for apiFetch
  }, []);

  // On mount — attempt silent refresh using HttpOnly cookie
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await apiFetch<{ accessToken: string }>("/api/v1/auth/refresh", {
          method: "POST",
        });
        setToken(data.accessToken);
        setUser(userFromAccessToken(data.accessToken));
      } catch {
        // No valid session — user needs to log in
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [setToken]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<{ accessToken: string }>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.accessToken);
      setUser(userFromAccessToken(data.accessToken));
    },
    [setToken]
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/v1/auth/logout", { method: "POST" });
    } finally {
      setToken(null);
      setUser(null);
    }
  }, [setToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
