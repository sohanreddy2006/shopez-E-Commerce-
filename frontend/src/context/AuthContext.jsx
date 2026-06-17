import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('shopezUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const persistUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem('shopezUser', JSON.stringify(nextUser));
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persistUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistUser(data);
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    persistUser(data);
    return data;
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await api.post('/auth/logout');
      }
    } catch {
      // Local logout should still complete even if the token has expired.
    }

    setUser(null);
    localStorage.removeItem('shopezUser');
  };

  const value = useMemo(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      login,
      logout,
      register,
      updateProfile
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
