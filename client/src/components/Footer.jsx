import {
  Box, Container, Grid, VStack, HStack, Text, Link, Icon, Divider
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaInstagram, FaBehance, FaDribbble, FaEnvelope, FaPhone } from 'react-icons/fa'

export default function Footer() {
  return (
    <Box bg="gray.900" color="white" py={12}>
      <Container maxW="7xl">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={8}>
          <VStack align="start" spacing={4}>
            <Text fontSize="2xl" fontFamily="heading" color="brand.red">
              GRAPHICS THINKING
            </Text>
            <Text color="gray.400" fontSize="sm">
              Professional graphic design services that bring your vision to life.
            </Text>
            <HStack spacing={4}>
              <Link href="https://instagram.com" isExternal>
                <Icon as={FaInstagram} w={5} h={5} _hover={{ color: 'brand.red' }} />
              </Link>
              <Link href="https://behance.net" isExternal>
                <Icon as={FaBehance} w={5} h={5} _hover={{ color: 'brand.blue' }} />
              </Link>
              <Link href="https://dribbble.com" isExternal>
                <Icon as={FaDribbble} w={5} h={5} _hover={{ color: 'brand.brown' }} />
              </Link>
            </HStack>
          </VStack>

          <VStack align="start" spacing={3}>
            <Text fontWeight="600" fontFamily="accent">Quick Links</Text>
            <Link as={RouterLink} to="/" color="gray.400" _hover={{ color: 'white' }}>Home</Link>
            <Link as={RouterLink} to="/about" color="gray.400" _hover={{ color: 'white' }}>About</Link>
            <Link as={RouterLink} to="/portfolio" color="gray.400" _hover={{ color: 'white' }}>Portfolio</Link>
            <Link as={RouterLink} to="/services" color="gray.400" _hover={{ color: 'white' }}>Services</Link>
          </VStack>

          <VStack align="start" spacing={3}>
            <Text fontWeight="600" fontFamily="accent">Services</Text>
            <Text color="gray.400" fontSize="sm">Logo Design</Text>
            <Text color="gray.400" fontSize="sm">Social Media Design</Text>
            <Text color="gray.400" fontSize="sm">Print Design</Text>
            <Text color="gray.400" fontSize="sm">Digital Art</Text>
          </VStack>

          <VStack align="start" spacing={3}>
            <Text fontWeight="600" fontFamily="accent">Contact</Text>
            <HStack>
              <Icon as={FaEnvelope} />
              <Text color="gray.400" fontSize="sm">hello@graphicsthinking.com</Text>
            </HStack>
            <HStack>
              <Icon as={FaPhone} />
              <Text color="gray.400" fontSize="sm">+1 (555) 123-4567</Text>
            </HStack>
          </VStack>
        </Grid>

        <Divider my={8} borderColor="gray.700" />
        
        <HStack justify="space-between" flexWrap="wrap">
          <Text color="gray.400" fontSize="sm">
            © 2024 Graphics Thinking. All rights reserved.
          </Text>
          <HStack spacing={6}>
            <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
              Privacy Policy
            </Link>
            <Link href="#" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>
              Terms of Service
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}