import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Importar a Sidebar

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (opcional, pode adicionar um aqui se quiser) */}
        {/* <header className="bg-white shadow-sm h-16"></header> */}
        
        {/* Conteúdo da página com scroll */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <Outlet /> {/* Onde o conteúdo da rota atual será renderizado */}
        </main>
      </div>
    </div>
  );
};

export default Layout; 