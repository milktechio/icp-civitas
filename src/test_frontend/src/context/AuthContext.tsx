import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    const authClient = await AuthClient.create();
    authClient.login({
      // 7 days in nanoseconds
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        setIsAuthenticated(true);
      },
    });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
