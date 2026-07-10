/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { getToken, removeToken } from '../utils/authStorage';
import { authApi } from '../services/api/auth';
import type { LoginRequest } from '../types/api.types';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  changePassword: (password: string, passwordConfirmation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Токен читается синхронно из localStorage при инициализации,
  // поэтому отдельного состояния загрузки не требуется.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getToken());

  const login = async (credentials: LoginRequest) => {
    await authApi.login(credentials); // токен сохраняется внутри authApi.login
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
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
