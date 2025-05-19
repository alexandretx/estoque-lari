import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  IconButton,
  Tag,
  Icon,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  CheckCircleIcon, 
  WarningIcon,
  DragHandleIcon
} from '@chakra-ui/icons';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/acessorios`;

// Paleta de cores (consistente com VivoCelularesPage)
const appColors = {
  vivoPurple: '#660099',
  vivoPurpleDarker: '#4c0073',
  vivoPurpleLight: '#E9D8FD',
  vivoPink: '#FF007F',
  accentBlue: '#00BFFF',
  textOnDark: 'whiteAlpha.900',
  textOnLight: '#2D3748',
  subtleTextOnDark: 'gray.400',
  subtleTextOnLight: 'gray.600',
  cardBgDark: 'rgba(45, 55, 72, 0.6)', 
  cardBgLight: 'white',
  lightBgGlobal: '#F7FAFC', 
  darkBgGlobal: '#1A202C', 
  borderColorDark: 'rgba(255, 255, 255, 0.1)',
  borderColorLight: 'gray.200',
};

const VivoAcessoriosPage = () => {
  const [acessorios, setAcessorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAcessorios, setFilteredAcessorios] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [tipoFilter, setTipoFilter] = useState('todos');

  // Para o Modal de Confirmação de Exclusão
  const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageBg = useColorModeValue(
    `linear-gradient(135deg, ${appColors.vivoPurpleLight} 0%, ${appColors.lightBgGlobal} 100%)`,
    `linear-gradient(135deg, ${appColors.vivoPurpleDarker} 0%, ${appColors.darkBgGlobal} 150%)`
  );
  const textColor = useColorModeValue(appColors.textOnLight, appColors.textOnDark);
  const subtleTextColor = useColorModeValue(appColors.subtleTextOnLight, appColors.subtleTextOnDark);
  const pageHeaderColor = useColorModeValue(appColors.vivoPurple, appColors.textOnDark);
  const highlightColor = appColors.vivoPink;
  const tableBg = useColorModeValue(appColors.cardBgLight, appColors.cardBgDark);
  const tableHeaderBg = useColorModeValue('gray.100', 'gray.700');
  const tableBorderColor = useColorModeValue(appColors.borderColorLight, appColors.borderColorDark);

  const fetchAcessorios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setAcessorios(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar acessórios:', error);
      toast.error('Erro ao carregar acessórios da Vivo');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcessorios();
  }, [fetchAcessorios]);

  const getTipos = () => {
    const tipos = [...new Set(acessorios.map(item => item.tipo))].filter(Boolean);
    return tipos.sort();
  };

  useEffect(() => {
    let result = [...acessorios];
    if (tipoFilter !== 'todos') {
      result = result.filter(acessorio => acessorio.tipo === tipoFilter);
    }
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        acessorio =>
          acessorio.marca?.toLowerCase().includes(searchTermLower) ||
          acessorio.modelo?.toLowerCase().includes(searchTermLower) ||
          acessorio.tipo?.toLowerCase().includes(searchTermLower)
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'dataCompra') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setFilteredAcessorios(result);
  }, [acessorios, searchTerm, sortConfig, tipoFilter]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteAcessorio = (acessorio) => {
    setItemToDelete(acessorio);
    onConfirmModalOpen();
  };

  const confirmDeleteHandler = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/${itemToDelete._id}`);
      toast.success(`Acessório ${itemToDelete.tipo} ${itemToDelete.marca || ''} ${itemToDelete.modelo || ''} excluído!`);
      fetchAcessorios();
      onConfirmModalClose();
      setItemToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir acessório:', error);
      toast.error('Erro ao excluir acessório.');
    }
    setIsDeleting(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  // getStatusColor e getSortableHeaderStyle não são mais necessários no novo design
  // A tabela será substituída por cards ou um layout de tabela Chakra UI repaginado.

  // Placeholder para o novo AcessoriosList ou Cards
  const AcessoriosListRender = () => {
    if (filteredAcessorios.length === 0) {
      return (
        <Flex justify="center" align="center" h="200px" direction="column">
          <Icon as={WarningIcon} boxSize="50px" color="yellow.400" />
          <Heading size="md" color={textColor} mt={4}>Nenhum acessório encontrado.</Heading>
          <Text color={subtleTextColor}>Tente ajustar os filtros ou o termo de busca.</Text>
        </Flex>
      );
    }
    // Esta é a parte que será completamente repaginada para usar Cards ou uma Tabela Chakra UI estilizada
    // Por agora, vamos manter a estrutura da tabela antiga para focar na substituição do modal
    return (
      <Box overflowX="auto" bg={tableBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={tableBorderColor}>
        <Table variant="simple" color={textColor}>
          <Thead bg={tableHeaderBg}>
            <Tr>
              <Th onClick={() => requestSort('tipo')} cursor="pointer" color={textColor}>Tipo {sortConfig.key === 'tipo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</Th>
              <Th onClick={() => requestSort('marca')} cursor="pointer" color={textColor}>Marca {sortConfig.key === 'marca' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</Th>
              <Th onClick={() => requestSort('modelo')} cursor="pointer" color={textColor}>Modelo {sortConfig.key === 'modelo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</Th>
              <Th color={textColor}>Cor</Th>
              <Th onClick={() => requestSort('dataCompra')} cursor="pointer" color={textColor}>Data de Compra {sortConfig.key === 'dataCompra' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</Th>
              <Th textAlign="center" color={textColor}>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAcessorios.map((acessorio) => (
              <Tr key={acessorio._id} _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                <Td borderColor={tableBorderColor}>{acessorio.tipo || 'N/A'}</Td>
                <Td borderColor={tableBorderColor}>{acessorio.marca || 'N/A'}</Td>
                <Td borderColor={tableBorderColor}>{acessorio.modelo || 'N/A'}</Td>
                <Td borderColor={tableBorderColor}>{acessorio.cor || 'N/A'}</Td>
                <Td borderColor={tableBorderColor}>{formatDate(acessorio.dataCompra)}</Td>
                <Td textAlign="center" borderColor={tableBorderColor}>
                  <HStack spacing={2} justify="center">
                    <IconButton
                      as={Link}
                      to={`/vivo/acessorios/editar/${acessorio._id}`}
                      icon={<EditIcon />}
                      colorScheme="blue"
                      variant="ghost"
                      size="sm"
                      aria-label="Editar"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="pink"
                      variant="ghost"
                      size="sm"
                      aria-label="Excluir"
                      onClick={() => handleDeleteAcessorio(acessorio)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };

  const LoadingSkeleton = () => (
    <VStack spacing={4} mt={8} align="stretch">
      <Spinner size="xl" color={appColors.vivoPurple} thickness="4px" speed="0.65s" />
      <Text color={subtleTextColor}>Carregando acessórios...</Text>
    </VStack>
  );
  

  return (
    <Box bg={pageBg} minH="100vh" color={textColor}>
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{base: 8, md: 10}} align="stretch">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
            gap={{ base: 4, md: 6 }}
            pb={4}
            borderBottomWidth="1px"
            borderColor={useColorModeValue(appColors.borderColorLight, appColors.borderColorDark)}
          >
            <VStack align={{ base: 'center', md: 'start' }} spacing={1} textAlign={{ base: 'center', md: 'left' }} flexShrink={0}>
              <Heading as="h1" size="xl" color={pageHeaderColor}>
                Acessórios <Text as="span" color={highlightColor}>Vivo</Text>
              </Heading>
              <Text fontSize="md" color={subtleTextColor}>
                Gerencie seu catálogo de acessórios exclusivos.
              </Text>
            </VStack>
            <Button
              as={Link}
              to="/vivo/acessorios/novo"
              leftIcon={<AddIcon />}
              bg={appColors.vivoPurple}
              color="white"
              _hover={{ bg: highlightColor, transform: 'scale(1.05)'}}
              _active={{ bg: appColors.vivoPink, transform: 'scale(0.95)' }}
              size="lg"
              px={8}
              py={6}
              borderRadius="lg"
              boxShadow="md"
              fontWeight="bold"
              transition="all 0.2s ease-in-out"
            >
              Adicionar Novo
            </Button>
          </Flex>

          <Box 
            bg={useColorModeValue(appColors.cardBgLight, appColors.cardBgDark)} 
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="lg"
            backdropFilter={useColorModeValue("none", "blur(5px)")}
          >
            <HStack spacing={{ base: 3, md: 4}} w="full" direction={{ base: 'column', sm: 'row' }}>
              <InputGroup size="lg" flex={1}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={subtleTextColor} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por tipo, marca, modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={useColorModeValue(appColors.lightBgGlobal, appColors.darkBgGlobal)}
                  borderRadius="md"
                  borderColor={useColorModeValue(appColors.borderColorLight, appColors.borderColorDark)}
                  _hover={{ borderColor: appColors.accentBlue }}
                  _focus={{ borderColor: highlightColor, boxShadow: `0 0 0 1px ${highlightColor}`}}
                  color={textColor}
                />
              </InputGroup>
              <Select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                w={{ base: 'full', sm: '220px' }}
                size="lg"
                bg={useColorModeValue(appColors.lightBgGlobal, appColors.darkBgGlobal)}
                borderRadius="md"
                borderColor={useColorModeValue(appColors.borderColorLight, appColors.borderColorDark)}
                _hover={{ borderColor: appColors.accentBlue }}
                _focus={{ borderColor: highlightColor, boxShadow: `0 0 0 1px ${highlightColor}`}}
                color={textColor}
              >
                <option value="todos" style={{ backgroundColor: useColorModeValue(appColors.cardBgLight, appColors.darkBgGlobal) }}>Todos os Tipos</option>
                {getTipos().map(tipo => (
                  <option key={tipo} value={tipo} style={{ backgroundColor: useColorModeValue(appColors.cardBgLight, appColors.darkBgGlobal) }}>{tipo}</option>
                ))}
              </Select>
            </HStack>
          </Box>

          {loading ? <LoadingSkeleton /> : <AcessoriosListRender />}
        </VStack>
        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={onConfirmModalClose}
            onConfirm={confirmDeleteHandler}
            title="Confirmar Exclusão de Acessório"
            body={`Tem certeza que deseja excluir o acessório ${itemToDelete?.tipo} ${itemToDelete?.marca || ''} ${itemToDelete?.modelo || ''}? Esta ação é irreversível.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            isLoading={isDeleting}
        />
      </Container>
    </Box>
  );
};

export default VivoAcessoriosPage; 