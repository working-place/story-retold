/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getToken, setToken, removeToken } from '../utils/authStorage';
import { authApi } from '../services/api/auth';
import type { LoginRequest } from '../types/api.types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  changePassword: (password: string, passwordConfirmation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // After first render, loading is done. This is safe and runs only once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    setToken(response.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  const changePassword = async (password: string, passwordConfirmation: string) => {
    await authApi.changePassword({ password, password_confirmation: passwordConfirmation });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};