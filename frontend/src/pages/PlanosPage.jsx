import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  HStack,
  VStack,
  IconButton,
  Spinner,
  Text,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  WarningIcon
} from '@chakra-ui/icons';
import ConfirmationModal from '../components/common/ConfirmationModal';

const API_PLANOS_URL = `${import.meta.env.VITE_API_URL}/api/planos`;

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

const PlanosPage = () => {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchPlanos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_PLANOS_URL);
      setPlanos(response.data);
    } catch (err) {
      console.error("Erro ao buscar planos:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao carregar planos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanos();
  }, [fetchPlanos]);

  const handleDelete = (plano) => {
    setItemToDelete(plano);
    onConfirmModalOpen();
  };

  const confirmDeleteHandler = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_PLANOS_URL}/${itemToDelete._id}`);
      setPlanos(planos.filter(p => p._id !== itemToDelete._id));
      toast.success(`Plano "${itemToDelete.nome}" excluído com sucesso!`);
      onConfirmModalClose();
      setItemToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir plano:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Erro ao excluir plano.');
    }
    setIsDeleting(false);
  };

  const formatCurrency = (value) => {
    return value.toFixed(2).replace('.', ',');
  };

  return (
    <Box bg={pageBg} minH="100vh" color={textColor}>
      <Container maxW="container.lg" py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
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
                Gerenciar Planos
              </Heading>
              <Text fontSize="md" color={subtleTextColor}>
                Visualize, adicione ou remova planos de serviço.
              </Text>
            </VStack>
            <Button
              as={Link}
              to="/planos/novo"
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
              Adicionar Plano
            </Button>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" color={appColors.vivoPurple} thickness="4px" speed="0.65s" />
            </Flex>
          ) : (
            <Box bg={tableBg} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={tableBorderColor} overflowX="auto">
              <Table variant="simple">
                <Thead bg={tableHeaderBg}>
                  <Tr>
                    <Th color={textColor}>Nome</Th>
                    <Th color={textColor}>SKU</Th>
                    <Th color={textColor} isNumeric>Valor (R$)</Th>
                    <Th color={textColor} textAlign="center">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {planos.length === 0 ? (
                    <Tr>
                      <Td colSpan={4} textAlign="center" borderColor={tableBorderColor}>
                        <VStack spacing={3} py={8}>
                          <Icon as={WarningIcon} boxSize="40px" color="yellow.400" />
                          <Text fontSize="lg" color={subtleTextColor}>Nenhum plano cadastrado.</Text>
                        </VStack>
                      </Td>
                    </Tr>
                  ) : (
                    planos.map((plano) => (
                      <Tr key={plano._id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                        <Td borderColor={tableBorderColor}>{plano.nome}</Td>
                        <Td borderColor={tableBorderColor}>{plano.sku}</Td>
                        <Td borderColor={tableBorderColor} isNumeric>{formatCurrency(plano.valor)}</Td>
                        <Td borderColor={tableBorderColor} textAlign="center">
                          <HStack spacing={2} justify="center">
                            <IconButton
                              as={Link}
                              to={`/planos/editar/${plano._id}`}
                              icon={<EditIcon />}
                              colorScheme="blue"
                              variant="ghost"
                              size="sm"
                              aria-label="Editar Plano"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="pink"
                              variant="ghost"
                              size="sm"
                              aria-label="Excluir Plano"
                              onClick={() => handleDelete(plano)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
        </VStack>

        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={onConfirmModalClose}
            onConfirm={confirmDeleteHandler}
            title="Confirmar Exclusão de Plano"
            body={`Tem certeza que deseja excluir o plano "${itemToDelete?.nome}"? Esta ação é irreversível.`}
            confirmText="Excluir"
            cancelText="Cancelar"
            isLoading={isDeleting}
        />
      </Container>
    </Box>
  );
};

export default PlanosPage; 