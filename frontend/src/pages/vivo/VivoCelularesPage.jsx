import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  useColorModeValue,
  Text,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Divider,
  Tag,
  Wrap,
  WrapItem,
  Icon,
  Grid,
  GridItem,
  useTheme,
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  PhoneIcon,
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  MoonIcon,
  SunIcon,
  DragHandleIcon,
} from '@chakra-ui/icons';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);
const MotionBox = motion(Box);

// Paleta de cores com foco no Roxo Vivo e contraste
const appColors = {
  vivoPurple: '#660099', // Roxo principal da Vivo
  vivoPurpleDarker: '#4c0073', // Um tom mais escuro para gradientes ou fundos
  vivoPurpleLight: '#E9D8FD', // Um lavanda bem suave para fundos claros
  vivoPink: '#FF007F',       // Cor de destaque vibrante
  accentBlue: '#00BFFF',     // Mantido para possíveis elementos de UI específicos
  
  // Cores de Texto adaptadas para fundos roxos
  textOnDark: 'whiteAlpha.900',      // Para texto sobre fundos roxos escuros
  textOnLight: '#2D3748',         // Cinza escuro (gray.800) para texto sobre fundos roxos claros
  subtleTextOnDark: 'gray.400',    // Cinza claro para texto sutil em fundo escuro
  subtleTextOnLight: 'gray.600',   // Cinza médio para texto sutil em fundo claro

  // Fundos e Bordas
  cardBgDark: 'rgba(45, 55, 72, 0.6)', // Cinza escuro com transparência para cards em modo escuro
  cardBgLight: 'white',
  lightBgGlobal: '#F7FAFC',      // Cinza muito claro global (para partes não-roxas)
  darkBgGlobal: '#1A202C',       // Preto global (para partes não-roxas)
  borderColorDark: 'rgba(255, 255, 255, 0.1)', // Borda sutil para modo escuro
  borderColorLight: 'gray.200',
};

const VivoCelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCelulares, setFilteredCelulares] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('todos');
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure();
  const [selectedCelular, setSelectedCelular] = useState(null);
  const { isOpen: isConfirmModalOpen, onOpen: onConfirmModalOpen, onClose: onConfirmModalClose } = useDisclosure();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const theme = useTheme();

  // Cores de fundo da página com gradiente roxo
  const pageBg = useColorModeValue(
    `linear-gradient(135deg, ${appColors.vivoPurpleLight} 0%, ${appColors.lightBgGlobal} 100%)`,
    `linear-gradient(135deg, ${appColors.vivoPurpleDarker} 0%, ${appColors.darkBgGlobal} 150%)`
  );

  // Cores de texto principais
  const textColor = useColorModeValue(appColors.textOnLight, appColors.textOnDark);
  const subtleTextColor = useColorModeValue(appColors.subtleTextOnLight, appColors.subtleTextOnDark);
  
  // Cor do título principal da página
  const pageHeaderColor = useColorModeValue(appColors.vivoPurple, appColors.textOnDark);
  // Cor de destaque (rosa vivo)
  const highlightColor = appColors.vivoPink;

  // Cores para os cards
  const cardBg = useColorModeValue(appColors.cardBgLight, appColors.cardBgDark);
  const cardHeaderColor = useColorModeValue(appColors.vivoPurple, appColors.textOnDark);
  const cardBorderColor = useColorModeValue(appColors.borderColorLight, appColors.borderColorDark);


  const fetchCelulares = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCelulares(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar celulares:', error);
      toast.error('Erro ao carregar celulares da Vivo');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCelulares();
  }, [fetchCelulares]);

  useEffect(() => {
    let result = [...celulares];
    if (statusFilter !== 'todos') {
      result = result.filter(celular => celular.status === statusFilter);
    }
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        celular =>
          celular.marca?.toLowerCase().includes(searchTermLower) ||
          celular.modelo?.toLowerCase().includes(searchTermLower)
      );
    }
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === 'createdAt') {
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
    setFilteredCelulares(result);
  }, [celulares, searchTerm, sortConfig, statusFilter]);

  const handleDeleteCelular = (celular) => {
    setItemToDelete(celular);
    onConfirmModalOpen();
  };

  const confirmDeleteHandler = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/${itemToDelete._id}`);
      toast.success(`Celular ${itemToDelete.marca} ${itemToDelete.modelo} excluído!`);
      fetchCelulares();
      onConfirmModalClose();
      setItemToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir celular:', error);
      toast.error('Falha ao excluir celular.');
    }
    setIsDeleting(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusProps = (status) => {
    if (status === 'Guardado') return { colorScheme: 'green', icon: CheckCircleIcon, label: 'Guardado' };
    if (status === 'Vitrine') return { colorScheme: 'pink', icon: WarningIcon, label: 'Vitrine' }; 
    return { colorScheme: 'gray', icon: DragHandleIcon, label: status || 'Indefinido' };
  };

  const handleCelularCardClick = (celular) => {
    setSelectedCelular(celular);
    onDetailsModalOpen();
  };

  const CelularCard = ({ celular }) => {
    const statusProps = getStatusProps(celular.status);

    return (
      <MotionBox
        as="article"
        bg={cardBg}
        borderRadius="xl"
        boxShadow="lg"
        overflow="hidden"
        p={6}
        initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -30, filter: 'blur(5px)' }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} 
        whileHover={{
          scale: 1.03, 
          boxShadow: 'xl', 
          borderColor: highlightColor,
          borderWidth: '2px', 
        }}
        borderWidth="2px"
        borderColor="transparent"
        cursor="pointer"
        onClick={() => handleCelularCardClick(celular)}
        minH="220px" 
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <VStack align="stretch" spacing={3} flex={1}>
          <Flex justify="space-between" align="flex-start">
            <Heading size="md" color={cardHeaderColor} fontWeight="semibold" noOfLines={2}>
              {celular.marca} {celular.modelo}
            </Heading>
            <Tag size="md" colorScheme={statusProps.colorScheme} variant="subtle" borderRadius="full">
              <Icon as={statusProps.icon} mr={1.5} />
              {statusProps.label}
            </Tag>
          </Flex>

          <Divider borderColor={cardBorderColor} my={2}/>

          <VStack spacing={1.5} align="stretch" fontSize="sm">
            <HStack>
              <Text fontWeight="medium" color={subtleTextColor}>Cor:</Text>
              <Text color={textColor}>{celular.cor || 'N/A'}</Text>
            </HStack>
            <HStack>
              <Icon as={TimeIcon} color={subtleTextColor} />
              <Text fontWeight="medium" color={subtleTextColor}>Cadastrado em:</Text>
              <Text color={textColor}>{formatDate(celular.createdAt)}</Text>
            </HStack>
          </VStack>
        </VStack>

        <HStack
            spacing={3}
            justify="flex-end"
            mt={4}
            opacity={0.8}
            _hover={{ opacity: 1 }}
        >
            <Tooltip label="Editar Celular" placement="top" bg={appColors.accentBlue} color="white">
                <IconButton
                    as={Link}
                    to={`/vivo/celulares/editar/${celular._id}`}
                    icon={<EditIcon />}
                    colorScheme="blue"
                    variant="ghost"
                    aria-label="Editar"
                    size="sm"
                    color={useColorModeValue(appColors.accentBlue, 'white')}
                    onClick={(e) => e.stopPropagation()}
                />
            </Tooltip>
            <Tooltip label="Excluir Celular" placement="top" bg={highlightColor} color="white">
                <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="pink"
                    variant="ghost"
                    aria-label="Excluir"
                    size="sm"
                    color={useColorModeValue(highlightColor, 'white')}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCelular(celular);
                    }}
                />
            </Tooltip>
        </HStack>
      </MotionBox>
    );
  };

  const CelularDetailsModal = () => (
    <Modal isOpen={isDetailsModalOpen} onClose={onDetailsModalClose} size="xl" motionPreset="slideInBottom" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
      <ModalContent bg={cardBg} borderRadius="lg" boxShadow="2xl" mx={4} color={textColor}>
        <ModalHeader color={cardHeaderColor} fontWeight="bold" borderBottomWidth="1px" borderColor={cardBorderColor} px={6} py={4}>
          <HStack>
            <Icon as={PhoneIcon} color={appColors.vivoPurple} w={6} h={6}/>
            <Text fontSize="xl">Detalhes do Celular</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton _hover={{ bg: highlightColor, color: 'white' }} top={3} right={3}/>
        <ModalBody py={6} px={6}>
          {selectedCelular && (
            <VStack align="stretch" spacing={5}>
                <VStack align="stretch" spacing={2}>
                    <Heading size="lg" color={cardHeaderColor}>{selectedCelular.marca}</Heading>
                    <Text fontSize="2xl" fontWeight="medium" lineHeight="shorter">{selectedCelular.modelo}</Text>
                    <Tag size="lg" colorScheme={getStatusProps(selectedCelular.status).colorScheme} variant="solid" alignSelf="flex-start" mt={1}>
                        <Icon as={getStatusProps(selectedCelular.status).icon} mr={2}/>
                        {getStatusProps(selectedCelular.status).label}
                    </Tag>
                </VStack>
                <Divider borderColor={cardBorderColor}/>
                <Grid templateColumns="repeat(auto-fit, minmax(180px, 1fr))" gap={4}>
                    <GridItem>
                        <Text fontSize="sm" fontWeight="medium" color={subtleTextColor}>Cor:</Text>
                        <Text fontSize="md">{selectedCelular.cor || 'Não informada'}</Text>
                    </GridItem>
                    <GridItem>
                        <Text fontSize="sm" fontWeight="medium" color={subtleTextColor}>Cadastrado em:</Text>
                        <Text fontSize="md">{formatDate(selectedCelular.createdAt)}</Text>
                    </GridItem>
                </Grid>

              <Text fontSize="md" fontWeight="bold" mt={3}>Observações:</Text>
              <Box 
                bg={useColorModeValue(appColors.vivoPurpleLight, appColors.darkBgGlobal)} 
                p={3} 
                borderRadius="md" 
                minH="80px"
                borderWidth="1px"
                borderColor={cardBorderColor}
              >
                <Text fontStyle="italic" color={subtleTextColor} fontSize="sm">
                    {selectedCelular.observacoes || 'Nenhuma observação registrada.'}
                </Text>
              </Box>

              <HStack spacing={4} justify="flex-end" mt={5}>
                <Button
                  as={Link}
                  to={`/vivo/celulares/editar/${selectedCelular._id}`}
                  leftIcon={<EditIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={onDetailsModalClose}
                  size="md"
                  _hover={{ bg: appColors.accentBlue, color: 'white' }}
                  borderColor={appColors.accentBlue}
                  color={appColors.accentBlue}
                >
                  Editar Detalhes
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  bg={highlightColor} 
                  color="white"
                  _hover={{ bg: appColors.vivoPurple }}
                  onClick={() => {
                    onDetailsModalClose();
                    handleDeleteCelular(selectedCelular);
                  }}
                  size="md"
                >
                  Excluir Celular
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <Box bg={pageBg} minH="100vh" color={textColor}>
      <Container maxW="container.xl" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        <MotionVStack
            spacing={{base: 8, md: 10}}
            align="stretch"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
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
                Estoque de Celulares <Text as="span" color={highlightColor}>Vivo</Text>
              </Heading>
              <Text fontSize="md" color={subtleTextColor}>
                Gerenciamento avançado do seu catálogo exclusivo.
              </Text>
            </VStack>
            <Button
              as={Link}
              to="/vivo/celulares/novo"
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

          <MotionBox
            bg={useColorModeValue(appColors.cardBgLight, appColors.cardBgDark)} 
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            boxShadow="lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            backdropFilter={useColorModeValue("none", "blur(5px)")}
          >
            <HStack spacing={{ base: 3, md: 4}} w="full" direction={{ base: 'column', sm: 'row' }}>
              <InputGroup size="lg" flex={1}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={subtleTextColor} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por marca ou modelo..."
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w={{ base: 'full', sm: '220px' }}
                size="lg"
                bg={useColorModeValue(appColors.lightBgGlobal, appColors.darkBgGlobal)}
                borderRadius="md"
                borderColor={useColorModeValue(appColors.borderColorLight, appColors.borderColorDark)}
                _hover={{ borderColor: appColors.accentBlue }}
                _focus={{ borderColor: highlightColor, boxShadow: `0 0 0 1px ${highlightColor}`}}
                color={textColor}
              >
                <option value="todos" style={{ backgroundColor: useColorModeValue(appColors.cardBgLight, appColors.darkBgGlobal) }}>Todos os Status</option>
                <option value="Guardado" style={{ backgroundColor: useColorModeValue(appColors.cardBgLight, appColors.darkBgGlobal) }}>Guardado</option>
                <option value="Vitrine" style={{ backgroundColor: useColorModeValue(appColors.cardBgLight, appColors.darkBgGlobal) }}>Vitrine</option>
              </Select>
            </HStack>
          </MotionBox>

          {loading ? (
            <Flex justify="center" align="center" h="250px">
                <VStack spacing={3}>
                    {useColorModeValue(
                        <SunIcon color={appColors.vivoPurple} boxSize="32px" className="animate-pulse"/>,
                        <MoonIcon color={highlightColor} boxSize="32px" className="animate-pulse"/>
                    )}
                    <Text color={subtleTextColor} fontSize="lg">Carregando celulares...</Text>
                </VStack>
            </Flex>
          ) : (
            <Wrap spacing={{ base: 4, md: 6 }} justify="center" w="full">
              <AnimatePresence>
                {filteredCelulares.length > 0 ? (
                  filteredCelulares.map((celular) => (
                    <WrapItem key={celular._id} display="flex" w={{ base: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 18px)' }}>
                      <CelularCard celular={celular} />
                    </WrapItem>
                  ))
                ) : (
                  <MotionVStack w="full" justify="center" align="center" h="200px" spacing={3} initial={{opacity:0, y: 20}} animate={{opacity:1, y:0}} transition={{delay:0.2}}>
                    <Icon as={WarningIcon} boxSize={{ base: "40px", md: "50px" }} color="yellow.400" />
                    <Heading size="md" color={textColor}>Nenhum celular no catálogo.</Heading>
                    <Text color={subtleTextColor}>Verifique os filtros ou adicione um novo celular.</Text>
                  </MotionVStack>
                )}
              </AnimatePresence>
            </Wrap>
          )}
        </MotionVStack>

        <CelularDetailsModal />
        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={onConfirmModalClose}
            onConfirm={confirmDeleteHandler}
            title="Confirmar Exclusão de Celular"
            body={`Tem certeza que deseja excluir o celular ${itemToDelete?.marca} ${itemToDelete?.modelo}? Esta ação é irreversível.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            isLoading={isDeleting}
        />
      </Container>
    </Box>
  );
};

export default VivoCelularesPage; 