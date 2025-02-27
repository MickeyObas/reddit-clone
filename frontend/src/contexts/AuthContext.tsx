import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  isRegistered: boolean;
  setIsRegistered: (registered: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ isVerified, setIsVerified, isRegistered, setIsRegistered }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
