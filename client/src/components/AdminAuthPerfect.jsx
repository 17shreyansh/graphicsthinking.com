import { useState } from 'react'
import {
  Box, Container, VStack, Heading, Text, Input, Button, FormControl, FormLabel,
  Alert, AlertIcon, Card, CardBody, Image, HStack, InputGroup, InputRightElement,
  IconButton, useToast
} from '@chakra-ui/react'
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'

export default function AdminAuthPerfect({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple authentication - in production, use proper JWT/OAuth
    if (credentials.username === 'admin' && credentials.password === 'graphics2024') {
      localStorage.setItem('adminAuth', 'true')
      toast({
        title: 'Login Successful',
        description: 'Welcome to Graphics Thinking Admin Panel',
        status: 'success',
        duration: 3000
      })
      onLogin()
    } else {
      setError('Invalid credentials. Please try again.')
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password',
        status: 'error',
        duration: 3000
      })
    }
    
    setLoading(false)
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #1A365D 0%, #2D3748 100%)" display="flex" alignItems="center">
      <Container maxW="md">
        <Card bg="rgba(255,255,255,0.1)" backdropFilter="blur(10px)" borderRadius="2xl" border="1px solid rgba(255,255,255,0.2)">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <VStack spacing={4}>
                <Box bg="brand.red" p={4} borderRadius="full">
                  <FaLock size={24} color="white" />
                </Box>
                <Heading color="white" textAlign="center" fontFamily="heading">
                  GRAPHICS THINKING
                </Heading>
                <Text color="gray.300" textAlign="center">
                  Admin Panel Access
                </Text>
              </VStack>

              {error && (
                <Alert status="error" bg="rgba(245, 101, 101, 0.1)" border="1px solid #F56565" borderRadius="md">
                  <AlertIcon />
                  <Text color="red.300">{error}</Text>
                </Alert>
              )}

              <form onSubmit={handleLogin}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color="white">Username</FormLabel>
                    <InputGroup>
                      <Input
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                        bg="rgba(255,255,255,0.1)"
                        border="1px solid rgba(255,255,255,0.2)"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        _focus={{ borderColor: 'brand.red', boxShadow: '0 0 0 1px #E53E3E' }}
                      />
                      <InputRightElement>
                        <FaUser color="gray" />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="white">Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        bg="rgba(255,255,255,0.1)"
                        border="1px solid rgba(255,255,255,0.2)"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        _focus={{ borderColor: 'brand.red', boxShadow: '0 0 0 1px #E53E3E' }}
                      />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          onClick={() => setShowPassword(!showPassword)}
                          color="gray.400"
                          _hover={{ color: 'white' }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="red"
                    size="lg"
                    width="full"
                    isLoading={loading}
                    loadingText="Signing In..."
                    bg="brand.red"
                    _hover={{ bg: '#C53030' }}
                    borderRadius="md"
                    fontWeight="bold"
                  >
                    Sign In
                  </Button>
                </VStack>
              </form>

              <VStack spacing={2} pt={4} borderTop="1px solid rgba(255,255,255,0.1)">
                <Text color="gray.400" fontSize="sm" textAlign="center">
                  Demo Credentials
                </Text>
                <HStack spacing={4} fontSize="xs">
                  <Text color="gray.300">Username: <Text as="span" color="brand.red">admin</Text></Text>
                  <Text color="gray.300">Password: <Text as="span" color="brand.red">graphics2024</Text></Text>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}