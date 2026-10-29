import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [schoolName, setSchoolName] = useState('BDS TELECOM Nancy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bds_admin_token');
    if (token) {
      api.auth.verify()
        .then((res) => {
          setIsAdmin(true);
          if (res.school_name) setSchoolName(res.school_name);
        })
        .catch(() => {
          localStorage.removeItem('bds_admin_token');
          setIsAdmin(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (password) => {
    const res = await api.auth.login(password);
    localStorage.setItem('bds_admin_token', res.access_token);
    setIsAdmin(true);
    if (res.school_name) setSchoolName(res.school_name);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('bds_admin_token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, schoolName, setSchoolName, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
