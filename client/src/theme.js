import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      red: '#E53E3E',
      blue: '#3182CE', 
      brown: '#8B4513',
      redLight: '#FED7D7',
      blueLight: '#BEE3F8',
      brownLight: '#F7FAFC',
      redDark: '#C53030',
      blueDark: '#2C5282',
      brownDark: '#744210',
      50: '#FFF5F5',
      100: '#FED7D7',
      200: '#FEB2B2',
      300: '#FC8181',
      400: '#F56565',
      500: '#E53E3E',
      600: '#C53030',
      700: '#9B2C2C',
      800: '#822727',
      900: '#63171B'
    }
  },
  fonts: {
    heading: 'Anton, sans-serif',
    body: 'Poppins, sans-serif',
    accent: 'Montserrat, sans-serif'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem'
  },
  shadows: {
    brand: '0 10px 25px -5px rgba(229, 62, 62, 0.1), 0 4px 6px -2px rgba(229, 62, 62, 0.05)',
    'brand-lg': '0 25px 50px -12px rgba(229, 62, 62, 0.25)',
    blue: '0 10px 25px -5px rgba(49, 130, 206, 0.1), 0 4px 6px -2px rgba(49, 130, 206, 0.05)',
    brown: '0 10px 25px -5px rgba(139, 69, 19, 0.1), 0 4px 6px -2px rgba(139, 69, 19, 0.05)'
  },
  styles: {
    global: {
      body: {
        bg: '#1A365D',
        color: 'white',
        lineHeight: '1.6'
      },
      '*': {
        scrollBehavior: 'smooth'
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: '12px',
        fontFamily: 'accent'
      },
      variants: {
        solid: {
          bg: 'brand.red',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-2px)',
            boxShadow: 'brand-lg'
          },
          _active: {
            transform: 'translateY(0)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        outline: {
          borderColor: 'brand.red',
          color: 'brand.red',
          _hover: {
            bg: 'brand.red',
            color: 'white',
            transform: 'translateY(-2px)'
          }
        }
      },
      sizes: {
        lg: {
          h: '56px',
          px: '32px',
          fontSize: 'lg'
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          _hover: {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          },
          transition: 'all 0.3s ease'
        }
      }
    }
  }
})

export default theme