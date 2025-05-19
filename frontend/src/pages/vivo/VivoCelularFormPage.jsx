import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

const initialFormData = {
  marca: '',
  modelo: '',
  imei: '',
  armazenamento: '',
  ram: '',
  cor: '',
  dataCompra: '',
  status: 'Guardado',
  observacoes: ''
};

const VivoCelularFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const isEditMode = !!id;

  useEffect(() => {
    // Se for modo de edição, buscar dados do celular
    if (isEditMode) {
      const fetchCelular = async () => {
        try {
          setFetching(true);
          const response = await axios.get(`${API_URL}/${id}`);
          
          // Formatação da data para o formato esperado pelo input type="date"
          let formattedData = { ...response.data };
          if (formattedData.dataCompra) {
            const date = new Date(formattedData.dataCompra);
            formattedData.dataCompra = date.toISOString().split('T')[0];
          }
          
          setFormData(formattedData);
          setFetching(false);
        } catch (error) {
          console.error('Erro ao buscar celular:', error);
          toast.error('Erro ao carregar dados do celular');
          setFetching(false);
          navigate('/vivo/celulares');
        }
      };

      fetchCelular();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Conversão de valores numéricos
    if (type === 'number' || name === 'armazenamento' || name === 'ram') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload = { ...formData };
      
      // Limpeza de campos vazios
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
          payload[key] = undefined;
        }
      });

      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, payload);
        toast.success('Celular atualizado com sucesso!');
      } else {
        await axios.post(API_URL, payload);
        toast.success('Celular adicionado com sucesso!');
      }
      
      navigate('/vivo/celulares');
    } catch (error) {
      console.error('Erro ao salvar celular:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar celular');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen -mt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Celular Vivo' : 'Adicionar Celular Vivo'}
          </h1>
          <Link
            to="/vivo/celulares"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            Voltar para Lista
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marca */}
            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Modelo */}
            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* IMEI */}
            <div>
              <label htmlFor="imei" className="block text-sm font-medium text-gray-700 mb-1">
                IMEI
              </label>
              <input
                type="text"
                id="imei"
                name="imei"
                value={formData.imei}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Cor */}
            <div>
              <label htmlFor="cor" className="block text-sm font-medium text-gray-700 mb-1">
                Cor
              </label>
              <input
                type="text"
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Armazenamento */}
            <div>
              <label htmlFor="armazenamento" className="block text-sm font-medium text-gray-700 mb-1">
                Armazenamento (GB)
              </label>
              <input
                type="number"
                min="0"
                id="armazenamento"
                name="armazenamento"
                value={formData.armazenamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* RAM */}
            <div>
              <label htmlFor="ram" className="block text-sm font-medium text-gray-700 mb-1">
                Memória RAM (GB)
              </label>
              <input
                type="number"
                min="0"
                id="ram"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Data de Compra */}
            <div>
              <label htmlFor="dataCompra" className="block text-sm font-medium text-gray-700 mb-1">
                Data de Compra
              </label>
              <input
                type="date"
                id="dataCompra"
                name="dataCompra"
                value={formData.dataCompra}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Guardado">Guardado</option>
                <option value="Vitrine">Vitrine</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              rows="3"
              value={formData.observacoes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      </div>
    </div>
  );
};

export default VivoCelularFormPage; 