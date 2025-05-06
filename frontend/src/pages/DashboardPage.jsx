import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardSkeleton } from '../components/SkeletonLoader';

const API_STATS_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/stats`;
const API_ACTIVITIES_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/activities`;
const API_OLD_ITEMS_URL = `${import.meta.env.VITE_API_URL}/api/dashboard/old-items`;

// Componente de Card reutilizável com ícone e animação
const StatCard = ({ title, value, linkTo, icon, subtext }) => (
  <Link to={linkTo} className="stat-card group">
    <div className="flex justify-between items-start w-full">
      <div>
        <p className="text-secondary font-medium mb-1">{title}</p>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 my-1">{value ?? '-'}</h3>
        {subtext && <p className="text-tiny">{subtext}</p>}
      </div>
      {icon && (
        <div className="icon-box transform transition-transform group-hover:scale-110">
          {icon}
        </div>
      )}
    </div>
  </Link>
);

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
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Atividades Recentes</h3>
      </div>
      
      {loading && (
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start pb-3 border-b border-gray-200">
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
        <div className="item-list">
          {activities.map((activity, index) => (
            <div key={index} className="item-list-row">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                <p className="text-tiny truncate">{activity.item} • {activity.time}</p>
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
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
    </svg>
  ),
  acessorio: (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
    </svg>
  ),
  alerta: (
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>
  ),
  refresh: (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
  ),
  add: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
    </svg>
  )
};

// Componente para listar itens antigos
const OldItemsList = ({ items }) => {
  if (!items || (items.oldCelulares.length === 0 && items.oldAcessorios.length === 0)) {
    return null; // Não renderiza nada se não houver itens antigos
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalItems = items.oldCelulares.length + items.oldAcessorios.length;

  return (
    <div className="alert alert-warning">
      <div className="flex items-start">
        <div className="mr-3 mt-0.5 text-amber-600">
          {Icons.alerta}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-base mb-2">Atenção: {totalItems} {totalItems === 1 ? 'item' : 'itens'} com mais de 180 dias no estoque</h4>
          
          <div className="max-h-48 overflow-y-auto text-sm space-y-3 pr-2">
            {items.oldCelulares.length > 0 && (
              <div className="mb-3">
                <p className="font-semibold mb-2 text-amber-700">Celulares ({items.oldCelulares.length})</p>
                <div className="space-y-2">
                  {items.oldCelulares.map(item => (
                    <Link 
                      key={item._id} 
                      to={`/celulares/editar/${item._id}`} 
                      className="block p-2 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-amber-900 border border-amber-200"
                      title={`Editar ${item.marca} ${item.modelo}`}
                    >
                      <div className="flex justify-between">
                        <span>{item.marca} {item.modelo} {item.imei && `(IMEI: ${item.imei})`}</span>
                        <span className="text-amber-600 font-medium">{formatDate(item.dataCompra)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {items.oldAcessorios.length > 0 && (
              <div>
                <p className="font-semibold mb-2 text-amber-700">Acessórios ({items.oldAcessorios.length})</p>
                <div className="space-y-2">
                  {items.oldAcessorios.map(item => (
                    <Link 
                      key={item._id} 
                      to={`/acessorios/editar/${item._id}`} 
                      className="block p-2 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-amber-900 border border-amber-200"
                      title={`Editar ${item.marca} ${item.modelo} (${item.tipo})`}
                    >
                      <div className="flex justify-between">
                        <span>{item.marca} {item.modelo} ({item.tipo || 'N/A'})</span>
                        <span className="text-amber-600 font-medium">{formatDate(item.dataCompra)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 max-w-6xl">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-gray-900">Dashboard</h1>
            {user && (
              <p className="text-gray-600 text-sm mt-1">Olá, <span className="font-medium text-gray-800">{user.nome}</span>. Bem-vindo(a) ao seu painel de controle.</p>
            )}
          </div>
          
          <button 
            onClick={fetchDashboardData}
            className="btn btn-outline flex items-center text-sm"
          >
            {Icons.refresh}
            Atualizar Dados
          </button>
        </div>
      </header>

      {/* Alerta de Itens Antigos */}
      <OldItemsList items={oldItems} />

      {error && (
        <div className="alert alert-danger mb-6" role="alert">
          <div className="flex">
            <svg className="w-5 h-5 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 className="font-bold text-red-800">Erro</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid de cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Card Celulares */}
        <StatCard
          title="Celulares em Estoque"
          value={stats?.celulares ?? '...'}
          linkTo="/celulares"
          icon={Icons.celular}
          subtext="Total de unidades"
        />

        {/* Card Acessórios */}
        <StatCard
          title="Acessórios em Estoque"
          value={stats?.acessorios ?? '...'}
          linkTo="/acessorios"
          icon={Icons.acessorio}
          subtext="Total de unidades"
        />
      </div>

      {/* Atividades Recentes */}
      <div className="mb-8">
        <RecentActivities />
      </div>

      {/* Links Rápidos - Agora com melhor design e espaçamento */}
      <div className="card p-6">
        <h3 className="card-title mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/celulares/novo" className="btn btn-primary">
            {Icons.add}
            Adicionar Celular
          </Link>
          <Link to="/acessorios/novo" className="btn btn-primary">
            {Icons.add}
            Adicionar Acessório
          </Link>
          <Link to="/celulares" className="btn btn-outline">
            Ver Todos Celulares
          </Link>
          <Link to="/acessorios" className="btn btn-outline">
            Ver Todos Acessórios
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 