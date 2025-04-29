"use client";

import { useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  return (
    <UserContext.Provider value={{ user, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuthUser = () => useContext(UserContext);
