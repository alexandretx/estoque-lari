import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from './../components/Icons'; // Assumindo que os ícones existem
import { TableSkeleton } from '../components/SkeletonLoader'; // Importar Skeleton

const API_ACESSORIOS_URL = `${import.meta.env.VITE_API_URL}/api/acessorios`;

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir este acessório? Esta ação não pode ser desfeita.
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

const AcessoriosPage = () => {
  const [acessorios, setAcessorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para a busca
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  useEffect(() => {
    fetchAcessorios();
  }, []);

  const fetchAcessorios = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ACESSORIOS_URL);
      setAcessorios(response.data);
    } catch (err) {
      console.error("Erro ao buscar acessórios:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao carregar acessórios.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar acessórios baseado no searchTerm
  const filteredAcessorios = useMemo(() => {
    if (!searchTerm) {
      return acessorios;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return acessorios.filter(acessorio => 
      (acessorio.marca && acessorio.marca.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (acessorio.modelo && acessorio.modelo.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (acessorio.tipo && acessorio.tipo.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (acessorio.observacoes && acessorio.observacoes.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [acessorios, searchTerm]);
  
  const confirmDelete = (id) => {
    setDeleteModal({ show: true, id });
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, id: null });
  };

  const handleDelete = async () => {
    const idToDelete = deleteModal.id;
    try {
      await axios.delete(`${API_ACESSORIOS_URL}/${idToDelete}`);
      setAcessorios(prevAcessorios => prevAcessorios.filter(a => a._id !== idToDelete));
      toast.success('Acessório excluído com sucesso!');
    } catch (err) {
      console.error("Erro ao excluir acessório:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao excluir acessório.');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Gerenciar Acessórios</h2>
        <Link
          to="/acessorios/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center justify-center transition duration-200 w-full sm:w-auto"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Adicionar Acessório
        </Link>
      </div>
      
      {/* Barra de Pesquisa */}
      <div className="mb-4">
        <input 
          type="text"
          placeholder="Buscar por marca, modelo, tipo ou observação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Tabela de Acessórios */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modelo</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Observações</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <TableSkeleton rows={5} cols={5} /> // Ajustar cols para 5
            ) : filteredAcessorios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-5 bg-white text-sm text-center text-gray-500">
                  {searchTerm ? 'Nenhum acessório encontrado.' : 'Nenhum acessório cadastrado.'}
                </td>
              </tr>
            ) : (
              filteredAcessorios.map((acessorio) => (
                <tr key={acessorio._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.marca}</p></td>
                  <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.modelo}</p></td>
                  <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.tipo}</p></td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-700 whitespace-pre-wrap break-words max-w-xs truncate" title={acessorio.observacoes}>{acessorio.observacoes || '-'}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm text-center whitespace-no-wrap space-x-2">
                    <Link
                      to={`/acessorios/editar/${acessorio._id}`}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 inline-block"
                      title="Editar"
                    >
                      <PencilIcon className="w-5 h-5"/>
                    </Link>
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
      </div>

      <DeleteModal 
        isOpen={deleteModal.show}
        onClose={cancelDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AcessoriosPage; 