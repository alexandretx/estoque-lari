import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from './../components/Icons'; // Supondo que criaremos Icones
import { TableSkeleton } from '../components/SkeletonLoader';

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
      <span className="text-gray-900">{celular.imei}</span>
    </div>
    <div className="flex justify-between text-sm border-b pb-2 mb-2">
      <span className="text-gray-500">Cor:</span>
      <span className="text-gray-900">{celular.cor}</span>
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

  useEffect(() => {
    fetchCelulares();
  }, []);

  const fetchCelulares = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_CELULARES_URL);
      setCelulares(response.data);
    } catch (err) {
      console.error("Erro ao buscar celulares:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao carregar celulares.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCelulares = useMemo(() => {
    if (!searchTerm) {
      return celulares;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return celulares.filter(celular => 
      (celular.marca && celular.marca.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (celular.modelo && celular.modelo.toLowerCase().includes(lowerCaseSearchTerm)) ||
      (celular.observacoes && celular.observacoes.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [celulares, searchTerm]);

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
      setCelulares(prevCelulares => prevCelulares.filter(c => c._id !== idToDelete));
      toast.success('Celular excluído com sucesso!');
    } catch (err) {
      console.error("Erro ao excluir celular:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao excluir celular.');
    } finally {
       setDeleteModal({ show: false, id: null });
    }
  };

  const navigateToEdit = (id) => {
    window.location.href = `/celulares/editar/${id}`;
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
          placeholder="Buscar por marca ou modelo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="md:hidden">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCelulares.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
             <p className="text-gray-500">{searchTerm ? 'Nenhum celular encontrado para a busca.' : 'Nenhum celular cadastrado.'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCelulares.map((celular) => (
              <CelularCard 
                key={celular._id}
                celular={celular}
                onEdit={navigateToEdit}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca/Modelo</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IMEI</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cor</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Observações</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <TableSkeleton rows={5} cols={5} />
            ) : filteredCelulares.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-5 bg-white text-sm text-center text-gray-500">
                  {searchTerm ? 'Nenhum celular encontrado para a busca.' : 'Nenhum celular cadastrado.'}
                </td>
              </tr>
            ) : (
              filteredCelulares.map((celular) => (
                <tr key={celular._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-900 font-medium">{celular.marca}</p>
                    <p className="text-gray-600 text-xs">{celular.modelo}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{celular.imei}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{celular.cor}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm">
                    <p className="text-gray-700 whitespace-pre-wrap break-words max-w-xs truncate" title={celular.observacoes}>{celular.observacoes || '-'}</p>
                  </td>
                  <td className="px-5 py-4 bg-white text-sm text-center whitespace-no-wrap space-x-2">
                    <Link
                      to={`/celulares/editar/${celular._id}`}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 inline-block"
                      title="Editar"
                    >
                      <PencilIcon className="w-5 h-5"/>
                    </Link>
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