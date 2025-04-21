import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_ACESSORIOS_URL = `${import.meta.env.VITE_API_URL}/api/acessorios`;

const AcessorioFormPage = () => {
  const [acessorio, setAcessorio] = useState({
    marca: '',
    modelo: '',
    tipo: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      axios.get(`${API_ACESSORIOS_URL}/${id}`)
        .then(response => {
          setAcessorio({ ...response.data });
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar acessório:", err.response?.data?.message || err.message);
          toast.error('Erro ao carregar dados do acessório para edição.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcessorio(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const acessorioData = { ...acessorio };

     // Validação simples no frontend (opcional, backend deve validar também)
    if (!acessorioData.marca || !acessorioData.modelo || !acessorioData.tipo) {
        setError('Por favor, preencha todos os campos obrigatórios corretamente.');
        setLoading(false);
        toast.warn('Preencha os campos Marca, Modelo e Tipo.');
        return;
    }

    try {
      if (isEditing) {
        await axios.put(`${API_ACESSORIOS_URL}/${id}`, acessorioData);
        toast.success('Acessório atualizado com sucesso!');
      } else {
        await axios.post(API_ACESSORIOS_URL, acessorioData);
        toast.success('Acessório adicionado com sucesso!');
      }
      navigate('/acessorios'); // Redireciona para a lista após sucesso
    } catch (err) {
      console.error("Erro ao salvar acessório:", err.response?.data?.message || err.message);
      const errorMessage = error || (err.response?.data?.message || 'Erro ao salvar acessório. Verifique os dados.');
      toast.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
    // Não definir setLoading(false) aqui em caso de sucesso por causa do navigate
  };

  if (loading && isEditing) return <p className="text-center text-gray-600 py-8">Carregando dados do acessório...</p>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {isEditing ? 'Editar Acessório' : 'Adicionar Novo Acessório'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        {/* Linha 1: Marca e Modelo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="marca" className="block text-gray-700 text-sm font-bold mb-2">Marca *</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={acessorio.marca}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="modelo" className="block text-gray-700 text-sm font-bold mb-2">Modelo *</label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={acessorio.modelo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        {/* Tipo */}
        <div className="mb-6">
          <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">Tipo *</label>
          <input
            type="text"
            id="tipo"
            name="tipo"
            value={acessorio.tipo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="Ex: Carregador, Fone, Capa"
          />
        </div>

        {/* Observações */}
        <div className="mb-6">
          <label htmlFor="observacoes" className="block text-gray-700 text-sm font-bold mb-2">Observações</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={acessorio.observacoes}
            onChange={handleChange}
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Acessório' : 'Adicionar Acessório')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/acessorios')} // Botão para cancelar/voltar
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcessorioFormPage; 