
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ADMIN AUTHENTICATION DATA
  // ==========================================
  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("adminUser");

      const storedToken =
        localStorage.getItem("adminToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error(
        "Failed to load admin authentication data:",
        error
      );

      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");

      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // ADMIN LOGIN
  // ==========================================
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem(
      "adminUser",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "adminToken",
      userToken
    );
  };

  // ==========================================
  // ADMIN LOGOUT
  // ==========================================
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
  };

  // ==========================================
  // AUTHENTICATION STATUS
  // ==========================================
  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// CUSTOM AUTH HOOK
// ==========================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;

