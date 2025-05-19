import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon } from '../../components/Icons';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/acessorios`;

const VivoAcessoriosPage = () => {
  const [acessorios, setAcessorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAcessorios, setFilteredAcessorios] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Buscar acessórios
  const fetchAcessorios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setAcessorios(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar acessórios:', error);
      toast.error('Erro ao carregar acessórios da Vivo');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcessorios();
  }, [fetchAcessorios]);

  // Obter tipos únicos para o filtro
  const getTipos = () => {
    const tipos = [...new Set(acessorios.map(item => item.tipo))].filter(Boolean);
    return tipos.sort();
  };

  // Filtrar e classificar acessórios
  useEffect(() => {
    let result = [...acessorios];

    // Aplicar filtro de tipo
    if (tipoFilter !== 'todos') {
      result = result.filter(acessorio => acessorio.tipo === tipoFilter);
    }

    // Aplicar filtro de status
    if (statusFilter !== 'todos') {
      result = result.filter(acessorio => acessorio.status === statusFilter);
    }

    // Aplicar busca
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        acessorio =>
          acessorio.marca?.toLowerCase().includes(searchTermLower) ||
          acessorio.modelo?.toLowerCase().includes(searchTermLower) ||
          acessorio.tipo?.toLowerCase().includes(searchTermLower)
      );
    }

    // Aplicar classificação
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Tratamento especial para datas
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'dataCompra') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredAcessorios(result);
  }, [acessorios, searchTerm, sortConfig, tipoFilter, statusFilter]);

  // Função para ordenar
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Função para excluir acessório
  const handleDeleteAcessorio = async (id, tipo, marca, modelo) => {
    if (window.confirm(`Tem certeza que deseja excluir o acessório ${tipo} ${marca} ${modelo}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Acessório excluído com sucesso!');
        fetchAcessorios(); // Recarregar a lista
      } catch (error) {
        console.error('Erro ao excluir acessório:', error);
        toast.error('Erro ao excluir acessório');
      }
    }
  };

  // Formatador de data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para obter a cor do status
  const getStatusColor = (status) => {
    if (status === 'Guardado') return 'text-green-600';
    if (status === 'Vitrine') return 'text-red-600';
    return 'text-gray-700';
  };

  // Estilo para o cabeçalho da coluna ordenável
  const getSortableHeaderStyle = (key) => {
    return {
      cursor: 'pointer',
      position: 'relative',
      paddingRight: '15px',
      '&::after': {
        content: sortConfig.key === key 
          ? (sortConfig.direction === 'asc' ? '"▲"' : '"▼"') 
          : '""',
        position: 'absolute',
        right: '5px',
        top: '50%',
        transform: 'translateY(-50%)'
      }
    };
  };

  // Componente para lista de acessórios
  const AcessoriosList = () => (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th 
              className="py-2 px-4 font-semibold text-sm text-left"
              onClick={() => requestSort('tipo')}
              style={getSortableHeaderStyle('tipo')}
            >
              Tipo
            </th>
            <th 
              className="py-2 px-4 font-semibold text-sm text-left"
              onClick={() => requestSort('marca')}
              style={getSortableHeaderStyle('marca')}
            >
              Marca
            </th>
            <th 
              className="py-2 px-4 font-semibold text-sm text-left"
              onClick={() => requestSort('modelo')}
              style={getSortableHeaderStyle('modelo')}
            >
              Modelo
            </th>
            <th
              className="py-2 px-4 font-semibold text-sm text-left"
              onClick={() => requestSort('status')}
              style={getSortableHeaderStyle('status')}
            >
              Status
            </th>
            <th className="py-2 px-4 font-semibold text-sm text-left">Cor</th>
            <th 
              className="py-2 px-4 font-semibold text-sm text-left"
              onClick={() => requestSort('quantidade')}
              style={getSortableHeaderStyle('quantidade')}
            >
              Qtd
            </th>
            <th 
              className="py-2 px-4 font-semibold text-sm text-left"
              onClick={() => requestSort('dataCompra')}
              style={getSortableHeaderStyle('dataCompra')}
            >
              Data de Compra
            </th>
            <th className="py-2 px-4 font-semibold text-sm text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredAcessorios.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                Nenhum acessório encontrado
              </td>
            </tr>
          ) : (
            filteredAcessorios.map((acessorio) => (
              <tr key={acessorio._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 text-sm">{acessorio.tipo || 'N/A'}</td>
                <td className="py-2 px-4 text-sm">{acessorio.marca || 'N/A'}</td>
                <td className="py-2 px-4 text-sm">{acessorio.modelo || 'N/A'}</td>
                <td className={`py-2 px-4 text-sm font-medium ${getStatusColor(acessorio.status)}`}>
                  {acessorio.status || 'N/A'}
                </td>
                <td className="py-2 px-4 text-sm">{acessorio.cor || 'N/A'}</td>
                <td className="py-2 px-4 text-sm">{acessorio.quantidade || '0'}</td>
                <td className="py-2 px-4 text-sm">{formatDate(acessorio.dataCompra)}</td>
                <td className="py-2 px-4 text-sm text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`/vivo/acessorios/editar/${acessorio._id}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteAcessorio(acessorio._id, acessorio.tipo, acessorio.marca, acessorio.modelo)}
                      className="text-red-600 hover:text-red-800"
                      title="Excluir"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Componente de carregamento
  const LoadingSkeleton = () => (
    <div className="animate-pulse mt-4">
      <div className="h-10 bg-gray-200 rounded mb-2"></div>
      <div className="space-y-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Acessórios Vivo
        </h1>
        <Link
          to="/vivo/acessorios/novo"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          + Adicionar Acessório
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="flex-1 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar por tipo, marca, modelo..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label htmlFor="tipoFilter" className="text-sm font-medium text-gray-700">Tipo:</label>
          <select
            id="tipoFilter"
            className="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            {getTipos().map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">Status:</label>
          <select
            id="statusFilter"
            className="pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="Guardado">Guardado</option>
            <option value="Vitrine">Vitrine</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSkeleton /> : <AcessoriosList />}
    </div>
  );
};

export default VivoAcessoriosPage; 