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
        <nav className="bg-[#160126] text-white p-3 shadow-md min-h-[56px]">
            <div className="container mx-auto flex justify-between items-center">
                 <span className="text-lg font-bold">Estoque App</span>
                 {/* Pode adicionar um spinner aqui */}
            </div>
        </nav>
    );
  }

  return (
    <nav className="bg-[#160126] text-purple-300 p-3 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-lg font-bold text-white hover:text-purple-100 transition-colors">
          Estoque App
        </Link>

        {/* Menu para desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard" className="hover:text-purple-100 px-2 py-1 rounded transition-colors">Dashboard</Link>
              <Link to="/celulares" className="hover:text-purple-100 px-2 py-1 rounded transition-colors">Celulares</Link>
              <Link to="/acessorios" className="hover:text-purple-100 px-2 py-1 rounded transition-colors">Acessórios</Link>
              <span className="border-l border-purple-700 pl-4 ml-2 text-sm">Olá, <span className="font-medium text-white">{user.nome}</span>!</span>
              <button
                onClick={handleLogout}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-100 px-3 py-1 rounded transition-colors">Login</Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1 rounded transition-colors duration-200">Registrar</Link>
            </>
          )}
        </div>

        {/* Botão de hambúrguer para mobile */}
        <div className="md:hidden flex items-center">
          {isAuthenticated && (
            <span className="mr-2 text-xs truncate max-w-[120px]">Olá, <span className="font-medium text-white">{user.nome}</span>!</span>
          )}
          <button onClick={toggleMenu} className="hover:text-purple-100 focus:outline-none">
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
        <div className="md:hidden container mx-auto mt-2 pt-2 border-t border-purple-700">
          <div className="flex flex-col space-y-1">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded hover:bg-purple-700 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/celulares" onClick={closeMenu} className="block px-3 py-2 rounded hover:bg-purple-700 hover:text-white transition-colors">Celulares</Link>
                <Link to="/acessorios" onClick={closeMenu} className="block px-3 py-2 rounded hover:bg-purple-700 hover:text-white transition-colors">Acessórios</Link>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 hover:bg-purple-500 text-white w-full px-3 py-2 text-left rounded text-sm transition-colors duration-200 mt-2"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="block px-3 py-2 rounded hover:bg-purple-700 hover:text-white transition-colors">Login</Link>
                <Link to="/register" onClick={closeMenu} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold w-full px-3 py-2 rounded transition-colors duration-200">Registrar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 