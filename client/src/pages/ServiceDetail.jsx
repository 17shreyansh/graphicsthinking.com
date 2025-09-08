import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box, Container, Heading, Text, Grid, Image, VStack, HStack, Tag, Button,
  Badge, Icon, SimpleGrid, Divider, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Tabs, TabList, TabPanels, Tab, TabPanel, List, ListItem, ListIcon, Progress
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { 
  FaArrowLeft, FaCheck, FaStar, FaClock, FaRedo, FaShoppingCart,
  FaWhatsapp, FaEnvelope, FaPhone
} from 'react-icons/fa'
import { servicesAPI } from '../services/api'
import { fallbackServicesData } from '../data/fallbackData'
import Loading from '../components/Loading'

const MotionBox = motion(Box)

const PackageCard = ({ package: pkg, isPopular, onSelect }) => (
  <MotionBox
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      boxShadow="lg"
      border={isPopular ? "3px solid" : "1px solid"}
      borderColor={isPopular ? "brand.red" : "gray.200"}
      position="relative"
      h="full"
    >
      {isPopular && (
        <Badge
          position="absolute"
          top="-10px"
          left="50%"
          transform="translateX(-50%)"
          colorScheme="red"
          px={3}
          py={1}
          borderRadius="full"
        >
          Most Popular
        </Badge>
      )}
      
      <VStack spacing={4} align="stretch">
        <VStack spacing={2}>
          <Heading size="md" fontFamily="accent" textAlign="center">
            {pkg.name}
          </Heading>
          <Text fontSize="3xl" fontWeight="bold" color="brand.red" textAlign="center">
            ₹{pkg.price?.toLocaleString('en-IN')}
          </Text>
          <Text color="gray.600" fontSize="sm" textAlign="center">
            Delivery: {pkg.deliveryTime}
          </Text>
        </VStack>
        
        <Divider />
        
        <List spacing={2}>
          {pkg.features.map((feature, index) => (
            <ListItem key={index} fontSize="sm">
              <ListIcon as={FaCheck} color="green.500" />
              {feature}
            </ListItem>
          ))}
        </List>
        
        <Button
          colorScheme={isPopular ? "red" : "blue"}
          size="lg"
          onClick={() => onSelect(pkg)}
          w="full"
        >
          Select Package
        </Button>
      </VStack>
    </Box>
  </MotionBox>
)

