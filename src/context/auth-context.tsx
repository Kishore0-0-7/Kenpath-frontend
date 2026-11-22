import * as React from "react";
import { authApi, getStoredToken, setStoredToken, getCachedUser, setCachedUser } from "../lib/api.js";
import type { User } from "../types/api.js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => getCachedUser());
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const initAuth = React.useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setCachedUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.me();
      setUser(response.user);
    } catch (err: any) {
      // ONLY wipe session if server definitively rejected credentials (401 Unauthorized)
      if (err.status === 401 || err.code === "TOKEN_INVALID" || err.code === "TOKEN_EXPIRED") {
        console.warn("Session invalidated by server:", err.message);
        setStoredToken(null);
        setCachedUser(null);
        setUser(null);
      } else {
        // Network drop or DB temporary unavailability: KEEP user logged in from cache
        console.warn("Preserving user session despite network/database connectivity drop:", err.message);
        const cached = getCachedUser();
        if (cached) {
          setUser(cached);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authApi.register({ name, email, password });
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setCachedUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
