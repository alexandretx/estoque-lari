import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

const VivoCelularFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(!!id);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    imei: '',
    armazenamento: '',
    ram: '',
    cor: '',
    valorCompra: '',
    dataCompra: '',
    observacoes: '',
    statusVivo: 'disponível',
    lojaVivo: 'Principal',
    quantidade: 1
  });

  useEffect(() => {
    if (id) {
      fetchCelular();
    }
  }, [id]);

  const fetchCelular = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      const celular = response.data;
      
      // Formatar data para o formato esperado pelo input date
      let formattedDate = '';
      if (celular.dataCompra) {
        const date = new Date(celular.dataCompra);
        formattedDate = date.toISOString().split('T')[0];
      }
      
      setFormData({
        ...celular,
        dataCompra: formattedDate
      });
      
    } catch (err) {
      console.error('Erro ao buscar celular:', err);
      setError('Não foi possível carregar o celular. Verifique se o ID está correto.');
      toast.error('Erro ao carregar dados do celular');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Validações básicas
      if (!formData.marca) throw new Error('A marca é obrigatória');
      if (!formData.modelo) throw new Error('O modelo é obrigatório');
      if (!formData.imei) throw new Error('O IMEI é obrigatório');
      if (!formData.valorCompra) throw new Error('O valor de compra é obrigatório');
      
      // Criar payload com conversão de tipos
      const celularData = {
        ...formData,
        valorCompra: parseFloat(formData.valorCompra),
        armazenamento: formData.armazenamento ? parseInt(formData.armazenamento) : undefined,
        ram: formData.ram ? parseInt(formData.ram) : undefined,
      };
      
      if (isEditing) {
        await axios.put(`${API_URL}/${id}`, celularData);
        toast.success('Celular atualizado com sucesso!');
      } else {
        await axios.post(API_URL, celularData);
        toast.success('Celular cadastrado com sucesso!');
      }
      
      navigate('/vivo/celulares');
      
    } catch (err) {
      console.error('Erro ao salvar celular:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar os dados';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-purple-600 mr-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </span>
            {isEditing ? 'Editar' : 'Adicionar'} Celular Vivo
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {isEditing ? 'Atualize as informações do celular Vivo' : 'Adicione um novo celular ao estoque Vivo'}
          </p>
        </div>
        <button
          onClick={() => navigate('/vivo/celulares')}
          className="mt-3 sm:mt-0 bg-gray-500 text-white py-1.5 px-3 rounded-md text-xs sm:text-sm hover:bg-gray-600 transition-colors inline-flex items-center"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Voltar
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
              <p className="font-bold">Erro</p>
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Informações Básicas */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Informações Básicas</h3>
            </div>
            
            <div className="mb-4">
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">Marca*</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Marca do celular"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">Modelo*</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Modelo do celular"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="imei" className="block text-sm font-medium text-gray-700 mb-1">IMEI*</label>
              <input
                type="text"
                id="imei"
                name="imei"
                value={formData.imei}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="IMEI do celular"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="cor" className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
              <input
                type="text"
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Cor do celular"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="armazenamento" className="block text-sm font-medium text-gray-700 mb-1">Armazenamento (GB)</label>
              <input
                type="number"
                id="armazenamento"
                name="armazenamento"
                value={formData.armazenamento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Capacidade em GB"
                min="0"
                step="1"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="ram" className="block text-sm font-medium text-gray-700 mb-1">Memória RAM (GB)</label>
              <input
                type="number"
                id="ram"
                name="ram"
                value={formData.ram}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="RAM em GB"
                min="0"
                step="1"
              />
            </div>
            
            {/* Informações de Compra */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Informações de Compra</h3>
            </div>
            
            <div className="mb-4">
              <label htmlFor="valorCompra" className="block text-sm font-medium text-gray-700 mb-1">Valor de Compra (R$)*</label>
              <input
                type="number"
                id="valorCompra"
                name="valorCompra"
                value={formData.valorCompra}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                min="0"
                step="0.01"
                placeholder="0,00"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="dataCompra" className="block text-sm font-medium text-gray-700 mb-1">Data de Compra</label>
              <input
                type="date"
                id="dataCompra"
                name="dataCompra"
                value={formData.dataCompra}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            {/* Informações da Vivo */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Informações da Vivo</h3>
            </div>
            
            <div className="mb-4">
              <label htmlFor="statusVivo" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="statusVivo"
                name="statusVivo"
                value={formData.statusVivo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="disponível">Disponível</option>
                <option value="vendido">Vendido</option>
                <option value="reservado">Reservado</option>
                <option value="manutenção">Em Manutenção</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="lojaVivo" className="block text-sm font-medium text-gray-700 mb-1">Loja</label>
              <input
                type="text"
                id="lojaVivo"
                name="lojaVivo"
                value={formData.lojaVivo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Nome da loja"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                min="0"
                step="1"
              />
            </div>
            
            {/* Observações */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Observações adicionais sobre o celular..."
              ></textarea>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate('/vivo/celulares')}
              className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`py-2 px-4 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VivoCelularFormPage;