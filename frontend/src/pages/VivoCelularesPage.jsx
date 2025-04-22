// Página para Gerenciar Celulares da Vivo
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { SortAscIcon, SortDescIcon } from '@heroicons/react/solid';
import ConfirmationModal from '../../components/ConfirmationModal';
import Pagination from '../../components/Pagination';
import CelularCard from '../../components/CelularCard'; // Reutilizar ou criar VivoCelularCard se necessário

// <<< Alterar URL da API >>>
const API_VIVO_CELULARES_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

// <<< Renomear Componente >>>
const VivoCelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCelularId, setSelectedCelularId] = useState(null);
  const [isGridView, setIsGridView] = useState(true); // Estado para controlar a visualização

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const isFirstRender = useRef(true);

  // Ordenação
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  const navigate = useNavigate();

  // Debounce para busca
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page when search term changes
    }, 300); // 300ms de espera

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Função para buscar celulares Vivo
  const fetchCelulares = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchTerm,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
      };
      // <<< Usar URL da API Vivo >>>
      const response = await axios.get(API_VIVO_CELULARES_URL, { params });
      setCelulares(response.data.celulares || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalCelulares || 0);
    } catch (error) {
      console.error('Erro ao buscar celulares Vivo:', error);
      toast.error('Erro ao buscar celulares Vivo.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortConfig]);

  // Buscar celulares ao montar, mudar página, busca ou ordenação
  useEffect(() => {
    fetchCelulares();
  }, [fetchCelulares]); // Dependência já inclui currentPage, debouncedSearchTerm, sortConfig

  // Função para deletar celular Vivo
  const handleDelete = async () => {
    if (!selectedCelularId) return;
    try {
      // <<< Usar URL da API Vivo >>>
      await axios.delete(`${API_VIVO_CELULARES_URL}/${selectedCelularId}`);
      toast.success('Celular Vivo deletado com sucesso!');
      fetchCelulares(); // Rebuscar lista após deletar
    } catch (error) {
      console.error('Erro ao deletar celular Vivo:', error);
      toast.error('Erro ao deletar celular Vivo.');
    } finally {
      setShowModal(false);
      setSelectedCelularId(null);
    }
  };

  // Abrir modal de confirmação
  const openModal = (id) => {
    setSelectedCelularId(id);
    setShowModal(true);
  };

  // Fechar modal de confirmação
  const closeModal = () => {
    setShowModal(false);
    setSelectedCelularId(null);
  };

  // Lidar com mudança de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Lidar com clique na ordenação (para visualização em lista)
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset page when sorting changes
  };

  // Renderizar ícone de ordenação
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <SortAscIcon className="w-4 h-4 ml-1" /> : <SortDescIcon className="w-4 h-4 ml-1" />;
  };

  // Função auxiliar para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        // Adiciona 1 dia para corrigir o fuso horário
        date.setUTCDate(date.getUTCDate() + 1);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Data inválida';
    }
};

  return (
    <div className="container mx-auto p-4 sm:p-6">
      {/* <<< Ajustar Título >>> */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Gerenciar Celulares Vivo</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        {/* Campo de Busca */}
        <div className="relative w-full sm:w-auto flex-grow sm:max-w-xs">
          <input
            type="text"
            placeholder="Buscar celulares Vivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* <<< Ajustar Link do Botão >>> */}
        <Link
          to="/vivo/celulares/novo" // <<< Ajustar rota >>>
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150 ease-in-out w-full sm:w-auto justify-center"
        >
          <FiPlus className="mr-2" />
          Adicionar Celular Vivo
        </Link>
      </div>

      {/* Seletor de Visualização (pode ser adicionado se necessário) */}
      {/* <div className="mb-4 flex justify-end">
        <button onClick={() => setIsGridView(true)} className={`mr-2 p-2 ${isGridView ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Grid</button>
        <button onClick={() => setIsGridView(false)} className={`p-2 ${!isGridView ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Lista</button>
      </div> */} 

      {/* Conteúdo (Grid ou Lista) */}
      {loading ? (
        <p className="text-center text-gray-600 py-8">Carregando celulares Vivo...</p>
      ) : celulares.length === 0 && !loading ? (
        <div className="text-center py-10 px-4 bg-white shadow rounded-lg">
            <FiEye className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum celular Vivo encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
                {debouncedSearchTerm
                    ? "Tente ajustar seus termos de busca."
                    : "Comece adicionando um novo celular Vivo."
                }
            </p>
            {!debouncedSearchTerm && (
                <div className="mt-6">
                    {/* <<< Ajustar Link do Botão >>> */}
                    <Link
                        to="/vivo/celulares/novo" // <<< Ajustar rota >>>
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Adicionar Celular Vivo
                    </Link>
                </div>
            )}
        </div>
      ) : (
        <> 
          {/* Visualização em Grid (padrão) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {celulares.map((celular) => (
                  <CelularCard
                      key={celular._id}
                      celular={celular}
                      onEdit={() => navigate(`/vivo/celulares/editar/${celular._id}`)} // <<< Ajustar rota >>>
                      onDelete={() => openModal(celular._id)}
                  />
              ))}
          </div>

          {/* TODO: Implementar Visualização em Lista se necessário */}
          {/*!isGridView && (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('marca')}>
                      <div className="flex items-center">Marca {renderSortIcon('marca')}</div>
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('modelo')}>
                      <div className="flex items-center">Modelo {renderSortIcon('modelo')}</div>
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('imei1')}>
                      <div className="flex items-center">IMEI 1 {renderSortIcon('imei1')}</div>
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('numeroLinha')}>
                      <div className="flex items-center">Nº Linha {renderSortIcon('numeroLinha')}</div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('dataAquisicao')}>
                      <div className="flex items-center">Aquisição {renderSortIcon('dataAquisicao')}</div>
                    </th>
                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                      <div className="flex items-center">Status {renderSortIcon('status')}</div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {celulares.map((celular) => (
                    <tr key={celular._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{celular.marca}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{celular.modelo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{celular.imei1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{celular.numeroLinha || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(celular.dataAquisicao)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${celular.status === 'ativo' ? 'bg-green-100 text-green-800' : celular.status === 'manutencao' ? 'bg-yellow-100 text-yellow-800' : celular.status === 'baixado' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {celular.status?.charAt(0).toUpperCase() + celular.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => navigate(`/vivo/celulares/editar/${celular._id}`)} // <<< Ajustar rota >>>
                            className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out"
                            aria-label="Editar Celular Vivo"
                            title="Editar Celular Vivo"
                            >
                            <FiEdit />
                        </button>
                        <button
                          onClick={() => openModal(celular._id)}
                          className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                          aria-label="Deletar Celular Vivo"
                          title="Deletar Celular Vivo"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                  )}*/}
        </>
      )}

      {/* Paginação */}
      {!loading && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirmar Exclusão"
        // <<< Ajustar Mensagem >>>
        message="Tem certeza que deseja deletar este celular Vivo? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default VivoCelularesPage; // <<< Exportar nome correto 