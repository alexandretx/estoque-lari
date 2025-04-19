import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from './../components/Icons'; // Assumindo que os ícones existem

const API_ACESSORIOS_URL = `${import.meta.env.VITE_API_URL}/api/acessorios`;

const AcessoriosPage = () => {
  const [acessorios, setAcessorios] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este acessório?')) {
      try {
        await axios.delete(`${API_ACESSORIOS_URL}/${id}`);
        setAcessorios(acessorios.filter(a => a._id !== id));
        toast.success('Acessório excluído com sucesso!');
      } catch (err) {
        console.error("Erro ao excluir acessório:", err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || 'Erro ao excluir acessório.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Gerenciar Acessórios</h2>
        <Link
          to="/acessorios/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center transition duration-200"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Adicionar Acessório
        </Link>
      </div>

      {loading && <p className="text-center text-gray-600 py-8">Carregando acessórios...</p>}

      {!loading && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Modelo</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Valor (R$)</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {acessorios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-5 bg-white text-sm text-center text-gray-500">
                    Nenhum acessório cadastrado.
                  </td>
                </tr>
              ) : (
                acessorios.map((acessorio) => (
                  <tr key={acessorio._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.marca}</p></td>
                    <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.modelo}</p></td>
                    <td className="px-5 py-4 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{acessorio.tipo}</p></td>
                    <td className="px-5 py-4 bg-white text-sm text-right"><p className="text-gray-900 whitespace-no-wrap">{acessorio.valorProduto?.toFixed(2).replace('.', ',') ?? 'N/A'}</p></td>
                    <td className="px-5 py-4 bg-white text-sm text-center whitespace-no-wrap space-x-2">
                      <Link
                        to={`/acessorios/editar/${acessorio._id}`}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors p-1 inline-block"
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5"/>
                      </Link>
                      <button
                        onClick={() => handleDelete(acessorio._id)}
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

export default AcessoriosPage; 