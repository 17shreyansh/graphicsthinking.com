import {
  Box, Flex, HStack, Link, IconButton, useDisclosure, Stack, Text
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from './Logo'

const MotionBox = motion(Box)

const NavLink = ({ children, to }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      as={RouterLink}
      to={to}
      px={4}
      py={2}
      rounded="lg"
      fontFamily="accent"
      fontWeight="600"
      color={isActive ? 'brand.red' : 'white'}
      bg={isActive ? 'brand.redLight' : 'transparent'}
      _hover={{
        textDecoration: 'none',
        color: 'brand.red',
        bg: 'brand.redLight',
        transform: 'translateY(-1px)'
      }}
      transition="all 0.3s ease"
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <MotionBox
      bg="rgba(26, 54, 93, 0.95)"
      px={4}
      boxShadow="lg"
      position="sticky"
      top={0}
      zIndex={1000}
      borderBottom="3px solid"
      borderColor="brand.red"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">
        <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        <HStack spacing={8} alignItems="center" display={{ base: 'none', md: 'flex' }}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </HStack>

        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {isOpen && (
        <MotionBox
          pb={4}
          display={{ md: 'none' }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Stack as="nav" spacing={4} bg="rgba(26, 54, 93, 0.95)" p={4} borderRadius="md" boxShadow="lg" mt={2}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/portfolio">Portfolio</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </Stack>
        </MotionBox>
      )}
    </MotionBox>
  )
}