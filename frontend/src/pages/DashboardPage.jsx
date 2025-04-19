import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/SkeletonLoader';

const API_STATS_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/stats`;
const API_ACTIVITIES_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/activities`;

// Componente de Card reutilizável com ícone e animação
const StatCard = ({ title, value, linkTo, bgColor = 'bg-blue-500', borderColor = 'border-blue-600', icon, subtext }) => (
  <Link to={linkTo} className={`block p-3 sm:p-4 md:p-6 rounded-lg shadow-md bg-white border-t-4 ${borderColor} hover:shadow-lg transition-all duration-300`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 my-1">{value ?? '-'}</h3>
        {subtext && <p className="text-[10px] sm:text-xs text-gray-500">{subtext}</p>}
      </div>
      {icon && <div className={`text-xl ${bgColor} w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white shadow-md`}>{icon}</div>}
    </div>
  </Link>
);

// Componente de Gráfico Simplificado (Simulado por barras)
const SimpleBarChart = ({ data, title }) => {
  // Encontrar o valor máximo para calcular as porcentagens
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 col-span-1 md:col-span-2 lg:col-span-3">
      <h3 className="text-sm md:text-lg font-semibold text-gray-700 mb-2 md:mb-4">{title}</h3>
      <div className="space-y-3 md:space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${item.color}`} 
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para Atividades Recentes (agora buscando do backend)
const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ACTIVITIES_URL);
        setActivities(response.data);
      } catch (err) {
        console.error("Erro ao buscar atividades:", err);
        setError("Não foi possível carregar atividades recentes");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      <h3 className="text-sm md:text-lg font-semibold text-gray-700 mb-2 md:mb-4">Atividades Recentes</h3>
      
      {loading && (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start pb-3 border-b border-gray-100">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full mr-2 sm:mr-3"></div>
              <div className="flex-1">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1 sm:mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && error && (
        <div className="text-center text-gray-500 py-3 sm:py-4">
          <p className="text-xs sm:text-sm">{error}</p>
        </div>
      )}
      
      {!loading && !error && activities.length === 0 && (
        <div className="text-center text-gray-500 py-3 sm:py-4">
          <p className="text-xs sm:text-sm">Nenhuma atividade recente</p>
        </div>
      )}
      
      {!loading && !error && activities.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start pb-3 sm:pb-4 border-b border-gray-100">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">{activity.item} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Ícones mais modernos usando SVG
const Icons = {
  celular: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
    </svg>
  ),
  acessorio: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
    </svg>
  ),
  plano: (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
  ),
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

  // Preparar dados para o gráfico de barras
  const chartData = stats ? [
    { label: 'Celulares', value: stats.celulares, color: 'bg-blue-600' },
    { label: 'Acessórios', value: stats.acessorios, color: 'bg-green-600' },
    { label: 'Planos', value: stats.planos, color: 'bg-purple-600' }
  ] : [];

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h2>
          {user && (
            <p className="mt-1 text-xs sm:text-sm text-gray-600">Bem-vindo(a) de volta, <span className="font-medium text-gray-800">{user.nome}</span></p>
          )}
        </div>
        <button 
          onClick={fetchStats} 
          className="mt-3 sm:mt-0 px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start text-xs sm:text-sm w-full sm:w-auto"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Atualizar
        </button>
      </div>

      {loading && (
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-3 sm:p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 mb-1 sm:mb-2"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md relative mb-4 sm:mb-6 shadow-md" role="alert">
          <p className="font-bold text-xs sm:text-sm">Erro ao carregar dados</p>
          <p className="text-xs">{error}</p>
          <button onClick={fetchStats} className="mt-2 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Tentar Novamente</button>
        </div>
      )}

      {!loading && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
            <StatCard
              title="Celulares em Estoque"
              value={stats.celulares}
              linkTo="/celulares"
              bgColor="bg-blue-600"
              borderColor="border-blue-600"
              icon={Icons.celular}
              subtext="Gerenciar celulares"
            />
            <StatCard
              title="Acessórios em Estoque"
              value={stats.acessorios}
              linkTo="/acessorios"
              bgColor="bg-green-600"
              borderColor="border-green-600"
              icon={Icons.acessorio}
              subtext="Gerenciar acessórios"
            />
            <StatCard
              title="Planos Cadastrados"
              value={stats.planos}
              linkTo="/planos"
              bgColor="bg-purple-600"
              borderColor="border-purple-600"
              icon={Icons.plano}
              subtext="Gerenciar planos"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <SimpleBarChart data={chartData} title="Visão Geral do Estoque" />
            <RecentActivities />
          </div>
        </>
      )}

      {!loading && !stats && !error && (
        <div className="text-center py-6 sm:py-8 bg-white rounded-lg shadow">
          <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="mt-2 text-xs font-medium text-gray-900 sm:text-sm">Sem dados disponíveis</h3>
          <p className="mt-1 text-xs text-gray-500">Não foi possível carregar as estatísticas.</p>
          <div className="mt-4 sm:mt-6">
            <button onClick={fetchStats} className="bg-blue-600 px-3 py-1.5 text-white rounded-md text-xs sm:text-sm hover:bg-blue-700">Tentar Novamente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 
