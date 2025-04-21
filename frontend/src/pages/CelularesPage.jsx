import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from './../components/Icons';
import { TableSkeleton } from '../components/SkeletonLoader';
import Pagination from '../components/Pagination';

const API_CELULARES_URL = `${import.meta.env.VITE_API_URL}/api/celulares`;

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir este celular? Esta ação não pode ser desfeita.
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

// Card para visualização móvel
const CelularCard = ({ celular, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-medium text-gray-900">{celular.marca}</h3>
        <p className="text-sm text-gray-600">{celular.modelo}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(celular._id)}
          className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 inline-block"
          title="Editar"
        >
          <PencilIcon className="w-5 h-5"/>
        </button>
        <button
          onClick={() => onDelete(celular._id)}
          className="text-red-600 hover:text-red-800 transition-colors p-1 inline-block"
          title="Excluir"
        >
          <TrashIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
    <div className="flex justify-between text-sm border-b pb-2 mb-2">
      <span className="text-gray-500">IMEI:</span>
      <span className="text-gray-900">{celular.imei || '-'}</span>
    </div>
    <div className="flex justify-between text-sm border-b pb-2 mb-2">
      <span className="text-gray-500">Cor:</span>
      <span className="text-gray-900">{celular.cor || '-'}</span>
    </div>
    {celular.observacoes && (
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">Observações:</p>
        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{celular.observacoes}</p>
      </div>
    )}
  </div>
);

const CelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCelulares, setTotalCelulares] = useState(0);
  const [limit] = useState(10);
  const navigate = useNavigate();
  const firstRender = useRef(true);
  const [sortConfig, setSortConfig] = useState({ key: 'marca', direction: 'asc' });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!firstRender.current || searchTerm !== debouncedSearchTerm) {
        if(currentPage !== 1) setCurrentPage(1);
        setDebouncedSearchTerm(searchTerm);
      }
      if(firstRender.current) firstRender.current = false;
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, currentPage]);

  const fetchCelulares = useCallback(async (pageToFetch = 1, currentSearchTerm = '', currentSortConfig = { key: 'createdAt', direction: 'desc' }) => {
    setLoading(true);
    setError(null);
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
      
      const response = await axios.get(API_CELULARES_URL, { params });

      setCelulares(response.data.celulares);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalCelulares(response.data.totalCelulares);
    } catch (err) {
      console.error("Erro ao buscar celulares:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao carregar celulares.');
      setCelulares([]);
      setTotalPages(0);
      setTotalCelulares(0);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (!firstRender.current || debouncedSearchTerm || sortConfig.key !== 'createdAt') {
      fetchCelulares(currentPage, debouncedSearchTerm, sortConfig);
    }
  }, [currentPage, debouncedSearchTerm, sortConfig, fetchCelulares]);

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
    else if (sortConfig.key !== key) {
        direction = 'asc';
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
      await axios.delete(`${API_CELULARES_URL}/${idToDelete}`);
      toast.success('Celular excluído com sucesso!');
      const pageToFetch = (celulares.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
      fetchCelulares(pageToFetch, debouncedSearchTerm, sortConfig);
    } catch (err) {
      console.error("Erro ao excluir celular:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao excluir celular.');
    } finally {
       setDeleteModal({ show: false, id: null });
    }
  };

  const navigateToEdit = (id) => {
    navigate(`/celulares/editar/${id}`);
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
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Gerenciar Celulares</h2>
        <Link
          to="/celulares/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center transition duration-200 w-full sm:w-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Adicionar Celular
        </Link>
      </div>
      
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Buscar por marca, modelo, IMEI ou observação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Visualização mobile */}
      <div className="md:hidden">
        {loading && <p>Carregando...</p>} 
        {!loading && celulares.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
             <p className="text-gray-500">{debouncedSearchTerm ? 'Nenhum celular encontrado para a busca.' : 'Nenhum celular cadastrado.'}</p>
          </div>
        )}
        {!loading && celulares.length > 0 && (
          <div className="space-y-4">
            {celulares.map((celular) => (
              <CelularCard 
                key={celular._id}
                celular={celular}
                onEdit={navigateToEdit}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
        {/* Paginação Mobile */} 
         {!loading && totalPages > 1 && (
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />
         )}
      </div>

      {/* Visualização desktop */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('marca')}>
                Marca/Modelo {renderSortIndicator('marca')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('imei')}>
                IMEI {renderSortIndicator('imei')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('cor')}>
                Cor {renderSortIndicator('cor')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('createdAt')}>
                Cadastro {renderSortIndicator('createdAt')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Observações</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <TableSkeleton rows={limit} cols={6} />
            ) : celulares.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-5 bg-white text-sm text-center text-gray-500">
                   {debouncedSearchTerm ? 'Nenhum celular encontrado para a busca.' : 'Nenhum celular cadastrado.'}
                </td>
              </tr>
            ) : (
              celulares.map((celular) => (
                <tr key={celular._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-900 font-medium">{celular.marca}</p>
                    <p className="text-gray-600 text-xs">{celular.modelo}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{celular.imei || '-'}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{celular.cor || '-'}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {celular.createdAt ? new Date(celular.createdAt).toLocaleDateString('pt-BR') : '-'} 
                    </p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-700 whitespace-pre-wrap break-words max-w-xs truncate" title={celular.observacoes}>{celular.observacoes || '-'}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm text-center whitespace-no-wrap space-x-2">
                    <button
                      onClick={() => navigateToEdit(celular._id)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 inline-block"
                      title="Editar"
                    >
                      <PencilIcon className="w-5 h-5"/>
                    </button>
                    <button
                      onClick={() => confirmDelete(celular._id)}
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
        {/* Paginação Desktop */} 
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
        itemName="celular"
      />
    </div>
  );
};

export default CelularesPage; 