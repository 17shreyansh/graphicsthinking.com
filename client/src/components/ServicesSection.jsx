import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Grid, VStack, Icon, Button } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  FaInstagram, FaBullhorn, FaPrint, FaPalette, FaImage, FaGlobe,
  FaPhotoVideo, FaEdit, FaIdCard, FaAddressCard
} from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'
import { servicesAPI } from '../services/api'


const MotionBox = motion(Box)

const serviceIcons = {
  'Social Media Post Design': FaInstagram,
  'Advertisement Design': FaBullhorn,
  'Printing Design': FaPrint,
  'Logo Design': FaPalette,
  'Banner Design': FaImage,
  'Website Banner Design': FaGlobe,
  'Photo Manipulation': FaPhotoVideo,
  'Image Editing': FaEdit,
  'Business Card Design': FaIdCard,
  'Visiting Card Design': FaAddressCard
}

const ServiceCard = ({ service, index }) => {
  const IconComponent = serviceIcons[service.name] || FaPalette
  const colors = ['red', 'blue', 'brown']
  const colorScheme = colors[index % 3]
  
  const colorConfig = {
    red: { icon: 'brand.red' },
    blue: { icon: 'brand.blue' },
    brown: { icon: 'brand.brown' }
  }

  return (
    <MotionBox
      bg="rgba(255, 255, 255, 0.1)"
      p={8}
      borderRadius="xl"
      boxShadow="lg"
      textAlign="center"
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      transition={{ duration: 0.3 }}
      border="2px solid"
      borderColor={colorConfig[colorScheme].icon}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="4px"
        bg={colorConfig[colorScheme].icon}
      />
      <Icon as={IconComponent} w={16} h={16} color={colorConfig[colorScheme].icon} mb={6} />
      <Heading size="md" mb={4} fontFamily="accent" color="white">{service.name}</Heading>
      <Text color="gray.300" mb={6} lineHeight="1.6">{service.description}</Text>
      <VStack spacing={2}>
        <Button
          as={RouterLink}
          to={`/services/${service.slug || service.seo?.slug || service._id}`}
          bg={colorConfig[colorScheme].icon}
          color="white"
          size="md"
          w="full"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
        >
          View Details
        </Button>
        <Button
          as={RouterLink}
          to="/contact"
          variant="outline"
          borderColor={colorConfig[colorScheme].icon}
          color={colorConfig[colorScheme].icon}
          size="sm"
          w="full"
        >
          Get Quote
        </Button>
      </VStack>
    </MotionBox>
  )
}

export default function ServicesSection() {
  const [services, setServices] = useState([])

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll()
      setServices((response.services || response || []).slice(0, 6))
    } catch (error) {
      console.error('Failed to fetch services:', error)
      setServices([])
    }
  }

  return (
    <Box py={20} bg="rgba(255, 255, 255, 0.05)" position="relative" overflow="hidden">
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        opacity="0.02"
        style={{
          backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 60 60\"><circle cx=\"30\" cy=\"30\" r=\"2\" fill=\"%23E53E3E\"/><circle cx=\"10\" cy=\"10\" r=\"1\" fill=\"%233182CE\"/><circle cx=\"50\" cy=\"10\" r=\"1\" fill=\"%238B4513\"/><circle cx=\"10\" cy=\"50\" r=\"1\" fill=\"%238B4513\"/><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%233182CE\"/></svg>')",
          backgroundSize: "60px 60px"
        }}
      />
      <Container maxW="7xl" position="relative" zIndex={1}>
        <VStack spacing={16}>
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="4xl" fontFamily="body" fontWeight="800" color="white">
              OUR SERVICES
            </Heading>
            <Text fontSize="lg" color="gray.300" maxW="600px">
              Professional graphic design services tailored to meet your business needs.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
            {Array.isArray(services) && services.map((service, index) => (
              <MotionBox
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ServiceCard service={service} index={index} />
              </MotionBox>
            ))}
          </Grid>

          <Button
            as={RouterLink}
            to="/services"
            size="lg"
            variant="outline"
            borderColor="brand.red"
            color="brand.red"
            _hover={{ bg: 'brand.red', color: 'white' }}
          >
            View All Services
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}