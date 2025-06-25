import React, { createContext, ReactNode, useContext } from "react";
import { getCurrentUser, Admin } from "./appwrite";
import { useAppwrite } from "./useAppwrite";

interface GlobalContextType {
  isLogged: boolean;
  admin: Admin | null;
  loading: boolean;
  refetch: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { data: admin, loading, refetch } = useAppwrite({ fn: getCurrentUser });
  const isLogged = !!admin;

  return (
    <GlobalContext.Provider
      value={{ isLogged, admin, loading, refetch }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;