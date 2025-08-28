import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie, deleteCookie, hasCookie } from "cookies-next";

// Create context
const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

const AUTH_COOKIE_KEY = "_EduGlobal_AUTH_KEY_";

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const getSession = () => {
    const cookie = getCookie(AUTH_COOKIE_KEY)?.toString();
    if (!cookie) return null;
    try {
      return JSON.parse(cookie);
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getSession());

  const saveSession = (userData) => {
    const sessionData = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isLoggedIn: userData.isLoggedIn,
      token: userData.token,
    };

    // Save in cookie (13 days)
    setCookie(AUTH_COOKIE_KEY, JSON.stringify(sessionData), {
      path: "/",
      maxAge: 13 * 24 * 60 * 60, // 13 days in seconds
    });

    setUser(sessionData);
    console.log("Session saved:", sessionData);
  };

  const removeSession = () => {
    deleteCookie(AUTH_COOKIE_KEY, { path: "/" });
    setUser(null);
    navigate("/auth/sign-in");
  };

  const isAuthenticated = !!user && hasCookie(AUTH_COOKIE_KEY);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        saveSession,
        removeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
