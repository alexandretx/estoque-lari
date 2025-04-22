// Formulário para Planos da Vivo
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// <<< Alterar URL da API >>>
const API_VIVO_PLANOS_URL = `${import.meta.env.VITE_API_URL}/api/vivo/planos`;

// <<< Renomear Componente >>>
const VivoPlanoFormPage = () => {
  // <<< Adaptar Estado Inicial (se houver diferenças no model VivoPlanos) >>>
  const [plano, setPlano] = useState({
    numeroLinha: '',
    nomePlano: '',
    valorMensal: '',
    dataContratacao: '',
    observacoes: '',
    status: 'ativo', // Status padrão
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      setValidationErrors({});
      axios.get(`${API_VIVO_PLANOS_URL}/${id}`) // <<< Usar URL Vivo
        .then(response => {
          const data = response.data;
          const dataFormatada = data.dataContratacao ? new Date(data.dataContratacao).toISOString().split('T')[0] : '';
           // <<< Garantir que os campos correspondem ao estado/model VivoPlanos >>>
          setPlano({
            numeroLinha: data.numeroLinha || '',
            nomePlano: data.nomePlano || '',
            valorMensal: data.valorMensal || '',
            dataContratacao: dataFormatada,
            observacoes: data.observacoes || '',
            status: data.status || 'ativo', 
          });
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar plano Vivo:", err.response?.data?.message || err.message);
          toast.error('Erro ao carregar dados do plano Vivo para edição.');
          setLoading(false);
          navigate('/vivo/planos'); // <<< Navegar para rota Vivo
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlano(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (validationErrors[name]) {
        setValidationErrors(prevErrors => ({
            ...prevErrors,
            [name]: null
        }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setLoading(true);

    let frontendErrors = {};
    if (!plano.numeroLinha) frontendErrors.numeroLinha = 'Número da Linha é obrigatório.';
    else if (!/^[0-9()-\s+]+$/.test(plano.numeroLinha)) frontendErrors.numeroLinha = 'Número da Linha inválido.';
    if (!plano.nomePlano) frontendErrors.nomePlano = 'Nome do Plano é obrigatório.';
    if (!plano.valorMensal) frontendErrors.valorMensal = 'Valor Mensal é obrigatório.';
    else if (isNaN(parseFloat(plano.valorMensal))) frontendErrors.valorMensal = 'Valor Mensal deve ser um número.';
    if (!plano.status) frontendErrors.status = 'Status é obrigatório.';

    if (Object.keys(frontendErrors).length > 0) {
        setValidationErrors(frontendErrors);
        toast.warn('Por favor, corrija os erros no formulário.');
        setLoading(false);
        return;
    }

    // <<< Adaptar dados enviados se o model Vivo for diferente >>>
    const planoData = {
      ...plano,
      valorMensal: parseFloat(plano.valorMensal),
      dataContratacao: plano.dataContratacao || undefined,
    };

    Object.keys(planoData).forEach(key => {
        // Remover campos vazios, exceto observações
        if (planoData[key] === '' && key !== 'observacoes') {
            delete planoData[key];
        }
    });

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${API_VIVO_PLANOS_URL}/${id}`, planoData); // <<< Usar URL Vivo
        toast.success('Plano Vivo atualizado com sucesso!');
      } else {
        response = await axios.post(API_VIVO_PLANOS_URL, planoData); // <<< Usar URL Vivo
        toast.success('Plano Vivo adicionado com sucesso!');
      }
      navigate('/vivo/planos'); // <<< Navegar para rota Vivo
    } catch (err) {
      console.error("Erro ao salvar plano Vivo:", err);
      const errorMessage = err.response?.data?.message || 'Erro desconhecido ao salvar.';
      if (err.response?.status === 400 && typeof err.response.data.errors === 'object') {
          setValidationErrors(err.response.data.errors);
          toast.error('Erro de validação. Verifique os campos marcados.');
      } else {
          toast.error(`Erro ao salvar: ${errorMessage}`);
      }
      setLoading(false);
    }
  };

   const renderFieldError = (fieldName) => {
      return validationErrors[fieldName] ? (
          <p className="text-red-500 text-xs italic mt-1">{validationErrors[fieldName]}</p>
      ) : null;
  }

   // <<< Ajustar condição de loading inicial >>>
   if (loading && isEditing && !plano.numeroLinha) {
       return <p className="text-center text-gray-600 py-8">Carregando dados do plano Vivo...</p>;
   }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
        {/* <<< Ajustar Título >>> */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {isEditing ? 'Editar Plano Vivo' : 'Adicionar Novo Plano Vivo'}
        </h2>

        {/* O JSX do formulário pode ser mantido igual se os campos forem os mesmos */}
        {/* Apenas garantir que os names dos inputs correspondem às chaves do estado */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-6 sm:px-8 pt-6 pb-8 mb-4">
             {/* Linha 1: Número Linha, Nome Plano */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                    <label htmlFor="numeroLinha" className="block text-gray-700 text-sm font-bold mb-2">Número da Linha <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="numeroLinha"
                      name="numeroLinha"
                      value={plano.numeroLinha}
                      onChange={handleChange}
                      placeholder="(XX) XXXXX-XXXX"
                      className={`shadow appearance-none border ${validationErrors.numeroLinha ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      aria-describedby="numeroLinha-error"
                    />
                    {renderFieldError('numeroLinha')}
                </div>
                <div>
                    <label htmlFor="nomePlano" className="block text-gray-700 text-sm font-bold mb-2">Nome do Plano <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="nomePlano"
                      name="nomePlano"
                      value={plano.nomePlano}
                      onChange={handleChange}
                      placeholder="Ex: Vivo Controle 10GB"
                      className={`shadow appearance-none border ${validationErrors.nomePlano ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      aria-describedby="nomePlano-error"
                    />
                    {renderFieldError('nomePlano')}
                </div>
            </div>

             {/* Linha 2: Valor Mensal, Data Contratação, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <div>
                    <label htmlFor="valorMensal" className="block text-gray-700 text-sm font-bold mb-2">Valor Mensal (R$) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      id="valorMensal"
                      name="valorMensal"
                      value={plano.valorMensal}
                      onChange={handleChange}
                      placeholder="Ex: 59.99"
                      step="0.01"
                      min="0"
                      className={`shadow appearance-none border ${validationErrors.valorMensal ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      aria-describedby="valorMensal-error"
                    />
                    {renderFieldError('valorMensal')}
                </div>
                <div>
                    <label htmlFor="dataContratacao" className="block text-gray-700 text-sm font-bold mb-2">Data Contratação</label>
                    <input
                      type="date"
                      id="dataContratacao"
                      name="dataContratacao"
                      value={plano.dataContratacao}
                      onChange={handleChange}
                      className={`shadow appearance-none border ${validationErrors.dataContratacao ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      aria-describedby="dataContratacao-error"
                    />
                    {renderFieldError('dataContratacao')}
                </div>
                <div>
                    <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status <span className="text-red-500">*</span></label>
                    <select
                      id="status"
                      name="status"
                      value={plano.status}
                      onChange={handleChange}
                      className={`shadow appearance-none border ${validationErrors.status ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white`}
                      aria-describedby="status-error"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="suspenso">Suspenso</option>
                      <option value="pendente">Pendente</option>
                    </select>
                    {renderFieldError('status')}
                </div>
            </div>

            {/* Linha 3: Observações */}
            <div className="mb-6">
                <label htmlFor="observacoes" className="block text-gray-700 text-sm font-bold mb-2">Observações</label>
                <textarea
                    id="observacoes"
                    name="observacoes"
                    value={plano.observacoes}
                    onChange={handleChange}
                    rows="3"
                    className={`shadow appearance-none border ${validationErrors.observacoes ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    aria-describedby="observacoes-error"
                ></textarea>
                 {renderFieldError('observacoes')}
            </div>

            {/* Botões */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Salvando...' : (isEditing ? 'Atualizar Plano Vivo' : 'Adicionar Plano Vivo')}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/vivo/planos')} // <<< Navegar para rota Vivo
                    disabled={loading}
                    className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Cancelar
                </button>
            </div>
        </form>
    </div>
  );
};

export default VivoPlanoFormPage; // <<< Exportar nome correto 