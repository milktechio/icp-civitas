import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useEffect, useState } from "react";

type AuthContextType = {
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const adminPrincipals = [
  "icbe6-fncid-t7cy2-wyqgx-w2jhu-3wgpt-x3n5x-5rhtj-czgbg-latkm-mae", // Ejemplo de Principal de admin 1
  "qo2sj-nyaaa-aaaaa-aaaaq-cai", // Ejemplo de Principal de admin 2
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async () => {
    setLoading(true);

    const authClient = await AuthClient.create();
    authClient.login({
      // 7 days in nanoseconds
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        setIsAuthenticated(true);
      },
    });

    setLoading(false);
  };

  const logout = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIsAuthenticated(false);
  };

  const authClientInit = async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = await authClient.getIdentity();
      const principalId = await identity.getPrincipal().toText();

      console.log(principalId);

      if (!identity.getPrincipal().isAnonymous()) {
        setIsAuthenticated(true);
      }

      if (adminPrincipals?.includes(principalId)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  };

  useEffect(() => {
    authClientInit();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAdmin, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
