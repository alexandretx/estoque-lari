import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Core Components
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CelularesPage from './pages/CelularesPage';
import AcessoriosPage from './pages/AcessoriosPage';
import CelularFormPage from './pages/CelularFormPage';
import AcessorioFormPage from './pages/AcessorioFormPage';
import VivoPage from './pages/VivoPage';
import PlanosPage from './pages/PlanosPage';
import PlanoFormPage from './pages/PlanoFormPage';

// Páginas Vivo - importação absoluta para evitar problemas de resolução
import VivoCelularesPage from '/src/pages/vivo/VivoCelularesPage.jsx';
import VivoAcessoriosPage from '/src/pages/vivo/VivoAcessoriosPage.jsx';
import VivoCelularFormPage from '/src/pages/vivo/VivoCelularFormPage.jsx';
import VivoAcessorioFormPage from '/src/pages/vivo/VivoAcessorioFormPage.jsx';

// Estilos globais adicionais
import './global.css';
// Toastify CSS
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Detectar se é um dispositivo móvel
  const isMobile = window.innerWidth < 768;

  return (
    <div className="flex flex-col min-h-screen max-w-[100vw] overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0 px-2 sm:px-4 md:px-6">
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
              
              {/* Rotas Vivo */}
              <Route path="/vivo" element={<VivoPage />} />
              <Route path="/vivo/celulares" element={<VivoCelularesPage />} />
              <Route path="/vivo/celulares/novo" element={<VivoCelularFormPage />} />
              <Route path="/vivo/celulares/editar/:id" element={<VivoCelularFormPage />} />
              <Route path="/vivo/acessorios" element={<VivoAcessoriosPage />} />
              <Route path="/vivo/acessorios/novo" element={<VivoAcessorioFormPage />} />
              <Route path="/vivo/acessorios/editar/:id" element={<VivoAcessorioFormPage />} />
          </Route>

          {/* Rota Not Found (Opcional) */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      <MobileNav />
      <ToastContainer 
        position={isMobile ? "bottom-center" : "bottom-right"}
        autoClose={3000}
        hideProgressBar={isMobile}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ 
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          maxWidth: isMobile ? '90%' : '350px'
        }}
        toastStyle={{
          borderRadius: '8px',
          padding: isMobile ? '8px 12px' : '12px 16px'
        }}
      />
       {/* Footer (Opcional) */}
       {/* <footer className="bg-gray-200 text-center p-4 mt-auto">Footer Content</footer> */}
    </div>
  )
}

export default App
