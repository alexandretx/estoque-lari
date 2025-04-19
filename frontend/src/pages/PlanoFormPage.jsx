import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_PLANOS_URL = `${import.meta.env.VITE_API_URL}/api/planos`;

const PlanoFormPage = () => {
  const [plano, setPlano] = useState({
    nome: '',
    sku: '',
    valor: '', // Usaremos string para facilitar a formatação com vírgula
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
      axios.get(`${API_PLANOS_URL}/${id}`)
        .then(response => {
          // Formata valor para exibição (número para string com vírgula)
          const valorFormatado = response.data.valor ? response.data.valor.toString().replace('.', ',') : '';
          setPlano({ ...response.data, valor: valorFormatado });
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar plano:", err.response?.data?.message || err.message);
          toast.error('Erro ao carregar dados do plano para edição.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlano(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Converte valor para número antes de enviar
    const planoData = {
      ...plano,
      valor: parseFloat(plano.valor.toString().replace('.', '').replace(',', '.')),
    };

    // Validação simples no frontend
    if (!planoData.nome || !planoData.sku || isNaN(planoData.valor)) {
      setError('Por favor, preencha todos os campos obrigatórios corretamente.');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`${API_PLANOS_URL}/${id}`, planoData);
        toast.success('Plano atualizado com sucesso!');
      } else {
        await axios.post(API_PLANOS_URL, planoData);
        toast.success('Plano adicionado com sucesso!');
      }
      navigate('/planos'); // Redireciona para a lista após sucesso
    } catch (err) {
      console.error("Erro ao salvar plano:", err.response?.data?.message || err.message);
      const errorMessage = error || (err.response?.data?.message || 'Erro ao salvar plano. Verifique os dados.');
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  if (loading && isEditing) return <p className="text-center text-gray-600 py-8">Carregando dados do plano...</p>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {isEditing ? 'Editar Plano' : 'Adicionar Novo Plano'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        {/* Linha 1: Nome e SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="nome" className="block text-gray-700 text-sm font-bold mb-2">Nome do Plano *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={plano.nome}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-gray-700 text-sm font-bold mb-2">SKU *</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={plano.sku}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        {/* Linha 2: Valor */}
        <div className="mb-6">
          <label htmlFor="valor" className="block text-gray-700 text-sm font-bold mb-2">Valor Mensal (R$) *</label>
          <input
            type="text" // Usar text para máscara/formatação com vírgula
            id="valor"
            name="valor"
            value={plano.valor}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="0,00"
            required
          />
        </div>

        {/* Botões */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Plano' : 'Adicionar Plano')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/planos')} // Botão para cancelar/voltar
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanoFormPage; 