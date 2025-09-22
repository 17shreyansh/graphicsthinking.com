import { useState, useEffect } from 'react'
import {
  Box, Container, VStack, HStack, Button, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Select, Switch, useDisclosure, useToast,
  Tabs, TabList, TabPanels, Tab, TabPanel, Badge, IconButton, Flex, Heading,
  Card, CardBody, Text, Alert, AlertIcon, Spinner, Center, SimpleGrid, Stat,
  StatLabel, StatNumber, StatHelpText, Image
} from '@chakra-ui/react'
import { FaPlus, FaEdit, FaTrash, FaEye, FaChartBar, FaBriefcase, FaEnvelope, FaUsers } from 'react-icons/fa'
import { portfolioAPI, servicesAPI, contactAPI } from '../../services/api'
import AdminAuthPerfect from '../AdminAuthPerfect'

export default function UnifiedAdminEditor() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [portfolioItems, setPortfolioItems] = useState([])
  const [services, setServices] = useState([])
  const [messages, setMessages] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth')
    setIsAuthenticated(authStatus === 'true')
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && activeTab !== 'dashboard') {
      fetchTabData()
    }
  }, [activeTab])

  const handleLogin = () => setIsAuthenticated(true)

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <AdminAuthPerfect onLogin={handleLogin} />
  }

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Test if backend is running
      const testResponse = await fetch('http://localhost:5000/health').catch(() => null)
      if (!testResponse) {
        setError('Backend server is not running. Please start the server.')
        return
      }
      
      const [portfolioRes, servicesRes, messagesRes] = await Promise.allSettled([
        portfolioAPI.getAll(),
        servicesAPI.getAll(),
        contactAPI.getAll()
      ])
      
      if (portfolioRes.status === 'fulfilled') {
        setPortfolioItems(Array.isArray(portfolioRes.value) ? portfolioRes.value : portfolioRes.value.items || [])
      }
      if (servicesRes.status === 'fulfilled') {
        setServices(Array.isArray(servicesRes.value) ? servicesRes.value : servicesRes.value.services || [])
      }
      if (messagesRes.status === 'fulfilled') {
        setMessages(Array.isArray(messagesRes.value) ? messagesRes.value : messagesRes.value.messages || [])
      }
      
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const fetchTabData = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (activeTab === 'portfolio') {
        const res = await portfolioAPI.getAll()
        setPortfolioItems(Array.isArray(res) ? res : res.items || [])
      } else if (activeTab === 'services') {
        const res = await servicesAPI.getAll()
        setServices(Array.isArray(res) ? res : res.services || [])
      } else if (activeTab === 'messages') {
        const res = await contactAPI.getAll()
        setMessages(Array.isArray(res) ? res : res.messages || [])
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')
      
      const apiService = activeTab === 'portfolio' ? portfolioAPI : activeTab === 'services' ? servicesAPI : contactAPI
      
      if (editingItem) {
        await apiService.update(editingItem._id, formData)
        toast({ title: 'Success', description: 'Updated successfully', status: 'success' })
      } else {
        await apiService.create(formData)
        toast({ title: 'Success', description: 'Created successfully', status: 'success' })
      }
      
      onClose()
      setEditingItem(null)
      setFormData({})
      fetchTabData()
      fetchAllData()
    } catch (err) {
      setError('Failed to save')
      toast({ title: 'Error', description: 'Failed to save', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    
    try {
      setLoading(true)
      const apiService = activeTab === 'portfolio' ? portfolioAPI : activeTab === 'services' ? servicesAPI : contactAPI
      await apiService.delete(id)
      toast({ title: 'Success', description: 'Deleted successfully', status: 'success' })
      fetchTabData()
      fetchAllData()
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    setFormData(item || {})
    setError('')
    onOpen()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderDashboard = () => (
    <VStack spacing={8} align="stretch">
      {loading && (
        <Center>
          <Spinner size="xl" color="blue.500" />
          <Text ml={4} color="gray.600">Loading data...</Text>
        </Center>
      )}
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card bg="white" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Portfolio Items</StatLabel>
              <StatNumber color="blue.500" fontSize="3xl">{portfolioItems.length}</StatNumber>
              <StatHelpText color="gray.500">
                <HStack>
                  <FaBriefcase />
                  <Text>{portfolioItems.filter(p => p.featured).length} featured</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Services</StatLabel>
              <StatNumber color="green.500" fontSize="3xl">{services.length}</StatNumber>
              <StatHelpText color="gray.500">
                <HStack>
                  <FaUsers />
                  <Text>Active services</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Messages</StatLabel>
              <StatNumber color="orange.500" fontSize="3xl">{messages.length}</StatNumber>
              <StatHelpText color="gray.500">
                <HStack>
                  <FaEnvelope />
                  <Text>{messages.filter(m => m.status === 'new').length} new</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" shadow="md">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Items</StatLabel>
              <StatNumber color="purple.500" fontSize="3xl">{portfolioItems.length + services.length}</StatNumber>
              <StatHelpText color="gray.500">
                <HStack>
                  <FaChartBar />
                  <Text>Content items</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card bg="white" shadow="md">
          <CardBody>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="gray.700">Recent Portfolio</Heading>
              <Button size="sm" colorScheme="blue" onClick={() => setActiveTab('portfolio')}>
                View All
              </Button>
            </Flex>
            <VStack spacing={3} align="stretch">
              {portfolioItems.slice(0, 5).map(item => (
                <Flex key={item._id} align="center" p={3} bg="gray.50" borderRadius="md">
                  <Image src={item.image} boxSize="40px" borderRadius="md" mr={3} fallbackSrc="https://via.placeholder.com/40" />
                  <Box flex={1}>
                    <Text color="gray.800" fontWeight="bold" fontSize="sm">{item.title}</Text>
                    <Text color="gray.600" fontSize="xs">{item.category}</Text>
                  </Box>
                  {item.featured && <Badge colorScheme="blue" size="sm">Featured</Badge>}
                </Flex>
              ))}
              {portfolioItems.length === 0 && (
                <Text color="gray.500" textAlign="center">No portfolio items</Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card bg="white" shadow="md">
          <CardBody>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="gray.700">Recent Messages</Heading>
              <Button size="sm" colorScheme="orange" onClick={() => setActiveTab('messages')}>
                View All
              </Button>
            </Flex>
            <VStack spacing={3} align="stretch">
              {messages.slice(0, 5).map(msg => (
                <Flex key={msg._id} justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                  <Box>
                    <Text color="gray.800" fontWeight="bold" fontSize="sm">{msg.name}</Text>
                    <Text color="gray.600" fontSize="xs">{msg.subject}</Text>
                  </Box>
                  <Badge colorScheme={msg.status === 'new' ? 'red' : msg.status === 'read' ? 'yellow' : 'green'}>
                    {msg.status}
                  </Badge>
                </Flex>
              ))}
              {messages.length === 0 && (
                <Text color="gray.500" textAlign="center">No messages</Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  )

  const renderForm = () => {
    if (activeTab === 'portfolio') {
      return (
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel color="gray.700">Title</FormLabel>
            <Input value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="gray.700">Description</FormLabel>
            <Textarea value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="gray.700">Category</FormLabel>
            <Select value={formData.category || ''} onChange={(e) => handleInputChange('category', e.target.value)}>
              <option value="">Select Category</option>
              <option value="Logo Design">Logo Design</option>
              <option value="Social Media">Social Media</option>
              <option value="Print Design">Print Design</option>
              <option value="Branding">Branding</option>
              <option value="Web Design">Web Design</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="gray.700">Image URL</FormLabel>
            <Input value={formData.image || ''} onChange={(e) => handleInputChange('image', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">Client</FormLabel>
            <Input value={formData.client || ''} onChange={(e) => handleInputChange('client', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">Featured</FormLabel>
            <Switch isChecked={formData.featured || false} onChange={(e) => handleInputChange('featured', e.target.checked)} />
          </FormControl>
        </VStack>
      )
    }
    
    if (activeTab === 'services') {
      return (
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel color="gray.700">Service Name</FormLabel>
            <Input value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="gray.700">Description</FormLabel>
            <Textarea value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="gray.700">Price</FormLabel>
            <Input type="number" value={formData.price || ''} onChange={(e) => handleInputChange('price', Number(e.target.value))} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="gray.700">Category</FormLabel>
            <Select value={formData.category || ''} onChange={(e) => handleInputChange('category', e.target.value)}>
              <option value="">Select Category</option>
              <option value="Branding">Branding</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Print Design">Print Design</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">Delivery Time</FormLabel>
            <Input value={formData.deliveryTime || ''} onChange={(e) => handleInputChange('deliveryTime', e.target.value)} />
          </FormControl>
        </VStack>
      )
    }
    
    if (activeTab === 'messages') {
      return (
        <VStack spacing={4}>
          <FormControl>
            <FormLabel color="gray.700">Name</FormLabel>
            <Input value={formData.name || ''} isReadOnly bg="gray.100" />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">Email</FormLabel>
            <Input value={formData.email || ''} isReadOnly bg="gray.100" />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">Subject</FormLabel>
            <Input value={formData.subject || ''} isReadOnly bg="gray.100" />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">Message</FormLabel>
            <Textarea value={formData.message || ''} isReadOnly bg="gray.100" rows={4} />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.700">Status</FormLabel>
            <Select value={formData.status || 'new'} onChange={(e) => handleInputChange('status', e.target.value)}>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </Select>
          </FormControl>
        </VStack>
      )
    }
  }

  const renderTable = () => {
    const data = activeTab === 'portfolio' ? portfolioItems : activeTab === 'services' ? services : messages
    
    if (loading) {
      return (
        <Center h="200px">
          <Spinner size="xl" color="blue.500" />
        </Center>
      )
    }

    if (error) {
      return (
        <Alert status="error">
          <AlertIcon />
          <Text color="red.600">{error}</Text>
          <Button ml="auto" onClick={fetchTabData}>Retry</Button>
        </Alert>
      )
    }

    if (!data.length) {
      return (
        <Center h="200px">
          <VStack>
            <Text color="gray.600">No {activeTab} found</Text>
            {activeTab !== 'messages' && (
              <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => openModal()}>
                Add {activeTab.slice(0, -1)}
              </Button>
            )}
          </VStack>
        </Center>
      )
    }

    return (
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            {activeTab === 'portfolio' && (
              <>
                <Th color="gray.700">Title</Th>
                <Th color="gray.700">Category</Th>
                <Th color="gray.700">Featured</Th>
                <Th color="gray.700">Actions</Th>
              </>
            )}
            {activeTab === 'services' && (
              <>
                <Th color="gray.700">Name</Th>
                <Th color="gray.700">Category</Th>
                <Th color="gray.700">Price</Th>
                <Th color="gray.700">Actions</Th>
              </>
            )}
            {activeTab === 'messages' && (
              <>
                <Th color="gray.700">Name</Th>
                <Th color="gray.700">Email</Th>
                <Th color="gray.700">Subject</Th>
                <Th color="gray.700">Status</Th>
                <Th color="gray.700">Actions</Th>
              </>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item._id}>
              {activeTab === 'portfolio' && (
                <>
                  <Td color="gray.800">{item.title}</Td>
                  <Td color="gray.600">{item.category}</Td>
                  <Td>
                    <Badge colorScheme={item.featured ? 'green' : 'gray'}>
                      {item.featured ? 'Yes' : 'No'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack>
                      <IconButton icon={<FaEdit />} size="sm" colorScheme="blue" onClick={() => openModal(item)} />
                      <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(item._id)} />
                    </HStack>
                  </Td>
                </>
              )}
              {activeTab === 'services' && (
                <>
                  <Td color="gray.800">{item.name}</Td>
                  <Td color="gray.600">{item.category}</Td>
                  <Td color="gray.800">₹{item.price?.toLocaleString()}</Td>
                  <Td>
                    <HStack>
                      <IconButton icon={<FaEdit />} size="sm" colorScheme="blue" onClick={() => openModal(item)} />
                      <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(item._id)} />
                    </HStack>
                  </Td>
                </>
              )}
              {activeTab === 'messages' && (
                <>
                  <Td color="gray.800">{item.name}</Td>
                  <Td color="gray.600">{item.email}</Td>
                  <Td color="gray.800">{item.subject}</Td>
                  <Td>
                    <Badge colorScheme={item.status === 'new' ? 'red' : item.status === 'read' ? 'yellow' : 'green'}>
                      {item.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack>
                      <IconButton icon={<FaEye />} size="sm" colorScheme="blue" onClick={() => openModal(item)} />
                      <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(item._id)} />
                    </HStack>
                  </Td>
                </>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }

  return (
    <Box minH="100vh" bg="gray.100">
      <Box bg="blue.600" p={4}>
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <Heading color="white" size="lg">Graphics Thinking Admin</Heading>
            <Button variant="outline" color="white" borderColor="white" onClick={handleLogout}>
              Logout
            </Button>
          </Flex>
        </Container>
      </Box>
      
      {error && (
        <Container maxW="7xl" pt={4}>
          <Alert status="error">
            <AlertIcon />
            <Text color="red.600">{error}</Text>
            <Button ml="auto" onClick={fetchAllData}>Retry</Button>
          </Alert>
        </Container>
      )}
      
      <Container maxW="7xl" py={8}>
        <Tabs index={['dashboard', 'portfolio', 'services', 'messages'].indexOf(activeTab)} onChange={(index) => setActiveTab(['dashboard', 'portfolio', 'services', 'messages'][index])}>
          <TabList bg="white" borderRadius="md" p={1}>
            <Tab color="gray.600" _selected={{ color: 'blue.600', bg: 'blue.50' }}>Dashboard</Tab>
            <Tab color="gray.600" _selected={{ color: 'blue.600', bg: 'blue.50' }}>Portfolio</Tab>
            <Tab color="gray.600" _selected={{ color: 'blue.600', bg: 'blue.50' }}>Services</Tab>
            <Tab color="gray.600" _selected={{ color: 'blue.600', bg: 'blue.50' }}>Messages</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              {renderDashboard()}
            </TabPanel>
            
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Flex justify="space-between">
                  <Heading size="md" color="gray.700">Portfolio Items</Heading>
                  <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => openModal()}>Add New</Button>
                </Flex>
                <Card bg="white" shadow="md">
                  <CardBody>
                    {renderTable()}
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
            
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Flex justify="space-between">
                  <Heading size="md" color="gray.700">Services</Heading>
                  <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => openModal()}>Add New</Button>
                </Flex>
                <Card bg="white" shadow="md">
                  <CardBody>
                    {renderTable()}
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
            
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Flex justify="space-between">
                  <Heading size="md" color="gray.700">Contact Messages</Heading>
                </Flex>
                <Card bg="white" shadow="md">
                  <CardBody>
                    {renderTable()}
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="gray.700">{editingItem ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <Text color="red.600">{error}</Text>
              </Alert>
            )}
            {renderForm()}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave} isLoading={loading}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}