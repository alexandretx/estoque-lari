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
    valorProduto: '',
    observacoes: '',
    dataCompra: '',
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
      axios.get(`${API_ACESSORIOS_URL}/${id}`)
        .then(response => {
          const data = response.data;
          const dataFormatada = data.dataCompra ? new Date(data.dataCompra).toISOString().split('T')[0] : '';
          setAcessorio({
              marca: data.marca || '',
              modelo: data.modelo || '',
              tipo: data.tipo || '',
              valorProduto: data.valorProduto || '',
              observacoes: data.observacoes || '',
              dataCompra: dataFormatada,
          });
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar acessório:", err.response?.data?.message || err.message);
          toast.error('Erro ao carregar dados do acessório para edição.');
          setLoading(false);
          navigate('/acessorios');
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcessorio(prevState => ({
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
    if (!acessorio.marca) frontendErrors.marca = 'Marca é obrigatória.';
    if (!acessorio.modelo) frontendErrors.modelo = 'Modelo é obrigatório.';
    if (!acessorio.tipo) frontendErrors.tipo = 'Tipo é obrigatório.';

    if (Object.keys(frontendErrors).length > 0) {
        setValidationErrors(frontendErrors);
        toast.warn('Por favor, corrija os erros no formulário.');
        setLoading(false);
        return;
    }

    const acessorioData = { 
        ...acessorio, 
        valorProduto: acessorio.valorProduto ? parseFloat(acessorio.valorProduto) : undefined,
        dataCompra: acessorio.dataCompra || undefined 
    }; 
    
    Object.keys(acessorioData).forEach(key => {
        if (acessorioData[key] === '' && key !== 'observacoes') { 
             delete acessorioData[key];
        }
    });

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${API_ACESSORIOS_URL}/${id}`, acessorioData);
        toast.success('Acessório atualizado com sucesso!');
      } else {
        response = await axios.post(API_ACESSORIOS_URL, acessorioData);
        toast.success('Acessório adicionado com sucesso!');
      }
      navigate('/acessorios');
    } catch (err) {
      console.error("Erro ao salvar acessório:", err);
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

  if (loading && isEditing && !acessorio.marca) {
      return <p className="text-center text-gray-600 py-8">Carregando dados do acessório...</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditing ? 'Editar Acessório' : 'Adicionar Novo Acessório'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-6 sm:px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label htmlFor="marca" className="block text-gray-700 text-sm font-bold mb-2">Marca <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={acessorio.marca}
              onChange={handleChange}
              className={`shadow appearance-none border ${validationErrors.marca ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              aria-describedby="marca-error"
            />
            {renderFieldError('marca')}
          </div>
          <div>
            <label htmlFor="modelo" className="block text-gray-700 text-sm font-bold mb-2">Modelo <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={acessorio.modelo}
              onChange={handleChange}
              className={`shadow appearance-none border ${validationErrors.modelo ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              aria-describedby="modelo-error"
            />
            {renderFieldError('modelo')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
                <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">Tipo <span className="text-red-500">*</span></label>
                <input
                type="text"
                id="tipo"
                name="tipo"
                value={acessorio.tipo}
                onChange={handleChange}
                className={`shadow appearance-none border ${validationErrors.tipo ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Ex: Carregador, Fone, Capa"
                aria-describedby="tipo-error"
                />
                {renderFieldError('tipo')}
            </div>
             <div>
                <label htmlFor="valorProduto" className="block text-gray-700 text-sm font-bold mb-2">Valor Produto (R$)</label>
                <input
                  type="number"
                  id="valorProduto"
                  name="valorProduto"
                  value={acessorio.valorProduto}
                  onChange={handleChange}
                  placeholder="Ex: 59.90"
                  step="0.01"
                  min="0"
                  className={`shadow appearance-none border ${validationErrors.valorProduto ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  aria-describedby="valorProduto-error"
                />
                 {renderFieldError('valorProduto')}
            </div>
        </div>

        <div className="mb-5">
            <label htmlFor="dataCompra" className="block text-gray-700 text-sm font-bold mb-2">Data Compra</label>
            <input
                type="date"
                id="dataCompra"
                name="dataCompra"
                value={acessorio.dataCompra}
                onChange={handleChange}
                className={`shadow appearance-none border ${validationErrors.dataCompra ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent md:max-w-xs`}
                aria-describedby="dataCompra-error"
            />
            {renderFieldError('dataCompra')}
        </div>
        
        <div className="mb-6">
          <label htmlFor="observacoes" className="block text-gray-700 text-sm font-bold mb-2">Observações</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={acessorio.observacoes}
            onChange={handleChange}
            rows="3"
            className={`shadow appearance-none border ${validationErrors.observacoes ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            aria-describedby="observacoes-error"
          ></textarea>
           {renderFieldError('observacoes')}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Acessório' : 'Adicionar Acessório')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/acessorios')} 
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

export default AcessorioFormPage; 