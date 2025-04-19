import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// URL base da API de autenticação (usa variável de ambiente VITE_API_URL)
const AUTH_API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Importante começar como true
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
        await fetchUserData(); // Espera fetchUserData terminar
      } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
        setUser(null);
        setLoading(false); // Marca como carregado se não há token
      }
    };
    initializeAuth();
  }, [token]);

  const fetchUserData = async () => {
    // Não reseta loading aqui, pois faz parte da inicialização
    setError(null);
    try {
      const response = await axios.get(`${AUTH_API_URL}/me`);
      setUser(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário (token inválido/expirado?):", err.response?.data?.message || err.message);
      logout(); // Desloga se não conseguir buscar dados
      // Não define erro aqui para não mostrar na tela logo ao carregar com token inválido
    } finally {
       if (loading) setLoading(false); // Só define loading false ao final da inicialização
    }
  };

  const login = async (email, senha) => {
    setLoading(true); // Define loading específico para a ação de login
    setError(null);
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, { email, senha });
      setToken(response.data.token); // Dispara o useEffect para buscar dados e remover loading inicial
      return true;
    } catch (err) {
      console.error("Erro no login:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Email ou senha inválidos.');
      setUser(null);
      setToken(null);
      setLoading(false); // Termina o loading da ação de login em caso de erro
      return false;
    }
  };

  const register = async (nome, email, senha) => {
    setLoading(true); // Define loading específico para a ação de registro
    setError(null);
    try {
      const response = await axios.post(`${AUTH_API_URL}/register`, { nome, email, senha });
      setToken(response.data.token); // Dispara o useEffect para buscar dados e remover loading inicial
       return true;
    } catch (err) {
      console.error("Erro no registro:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Erro ao registrar. Verifique os dados.');
      setUser(null);
      setToken(null);
      setLoading(false); // Termina o loading da ação de registro em caso de erro
      return false;
    }
  };

  const logout = () => {
    setToken(null); // Dispara o useEffect para limpar tudo e definir loading=false
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading, // Usado principalmente para o estado inicial
    error,
    login,
    register,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 