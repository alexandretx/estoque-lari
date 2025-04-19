import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Evita piscar conteúdo de deslogado durante carregamento inicial
  if (loading) {
    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md min-h-[64px]">
            <div className="container mx-auto flex justify-between items-center">
                 <span className="text-xl font-bold">Estoque App</span>
                 {/* Pode adicionar um spinner aqui */}
            </div>
        </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-xl font-bold hover:text-gray-300">
          Estoque App
        </Link>

        <div className="space-x-4 flex items-center">
          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors">Dashboard</Link>
              <Link to="/celulares" className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors">Celulares</Link>
              <Link to="/acessorios" className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors">Acessórios</Link>
              <Link to="/planos" className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors">Planos</Link>
              <span className="border-l border-gray-600 pl-4 ml-2">Olá, {user.nome}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition-colors">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded transition-colors duration-200">Registrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 