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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useColorModeValue,
  Card,
  CardBody,
  Text,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vivo/celulares`;

const MotionBox = motion(Box);
const MotionTr = motion(Tr);

const VivoCelularesPage = () => {
  const [celulares, setCelulares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCelulares, setFilteredCelulares] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [statusFilter, setStatusFilter] = useState('todos');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="vivo.600">
            Celulares Vivo
          </Heading>
          <Button
            as={Link}
            to="/vivo/celulares/novo"
            leftIcon={<AddIcon />}
            colorScheme="vivo"
            variant="vivo"
            size="md"
          >
            Adicionar Celular
          </Button>
        </Flex>

        <Card>
          <CardBody>
            <HStack spacing={4} mb={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por marca, modelo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w="200px"
              >
                <option value="todos">Todos os Status</option>
                <option value="Guardado">Guardado</option>
                <option value="Vitrine">Vitrine</option>
              </Select>
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th onClick={() => requestSort('marca')} cursor="pointer">
                      Marca {sortConfig.key === 'marca' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </Th>
                    <Th onClick={() => requestSort('modelo')} cursor="pointer">
                      Modelo {sortConfig.key === 'modelo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </Th>
                    <Th>Status</Th>
                    <Th>Cor</Th>
                    <Th onClick={() => requestSort('createdAt')} cursor="pointer">
                      Data de Cadastro {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </Th>
                    <Th textAlign="center">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <AnimatePresence>
                    {filteredCelulares.map((celular) => (
                      <MotionTr
                        key={celular._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        _hover={{ bg: 'gray.50' }}
                      >
                        <Td>{celular.marca || 'N/A'}</Td>
                        <Td>{celular.modelo || 'N/A'}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(celular.status)}>
                            {celular.status || 'N/A'}
                          </Badge>
                        </Td>
                        <Td>{celular.cor || 'N/A'}</Td>
                        <Td>{formatDate(celular.createdAt)}</Td>
                        <Td>
                          <HStack spacing={2} justify="center">
                            <IconButton
                              as={Link}
                              to={`/vivo/celulares/editar/${celular._id}`}
                              icon={<EditIcon />}
                              colorScheme="blue"
                              variant="ghost"
                              size="sm"
                              aria-label="Editar"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              aria-label="Excluir"
                              onClick={() => handleDeleteCelular(celular._id, celular.marca, celular.modelo)}
                            />
                          </HStack>
                        </Td>
                      </MotionTr>
                    ))}
                  </AnimatePresence>
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default VivoCelularesPage; 