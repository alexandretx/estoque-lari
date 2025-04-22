import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { ChevronUpIcon as SortAscIcon, ChevronDownIcon as SortDescIcon } from '@heroicons/react/20/solid';
import ConfirmationModal from '../../components/ConfirmationModal';
import Pagination from '../../components/Pagination';
import CelularCard from '../../components/CelularCard';

const API_CELULARES_URL = `${import.meta.env.VITE_API_URL}/api/celulares`;

const CelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCelularId, setSelectedCelularId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCelulares, setTotalCelulares] = useState(0);
  const [limit] = useState(10);
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'marca', direction: 'asc' });
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) { 
          setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, debouncedSearchTerm]);

  const fetchCelulares = useCallback(async (pageToFetch, currentSearchTerm, currentSortConfig) => {
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
      console.error("Erro ao buscar celulares:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Erro ao carregar celulares.');
      setCelulares([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalCelulares(0);
      setError('Falha ao buscar dados.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCelulares(currentPage, debouncedSearchTerm, sortConfig);
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
    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
  };

  const handleDelete = async () => {
    if (!selectedCelularId) return;
    const idToDelete = selectedCelularId;
    try {
      await axios.delete(`${API_CELULARES_URL}/${idToDelete}`);
      toast.success('Celular excluído com sucesso!');
      const pageToFetch = (celulares.length === 1 && currentPage > 1) ? currentPage - 1 : currentPage;
      if (pageToFetch !== currentPage) {
          setCurrentPage(pageToFetch);
      } else {
          fetchCelulares(pageToFetch, debouncedSearchTerm, sortConfig); 
      }
    } catch (err) {
      console.error("Erro ao excluir celular:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Erro ao excluir celular.');
    } finally {
      setShowConfirmationModal(false);
      setSelectedCelularId(null);
    }
  };

  const openModal = (id) => {
    setSelectedCelularId(id);
    setShowConfirmationModal(true);
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setSelectedCelularId(null);
  };

  const navigateToEdit = (id) => {
    navigate(`/celulares/editar/${id}`);
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <SortAscIcon className="w-4 h-4 ml-1" /> : <SortDescIcon className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Gerenciar Celulares</h2>
        <Link
          to="/celulares/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center transition duration-200 w-full sm:w-auto"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Adicionar Celular
        </Link>
      </div>
      
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Buscar por marca, modelo, IMEI, armaz. ou observação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Visualização mobile */}
      <div className="md:hidden">
        {loading && <div className="text-center py-4">Carregando...</div>} 
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
                onDelete={openModal}
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
                Marca/Modelo {renderSortIcon('marca')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('imei')}>
                IMEI {renderSortIcon('imei')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('cor')}>
                Cor {renderSortIndicator('cor')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 group" onClick={() => handleSort('armazenamento')}>
                Armaz. {renderSortIndicator('armazenamento')}
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
                    <p className="text-gray-900 whitespace-no-wrap">{celular.armazenamento || '-'}</p>
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
                      onClick={() => openModal(celular._id)}
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

      {/* Paginação */}
      {!loading && totalPages > 1 && (
          <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
              totalItems={totalCelulares} 
              itemsPerPage={limit} 
          />
       )}

      {/* Usar ConfirmationModal - Corrigir a duplicação */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar este celular? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default CelularesPage; 