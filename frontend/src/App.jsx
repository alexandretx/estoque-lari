import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Core Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CelularesPage from './pages/CelularesPage'; // Será criado a seguir
import AcessoriosPage from './pages/AcessoriosPage';
import PlanosPage from './pages/PlanosPage'; // Será criado a seguir
import CelularFormPage from './pages/CelularFormPage';
import AcessorioFormPage from './pages/AcessorioFormPage';
import PlanoFormPage from './pages/PlanoFormPage'; // Será criado a seguir

// import './App.css' // Não é mais necessário

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas Privadas */}
          <Route element={<PrivateRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Rotas Celulares */}
              <Route path="/celulares" element={<CelularesPage />} />
              <Route path="/celulares/novo" element={<CelularFormPage />} />
              <Route path="/celulares/editar/:id" element={<CelularFormPage />} />

              {/* Rotas Acessórios */}
              <Route path="/acessorios" element={<AcessoriosPage />} />
              <Route path="/acessorios/novo" element={<AcessorioFormPage />} />
              <Route path="/acessorios/editar/:id" element={<AcessorioFormPage />} />

              {/* Rotas Planos */}
              <Route path="/planos" element={<PlanosPage />} />
              <Route path="/planos/novo" element={<PlanoFormPage />} />
              <Route path="/planos/editar/:id" element={<PlanoFormPage />} />
          </Route>

          {/* Rota Not Found (Opcional) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
       {/* Footer (Opcional) */}
       {/* <footer className="bg-gray-200 text-center p-4 mt-auto">Footer Content</footer> */}
    </div>
  )
}

export default App