export default function ServiceDetail() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState(null)

  useEffect(() => {
    fetchServiceDetail()
  }, [id])

  const fetchServiceDetail = async () => {
    setLoading(true)
    try {
      const response = await servicesAPI.getById(id)
      setService(response.service)
      setRelated(response.related || [])
    } catch (error) {
      const fallbackItem = fallbackServicesData.find(item => item._id === id)
      if (fallbackItem) {
        setService({
          ...fallbackItem,
          name: fallbackItem.title,
          category: 'Design Services',
          rating: 4.8,
          totalOrders: 150,
          deliveryTime: fallbackItem.duration,
          revisions: 'Unlimited',
          features: fallbackItem.features
        })
        setRelated(fallbackServicesData.filter(item => item._id !== id).slice(0, 3))
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg)
  }

  const handleOrderNow = () => {
    const message = `Hi! I'm interested in your ${service.name} service${selectedPackage ? ` - ${selectedPackage.name} package` : ''}. Can you provide more details?`
    window.open(`https://wa.me/15551234567?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) return <Loading message="Loading service details..." />
  if (!service) {
    return (
      <Box p={20} textAlign="center">
        <Text fontSize="xl" color="gray.600">Service not found</Text>
        <Button as={RouterLink} to="/services" mt={4} colorScheme="red">
          Back to Services
        </Button>
      </Box>
    )
  }

  return (
    <Box py={10}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{service.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Back Button */}
          <Button
            as={RouterLink}
            to="/services"
            leftIcon={<FaArrowLeft />}
            variant="ghost"
            alignSelf="flex-start"
            color="brand.red"
          >
            Back to Services
          </Button>

          {/* Main Content */}
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={12}>
            {/* Left Column - Service Details */}
            <VStack spacing={8} align="stretch">
              {/* Service Header */}
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <VStack align="start" spacing={4}>
                  <HStack>
                    <Tag colorScheme="blue" size="lg">{service.category}</Tag>
                    {service.popular && (
                      <Badge colorScheme="red" variant="solid">Popular</Badge>
                    )}
                  </HStack>
                  
                  <Heading fontSize="4xl" fontFamily="heading" color="gray.800">
                    {service.name}
                  </Heading>
                  
                  <HStack spacing={4}>
                    <HStack>
                      <Icon as={FaStar} color="yellow.400" />
                      <Text fontWeight="600">{service.rating}/5</Text>
                    </HStack>
                    <Text color="gray.600">({service.totalOrders} orders completed)</Text>
                  </HStack>
                  
                  <Text color="gray.600" fontSize="lg" lineHeight="1.8">
                    {service.description}
                  </Text>
                </VStack>
              </MotionBox>

              {/* Service Image */}
              {service.image && (
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    w="100%"
                    h="400px"
                    objectFit="cover"
                    borderRadius="xl"
                    boxShadow="xl"
                  />
                </MotionBox>
              )}

              {/* Detailed Description */}
              {service.detailedDescription && (
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Tabs colorScheme="red">
                    <TabList>
                      <Tab>Service Details</Tab>
                      <Tab>What's Included</Tab>
                      <Tab>Process</Tab>
                    </TabList>
                    
                    <TabPanels>
                      <TabPanel px={0}>
                        <Text color="gray.600" lineHeight="1.8" fontSize="lg">
                          {service.detailedDescription}
                        </Text>
                      </TabPanel>
                      
                      <TabPanel px={0}>
                        <List spacing={3}>
                          {service.features.map((feature, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FaCheck} color="green.500" />
                              {feature}
                            </ListItem>
                          ))}
                        </List>
                      </TabPanel>
                      
                      <TabPanel px={0}>
                        <VStack align="start" spacing={4}>
                          <Text color="gray.600" lineHeight="1.8">
                            Our streamlined process ensures quality results:
                          </Text>
                          <List spacing={3}>
                            <ListItem>
                              <ListIcon as={FaCheck} color="brand.red" />
                              Initial consultation and requirement gathering
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaCheck} color="brand.red" />
                              Concept development and design creation
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaCheck} color="brand.red" />
                              Client review and feedback incorporation
                            </ListItem>
                            <ListItem>
                              <ListIcon as={FaCheck} color="brand.red" />
                              Final delivery with source files
                            </ListItem>
                          </List>
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </MotionBox>
              )}
            </VStack>

            {/* Right Column - Pricing and Order */}
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <VStack spacing={6} align="stretch">
                {/* Basic Service Info */}
                <Box bg="gray.50" p={6} borderRadius="xl">
                  <VStack spacing={4}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600">Starting Price:</Text>
                      <HStack>
                        {service.originalPrice && (
                          <Text textDecoration="line-through" color="gray.500">
                            ₹{service.originalPrice?.toLocaleString('en-IN')}
                          </Text>
                        )}
                        <Text fontSize="2xl" fontWeight="bold" color="brand.red">
                          ₹{service.price?.toLocaleString('en-IN')}
                        </Text>
                      </HStack>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <Icon as={FaClock} color="brand.blue" />
                        <Text fontWeight="600">Delivery:</Text>
                      </HStack>
                      <Text color="gray.600">{service.deliveryTime}</Text>
                    </HStack>
                    
                    <HStack justify="space-between" w="full">
                      <HStack>
                        <Icon as={FaRedo} color="brand.brown" />
                        <Text fontWeight="600">Revisions:</Text>
                      </HStack>
                      <Text color="gray.600">{service.revisions}</Text>
                    </HStack>
                  </VStack>
                </Box>

                {/* Contact Options */}
                <VStack spacing={3}>
                  <Button
                    leftIcon={<FaWhatsapp />}
                    colorScheme="green"
                    size="lg"
                    w="full"
                    onClick={handleOrderNow}
                  >
                    Order via WhatsApp
                  </Button>
                  
                  <Button
                    as={RouterLink}
                    to="/contact"
                    leftIcon={<FaEnvelope />}
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    w="full"
                  >
                    Get Custom Quote
                  </Button>
                  
                  <Button
                    as="a"
                    href="tel:+15551234567"
                    leftIcon={<FaPhone />}
                    colorScheme="brown"
                    variant="outline"
                    size="lg"
                    w="full"
                  >
                    Call Now
                  </Button>
                </VStack>
              </VStack>
            </MotionBox>
          </Grid>

          {/* Service Packages */}
          {service.packages && service.packages.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <VStack spacing={8}>
                <Heading size="lg" fontFamily="accent" textAlign="center">
                  Choose Your Package
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                  {service.packages.map((pkg, index) => (
                    <PackageCard
                      key={index}
                      package={pkg}
                      isPopular={index === 1}
                      onSelect={handlePackageSelect}
                    />
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          )}

          {/* Related Services */}
          {related.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <VStack spacing={8}>
                <Heading size="lg" fontFamily="accent" textAlign="center">
                  Related Services
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  {related.map((item) => (
                    <MotionBox
                      key={item._id}
                      as={RouterLink}
                      to={`/services/${item._id}`}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        bg="white"
                        p={6}
                        borderRadius="xl"
                        boxShadow="lg"
                        _hover={{ boxShadow: "xl" }}
                        h="full"
                      >
                        <VStack spacing={4} align="start">
                          <HStack justify="space-between" w="full">
                            <Tag size="sm" colorScheme="blue">
                              {item.category}
                            </Tag>
                            {item.popular && (
                              <Badge colorScheme="red" size="sm">Popular</Badge>
                            )}
                          </HStack>
                          
                          <Heading size="sm" fontFamily="accent">
                            {item.name}
                          </Heading>
                          
                          <Text color="gray.600" fontSize="sm" noOfLines={3}>
                            {item.description}
                          </Text>
                          
                          <HStack justify="space-between" w="full">
                            <Text fontSize="lg" fontWeight="bold" color="brand.red">
                              ₹{item.price?.toLocaleString('en-IN')}
                            </Text>
                            <HStack>
                              <Icon as={FaStar} color="yellow.400" size="sm" />
                              <Text fontSize="sm">{item.rating}</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Box>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </VStack>
            </MotionBox>
          )}
        </VStack>
      </Container>
    </Box>
  )
}