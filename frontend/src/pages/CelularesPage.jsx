import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from './../components/Icons'; // Supondo que criaremos Icones

const API_CELULARES_URL = `${import.meta.env.VITE_API_URL}/api/celulares`;

const CelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este celular?')) {
      try {
        await axios.delete(`${API_CELULARES_URL}/${id}`);
        setCelulares(celulares.filter(c => c._id !== id));
        toast.success('Celular excluído com sucesso!');
      } catch (err) {
        console.error("Erro ao excluir celular:", err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || 'Erro ao excluir celular.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Gerenciar Celulares</h2>
        <Link
          to="/celulares/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center transition duration-200"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Adicionar Celular
        </Link>
      </div>

      {loading && <p className="text-center text-gray-600 py-8">Carregando celulares...</p>}

      {!loading && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cor</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Qtd.</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor (R$)</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {celulares.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-5 bg-white text-sm text-center text-gray-500">
                    Nenhum celular cadastrado.
                  </td>
                </tr>
              ) : (
                celulares.map((celular) => (
                  <tr key={celular._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{celular.nome}</p></td>
                    <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{celular.cor}</p></td>
                    <td className="px-5 py-4 bg-white text-sm text-center"><p className="text-gray-900 whitespace-no-wrap">{celular.quantidade}</p></td>
                    <td className="px-5 py-4 bg-white text-sm text-right"><p className="text-gray-900 whitespace-no-wrap">{celular.valor.toFixed(2).replace('.', ',')}</p></td>
                    <td className="px-5 py-4 bg-white text-sm text-center whitespace-no-wrap space-x-2">
                      <Link
                        to={`/celulares/editar/${celular._id}`}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 inline-block"
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5"/>
                      </Link>
                      <button
                        onClick={() => handleDelete(celular._id)}
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
      )}
    </div>
  );
};

export default CelularesPage; 