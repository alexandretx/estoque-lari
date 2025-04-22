import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
    HomeIcon, 
    DevicePhoneMobileIcon, 
    CpuChipIcon, // Ícone genérico para acessórios
    RectangleStackIcon, // Ícone para Planos
    BuildingStorefrontIcon, // Ícone para Vivo
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowLeftOnRectangleIcon // Ícone de Logout
} from '@heroicons/react/24/outline'; // Usando outline icons

// Hook para simular logout (ajustar conforme sua lógica de auth)
// import { useAuth } from '../context/AuthContext'; // Exemplo

const Sidebar = () => {
    // const { logout } = useAuth(); // Exemplo
    const [isVivoOpen, setIsVivoOpen] = useState(false);
    const [isEstoqueOpen, setIsEstoqueOpen] = useState(true); // Começa aberto

    const handleLogout = () => {
        // Chamar sua função de logout real aqui
        // logout(); 
        console.log("Simulando logout...");
        // Opcional: redirecionar ou limpar estado
    };

    // Estilos comuns para links da NavLink
    const linkClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out";
    const activeLinkClasses = "bg-blue-100 text-blue-700";
    const inactiveLinkClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-100";
    const subLinkClasses = "flex items-center pl-11 pr-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"; // Com indentação

    return (
        <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200 shadow-sm">
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                {/* Link para o Dashboard ou Logo */}
                <Link to="/" className="text-xl font-semibold text-gray-800">
                    GestorApp
                </Link>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {/* Dashboard */}
                <NavLink 
                    to="/dashboard"
                    className={({ isActive }) => 
                        `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                    }
                >
                    <HomeIcon className="h-5 w-5 mr-3" />
                    Dashboard
                </NavLink>

                {/* Seção Estoque App (colapsável) */}
                 <div>
                    <button 
                        onClick={() => setIsEstoqueOpen(!isEstoqueOpen)}
                        className={`${linkClasses} w-full justify-between ${inactiveLinkClasses} ${isEstoqueOpen ? 'mb-1' : ''}`}
                    >
                        <span className="flex items-center">
                            <RectangleStackIcon className="h-5 w-5 mr-3" />
                            Estoque App
                        </span>
                        {isEstoqueOpen ? <ChevronDownIcon className="h-4 w-4"/> : <ChevronRightIcon className="h-4 w-4"/>}
                    </button>
                    {isEstoqueOpen && (
                        <div className="space-y-1">
                            <NavLink 
                                to="/celulares"
                                className={({ isActive }) => 
                                    `${subLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                                }
                            >
                                {/* Ícone opcional para subitem */}
                                <span className="mr-3 w-5 h-5"></span> {/* Espaçador */} 
                                Celulares
                            </NavLink>
                            <NavLink 
                                to="/acessorios"
                                className={({ isActive }) => 
                                    `${subLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                                }
                            >
                                <span className="mr-3 w-5 h-5"></span> 
                                Acessórios
                            </NavLink>
                            {/* Adicionar link para Planos se estiverem no estoque principal */}
                            {/* <NavLink 
                                to="/planos"
                                className={({ isActive }) => 
                                    `${subLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                                }
                            >
                                <span className="mr-3 w-5 h-5"></span> 
                                Planos
                            </NavLink> */} 
                        </div>
                    )}
                </div>

                {/* Seção Vivo (colapsável) */}
                <div>
                    <button 
                        onClick={() => setIsVivoOpen(!isVivoOpen)}
                        className={`${linkClasses} w-full justify-between ${inactiveLinkClasses} ${isVivoOpen ? 'mb-1' : ''}`}
                    >
                         <span className="flex items-center">
                            <BuildingStorefrontIcon className="h-5 w-5 mr-3" />
                            Vivo
                        </span>
                        {isVivoOpen ? <ChevronDownIcon className="h-4 w-4"/> : <ChevronRightIcon className="h-4 w-4"/>}
                    </button>
                    {isVivoOpen && (
                        <div className="space-y-1">
                            <NavLink 
                                to="/vivo/celulares" // Rota para Celulares Vivo
                                className={({ isActive }) => 
                                    `${subLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                                }
                            >
                                <span className="mr-3 w-5 h-5"></span> 
                                Celulares Vivo
                            </NavLink>
                            <NavLink 
                                to="/vivo/acessorios" // Rota para Acessórios Vivo
                                className={({ isActive }) => 
                                    `${subLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                                }
                            >
                                <span className="mr-3 w-5 h-5"></span> 
                                Acessórios Vivo
                            </NavLink>
                        </div>
                    )}
                </div>
                
                 {/* Outros links principais podem vir aqui, como Planos */}
                 <NavLink 
                    to="/planos"
                    className={({ isActive }) => 
                        `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
                    }
                >
                    <RectangleStackIcon className="h-5 w-5 mr-3" />
                    Planos
                </NavLink>

            </nav>

            {/* Seção Inferior (Ex: Logout) */}
            <div className="mt-auto p-3 border-t border-gray-200">
                <button 
                    onClick={handleLogout}
                    className={`${linkClasses} w-full ${inactiveLinkClasses}`}
                >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sair
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 