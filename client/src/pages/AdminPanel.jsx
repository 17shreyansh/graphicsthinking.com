import { useState, useEffect } from 'react'
import {
  Box, Container, Heading, Text, VStack, HStack, Button, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Select, Switch, useDisclosure, useToast,
  Tabs, TabList, TabPanels, Tab, TabPanel, Badge, IconButton, Flex, Spacer
} from '@chakra-ui/react'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import { portfolioAPI, servicesAPI, blogAPI, contactAPI } from '../services/api'

export default function AdminPanel() {
  const [services, setServices] = useState([])
  const [portfolioItems, setPortfolioItems] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [messages, setMessages] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('portfolio')
  const [formData, setFormData] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [servicesRes, portfolioRes, blogRes, messagesRes] = await Promise.all([
        servicesAPI.getAll(),
        portfolioAPI.getAll(),
        blogAPI.getAll(),
        contactAPI.getAll()
      ])
      setServices(servicesRes.services || servicesRes || [])
      setPortfolioItems(portfolioRes.items || portfolioRes || [])
      setBlogPosts(blogRes.posts || blogRes || [])
      setMessages(messagesRes.messages || messagesRes || [])
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', status: 'error' })
    }
  }

  const handleSave = async () => {
    try {
      const api = activeTab === 'portfolio' ? portfolioAPI : activeTab === 'services' ? servicesAPI : activeTab === 'blog' ? blogAPI : contactAPI
      if (editingItem) {
        await api.update(editingItem._id, formData)
        toast({ title: 'Success', description: 'Updated successfully', status: 'success' })
      } else {
        await api.create(formData)
        toast({ title: 'Success', description: 'Created successfully', status: 'success' })
      }
      onClose()
      setEditingItem(null)
      setFormData({})
      fetchData()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', status: 'error' })
    }
  }

  const handleDelete = async (id) => {
    try {
      const api = activeTab === 'portfolio' ? portfolioAPI : activeTab === 'services' ? servicesAPI : activeTab === 'blog' ? blogAPI : contactAPI
      await api.delete(id)
      toast({ title: 'Success', description: 'Deleted successfully', status: 'success' })
      fetchData()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', status: 'error' })
    }
  }

  const openModal = (item = null) => {
    setEditingItem(item)
    setFormData(item || {})
    onOpen()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderForm = () => {
    if (activeTab === 'portfolio') {
      return (
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Detailed Description</FormLabel>
            <Textarea value={formData.detailedDescription || ''} onChange={(e) => handleInputChange('detailedDescription', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select value={formData.category || ''} onChange={(e) => handleInputChange('category', e.target.value)}>
              <option value="Logo Design">Logo Design</option>
              <option value="Social Media">Social Media</option>
              <option value="Print Design">Print Design</option>
              <option value="Web Design">Web Design</option>
              <option value="Branding">Branding</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Image URL</FormLabel>
            <Input value={formData.image || ''} onChange={(e) => handleInputChange('image', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Client</FormLabel>
            <Input value={formData.client || ''} onChange={(e) => handleInputChange('client', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Featured</FormLabel>
            <Switch isChecked={formData.featured || false} onChange={(e) => handleInputChange('featured', e.target.checked)} />
          </FormControl>
        </VStack>
      )
    }
    
    if (activeTab === 'services') {
      return (
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Service Name</FormLabel>
            <Input value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Detailed Description</FormLabel>
            <Textarea value={formData.detailedDescription || ''} onChange={(e) => handleInputChange('detailedDescription', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select value={formData.category || ''} onChange={(e) => handleInputChange('category', e.target.value)}>
              <option value="Design Services">Design Services</option>
              <option value="Branding">Branding</option>
              <option value="Digital">Digital</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input value={formData.image || ''} onChange={(e) => handleInputChange('image', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Delivery Time</FormLabel>
            <Input value={formData.deliveryTime || ''} onChange={(e) => handleInputChange('deliveryTime', e.target.value)} />
          </FormControl>
        </VStack>
      )
    }
    
    if (activeTab === 'blog') {
      return (
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Excerpt</FormLabel>
            <Textarea value={formData.excerpt || ''} onChange={(e) => handleInputChange('excerpt', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Content</FormLabel>
            <Textarea rows={8} value={formData.content || ''} onChange={(e) => handleInputChange('content', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Input value={formData.category || ''} onChange={(e) => handleInputChange('category', e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Image URL</FormLabel>
            <Input value={formData.image || ''} onChange={(e) => handleInputChange('image', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Author</FormLabel>
            <Input value={formData.author || 'Graphics Thinking'} onChange={(e) => handleInputChange('author', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Published</FormLabel>
            <Switch isChecked={formData.published || false} onChange={(e) => handleInputChange('published', e.target.checked)} />
          </FormControl>
        </VStack>
      )
    }
    
    if (activeTab === 'messages') {
      return (
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={formData.name || ''} isReadOnly />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input value={formData.email || ''} isReadOnly />
          </FormControl>
          <FormControl>
            <FormLabel>Subject</FormLabel>
            <Input value={formData.subject || ''} isReadOnly />
          </FormControl>
          <FormControl>
            <FormLabel>Message</FormLabel>
            <Textarea value={formData.message || ''} isReadOnly rows={4} />
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select value={formData.status || 'new'} onChange={(e) => handleInputChange('status', e.target.value)}>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Reply Message</FormLabel>
            <Textarea value={formData.replyMessage || ''} onChange={(e) => handleInputChange('replyMessage', e.target.value)} rows={4} />
          </FormControl>
        </VStack>
      )
    }
  }

  return (
    <Box minH="100vh" bg="#1A365D">
      <Box bg="brand.red" p={4}>
        <Container maxW="7xl">
          <Heading color="white" fontFamily="heading" size="lg">
            GRAPHICS THINKING ADMIN
          </Heading>
        </Container>
      </Box>
      
      <Container maxW="7xl" py={8}>
        <Tabs index={['portfolio', 'services', 'blog', 'messages'].indexOf(activeTab)} onChange={(index) => setActiveTab(['portfolio', 'services', 'blog', 'messages'][index])}>
          <TabList>
            <Tab color="white" _selected={{ color: 'brand.red', borderColor: 'brand.red' }}>Portfolio</Tab>
            <Tab color="white" _selected={{ color: 'brand.red', borderColor: 'brand.red' }}>Services</Tab>
            <Tab color="white" _selected={{ color: 'brand.red', borderColor: 'brand.red' }}>Blog</Tab>
            <Tab color="white" _selected={{ color: 'brand.red', borderColor: 'brand.red' }}>Messages</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Flex>
                  <Heading size="md" color="white">Portfolio Items</Heading>
                  <Spacer />
                  <Button leftIcon={<FaPlus />} colorScheme="red" onClick={() => openModal()}>
                    Add Portfolio Item
                  </Button>
                </Flex>
                
                <Box bg="rgba(255,255,255,0.1)" borderRadius="lg" overflow="hidden">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th color="white">Title</Th>
                        <Th color="white">Category</Th>
                        <Th color="white">Featured</Th>
                        <Th color="white">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {portfolioItems.map((item) => (
                        <Tr key={item._id}>
                          <Td color="white">{item.title}</Td>
                          <Td color="white">{item.category}</Td>
                          <Td>{item.featured ? <Badge colorScheme="green">Yes</Badge> : <Badge>No</Badge>}</Td>
                          <Td>
                            <HStack>
                              <IconButton icon={<FaEdit />} size="sm" onClick={() => openModal(item)} />
                              <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(item._id)} />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Flex>
                  <Heading size="md" color="white">Services</Heading>
                  <Spacer />
                  <Button leftIcon={<FaPlus />} colorScheme="red" onClick={() => openModal()}>
                    Add Service
                  </Button>
                </Flex>
                
                <Box bg="rgba(255,255,255,0.1)" borderRadius="lg" overflow="hidden">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th color="white">Name</Th>
                        <Th color="white">Category</Th>
                        <Th color="white">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {services.map((service) => (
                        <Tr key={service._id}>
                          <Td color="white">{service.name}</Td>
                          <Td color="white">{service.category}</Td>
                          <Td>
                            <HStack>
                              <IconButton icon={<FaEdit />} size="sm" onClick={() => openModal(service)} />
                              <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(service._id)} />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Flex>
                  <Heading size="md" color="white">Blog Posts</Heading>
                  <Spacer />
                  <Button leftIcon={<FaPlus />} colorScheme="red" onClick={() => openModal()}>
                    Add Blog Post
                  </Button>
                </Flex>
                
                <Box bg="rgba(255,255,255,0.1)" borderRadius="lg" overflow="hidden">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th color="white">Title</Th>
                        <Th color="white">Category</Th>
                        <Th color="white">Published</Th>
                        <Th color="white">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {blogPosts.map((post) => (
                        <Tr key={post._id}>
                          <Td color="white">{post.title}</Td>
                          <Td color="white">{post.category}</Td>
                          <Td>{post.published ? <Badge colorScheme="green">Yes</Badge> : <Badge>No</Badge>}</Td>
                          <Td>
                            <HStack>
                              <IconButton icon={<FaEdit />} size="sm" onClick={() => openModal(post)} />
                              <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(post._id)} />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>
            
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Flex>
                  <Heading size="md" color="white">Contact Messages</Heading>
                  <Spacer />
                </Flex>
                
                <Box bg="rgba(255,255,255,0.1)" borderRadius="lg" overflow="hidden">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th color="white">Name</Th>
                        <Th color="white">Email</Th>
                        <Th color="white">Subject</Th>
                        <Th color="white">Status</Th>
                        <Th color="white">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {messages.map((message) => (
                        <Tr key={message._id}>
                          <Td color="white">{message.name}</Td>
                          <Td color="white">{message.email}</Td>
                          <Td color="white">{message.subject}</Td>
                          <Td>
                            <Badge colorScheme={message.status === 'new' ? 'red' : message.status === 'read' ? 'yellow' : 'green'}>
                              {message.status}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack>
                              <IconButton icon={<FaEye />} size="sm" onClick={() => openModal(message)} />
                              <IconButton icon={<FaTrash />} size="sm" colorScheme="red" onClick={() => handleDelete(message._id)} />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="#1A365D" color="white">
          <ModalHeader>{editingItem ? 'Edit Item' : 'Add Item'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {renderForm()}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleSave}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}