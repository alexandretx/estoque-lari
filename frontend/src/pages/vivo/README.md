# Formulários da Seção Vivo

Este diretório contém os formulários específicos para a seção Vivo da aplicação, que gerencia o estoque de uma loja Vivo separadamente do estoque principal.

## Arquivos

- `VivoCelularesPage.jsx` - Página de listagem dos celulares Vivo
- `VivoAcessoriosPage.jsx` - Página de listagem dos acessórios Vivo
- `VivoCelularFormPage.jsx` - Formulário para adicionar/editar celulares Vivo
- `VivoAcessorioFormPage.jsx` - Formulário para adicionar/editar acessórios Vivo

## Rotas Configuradas

As seguintes rotas estão configuradas no `App.jsx`:

- `/vivo` - Página principal da seção Vivo (implementada em `VivoPage.jsx`)
- `/vivo/celulares` - Listagem de celulares Vivo
- `/vivo/celulares/novo` - Formulário para adicionar novo celular Vivo
- `/vivo/celulares/editar/:id` - Formulário para editar um celular Vivo existente
- `/vivo/acessorios` - Listagem de acessórios Vivo
- `/vivo/acessorios/novo` - Formulário para adicionar novo acessório Vivo
- `/vivo/acessorios/editar/:id` - Formulário para editar um acessório Vivo existente

## Estrutura do Backend

No backend, existem modelos e controladores específicos para a seção Vivo:

- Modelos: `VivoCelular.js` e `VivoAcessorio.js`
- Controladores: `vivoCelularController.js` e `vivoAcessorioController.js`
- Rotas: `vivoCelularRoutes.js` e `vivoAcessorioRoutes.js`

Todos os endpoints da API usam o prefixo `/api/vivo/` para distinção dos endpoints do estoque principal. 