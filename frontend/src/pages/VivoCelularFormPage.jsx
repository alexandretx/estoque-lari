// Formulário para Celulares da Vivo
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// <<< Alterar URL da API >>>
const API_VIVO_CELULARES_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

// <<< Renomear Componente >>>
const VivoCelularFormPage = () => {
  // <<< Adaptar Estado Inicial (se houver diferenças no model VivoCelular) >>>
  const [celular, setCelular] = useState({
    marca: '',
    modelo: '',
    imei: '',
    armazenamento: '',
    ram: '',
    cor: '',
    observacoes: '',
    dataCompra: '',
    valorCompra: '', 
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
      axios.get(`${API_VIVO_CELULARES_URL}/${id}`) // <<< Usar URL Vivo
        .then(response => {
          const data = response.data;
          const dataFormatada = data.dataCompra ? new Date(data.dataCompra).toISOString().split('T')[0] : '';
          // <<< Garantir que os campos correspondem ao estado/model VivoCelular >>>
          setCelular({
              marca: data.marca || '',
              modelo: data.modelo || '',
              imei: data.imei || '',
              armazenamento: data.armazenamento || '',
              ram: data.ram || '',
              cor: data.cor || '',
              observacoes: data.observacoes || '',
              dataCompra: dataFormatada,
              valorCompra: data.valorCompra || '',
          });
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar celular Vivo:", err.response?.data?.message || err.message);
          toast.error('Erro ao carregar dados do celular Vivo para edição.');
          setLoading(false);
          navigate('/vivo/celulares'); // <<< Navegar para rota Vivo
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCelular(prevState => ({
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
    if (!celular.marca) frontendErrors.marca = 'Marca é obrigatória.';
    if (!celular.modelo) frontendErrors.modelo = 'Modelo é obrigatório.';
    
    if (Object.keys(frontendErrors).length > 0) {
        setValidationErrors(frontendErrors);
        toast.warn('Por favor, corrija os erros no formulário.');
        setLoading(false);
        return;
    }

    // <<< Adaptar dados enviados se o model Vivo for diferente >>>
    const celularData = {
        ...celular,
        armazenamento: celular.armazenamento ? parseInt(celular.armazenamento, 10) : undefined,
        ram: celular.ram ? parseInt(celular.ram, 10) : undefined,
        valorCompra: celular.valorCompra ? parseFloat(celular.valorCompra) : undefined,
        dataCompra: celular.dataCompra || undefined,
    };

    Object.keys(celularData).forEach(key => {
        // Ajustar quais campos podem ser string vazia se necessário
        if (celularData[key] === '' && key !== 'imei' && key !== 'observacoes' && key !== 'cor') { 
             delete celularData[key];
        }
    });

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${API_VIVO_CELULARES_URL}/${id}`, celularData); // <<< Usar URL Vivo
        toast.success('Celular Vivo atualizado com sucesso!');
      } else {
        response = await axios.post(API_VIVO_CELULARES_URL, celularData); // <<< Usar URL Vivo
        toast.success('Celular Vivo adicionado com sucesso!');
      }
      navigate('/vivo/celulares'); // <<< Navegar para rota Vivo
    } catch (err) {
      console.error("Erro ao salvar celular Vivo:", err);
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
  if (loading && isEditing && !celular.marca) { 
      return <p className="text-center text-gray-600 py-8">Carregando dados do celular Vivo...</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl"> 
      {/* <<< Ajustar Título >>> */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditing ? 'Editar Celular Vivo' : 'Adicionar Novo Celular Vivo'}
      </h2>

      {/* O JSX do formulário pode ser mantido igual se os campos forem os mesmos */}
      {/* Apenas garantir que os names dos inputs correspondem às chaves do estado */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-6 sm:px-8 pt-6 pb-8 mb-4">
        {/* Linha 1: Marca, Modelo, IMEI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div>
            <label htmlFor="marca" className="block text-gray-700 text-sm font-bold mb-2">Marca <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={celular.marca}
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
              value={celular.modelo}
              onChange={handleChange}
              className={`shadow appearance-none border ${validationErrors.modelo ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              aria-describedby="modelo-error"
            />
             {renderFieldError('modelo')}
          </div>
          <div>
            <label htmlFor="imei" className="block text-gray-700 text-sm font-bold mb-2">IMEI</label>
            <input
              type="text"
              id="imei"
              name="imei"
              value={celular.imei}
              onChange={handleChange}
              placeholder="Opcional (15 dígitos)"
              className={`shadow appearance-none border ${validationErrors.imei ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              aria-describedby="imei-error"
            />
             {renderFieldError('imei')}
          </div>
        </div>

        {/* Linha 2: Armazenamento, RAM, Cor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div>
            <label htmlFor="armazenamento" className="block text-gray-700 text-sm font-bold mb-2">Armazenamento (GB)</label>
            <input
              type="number"
              id="armazenamento"
              name="armazenamento"
              value={celular.armazenamento}
              onChange={handleChange}
              placeholder="Ex: 128"
              className={`shadow appearance-none border ${validationErrors.armazenamento ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              min="0"
              aria-describedby="armazenamento-error"
            />
             {renderFieldError('armazenamento')}
          </div>
          <div>
            <label htmlFor="ram" className="block text-gray-700 text-sm font-bold mb-2">RAM (GB)</label>
            <input
              type="number"
              id="ram"
              name="ram"
              value={celular.ram}
              onChange={handleChange}
              placeholder="Ex: 8"
              className={`shadow appearance-none border ${validationErrors.ram ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              min="0"
               aria-describedby="ram-error"
            />
             {renderFieldError('ram')}
          </div>
          <div>
            <label htmlFor="cor" className="block text-gray-700 text-sm font-bold mb-2">Cor</label>
            <input
              type="text"
              id="cor"
              name="cor"
              value={celular.cor}
              onChange={handleChange}
              className={`shadow appearance-none border ${validationErrors.cor ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
               aria-describedby="cor-error"
            />
             {renderFieldError('cor')}
          </div>
        </div>

        {/* Linha 3: Data Compra, Valor Compra */} 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
                <label htmlFor="dataCompra" className="block text-gray-700 text-sm font-bold mb-2">Data Compra</label>
                <input
                  type="date"
                  id="dataCompra"
                  name="dataCompra"
                  value={celular.dataCompra}
                  onChange={handleChange}
                  className={`shadow appearance-none border ${validationErrors.dataCompra ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                   aria-describedby="dataCompra-error"
                />
                 {renderFieldError('dataCompra')}
            </div>
             <div>
                <label htmlFor="valorCompra" className="block text-gray-700 text-sm font-bold mb-2">Valor Compra (R$)</label>
                <input
                  type="number"
                  id="valorCompra"
                  name="valorCompra"
                  value={celular.valorCompra}
                  onChange={handleChange}
                  placeholder="Ex: 1500.00"
                  step="0.01"
                  min="0"
                  className={`shadow appearance-none border ${validationErrors.valorCompra ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                   aria-describedby="valorCompra-error"
                />
                 {renderFieldError('valorCompra')}
            </div>
        </div>

        {/* Linha 4: Observações */}
        <div className="mb-6">
          <label htmlFor="observacoes" className="block text-gray-700 text-sm font-bold mb-2">Observações</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={celular.observacoes}
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
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Celular Vivo' : 'Adicionar Celular Vivo')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/vivo/celulares')} // <<< Navegar para rota Vivo
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

export default VivoCelularFormPage; // <<< Exportar nome correto 