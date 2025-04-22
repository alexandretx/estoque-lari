import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_CELULARES_URL = `${import.meta.env.VITE_API_URL}/api/celulares`;

const CelularFormPage = () => {
  const [celular, setCelular] = useState({
    marca: '',
    modelo: '',
    imei: '',
    armazenamento: '',
    ram: '',
    cor: '',
    observacoes: '',
    dataCompra: '',
    valorCompra: '', // Adicionar campo valorCompra se não existir
  });
  const [loading, setLoading] = useState(false);
  // Estado para guardar erros de validação do backend por campo
  const [validationErrors, setValidationErrors] = useState({}); 
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      // Resetar erros ao carregar para edição
      setValidationErrors({}); 
      axios.get(`${API_CELULARES_URL}/${id}`)
        .then(response => {
          const data = response.data;
          // Formata a data para YYYY-MM-DD
          const dataFormatada = data.dataCompra ? new Date(data.dataCompra).toISOString().split('T')[0] : '';
          // Garante que todos os campos do estado inicial existam
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
          console.error("Erro ao buscar celular:", err.response?.data?.message || err.message);
          toast.error('Erro ao carregar dados do celular para edição.');
          setLoading(false);
          navigate('/celulares'); // Volta se não encontrar
        });
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCelular(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // Limpar erro de validação para o campo que está sendo modificado
    if (validationErrors[name]) {
        setValidationErrors(prevErrors => ({
            ...prevErrors,
            [name]: null
        }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Resetar erros antes de submeter
    setValidationErrors({}); 
    setLoading(true);

    // Validação frontend simples (pode ser expandida)
    let frontendErrors = {};
    if (!celular.marca) frontendErrors.marca = 'Marca é obrigatória.';
    if (!celular.modelo) frontendErrors.modelo = 'Modelo é obrigatório.';
    // Adicionar outras validações frontend se necessário
    // Ex: if (celular.imei && celular.imei.length !== 15) frontendErrors.imei = 'IMEI deve ter 15 dígitos.';

    if (Object.keys(frontendErrors).length > 0) {
        setValidationErrors(frontendErrors);
        toast.warn('Por favor, corrija os erros no formulário.');
        setLoading(false);
        return;
    }

    const celularData = {
        ...celular,
        // Converte para número ou remove se vazio/inválido. Backend pode validar melhor.
        armazenamento: celular.armazenamento ? parseInt(celular.armazenamento, 10) : undefined,
        ram: celular.ram ? parseInt(celular.ram, 10) : undefined,
        valorCompra: celular.valorCompra ? parseFloat(celular.valorCompra) : undefined,
        // Data: envia como string, backend trata
        dataCompra: celular.dataCompra || undefined,
    };

    // Remover campos explicitamente vazios que não sejam string vazia permitida (como imei)
    Object.keys(celularData).forEach(key => {
        if (celularData[key] === '' && key !== 'imei' && key !== 'observacoes' && key !== 'cor') { 
             delete celularData[key];
        }
    });

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${API_CELULARES_URL}/${id}`, celularData);
        toast.success('Celular atualizado com sucesso!');
      } else {
        response = await axios.post(API_CELULARES_URL, celularData);
        toast.success('Celular adicionado com sucesso!');
      }
      navigate('/celulares'); 
    } catch (err) {
      console.error("Erro ao salvar celular:", err);
      const errorMessage = err.response?.data?.message || 'Erro desconhecido ao salvar.';
      // Tenta extrair erros de validação do backend (ajustar conforme a estrutura da sua resposta de erro)
      if (err.response?.status === 400 && typeof err.response.data.errors === 'object') {
          setValidationErrors(err.response.data.errors);
          toast.error('Erro de validação. Verifique os campos marcados.');
      } else {
          toast.error(`Erro ao salvar: ${errorMessage}`);
      }
      setLoading(false);
    }
  };

  // Helper para mostrar erro abaixo do campo
  const renderFieldError = (fieldName) => {
      return validationErrors[fieldName] ? (
          <p className="text-red-500 text-xs italic mt-1">{validationErrors[fieldName]}</p>
      ) : null;
  }

  if (loading && isEditing && !celular.marca) { // Melhor condição de loading inicial
      return <p className="text-center text-gray-600 py-8">Carregando dados do celular...</p>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl"> {/* Aumentar max-width */} 
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditing ? 'Editar Celular' : 'Adicionar Novo Celular'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-6 sm:px-8 pt-6 pb-8 mb-4"> {/* Mais padding e shadow */} 
        
        {/* Linha 1: Marca, Modelo, IMEI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5"> {/* Aumentar gap e mb */} 
          <div>
            {/* Adicionar required visualmente */}
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
              placeholder="Opcional (15 dígitos)" // Placeholder útil
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
              placeholder="Ex: 128" // Placeholder útil
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
                  step="0.01" // Permite decimais
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
        <div className="flex items-center justify-between flex-wrap gap-4"> {/* Adicionar wrap e gap */} 
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Celular' : 'Adicionar Celular')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/celulares')} 
            disabled={loading} // Desabilitar enquanto salva
            className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CelularFormPage; 