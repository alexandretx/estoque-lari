import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useColorModeValue,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons'; // Um ícone para dar mais peso à confirmação

// Reutilizando a paleta de cores definida anteriormente
const appColors = {
  vivoPurple: '#660099',
  vivoPurpleDarker: '#4c0073',
  vivoPurpleLight: '#E9D8FD',
  vivoPink: '#FF007F',
  accentBlue: '#00BFFF',
  textOnDark: 'whiteAlpha.900',      // Para texto sobre fundos roxos escuros
  textOnLight: '#2D3748',         // Cinza escuro (gray.800) para texto sobre fundos roxos claros
  subtleTextOnDark: 'gray.400',    // Cinza claro para texto sutil em fundo escuro
  subtleTextOnLight: 'gray.600',   // Cinza médio para texto sutil em fundo claro

  // Fundos e Bordas
  cardBgDark: 'rgba(45, 55, 72, 0.7)', // Um pouco mais de opacidade para modais
  cardBgLight: 'white',
  lightBgGlobal: '#F7FAFC',      // Cinza muito claro global (para partes não-roxas)
  darkBgGlobal: '#1A202C',       // Preto global (para partes não-roxas)
  borderColorDark: 'rgba(255, 255, 255, 0.15)',
  borderColorLight: 'gray.200',
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Ação",
  body = "Você tem certeza que deseja prosseguir com esta ação? Ela pode ser irreversível.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColorScheme = "red", // 'red' para destrutivo, 'blue' ou 'purple' para outros
  isLoading = false,
}) => {
  const modalBg = useColorModeValue(appColors.cardBgLight, appColors.cardBgDark);
  const textColor = useColorModeValue(appColors.textOnLight, appColors.textOnDark);
  const subtleTextColor = useColorModeValue(appColors.subtleTextOnLight, appColors.subtleTextOnDark);
  const borderColor = useColorModeValue(appColors.borderColorLight, appColors.borderColorDark);
  const headerColor = useColorModeValue(appColors.vivoPurple, appColors.textOnDark);


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom" size="md">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(5px)" />
      <ModalContent bg={modalBg} borderRadius="xl" boxShadow="dark-lg" color={textColor} mx={4}>
        <ModalHeader 
            borderBottomWidth="1px" 
            borderColor={borderColor} 
            px={6} py={4}
            fontSize="lg"
            fontWeight="bold"
            color={headerColor}
        >
            <HStack spacing={3}>
                <Icon as={WarningTwoIcon} w={5} h={5} color={confirmColorScheme === "red" ? appColors.vivoPink : appColors.accentBlue} />
                <Text>{title}</Text>
            </HStack>
        </ModalHeader>
        <ModalCloseButton _hover={{ bg: appColors.vivoPink, color: 'white' }} top={3} right={3} />
        <ModalBody py={6} px={6}>
          <Text whiteSpace="pre-wrap">{body}</Text>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={borderColor} px={6} py={4}>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            mr={3}
            _hover={{ bg: useColorModeValue('gray.100', 'whiteAlpha.200')}}
            isDisabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            bg={confirmColorScheme === "red" ? appColors.vivoPink : appColors.vivoPurple}
            color="white"
            _hover={{ 
                bg: confirmColorScheme === "red" ? appColors.vivoPurple : appColors.vivoPink,
                transform: 'scale(1.05)' 
            }}
            _active={{ transform: 'scale(0.95)' }}
            onClick={onConfirm}
            isLoading={isLoading}
            minW="100px"
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal; 