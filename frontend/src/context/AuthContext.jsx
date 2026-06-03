import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Make sure this path matches where your axios.js is!

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Because we set credentials: true in axios, it will automatically send the HttpOnly cookie!
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.data.user);
    return response.data;
  };

  const register = async (name, email, password) => {
    // Notice: NO ROLE FIELD HERE! Just as you requested.
    await api.post('/auth/register', { name, email, password });
    // Auto-login after registration
    return login(email, password);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);