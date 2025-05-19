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
  Image,
  Tooltip,
  Divider,
  AspectRatio,
  Tag,
  Wrap,
  WrapItem,
  Icon,
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
} from '@chakra-ui/icons';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);

const vivoColors = {
  purple: '#660099',
  pink: '#FF007F',
  darkPurple: '#4d0073',
  lightGray: '#f0f0f0',
  textDark: 'gray.700',
  textLight: 'whiteAlpha.900',
};

const VivoCelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCelulares, setFilteredCelulares] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('todos');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCelular, setSelectedCelular] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue(vivoColors.textDark, vivoColors.textLight);
  const subtleBg = useColorModeValue('gray.100', 'gray.900');
  const pageBg = useColorModeValue(
    `linear-gradient(135deg, ${vivoColors.lightGray} 0%, white 100%)`,
    `linear-gradient(135deg, ${vivoColors.darkPurple} 0%, #1A202C 100%)`
  );

  const fetchCelulares = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCelulares(response.data.map(c => ({...c, imageUrl: `https://picsum.photos/seed/${c.modelo || 'phone'}/400/300` })));
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

  const handleDeleteCelular = async (id, marca, modelo) => {
    if (window.confirm(`Tem certeza que deseja excluir o celular ${marca} ${modelo}?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Celular excluído com sucesso!');
        fetchCelulares();
      } catch (error) {
        console.error('Erro ao excluir celular:', error);
        toast.error('Erro ao excluir celular');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusProps = (status) => {
    if (status === 'Guardado') return { colorScheme: 'green', icon: CheckCircleIcon };
    if (status === 'Vitrine') return { colorScheme: 'red', icon: WarningIcon };
    return { colorScheme: 'gray', icon: InfoIcon };
  };

  const handleCelularClick = (celular) => {
    setSelectedCelular(celular);
    onOpen();
  };

  const CelularCard = ({ celular }) => {
    const statusProps = getStatusProps(celular.status);

    return (
      <MotionFlex
        direction="column"
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileHover={{ y: -10, boxShadow: "2xl" }}
        cursor="pointer"
        onClick={() => handleCelularClick(celular)}
        w={{ base: 'full', sm: '350px', md: '380px' }}
        m={2}
      >
        <AspectRatio ratio={16 / 9} w="full">
          <Image
            src={celular.imageUrl || 'https://via.placeholder.com/400x300.png?text=Celular+Vivo'}
            alt={`Celular ${celular.marca} ${celular.modelo}`}
            objectFit="cover"
            borderTopRadius="2xl"
          />
        </AspectRatio>

        <VStack p={6} spacing={4} align="stretch" flex={1}>
          <Flex justify="space-between" align="center">
            <Heading size="md" color={vivoColors.purple} fontWeight="bold">
              {celular.marca}
            </Heading>
            <Tag size="lg" colorScheme={statusProps.colorScheme} borderRadius="full" variant="solid">
              <Icon as={statusProps.icon} mr={2} />
              {celular.status}
            </Tag>
          </Flex>

          <Text fontSize="xl" fontWeight="semibold" color={textColor} noOfLines={2}>
            {celular.modelo}
          </Text>

          <Divider borderColor={useColorModeValue('gray.200', 'gray.600')} />

          <VStack spacing={2} align="stretch" fontSize="sm">
            <HStack>
              <Text fontWeight="medium" color="gray.500">Cor:</Text>
              <Text color={textColor}>{celular.cor || 'Não informada'}</Text>
            </HStack>
            <HStack>
              <Icon as={TimeIcon} color="gray.500" />
              <Text fontWeight="medium" color="gray.500">Cadastro:</Text>
              <Text color={textColor}>{formatDate(celular.createdAt)}</Text>
            </HStack>
          </VStack>

          <HStack
            spacing={3}
            justify="flex-end"
            pt={2}
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.3s ease-in-out"
          >
          </HStack>
        </VStack>
         <Flex
          position="absolute"
          bottom={4}
          right={4}
          opacity={0}
          transition="opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
          transform="translateY(10px)"
          _hover={{ opacity: 1, transform: "translateY(0)" }}
        >
          <Tooltip label="Editar Celular" placement="top">
            <IconButton
              as={Link}
              to={`/vivo/celulares/editar/${celular._id}`}
              icon={<EditIcon />}
              colorScheme="blue"
              aria-label="Editar"
              size="md"
              isRound
              boxShadow="md"
              onClick={(e) => e.stopPropagation()}
              mr={2}
            />
          </Tooltip>
          <Tooltip label="Excluir Celular" placement="top">
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="pink"
              aria-label="Excluir"
              size="md"
              isRound
              boxShadow="md"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCelular(celular._id, celular.marca, celular.modelo);
              }}
            />
          </Tooltip>
        </Flex>
      </MotionFlex>
    );
  };

  const CelularModal = () => (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" motionPreset="slideInBottom" isCentered>
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent bg={cardBg} borderRadius="xl" boxShadow="dark-lg">
        <ModalHeader color={vivoColors.purple} fontWeight="bold" borderBottomWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <HStack>
            <PhoneIcon />
            <Text>Detalhes do Celular Vivo</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton _hover={{ bg: 'red.500', color: 'white' }} />
        <ModalBody py={8} px={10}>
          {selectedCelular && (
            <VStack align="stretch" spacing={6}>
              <Flex direction={{ base: 'column', md: 'row' }} align="start" gap={8}>
                <AspectRatio ratio={4/3} w={{ base: 'full', md: '300px' }} borderRadius="lg" overflow="hidden">
                    <Image src={selectedCelular.imageUrl} alt={`Celular ${selectedCelular.marca} ${selectedCelular.modelo}`} objectFit="cover" />
                </AspectRatio>
                <VStack align="stretch" spacing={4} flex={1}>
                    <HStack justify="space-between">
                        <Heading size="lg" color={vivoColors.purple}>{selectedCelular.marca}</Heading>
                        <Tag size="lg" colorScheme={getStatusProps(selectedCelular.status).colorScheme} borderRadius="full">
                            <Icon as={getStatusProps(selectedCelular.status).icon} mr={2}/>
                            {selectedCelular.status}
                        </Tag>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="semibold" color={textColor}>{selectedCelular.modelo}</Text>
                    <Divider />
                    <Text fontSize="md" color={textColor}><Text as="span" fontWeight="bold">Cor:</Text> {selectedCelular.cor || 'Não informada'}</Text>
                    <Text fontSize="md" color={textColor}><Text as="span" fontWeight="bold">Cadastrado em:</Text> {formatDate(selectedCelular.createdAt)}</Text>
                </VStack>
              </Flex>

              <Divider mt={4} />

              <Text fontSize="lg" fontWeight="bold" color={textColor}>Observações:</Text>
              <Text fontStyle="italic" color="gray.500">
                {selectedCelular.observacoes || 'Nenhuma observação adicionada para este celular.'}
              </Text>

              <HStack spacing={4} justify="flex-end" mt={6}>
                <Button
                  as={Link}
                  to={`/vivo/celulares/editar/${selectedCelular._id}`}
                  leftIcon={<EditIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={onClose}
                  size="lg"
                >
                  Editar
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  colorScheme="pink"
                  onClick={() => {
                    handleDeleteCelular(
                      selectedCelular._id,
                      selectedCelular.marca,
                      selectedCelular.modelo
                    );
                    onClose();
                  }}
                  size="lg"
                >
                  Excluir
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <Box bg={pageBg} minH="100vh">
      <Container maxW="container.2xl" py={{ base: 6, md: 12 }} px={{ base: 4, md: 8 }}>
        <MotionVStack
            spacing={10}
            align="stretch"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'stretch', md: 'center' }}
            gap={4}
          >
            <VStack align={{ base: 'center', md: 'start' }} spacing={1} textAlign={{ base: 'center', md: 'left' }}>
              <Heading as="h1" size="2xl" color={useColorModeValue(vivoColors.purple, 'white')}>
                Catálogo Exclusivo <Text as="span" color={vivoColors.pink}>Vivo</Text>
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
                Explore nossa seleção especial de celulares da Vivo.
              </Text>
            </VStack>
            <Button
              as={Link}
              to="/vivo/celulares/novo"
              leftIcon={<AddIcon />}
              bg={vivoColors.purple}
              color="white"
              _hover={{ bg: vivoColors.pink }}
              size="lg"
              px={10}
              py={7}
              borderRadius="xl"
              boxShadow="lg"
              transition="all 0.3s ease"
            >
              Novo Celular
            </Button>
          </Flex>

          <VStack
            bg={useColorModeValue('whiteAlpha.800', 'blackAlpha.600')}
            p={{ base: 4, md: 8 }}
            borderRadius="2xl"
            boxShadow="lg"
            spacing={6}
            backdropFilter="blur(10px)"
          >
            <HStack spacing={{ base: 2, md: 4}} w="full" direction={{ base: 'column', md: 'row' }}>
              <InputGroup size="lg" flex={1}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por marca, modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={useColorModeValue('white', 'gray.700')}
                  borderRadius="lg"
                  _focus={{ borderColor: vivoColors.pink, boxShadow: `0 0 0 1px ${vivoColors.pink}`}}
                />
              </InputGroup>

              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w={{ base: 'full', md: '250px' }}
                size="lg"
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="lg"
                _focus={{ borderColor: vivoColors.pink, boxShadow: `0 0 0 1px ${vivoColors.pink}`}}
              >
                <option value="todos">Todos os Status</option>
                <option value="Guardado">Guardado</option>
                <option value="Vitrine">Vitrine</option>
              </Select>
            </HStack>
          </VStack>

          {loading ? (
            <Flex justify="center" align="center" h="300px">
                <VStack>
                    <MoonIcon color={vivoColors.purple} boxSize="40px" className="animate-spin"/>
                    <Text color={textColor}>Carregando celulares...</Text>
                </VStack>
            </Flex>
          ) : (
            <Wrap spacing={8} justify="center" w="full">
              <AnimatePresence>
                {filteredCelulares.length > 0 ? (
                  filteredCelulares.map((celular) => (
                    <WrapItem key={celular._id} display="flex">
                      <CelularCard celular={celular} />
                    </WrapItem>
                  ))
                ) : (
                  <MotionVStack justify="center" align="center" h="200px" spacing={4} initial={{opacity:0}} animate={{opacity:1}}>
                    <Icon as={WarningIcon} boxSize="50px" color="yellow.400" />
                    <Heading size="md" color={textColor}>Nenhum celular encontrado.</Heading>
                    <Text color="gray.500">Tente ajustar os filtros ou o termo de busca.</Text>
                  </MotionVStack>
                )}
              </AnimatePresence>
            </Wrap>
          )}
        </MotionVStack>

        <CelularModal />
      </Container>
    </Box>
  );
};

export default VivoCelularesPage; 