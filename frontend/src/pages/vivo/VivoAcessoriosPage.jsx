import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/acessorios`;

const VivoAcessoriosPage = () => {
  const [acessorios, setAcessorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchAcessorios();
  }, []);

  const fetchAcessorios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setAcessorios(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar acessórios:', err);
      setError('Não foi possível carregar os acessórios. Por favor, tente novamente.');
      setAcessorios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Acessório excluído com sucesso!');
        fetchAcessorios();
      } catch (err) {
        console.error('Erro ao excluir acessório:', err);
        toast.error('Erro ao excluir acessório. Por favor, tente novamente.');
        setLoading(false);
      } finally {
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const filteredAcessorios = acessorios.filter(acessorio => 
    acessorio.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acessorio.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acessorio.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-indigo-600 mr-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>
            </span>
            Acessórios Vivo
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">Gerenciamento de acessórios da loja Vivo</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar acessório..."
              className="pl-8 pr-4 py-1.5 text-xs sm:text-sm rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          <Link
            to="/vivo/acessorios/novo"
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md text-xs sm:text-sm hover:bg-indigo-700 transition-colors inline-flex items-center justify-center"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Adicionar
          </Link>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-3 sm:p-4 mb-4 border border-indigo-100">
        <div className="flex items-center">
          <div className="bg-indigo-100 rounded-full p-2 mr-3">
            <svg className="w-4 h-4 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs text-indigo-800">Este estoque é dedicado à loja Vivo, separado do estoque principal.</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-3 sm:p-4 rounded-md shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4" role="alert">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
          <button 
            onClick={fetchAcessorios} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {!loading && !error && acessorios.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum acessório encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo acessório ao estoque Vivo.</p>
          <div className="mt-6">
            <Link to="/vivo/acessorios/novo" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Adicionar Acessório
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && filteredAcessorios.length === 0 && acessorios.length > 0 && (
        <div className="text-center py-6 bg-white rounded-lg shadow-sm">
          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum resultado</h3>
          <p className="mt-1 text-sm text-gray-500">Nenhum acessório encontrado para a busca "{searchTerm}".</p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Limpar busca
          </button>
        </div>
      )}

      {!loading && !error && filteredAcessorios.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Tipo/Marca</th>
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">Modelo</th>
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 hidden lg:table-cell">Detalhes</th>
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Valor</th>
                <th className="px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAcessorios.map((acessorio) => (
                <tr key={acessorio._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs sm:text-sm">
                    <div className="font-medium text-gray-900">{acessorio.tipo}</div>
                    <div className="text-gray-500">{acessorio.marca}</div>
                  </td>
                  <td className="px-3 py-2 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{acessorio.modelo || "-"}</td>
                  <td className="px-3 py-2 text-xs hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {acessorio.cor && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-100 text-indigo-800">
                          {acessorio.cor}
                        </span>
                      )}
                      {acessorio.material && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                          {acessorio.material}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">{formatCurrency(acessorio.valorCompra)}</span>
                    <div className="text-[10px] text-gray-500">{formatDate(acessorio.dataCompra)}</div>
                  </td>
                  <td className="px-3 py-2 text-xs sm:text-sm text-center">
                    <div className="flex justify-center space-x-1">
                      <Link 
                        to={`/vivo/acessorios/editar/${acessorio._id}`} 
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(acessorio._id)} 
                        className={`p-1 ${confirmDelete === acessorio._id ? 'text-red-600' : 'text-gray-600 hover:text-red-900'}`}
                      >
                        {confirmDelete === acessorio._id ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-gray-500">
        {!loading && !error && filteredAcessorios.length > 0 && (
          <p>Total: {filteredAcessorios.length} acessórios encontrados</p>
        )}
      </div>
    </div>
  );
};

export default VivoAcessoriosPage; 