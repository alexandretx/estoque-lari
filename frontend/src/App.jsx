import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

// Core Components
import Layout from './components/Layout';
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
import PlanosPage from './pages/PlanosPage';

// --- Páginas Vivo (Importar mesmo antes de criar os arquivos) ---
import VivoCelularesPage from './pages/VivoCelularesPage';
import VivoAcessoriosPage from './pages/VivoAcessoriosPage';
import VivoCelularFormPage from './pages/VivoCelularFormPage';
import VivoAcessorioFormPage from './pages/VivoAcessorioFormPage';

// Estilos globais adicionais
import './global.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const isMobile = window.innerWidth < 768;

  return (
    <div className="max-w-[100vw] overflow-x-hidden">
      <Routes>
        {/* Rotas Públicas (fora do Layout com Sidebar) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rotas Privadas (dentro do Layout com Sidebar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Rotas Estoque App */}
            <Route path="/celulares" element={<CelularesPage />} />
            <Route path="/celulares/novo" element={<CelularFormPage />} />
            <Route path="/celulares/editar/:id" element={<CelularFormPage />} />

            <Route path="/acessorios" element={<AcessoriosPage />} />
            <Route path="/acessorios/novo" element={<AcessorioFormPage />} />
            <Route path="/acessorios/editar/:id" element={<AcessorioFormPage />} />
            
            <Route path="/planos" element={<PlanosPage />} />

            {/* --- Rotas Vivo --- */}
            <Route path="/vivo/celulares" element={<VivoCelularesPage />} />
            <Route path="/vivo/celulares/novo" element={<VivoCelularFormPage />} />
            <Route path="/vivo/celulares/editar/:id" element={<VivoCelularFormPage />} />
            
            <Route path="/vivo/acessorios" element={<VivoAcessoriosPage />} />
            <Route path="/vivo/acessorios/novo" element={<VivoAcessorioFormPage />} />
            <Route path="/vivo/acessorios/editar/:id" element={<VivoAcessorioFormPage />} />

          </Route>
        </Route>

        {/* Rota Not Found (Opcional, fora do layout principal talvez?) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
      
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
    </div>
  )
}

export default App;
