"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { verifyUser } from '@/api/fetchAPI'; // Update the path to your actual auth utility

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const jwtToken = Cookies.get('token');
    if (jwtToken) {
      verifyUser(jwtToken)
        .then((data: any) => {
          if (data.status === 'success') {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            router.replace('/'); // Redirect to home if not authenticated
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          router.replace('/'); // Redirect to home on error
        })
        .finally(() => setLoading(false));
    } else {
      setIsAuthenticated(false);
      setLoading(false);
      router.replace('/'); // Redirect to home if no token
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
