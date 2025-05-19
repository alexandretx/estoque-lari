import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Evita piscar conteúdo de deslogado durante carregamento inicial
  if (loading) {
    return (
        <nav className="bg-gray-800 text-white p-3 shadow-md min-h-[56px]">
            <div className="container mx-auto flex justify-between items-center">
                 <span className="text-lg font-bold">Estoque App</span>
                 {/* Pode adicionar um spinner aqui */}
            </div>
        </nav>
    );
  }

  return (
    <nav className="bg-gray-800 text-white p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-lg font-bold hover:text-gray-300">
          Estoque App
        </Link>

        {/* Menu para desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors">Dashboard</Link>
              <Link to="/celulares" className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors">Celulares</Link>
              <Link to="/acessorios" className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors">Acessórios</Link>
              <div className="relative group">
                <button className="hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-700 transition-colors flex items-center">
                  Vivo <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/vivo/celulares" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Celulares Vivo</Link>
                  <Link to="/vivo/acessorios" className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">Acessórios Vivo</Link>
                </div>
              </div>
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

        {/* Botão de hambúrguer para mobile */}
        <div className="md:hidden flex items-center">
          {isAuthenticated && (
            <span className="mr-2 text-xs truncate max-w-[120px]">Olá, {user.nome}!</span>
          )}
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden container mx-auto mt-2 pt-2 border-t border-gray-600">
          <div className="flex flex-col space-y-1">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="px-2 py-2 rounded hover:bg-gray-700 transition-colors">Dashboard</Link>
                <Link to="/celulares" onClick={closeMenu} className="px-2 py-2 rounded hover:bg-gray-700 transition-colors">Celulares</Link>
                <Link to="/acessorios" onClick={closeMenu} className="px-2 py-2 rounded hover:bg-gray-700 transition-colors">Acessórios</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-2 text-left rounded text-sm transition-colors duration-200 mt-2"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="px-2 py-2 rounded hover:bg-gray-700 transition-colors">Login</Link>
                <Link to="/register" onClick={closeMenu} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded transition-colors duration-200">Registrar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 