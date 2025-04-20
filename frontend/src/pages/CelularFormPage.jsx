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
    valorCompra: '',
    dataCompra: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL se estiver editando

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      setLoading(true);
      axios.get(`${API_CELULARES_URL}/${id}`)
        .then(response => {
          // Formata a data para YYYY-MM-DD para o input date
          const dataFormatada = response.data.dataCompra ? new Date(response.data.dataCompra).toISOString().split('T')[0] : '';
          setCelular({ ...response.data, dataCompra: dataFormatada });
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar celular:", err.response?.data?.message || err.message);
          toast.error('Erro ao carregar dados do celular para edição.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCelular(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Converte valorCompra para número
    const celularData = {
        ...celular,
        valorCompra: parseFloat(celular.valorCompra.toString().replace('.', '').replace(',', '.')),
        // Garante que campos numéricos sejam enviados como números
        armazenamento: celular.armazenamento ? parseInt(celular.armazenamento, 10) : undefined,
        ram: celular.ram ? parseInt(celular.ram, 10) : undefined,
    };

    // Remove campos vazios ou nulos que não são obrigatórios no backend
    Object.keys(celularData).forEach(key => {
        if (celularData[key] === '' || celularData[key] === null || celularData[key] === undefined) {
            // Mantém campos obrigatórios ou específicos mesmo que vazios para validação no backend se necessário
            // Por exemplo, se 'imei' fosse opcional, poderíamos deletar:
            // if (key !== 'marca' && key !== 'modelo' /* etc */) delete celularData[key];
            // Neste caso, vamos enviar como está para o backend validar
        }
    });

    try {
      if (isEditing) {
        await axios.put(`${API_CELULARES_URL}/${id}`, celularData);
        toast.success('Celular atualizado com sucesso!');
      } else {
        await axios.post(API_CELULARES_URL, celularData);
        toast.success('Celular adicionado com sucesso!');
      }
      navigate('/celulares'); // Redireciona para a lista após sucesso
    } catch (err) {
      console.error("Erro ao salvar celular:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao salvar celular. Verifique os dados.');
      setLoading(false);
    } finally {
      // Não seta loading false aqui porque o navigate acontece em caso de sucesso
    }
  };

  if (loading && isEditing) return <p className="text-center text-gray-600 py-8">Carregando dados do celular...</p>;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {isEditing ? 'Editar Celular' : 'Adicionar Novo Celular'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        {/* Linha 1: Marca, Modelo, IMEI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="marca" className="block text-gray-700 text-sm font-bold mb-2">Marca *</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={celular.marca}
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
              value={celular.modelo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label htmlFor="imei" className="block text-gray-700 text-sm font-bold mb-2">IMEI *</label>
            <input
              type="text"
              id="imei"
              name="imei"
              value={celular.imei}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
        </div>

        {/* Linha 2: Armazenamento, RAM, Cor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="armazenamento" className="block text-gray-700 text-sm font-bold mb-2">Armazenamento (GB)</label>
            <input
              type="number"
              id="armazenamento"
              name="armazenamento"
              value={celular.armazenamento}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="ram" className="block text-gray-700 text-sm font-bold mb-2">RAM (GB)</label>
            <input
              type="number"
              id="ram"
              name="ram"
              value={celular.ram}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="cor" className="block text-gray-700 text-sm font-bold mb-2">Cor</label>
            <input
              type="text"
              id="cor"
              name="cor"
              value={celular.cor}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Linha 3: Valor Compra, Data Compra */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
                <label htmlFor="valorCompra" className="block text-gray-700 text-sm font-bold mb-2">Valor Compra (R$)</label>
                <input
                type="text" // Usar text para facilitar máscara/formatação
                id="valorCompra"
                name="valorCompra"
                value={celular.valorCompra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                onChange={handleChange}
                onBlur={(e) => {
                    // Formata ao perder o foco, mas o state guarda o valor numérico
                    let value = e.target.value.replace(/\./g, '').replace(',', '.');
                    if (!isNaN(parseFloat(value))) {
                        setCelular({...celular, valorCompra: parseFloat(value)});
                    }
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="0,00"
                />
            </div>
            <div>
                <label htmlFor="dataCompra" className="block text-gray-700 text-sm font-bold mb-2">Data Compra</label>
                <input
                type="date"
                id="dataCompra"
                name="dataCompra"
                value={celular.dataCompra}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
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
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Celular' : 'Adicionar Celular')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/celulares')} // Botão para cancelar/voltar
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CelularFormPage; 