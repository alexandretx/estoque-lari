// Página para Gerenciar Acessórios da Vivo
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from './../components/Icons';
import { TableSkeleton } from '../components/SkeletonLoader';
import Pagination from '../components/Pagination';

// <<< Alterar URL da API >>>
const API_VIVO_ACESSORIOS_URL = `${import.meta.env.VITE_API_URL}/api/vivo/acessorios`;

// --- Componente DeleteModal --- 
const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir este {itemName}? Esta ação não pode ser desfeita.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// <<< Renomear Componente >>>
const VivoAcessoriosPage = () => {
  const [acessorios, setAcessorios] = useState([]); // <<< Mudar nome se quiser clareza
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalAcessorios, setTotalAcessorios] = useState(0);
  const [limit] = useState(10);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'marca', direction: 'asc' });

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) {
          setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, debouncedSearchTerm]);

  // <<< Renomear função e usar URL Vivo >>>
  const fetchVivoAcessorios = useCallback(async (pageToFetch, currentSearchTerm, currentSortConfig) => {
    setLoading(true);
    try {
      const params = { 
          page: pageToFetch,
          limit: limit,
          sortBy: currentSortConfig.key,
          sortOrder: currentSortConfig.direction
      };
      if (currentSearchTerm) {
          params.search = currentSearchTerm;
      }
      const response = await axios.get(API_VIVO_ACESSORIOS_URL, { params }); // <<< Usar URL Vivo
      setAcessorios(response.data.acessorios); // <<< Usar dados Vivo
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalAcessorios(response.data.totalAcessorios);
    } catch (err) {
      console.error("Erro ao buscar acessórios Vivo:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao carregar acessórios Vivo.');
      setAcessorios([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalAcessorios(0);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // useEffect busca
  useEffect(() => {
     fetchVivoAcessorios(currentPage, debouncedSearchTerm, sortConfig); // <<< Chamar função correta
  }, [currentPage, debouncedSearchTerm, sortConfig, fetchVivoAcessorios]); // <<< Adicionar dependência correta

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
  };

  const confirmDelete = (id) => {
    setDeleteModal({ show: true, id });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, id: null });
  };

  const handleDelete = async () => {
    const idToDelete = deleteModal.id;
    try {
      await axios.delete(`${API_VIVO_ACESSORIOS_URL}/${idToDelete}`); // <<< Usar URL Vivo
      toast.success('Acessório Vivo excluído com sucesso!');
      const pageToFetch = (acessorios.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
      if (pageToFetch !== currentPage) {
           setCurrentPage(pageToFetch);
      } else {
           fetchVivoAcessorios(pageToFetch, debouncedSearchTerm, sortConfig); // <<< Chamar função correta
      }
    } catch (err) {
      console.error("Erro ao excluir acessório Vivo:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao excluir acessório Vivo.');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  // <<< Ajustar navegação >>>
  const navigateToEdit = (id) => {
      navigate(`/vivo/acessorios/editar/${id}`);
  };

  const renderSortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) {
        return <span className="ml-1 opacity-0 group-hover:opacity-50">↕</span>;
    }
    if (sortConfig.direction === 'asc') {
      return <span className="ml-1">▲</span>;
    }
    return <span className="ml-1">▼</span>;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        {/* <<< Ajustar Título >>> */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Gerenciar Acessórios Vivo</h2>
        {/* <<< Ajustar Link >>> */}
        <Link
          to="/vivo/acessorios/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center transition duration-200 w-full sm:w-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Adicionar Acessório Vivo
        </Link>
      </div>
      
      <div className="mb-4">
        <input 
          type="text"
          // <<< Ajustar Placeholder >>>
          placeholder="Buscar acessório Vivo por marca, modelo, tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            {/* <<< Ajustar Cabeçalhos se necessário >>> */}
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('marca')}>
                Marca {renderSortIndicator('marca')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('modelo')}>
                Modelo {renderSortIndicator('modelo')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('tipo')}>
                Tipo {renderSortIndicator('tipo')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Observações</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <TableSkeleton rows={limit} cols={5} /> 
            ) : acessorios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-5 bg-white text-sm text-center text-gray-500">
                  {debouncedSearchTerm ? 'Nenhum acessório Vivo encontrado.' : 'Nenhum acessório Vivo cadastrado.'}
                </td>
              </tr>
            ) : (
              acessorios.map((acessorio) => (
                <tr key={acessorio._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.marca || '-'}</p></td>
                  <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.modelo || '-'}</p></td>
                  <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.tipo || '-'}</p></td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-700 whitespace-pre-wrap break-words max-w-xs truncate" title={acessorio.observacoes}>{acessorio.observacoes || '-'}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm text-center whitespace-no-wrap space-x-2">
                    <button
                      onClick={() => navigateToEdit(acessorio._id)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 inline-block"
                      title="Editar"
                    >
                      <PencilIcon className="w-5 h-5"/>
                    </button>
                    <button
                      onClick={() => confirmDelete(acessorio._id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 inline-block"
                      title="Excluir"
                    >
                       <TrashIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
         {!loading && totalPages > 1 && (
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />
         )}
      </div>

      <DeleteModal 
        isOpen={deleteModal.show}
        onClose={cancelDelete}
        onConfirm={handleDelete}
        itemName="acessório Vivo" // <<< Ajustar nome
      />
    </div>
  );
};

export default VivoAcessoriosPage; // <<< Exportar nome correto 