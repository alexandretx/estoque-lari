import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { PencilIcon, TrashIcon } from './../components/Icons';

const API_STATS_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/stats`;
const API_ACTIVITIES_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/activities`;
const API_OLD_ITEMS_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/old-items`;

// Componente de Card reutilizável com ícone e animação
const StatCard = ({ title, value, linkTo, bgColor = 'bg-blue-500', borderColor = 'border-blue-600', icon, subtext }) => (
  <Link to={linkTo} className={`block p-3 sm:p-4 md:p-6 rounded-lg shadow-md dark-card card-glow border-t-4 ${borderColor} hover:shadow-lg transition-all duration-300`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs sm:text-sm font-medium text-purple-300">{title}</p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white my-1">{value ?? '-'}</h3>
        {subtext && <p className="text-[10px] sm:text-xs text-purple-200">{subtext}</p>}
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
    <div className="dark-card rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      <h3 className="text-sm md:text-lg font-semibold text-purple-200 mb-2 md:mb-4">Atividades Recentes</h3>
      
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
            <div key={index} className="flex items-start pb-3 sm:pb-4 border-b border-purple-900">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-900 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">{activity.action}</p>
                <p className="text-[10px] sm:text-xs text-purple-300 truncate">{activity.item} • {activity.time}</p>
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
};

// Novo componente para listar itens antigos
const OldItemsList = ({ items }) => {
  if (!items || (items.oldCelulares.length === 0 && items.oldAcessorios.length === 0)) {
    return null; // Não renderiza nada se não houver itens antigos
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="mb-6 bg-purple-900/70 border-l-4 border-purple-500 text-white p-4 rounded-md shadow-md">
      <h3 className="font-bold text-sm mb-2">Atenção: Itens com mais de 180 dias no estoque</h3>
      <div className="max-h-48 overflow-y-auto text-xs space-y-2 pr-2">
        {items.oldCelulares.length > 0 && (
          <div className="mb-2">
            <p className="font-semibold mb-1">Celulares:</p>
            {items.oldCelulares.map(item => (
              <Link 
                key={item._id} 
                to={`/celulares/editar/${item._id}`} 
                className="block p-1.5 bg-purple-50 rounded hover:bg-purple-200 transition-colors text-purple-900"
                title={`Editar ${item.marca} ${item.modelo}`}
              >
                <span>{item.marca} {item.modelo} (IMEI: {item.imei || 'N/A'}) - Compra: {formatDate(item.dataCompra)}</span>
              </Link>
            ))}
          </div>
        )}
        {items.oldAcessorios.length > 0 && (
          <div>
            <p className="font-semibold mb-1">Acessórios:</p>
            {items.oldAcessorios.map(item => (
              <Link 
                key={item._id} 
                to={`/acessorios/editar/${item._id}`} 
                className="block p-1.5 bg-purple-50 rounded hover:bg-purple-200 transition-colors text-purple-900"
                title={`Editar ${item.marca} ${item.modelo} (${item.tipo})`}
              >
                <span>{item.marca} {item.modelo} ({item.tipo || 'N/A'}) - Compra: {formatDate(item.dataCompra)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [oldItems, setOldItems] = useState({ oldCelulares: [], oldAcessorios: [] });

  // Função para buscar todos os dados do dashboard
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Busca as estatísticas (celulares, acessórios, planos)
      const statsResponse = await axios.get(API_STATS_URL);
      setStats(statsResponse.data);

      // Busca os itens antigos
      const oldItemsResponse = await axios.get(API_OLD_ITEMS_URL);
      setOldItems(oldItemsResponse.data);

    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
      setError("Falha ao carregar dados do dashboard. Tente novamente.");
      // Limpar stats em caso de erro para não mostrar dados antigos
      setStats(null);
      setOldItems({ oldCelulares: [], oldAcessorios: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Roda apenas na montagem inicial

  // Dados simulados para o gráfico (poderiam vir do backend)
  const chartData = [
    { label: 'Vendas Semana 1', value: 12, color: 'bg-blue-500' },
    { label: 'Vendas Semana 2', value: 19, color: 'bg-green-500' },
    { label: 'Vendas Semana 3', value: 3, color: 'bg-red-500' },
    { label: 'Vendas Semana 4', value: 5, color: 'bg-yellow-500' },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8">Dashboard</h1>

      {/* Alerta de Itens Antigos */}
      <OldItemsList items={oldItems} />

      {error && (
        <div className="bg-red-900/60 border-l-4 border-red-500 text-white p-4 mb-4 rounded-md" role="alert">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      )}

      {/* Grid de cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {/* Card Celulares */}
        <StatCard
          title="Celulares em Estoque"
          value={stats?.celulares ?? '...'}
          linkTo="/celulares"
          bgColor="bg-gradient-to-r from-purple-500 to-violet-600"
          borderColor="border-purple-500"
          icon={Icons.celular}
          subtext="Total de unidades"
        />

        {/* Card Acessórios */}
        <StatCard
          title="Acessórios em Estoque"
          value={stats?.acessorios ?? '...'}
          linkTo="/acessorios"
          bgColor="bg-gradient-to-r from-violet-500 to-fuchsia-600"
          borderColor="border-violet-500"
          icon={Icons.acessorio}
          subtext="Total de unidades"
        />

        {/* Card Planos - REMOVIDO */}
        {/* 
        <StatCard
          title="Planos Cadastrados"
          value={stats?.planos ?? '...'}
          linkTo="/planos"
          bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
          borderColor="border-purple-600"
          icon={ 
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          }
          subtext="Tipos de planos disponíveis"
        /> 
        */}
      </div>

      {/* Grid para Gráficos e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Gráfico (Simulado) */}
        {/* <SimpleBarChart data={chartData} title="Vendas Simuladas (Exemplo)" /> */}

        {/* Atividades Recentes */}
        <div className="lg:col-span-3">
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 