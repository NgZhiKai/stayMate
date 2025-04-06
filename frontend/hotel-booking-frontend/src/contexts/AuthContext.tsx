import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  userId: string | null;
  login: (token: string, role: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  userId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const savedRole = sessionStorage.getItem("role");
    const savedUserId = sessionStorage.getItem("userId");

    setIsLoggedIn(!!token); // Check if token exists
    setRole(savedRole ? savedRole.toLowerCase() : null); // Set role from sessionStorage if available
    setUserId(savedUserId); // Set userId from sessionStorage if available
  }, []);

  const login = (token: string, role: string, userId: string) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role.toLowerCase());
    sessionStorage.setItem("userId", userId);

    setIsLoggedIn(true);
    setRole(role.toLowerCase());
    setUserId(userId);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userId");
    
    setIsLoggedIn(false);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
