import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_STATS_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/stats`;

// Componente de Card reutilizável com ícone
const StatCard = ({ title, value, linkTo, bgColor = 'bg-blue-500', icon }) => (
  <Link to={linkTo} className={`block p-6 rounded-lg shadow-lg text-white ${bgColor} hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex justify-between items-start">
        <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-4xl font-bold">{value ?? '-'}</p>
        </div>
        {icon && <div className="text-3xl opacity-80">{icon}</div>}
    </div>
  </Link>
);

// Ícones simples (pode usar SVGs ou biblioteca de ícones)
const Icons = {
    celular: '📱',
    acessorio: '🎧',
    plano: '📄',
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_STATS_URL);
      setStats(response.data);
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Erro ao carregar estatísticas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">Dashboard</h2>
      {user && (
          <p className="text-xl mb-8 text-gray-600">Bem-vindo(a) de volta, <span className="font-semibold text-gray-700">{user.nome}</span>!</p>
      )}

      {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-36 bg-gray-300 rounded-lg shadow-lg"></div>
            ))}
          </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md relative mb-6 shadow-md" role="alert">
          <p className="font-bold">Erro ao carregar dados</p>
          <p>{error}</p>
          <button onClick={fetchStats} className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Tentar Novamente</button>
        </div>
      )}

      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Celulares em Estoque"
            value={stats.celulares}
            linkTo="/celulares"
            bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
            icon={Icons.celular}
          />
          <StatCard
            title="Acessórios em Estoque"
            value={stats.acessorios}
            linkTo="/acessorios"
            bgColor="bg-gradient-to-r from-green-500 to-green-600"
            icon={Icons.acessorio}
           />
          <StatCard
            title="Planos Cadastrados"
            value={stats.planos}
            linkTo="/planos"
            bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
            icon={Icons.plano}
          />
        </div>
      )}

      {!loading && !stats && !error && (
           <p className="text-center text-gray-500 mt-8">Não foi possível carregar as estatísticas.</p>
      )}

    </div>
  );
};

export default DashboardPage; 