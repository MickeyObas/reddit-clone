import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  login: (data: LoginResponseData) => void,
  user: LoginResponseData["user"] | null
}

interface LoginResponseData {
  access: string,
  refresh: string,
  user: {
    id: number,
    username: string,
    email: string
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedUser = localStorage.getItem('user')
  const [user, setUser] = useState<LoginResponseData["user"] | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  const login = (data: LoginResponseData) => {
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user);
  }

  return (
    <AuthContext.Provider value={{ login, user }}>
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
