import { extendTheme } from '@chakra-ui/react';

const colors = {
  vivo: {
    50: '#f5e6ff',
    100: '#e6ccff',
    200: '#cc99ff',
    300: '#b366ff',
    400: '#9933ff',
    500: '#8000ff', // Cor principal da Vivo
    600: '#6600cc', // rgb(102, 0, 153) - Cor que você especificou
    700: '#4d0099',
    800: '#330066',
    900: '#1a0033',
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      vivo: {
        bg: 'vivo.500',
        color: 'white',
        _hover: {
          bg: 'vivo.600',
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          bg: 'vivo.700',
          transform: 'translateY(0)',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        boxShadow: 'md',
        _hover: {
          boxShadow: 'lg',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
  },
};

const theme = extendTheme({
  colors,
  components,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

export default theme; 