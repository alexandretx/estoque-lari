// Página de Listagem de Planos Vivo
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import { ChevronUpIcon as SortAscIcon, ChevronDownIcon as SortDescIcon } from '@heroicons/react/20/solid';
import ConfirmationModal from '../../components/ConfirmationModal';
import Pagination from '../../components/Pagination';

// <<< Alterar URL da API >>>
const API_VIVO_PLANOS_URL = `${import.meta.env.VITE_API_URL}/api/vivo/planos`;

// <<< Renomear Componente >>>
const VivoPlanosPage = () => {
  // <<< Manter estados, mas garantir que os nomes e dados iniciais sejam adequados >>>
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanoId, setSelectedPlanoId] = useState(null);

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

  // Função para buscar planos da Vivo
  const fetchPlanos = useCallback(async () => {
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
      const response = await axios.get(API_VIVO_PLANOS_URL, { params });
       // <<< Adaptar para a estrutura de resposta da API Vivo >>>
      setPlanos(response.data.planos || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalPlanos || 0);
    } catch (error) {
      console.error('Erro ao buscar planos Vivo:', error);
      toast.error('Erro ao buscar planos Vivo.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, sortConfig]);

  // Buscar planos ao montar, mudar página, busca ou ordenação
  useEffect(() => {
    fetchPlanos();
  }, [fetchPlanos]); // Dependência já inclui currentPage, debouncedSearchTerm, sortConfig

  // Função para deletar plano Vivo
  const handleDelete = async () => {
    if (!selectedPlanoId) return;
    try {
      // <<< Usar URL da API Vivo >>>
      await axios.delete(`${API_VIVO_PLANOS_URL}/${selectedPlanoId}`);
      toast.success('Plano Vivo deletado com sucesso!');
      fetchPlanos(); // Rebuscar lista após deletar
    } catch (error) {
      console.error('Erro ao deletar plano Vivo:', error);
      toast.error('Erro ao deletar plano Vivo.');
    } finally {
      setShowModal(false);
      setSelectedPlanoId(null);
    }
  };

  // Abrir modal de confirmação
  const openModal = (id) => {
    setSelectedPlanoId(id);
    setShowModal(true);
  };

  // Fechar modal de confirmação
  const closeModal = () => {
    setShowModal(false);
    setSelectedPlanoId(null);
  };

  // Lidar com mudança de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Lidar com clique na ordenação
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
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Gerenciar Planos Vivo</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        {/* Campo de Busca */}
        <div className="relative w-full sm:w-auto flex-grow sm:max-w-xs">
          <input
            type="text"
            placeholder="Buscar planos Vivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* <<< Ajustar Link do Botão >>> */}
        <Link
          to="/vivo/planos/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150 ease-in-out w-full sm:w-auto justify-center"
        >
          <FiPlus className="mr-2" />
          Adicionar Plano Vivo
        </Link>
      </div>

      {/* Tabela de Planos Vivo */}
      {loading ? (
        <p className="text-center text-gray-600 py-8">Carregando planos Vivo...</p>
      ) : planos.length === 0 && !loading ? (
          <div className="text-center py-10 px-4 bg-white shadow rounded-lg">
            <FiEye className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum plano Vivo encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {debouncedSearchTerm
                  ? "Tente ajustar seus termos de busca."
                  : "Comece adicionando um novo plano Vivo."
              }
            </p>
            {!debouncedSearchTerm && (
                <div className="mt-6">
                  {/* <<< Ajustar Link do Botão >>> */}
                   <Link
                    to="/vivo/planos/novo"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Adicionar Plano Vivo
                  </Link>
                </div>
            )}
          </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                 {/* <<< Ajustar Cabeçalhos da Tabela se necessário >>> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('numeroLinha')}>
                   <div className="flex items-center">Número Linha {renderSortIcon('numeroLinha')}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('nomePlano')}>
                    <div className="flex items-center">Nome do Plano {renderSortIcon('nomePlano')}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('valorMensal')}>
                    <div className="flex items-center">Valor (R$) {renderSortIcon('valorMensal')}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('dataContratacao')}>
                    <div className="flex items-center">Contratação {renderSortIcon('dataContratacao')}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                    <div className="flex items-center">Status {renderSortIcon('status')}</div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {planos.map((plano) => (
                <tr key={plano._id} className="hover:bg-gray-50">
                   {/* <<< Ajustar Campos da Tabela se necessário >>> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plano.numeroLinha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plano.nomePlano}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plano.valorMensal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(plano.dataContratacao)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plano.status === 'ativo' ? 'bg-green-100 text-green-800' : plano.status === 'cancelado' ? 'bg-red-100 text-red-800' : plano.status === 'suspenso' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {plano.status?.charAt(0).toUpperCase() + plano.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={plano.observacoes}>{plano.observacoes || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                     {/* <<< Ajustar Links de Ação >>> */}
                    <button
                      onClick={() => navigate(`/vivo/planos/editar/${plano._id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out"
                      aria-label="Editar Plano Vivo"
                      title="Editar Plano Vivo"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => openModal(plano._id)}
                      className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                      aria-label="Deletar Plano Vivo"
                      title="Deletar Plano Vivo"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        message="Tem certeza que deseja deletar este plano Vivo? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default VivoPlanosPage; // <<< Exportar nome correto 