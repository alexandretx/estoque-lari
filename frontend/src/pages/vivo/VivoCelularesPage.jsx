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
  Card,
  CardBody,
  Text,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
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
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  PhoneIcon,
  InfoIcon,
  CheckCircleIcon,
  WarningIcon,
} from '@chakra-ui/icons';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const VivoCelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCelulares, setFilteredCelulares] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('todos');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCelular, setSelectedCelular] = useState(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.600');

  // Buscar celulares
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

  // Filtrar e classificar celulares
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

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
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
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    if (status === 'Guardado') return 'green';
    if (status === 'Vitrine') return 'red';
    return 'gray';
  };

  const handleCelularClick = (celular) => {
    setSelectedCelular(celular);
    onOpen();
  };

  const CelularCard = ({ celular }) => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
        bg: cardHoverBg,
      }}
      cursor="pointer"
      onClick={() => handleCelularClick(celular)}
    >
      <CardBody p={6}>
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="center">
            <Heading size="md" color="vivo.600">
              {celular.marca}
            </Heading>
            <Badge
              colorScheme={getStatusColor(celular.status)}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
            >
              {celular.status}
            </Badge>
          </Flex>

          <Text fontSize="lg" fontWeight="medium">
            {celular.modelo}
          </Text>

          <Divider />

          <HStack spacing={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.500">
                Cor
              </Text>
              <Text fontSize="md">{celular.cor || 'N/A'}</Text>
            </VStack>

            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.500">
                Data de Cadastro
              </Text>
              <Text fontSize="md">{formatDate(celular.createdAt)}</Text>
            </VStack>
          </HStack>

          <HStack spacing={2} justify="flex-end">
            <Tooltip label="Editar">
              <IconButton
                as={Link}
                to={`/vivo/celulares/editar/${celular._id}`}
                icon={<EditIcon />}
                colorScheme="blue"
                variant="ghost"
                size="sm"
                aria-label="Editar"
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
            <Tooltip label="Excluir">
              <IconButton
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="ghost"
                size="sm"
                aria-label="Excluir"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCelular(celular._id, celular.marca, celular.modelo);
                }}
              />
            </Tooltip>
          </HStack>
        </VStack>
      </CardBody>
    </MotionCard>
  );

  const CelularModal = () => (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader color="vivo.600">
          <HStack>
            <PhoneIcon />
            <Text>Detalhes do Celular</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedCelular && (
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Heading size="md">{selectedCelular.marca}</Heading>
                <Badge
                  colorScheme={getStatusColor(selectedCelular.status)}
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {selectedCelular.status}
                </Badge>
              </HStack>

              <Text fontSize="xl" fontWeight="medium">
                {selectedCelular.modelo}
              </Text>

              <Divider />

              <SimpleGrid columns={2} spacing={4}>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">
                    Cor
                  </Text>
                  <Text fontSize="md">{selectedCelular.cor || 'N/A'}</Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color="gray.500">
                    Data de Cadastro
                  </Text>
                  <Text fontSize="md">{formatDate(selectedCelular.createdAt)}</Text>
                </VStack>
              </SimpleGrid>

              <HStack spacing={4} justify="flex-end">
                <Button
                  as={Link}
                  to={`/vivo/celulares/editar/${selectedCelular._id}`}
                  leftIcon={<EditIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={onClose}
                >
                  Editar
                </Button>
                <Button
                  leftIcon={<DeleteIcon />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    handleDeleteCelular(
                      selectedCelular._id,
                      selectedCelular.marca,
                      selectedCelular.modelo
                    );
                    onClose();
                  }}
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
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={2}>
            <Heading size="lg" color="vivo.600">
              Celulares Vivo
            </Heading>
            <Text color="gray.500">
              Gerencie seu estoque de celulares da Vivo
            </Text>
          </VStack>
          <Button
            as={Link}
            to="/vivo/celulares/novo"
            leftIcon={<AddIcon />}
            colorScheme="vivo"
            variant="vivo"
            size="lg"
            px={8}
          >
            Adicionar Celular
          </Button>
        </Flex>

        <Card>
          <CardBody>
            <VStack spacing={6}>
              <HStack spacing={4} w="full">
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Buscar por marca, modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="lg"
                  />
                </InputGroup>

                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  w="200px"
                  size="lg"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="Guardado">Guardado</option>
                  <option value="Vitrine">Vitrine</option>
                </Select>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                <AnimatePresence>
                  {filteredCelulares.map((celular) => (
                    <CelularCard key={celular._id} celular={celular} />
                  ))}
                </AnimatePresence>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      <CelularModal />
    </Container>
  );
};

export default VivoCelularesPage; 