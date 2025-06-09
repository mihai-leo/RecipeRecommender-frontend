// services/AuthContext.js
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    return userId && role ? { userId, role } : null;
  });

  const login = ({ userId, role }) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
    setAuth({ userId, role });
  };

  const logout = () => {
       localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
