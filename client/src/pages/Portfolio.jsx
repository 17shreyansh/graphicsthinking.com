import { useState, useEffect } from 'react'
import {
  Box, Container, Heading, Grid, Image, Text, Button, HStack, Tag, VStack, Modal,
  ModalOverlay, ModalContent, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link as RouterLink } from 'react-router-dom'
import { portfolioAPI } from '../services/api'
import { fallbackPortfolioData } from '../data/fallbackData'
import SearchFilter from '../components/SearchFilter'
import Loading from '../components/Loading'

const MotionBox = motion(Box)

const categories = ['All', 'Logo Design', 'Social Media', 'Print Design', 'Web Design', 'Branding']

const PortfolioItem = ({ item, onOpen, setSelectedItem, index }) => {
  const colors = ['red', 'blue', 'orange']
  const colorScheme = colors[index % 3]
  
  return (
    <MotionBox
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      cursor="pointer"
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        setSelectedItem(item)
        onOpen()
      }}
      border="2px solid"
      borderColor={`${colorScheme}.200`}
      position="relative"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="4px"
        bg={`${colorScheme}.500`}
        zIndex={1}
      />
      <Image
        src={item.image}
        alt={item.title}
        w="100%"
        h="250px"
        objectFit="cover"
      />
      <Box p={6}>
        <Tag size="sm" colorScheme={colorScheme} mb={2}>{item.category}</Tag>
        <Heading size="md" mb={2} fontFamily="accent" color="gray.800">{item.title}</Heading>
        <Text color="gray.600" fontSize="sm" lineHeight="1.6">{item.description}</Text>
      </Box>
    </MotionBox>
  )
}

export default function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  useEffect(() => {
    if (!Array.isArray(portfolioItems)) {
      setFilteredItems([])
      return
    }
    
    let filtered = [...portfolioItems]
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory)
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        default: // newest
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
    })
    
    setFilteredItems(filtered)
  }, [portfolioItems, activeCategory, searchTerm, sortBy])

  const fetchPortfolioItems = async () => {
    setLoading(true)
    try {
      const response = await portfolioAPI.getAll()
      setPortfolioItems(response.items || [])
    } catch (error) {
      setPortfolioItems(fallbackPortfolioData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box py={20} position="relative" overflow="hidden">
      {/* Decorative Elements */}
      <Box
        position="absolute"
        top="5%"
        right="5%"
        w="100px"
        h="100px"
        border="3px solid"
        borderColor="brand.red"
        borderRadius="20px"
        opacity="0.05"
        transform="rotate(15deg)"
      />
      <Box
        position="absolute"
        bottom="10%"
        left="3%"
        w="80px"
        h="80px"
        bg="brand.blue"
        borderRadius="full"
        opacity="0.03"
      />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" fontFamily="heading">
              OUR PORTFOLIO
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Explore our diverse collection of creative projects spanning various industries and design disciplines.
            </Text>
          </VStack>

          {/* Search and Filter */}
          <VStack spacing={6}>
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            
            <HStack spacing={4} flexWrap="wrap" justify="center">
              {categories.map((category, index) => {
                const colors = ['red', 'blue', 'orange']
                const colorScheme = colors[index % 3]
                return (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'solid' : 'outline'}
                    colorScheme={colorScheme}
                    onClick={() => setActiveCategory(category)}
                    _hover={{ transform: 'translateY(-2px)' }}
                    fontFamily="accent"
                    fontWeight="600"
                  >
                    {category}
                  </Button>
                )
              })}
            </HStack>
          </VStack>

          {/* Portfolio Grid */}
          {loading ? (
            <Loading message="Loading portfolio..." />
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
              {filteredItems.map((item, index) => (
                <MotionBox
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Box
                    as={RouterLink}
                    to={`/portfolio/${item._id}`}
                    _hover={{ textDecoration: 'none' }}
                  >
                    <PortfolioItem
                      item={item}
                      onOpen={onOpen}
                      setSelectedItem={setSelectedItem}
                      index={index}
                    />
                  </Box>
                </MotionBox>
              ))}
            </Grid>
          )}
        </VStack>
      </Container>

      {/* Portfolio Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            {selectedItem && (
              <Box>
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  w="100%"
                  h="400px"
                  objectFit="cover"
                />
                <Box p={6}>
                  <Tag size="sm" colorScheme="red" mb={2}>{selectedItem.category}</Tag>
                  <Heading size="lg" mb={4} fontFamily="accent">{selectedItem.title}</Heading>
                  <Text color="gray.600">{selectedItem.description}</Text>
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}