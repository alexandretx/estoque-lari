import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const { register, isAuthenticated, loading: authLoading, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    return () => {
      clearError();
      setLocalError('');
    };
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (senha !== confirmSenha) {
      setLocalError('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
        setLocalError('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setIsSubmitting(true);
    const success = await register(nome, email, senha);
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Carregando...</p></div>; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-gray-100 to-gray-200 py-8 px-4">
      <div className="p-10 bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all hover:scale-[1.01]">
         <div className="text-center mb-8">
           <span className="inline-block p-3 bg-blue-600 rounded-full text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
           </span>
        </div>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Crie sua Conta</h2>

        {(error || localError) && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md relative mb-6 shadow-md" role="alert">
            <p className="font-bold">Erro no Registro</p>
            <p>{error || localError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-gray-700 text-sm font-semibold mb-2">Nome Completo</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome completo"
              className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seuemail@exemplo.com"
              className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-gray-700 text-sm font-semibold mb-2">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="confirmSenha" className="block text-gray-700 text-sm font-semibold mb-2">Confirmar Senha</label>
            <input
              type="password"
              id="confirmSenha"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              required
              placeholder="Repita a senha"
              className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 w-full flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-px ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Criar Conta'}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-500 mt-8">
          Já tem uma conta? {' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 