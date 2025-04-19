import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Opcional: Retornar um componente de loading global aqui
    return <div className="flex justify-center items-center h-screen"><p>Verificando autenticação...</p></div>;
  }

  // Redireciona para login se não estiver autenticado após o carregamento
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute; 