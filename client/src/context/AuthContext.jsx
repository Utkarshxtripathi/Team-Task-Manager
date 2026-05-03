import React, { createContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (!response.data) {
      throw new Error('Invalid response from server');
    }
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const signup = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  setUser(response.data);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
