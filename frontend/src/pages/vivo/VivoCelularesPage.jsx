import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

const VivoCelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchCelulares();
  }, []);

  const fetchCelulares = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setCelulares(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar celulares:', err);
      setError('Não foi possível carregar os celulares. Por favor, tente novamente.');
      setCelulares([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      setLoading(true);
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Celular excluído com sucesso!');
        fetchCelulares();
      } catch (err) {
        console.error('Erro ao excluir celular:', err);
        toast.error('Erro ao excluir celular. Por favor, tente novamente.');
        setLoading(false);
      } finally {
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const filteredCelulares = celulares.filter(celular => 
    celular.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celular.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    celular.imei?.includes(searchTerm)
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
            <span className="text-purple-600 mr-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </span>
            Celulares Vivo
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">Gerenciamento de celulares da loja Vivo</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar celular..."
              className="pl-8 pr-4 py-1.5 text-xs sm:text-sm rounded-md border border-gray-300 focus:ring-purple-500 focus:border-purple-500 w-full"
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
            to="/vivo/celulares/novo"
            className="bg-purple-600 text-white py-1.5 px-3 rounded-md text-xs sm:text-sm hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Adicionar
          </Link>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 mb-4 border border-purple-100">
        <div className="flex items-center">
          <div className="bg-purple-100 rounded-full p-2 mr-3">
            <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-xs text-purple-800">Este estoque é dedicado à loja Vivo, separado do estoque principal.</p>
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
            onClick={fetchCelulares} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {!loading && !error && celulares.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum celular encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo celular ao estoque Vivo.</p>
          <div className="mt-6">
            <Link to="/vivo/celulares/novo" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Adicionar Celular
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && filteredCelulares.length === 0 && celulares.length > 0 && (
        <div className="text-center py-6 bg-white rounded-lg shadow-sm">
          <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum resultado</h3>
          <p className="mt-1 text-sm text-gray-500">Nenhum celular encontrado para a busca "{searchTerm}".</p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="mt-4 text-sm text-purple-600 hover:text-purple-500"
          >
            Limpar busca
          </button>
        </div>
      )}

      {!loading && !error && filteredCelulares.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Marca/Modelo</th>
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">IMEI</th>
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 hidden lg:table-cell">Características</th>
                <th className="px-3 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500">Valor</th>
                <th className="px-3 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCelulares.map((celular) => (
                <tr key={celular._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-xs sm:text-sm">
                    <div className="font-medium text-gray-900">{celular.marca}</div>
                    <div className="text-gray-500">{celular.modelo}</div>
                  </td>
                  <td className="px-3 py-2 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{celular.imei || "-"}</td>
                  <td className="px-3 py-2 text-xs hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {celular.armazenamento && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                          {celular.armazenamento}GB
                        </span>
                      )}
                      {celular.ram && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                          {celular.ram}GB RAM
                        </span>
                      )}
                      {celular.cor && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-800">
                          {celular.cor}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs sm:text-sm">
                    <span className="font-medium text-gray-900">{formatCurrency(celular.valorCompra)}</span>
                    <div className="text-[10px] text-gray-500">{formatDate(celular.dataCompra)}</div>
                  </td>
                  <td className="px-3 py-2 text-xs sm:text-sm text-center">
                    <div className="flex justify-center space-x-1">
                      <Link 
                        to={`/vivo/celulares/editar/${celular._id}`} 
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </Link>
                      <button 
                        onClick={() => handleDelete(celular._id)} 
                        className={`p-1 ${confirmDelete === celular._id ? 'text-red-600' : 'text-gray-600 hover:text-red-900'}`}
                      >
                        {confirmDelete === celular._id ? (
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
        {!loading && !error && filteredCelulares.length > 0 && (
          <p>Total: {filteredCelulares.length} celulares encontrados</p>
        )}
      </div>
    </div>
  );
};

export default VivoCelularesPage;