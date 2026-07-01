import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  login as loginService,
  logout as logoutService,
  me as meService,
  setupFirstUser as setupFirstUserService,
} from "@/services/auth";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  setupFirstUser: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function hasSessionCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith("session_token="));
}

function clearStoredUser() {
  return;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!hasSessionCookie()) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const currentUser = await meService();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void loadCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    await loginService({ email, password });

    const nextUser = await meService();
    setUser(nextUser);
  };

  const setupFirstUser = async (
    name: string,
    email: string,
    password: string,
  ) => {
    await setupFirstUserService({ name, email, password });
    setUser(null);
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch {
      // ignore and clear local state
    }

    clearStoredUser();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      setupFirstUser,
      logout,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
