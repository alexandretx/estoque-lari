import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = () => {
  const location = useLocation();
  const [vivoExpanded, setVivoExpanded] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Verificar se qualquer caminho vivo está ativo
  const isVivoActive = () => {
    return location.pathname.startsWith('/vivo/');
  };
  
  const mainNavItems = [
    {
      path: '/dashboard',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      )
    },
    {
      path: '/celulares',
      label: 'Celulares',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      path: '/acessorios',
      label: 'Acessórios',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
        </svg>
      )
    },
  ];

  const vivoItems = [
    {
      path: '/vivo/celulares',
      label: 'Cel. Vivo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      path: '/vivo/acessorios',
      label: 'Aces. Vivo',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
        </svg>
      )
    }
  ];
  
  // Botão de toggle para o menu Vivo
  const VivoToggleButton = () => (
    <button
      onClick={() => setVivoExpanded(!vivoExpanded)}
      className={`flex flex-col items-center py-2 px-1 ${
        isVivoActive() ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      <div className="w-5 h-5">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
        </svg>
      </div>
      <span className="text-[10px] mt-1">Vivo</span>
      <span className={`text-[8px] mt-0.5 transition-transform ${vivoExpanded ? 'rotate-180' : ''}`}>▼</span>
    </button>
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      {/* A barra principal é mostrada sempre */}
      <div className="flex justify-around">
        {mainNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-2 px-1 ${
              isActive(item.path)
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="w-5 h-5">{item.icon}</div>
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        ))}
        <VivoToggleButton />
      </div>

      {/* Menu expandido da Vivo */}
      {vivoExpanded && (
        <div className="flex justify-around bg-blue-50 border-t border-blue-200 py-1">
          {vivoItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-700'
              }`}
            >
              <div className="w-5 h-5">{item.icon}</div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      )}
      
      <div className="h-safe-area-bottom"></div>
    </div>
  );
};

export default MobileNav; 