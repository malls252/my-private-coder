import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY_AUTH = "isAuthenticated";
const STORAGE_KEY_LAST_ACTIVE = "lastActiveTime";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout>();

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_LAST_ACTIVE);
    setIsAuthenticated(false);
  }, []);

  const checkSession = useCallback(() => {
    const auth = localStorage.getItem(STORAGE_KEY_AUTH);
    const lastActive = localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);

    if (auth === "true" && lastActive) {
      const timeSinceLastActive = Date.now() - parseInt(lastActive, 10);

      if (timeSinceLastActive > TIMEOUT_MS) {
        // Session expired
        logout();
        toast.info("Sesi berakhir", {
          description: "Anda otomatis keluar karena tidak aktif selama 5 menit",
        });
        return false;
      } else {
        // Session valid
        setIsAuthenticated(true);
        return true;
      }
    } else {
      setIsAuthenticated(false);
      return false;
    }
  }, [logout]);

  const updateActivity = useCallback(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, Date.now().toString());
    }
  }, [isAuthenticated]);

  const login = (pin: string) => {
    // Hardcoded PIN for personal use as requested
    if (pin === "041103") {
      localStorage.setItem(STORAGE_KEY_AUTH, "true");
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, Date.now().toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Initial Check
  useEffect(() => {
    try {
      checkSession();
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [checkSession]);

  // Activity Listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll", "click"];

    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));

    // Periodic check every 30 seconds to catch expired sessions while open
    const interval = setInterval(() => {
      checkSession();
    }, 30000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(interval);
    };
  }, [isAuthenticated, updateActivity, checkSession]);

  // Visibility Check (when returning to app)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkSession]);

  // Prevent flash of login screen while checking storage
  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
