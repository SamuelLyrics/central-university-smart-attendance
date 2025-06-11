
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { LOCAL_STORAGE_KEYS, DUMMY_USERS } from '../constants';
import { loginUser, logoutUser } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize users if not already present in localStorage
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENTS)) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS)) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify([]));
    }
    
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.LOGGED_IN_USER);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGGED_IN_USER);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    const user = await loginUser(username, password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LOGGED_IN_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGGED_IN_USER);
    }
    setIsLoading(false);
    return user;
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGGED_IN_USER);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { currentUser, isLoading, login: handleLogin, logout: handleLogout } },
    children
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
